<script setup>

import axios from 'axios';
import { ref, computed } from 'vue';

// user session
import { useFirebaseAuth } from 'vuefire';
const auth = useFirebaseAuth()

const emit = defineEmits(['exit', 'close'])

const props = defineProps({
  zoneId: String,
  journeys: Object,
})

const name = ref('')
const distance = ref('')
const elevation = ref('')
const difficulty = ref(2)
const duration = ref('')
const journey = ref([])
const rates = ref(2)
const description = ref('')

const durationHHMM = computed({
  // getter
  get() {
    if ( duration.value !== undefined ) { // to prevent error when updatedDuration is accessed during render but not defined 
      const date = new Date(duration.value * 1000)
      return date.toISOString().substring(11, 16)
    }
  },
  // setter
  set(val) {
    var ts = val.split(':');
    duration.value  = Date.UTC(1970, 0, 1, ts[0], ts[1]) / 1000;
  }
})

// Dummy data to create new hike
const gpx = ref('')

async function createHike() {
  emit('close')
  const payload = {
    zone_id: props.zoneId,
    name: name.value,
    distance: distance.value,
    elevation: elevation.value,
    difficulty: difficulty.value,
    duration: duration.value,
    journey: journey.value,
    rates: rates.value,
    description: description.value,
    gpx: gpx.value,
  }

  // add authorization to protect API
  const token = await auth.currentUser.getIdToken()
  const headers = { 
    Authorization: 'Bearer ' + token
  };

  await axios.post(import.meta.env.VITE_APP_ROOT_API + '/hikes', payload, { headers })
      .then((res) => {
          console.log(res.status);
          resetData();
          emit('exit');
      })
      .catch((error) => {
          console.log(error);
          resetData();
      })
}

async function resetData() {
  name.value = ''
  distance.value = ''
  elevation.value = ''
  difficulty.value = 2
  duration.value = ''
  journey.value = ''
  rates.value = 2
  description.value = ''
  gpx.value = ''
  errors.value = []
}

// custom form validation
const errors = ref([])
async function onSubmit() {
  errors.value = []
  if (!name.value) {
    errors.value.push('Le nom est obligatoire.')
  }
  if (!distance.value) {
    errors.value.push('La distance est obligatoire.')
  }
  if (!elevation.value) {
    errors.value.push('Le dénivelé positif est obligatoire.')
  }
  if (!duration.value) {
    errors.value.push('La durée est obligatoire.')
  }
  if (!journey.value.name) {
    errors.value.push('Le type d\'itinéraire est obligatoire.')
  }
  if (errors.value.length == 0) {
    createHike()
  }
}

</script>

<template>

<div class="modal fade" data-bs-backdrop="static" id="#create" tabindex="-1" aria-labelledby="#create" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title inter-maps-bold fs-5" id="#create">Créer un itinéraire</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="resetData()"></button>
      </div>
      <div class="modal-body">
        <form @submit.prevent="onSubmit()" novalidate> 
          <p v-if="errors.length">
            <b>Veuillez corriger les erreurs suivantes :</b>
            <ul>
              <li v-for="error in errors" style="color:#D6955B;">{{ error }}</li>
            </ul>
          </p>
          <div class="form-group inter-maps">
            <label for="InputName">Nom</label>
            <input type="text" v-model="name" class="form-control inter-maps-light" id="InputName">
          </div>
          <div class="form-group inter-maps">
            <label for="InputDescription">Description</label>
            <textarea type="text" v-model="description" class="form-control inter-maps-light" id="InputDescription" rows="4"></textarea>
          </div>
          <br/>
          <div class="row">
            <div class="form-group col inter-maps">
              <label for="InputDistance">Distance</label>
              <input type="number" step="0.1" v-model="distance" class="form-control inter-maps-light" id="InputDistance" placeholder="km">
            </div>
            <div class="form-group col inter-maps">
              <label for="InputElevation">Dénivelé positif cumulé</label>
              <input type="number" v-model="elevation" class="form-control inter-maps-light" id="InputElevation" placeholder="m+">
            </div>
          </div>
          <div class="row">
            <div class="form-group col inter-maps">
              <label for="InputDuration">Durée</label>
              <input type="time" v-model="durationHHMM" class="form-control inter-maps-light" id="InputDuration" placeholder="durée">
            </div>
            <div class="form-group col inter-maps">
              <label for="InputJourney">Type d'itinéraire</label>
              <select v-model="journey" class="form-select inter-maps-light" id="InputJourney">
                <option v-for="option in journeys" :value="option">
                  {{ option.name }}
                </option>
              </select>
            </div>
          </div>
          <br/>
          <div class="form-group inter-maps">
            <label for="InputDifficulty">Difficulté</label>
            <input v-model="difficulty" type="range" class="form-range range-cust" min="0" max="4" id="InputDifficulty">
          </div>
          <div class="form-group inter-maps">
            <label for="InputRates">Intérêt</label>
            <input v-model="rates" type="range" class="form-range range-cust" min="0" max="4" id="InputRates">
          </div>
          <br/>
          <div class="modal-footer">
            <button type="submit" class="btn btn-danger">Créer</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</div>

</template>

<style>

.range-cust::-webkit-slider-thumb {
  background: #390040 !important;
}
.range-cust::-moz-range-thumb {
  background: #390040 !important;
}
.range-cust::-ms-thumb {
  background: #390040 !important;
}

</style>


