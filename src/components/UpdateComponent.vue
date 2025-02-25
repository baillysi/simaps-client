<script setup>

import axios from 'axios';
import { ref, toRef, watch, computed } from 'vue';

import AlertComponent from './AlertComponent.vue';

// user session
import { useFirebaseAuth } from 'vuefire';
const auth = useFirebaseAuth()

const emit = defineEmits(['exit'])

const props = defineProps({
  zoneId: String,
  hikeId: String,
  currentName: String,
  currentDistance: Number,
  currentElevation: Number,
  currentDifficulty: Number,
  currentDuration: Number,
  currentJourney: Object,
  currentRegion: Object,
  currentDescription: String,
  journeys: Object,
  regions: Object,
  hasTrail: Boolean,
})

// handle axios response 
const isResponseLoading = ref(false)
const showResponse = ref(false)
const message = ref('')
const success = ref(false)

const updatedName = ref('')
const updatedDistance = ref('')
const updatedElevation = ref('')
const updatedDifficulty = ref('')
const updatedDuration = ref('')
const updatedJourney = ref([])
const updatedRegion = ref([])
const updatedDescription = ref('')

// "writable" computed property to handle duration in hh:mm format
// https://vuejs.org/guide/essentials/computed.html

const durationHHMM = computed({
  // getter
  get() {
    if ( updatedDuration.value !== undefined ) { // to prevent error when updatedDuration is accessed during render but not defined 
      const date = new Date(updatedDuration.value * 1000)
      return date.toISOString().substring(11, 16)
    }
  },
  // setter
  set(val) {
    var ts = val.split(':');
    updatedDuration.value  = Date.UTC(1970, 0, 1, ts[0], ts[1]) / 1000;
  }
})

watch(toRef(props, 'currentName'), (value) => {
  updatedName.value = toRef(props, 'currentName').value; 
});

watch(toRef(props, 'currentDistance'), (value) => {
  updatedDistance.value = toRef(props, 'currentDistance').value; 
});

watch(toRef(props, 'currentElevation'), (value) => {
  updatedElevation.value = toRef(props, 'currentElevation').value; 
});

watch(toRef(props, 'currentDifficulty'), (value) => {
  updatedDifficulty.value = toRef(props, 'currentDifficulty').value; 
});

watch(toRef(props, 'currentDuration'), (value) => {
  updatedDuration.value = toRef(props, 'currentDuration').value;
});

watch(toRef(props, 'currentJourney'), (value) => {
  updatedJourney.value = toRef(props, 'currentJourney').value; 
});

watch(toRef(props, 'currentRegion'), (value) => {
  updatedRegion.value = toRef(props, 'currentRegion').value; 
});

watch(toRef(props, 'currentDescription'), (value) => {
  updatedDescription.value = toRef(props, 'currentDescription').value; 
});

async function updateHike() {
  isResponseLoading.value = true
  const payload = {
    name: updatedName.value,
    distance: updatedDistance.value,
    elevation: updatedElevation.value,
    difficulty: updatedDifficulty.value,
    duration: updatedDuration.value,
    journey: updatedJourney.value,
    region: updatedRegion.value,
    description: updatedDescription.value,
  }

  // add authorization to protect API
  const token = await auth.currentUser.getIdToken()
  const headers = { 
    Authorization: 'Bearer ' + token
  };

  await axios.put(import.meta.env.VITE_APP_ROOT_API + '/hikes/' + props.hikeId, payload, { headers })
      .then((res) => {
          console.log(res.status)
          isResponseLoading.value = false
          showResponse.value = true
          success.value = true
          message.value = 'Itinéraire mis à jour'
      })
      .catch((error) => {
          console.log(error)
          isResponseLoading.value = false
          showResponse.value = true
          success.value = false
          message.value = 'Une erreur est survenue'
      })
}

async function resetData() {
  updatedName.value = toRef(props, 'currentName').value
  updatedDistance.value = toRef(props, 'currentDistance').value
  updatedElevation.value = toRef(props, 'currentElevation').value
  updatedDifficulty.value = toRef(props, 'currentDifficulty').value
  updatedDuration.value = toRef(props, 'currentDuration').value
  updatedJourney.value = toRef(props, 'currentJourney').value
  updatedRegion.value = toRef(props, 'currentRegion').value
  updatedDescription.value = toRef(props, 'currentDescription').value
  errors.value = []

  showResponse.value = false
  success.value = false
  message.value = ''
}

// custom form validation
const errors = ref([])
async function onSubmit() {
  errors.value = []
  if (!updatedName.value) {
    errors.value.push('Le nom est obligatoire.')
  }
  if (!updatedDistance.value) {
    errors.value.push('La distance est obligatoire.')
  }
  if (!updatedElevation.value) {
    errors.value.push('Le dénivelé positif est obligatoire.')
  }
  if (!updatedDuration.value) {
    errors.value.push('La durée est obligatoire.')
  }
  if (!updatedJourney.value.name) {
    errors.value.push('Le type d\'itinéraire est obligatoire.')
  }
  if (!updatedRegion.value.name) {
    errors.value.push('La région est obligatoire.')
  }
  if (errors.value.length == 0) {
    updateHike()
  }
}

</script>

<template>

<div class="modal fade" data-bs-backdrop="static" id="#update" tabindex="-1" aria-labelledby="#update" aria-hidden="false">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title simaps-bold fs-5" id="#update">Mettre à jour l'itinéraire</h1>
        <button v-if="!showResponse" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="resetData()"></button>
        <button v-if="showResponse" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="resetData(), emit('exit')"></button>
      </div>
      <div v-if="!showResponse" class="modal-body">
        <form @submit.prevent="onSubmit()" novalidate>
          <p v-if="errors.length" style="color:#FF803D;">
            <b>Veuillez corriger les erreurs suivantes :</b>
            <ul>
              <li v-for="error in errors">{{ error }}</li>
            </ul>
          </p>
          <div class="form-group simaps-classic">
            <label for="InputName">Nom</label>
            <input type="text" v-model="updatedName" class="form-control simaps-light" id="InputName">
          </div>
          <div class="form-group simaps-classic">
            <label for="InputRegion">Région</label>
            <select v-model="updatedRegion" class="form-select simaps-light" id="InputRegion">
              <option v-for="option in regions" :value="option">
                {{ option.name }}
              </option>
            </select>
          </div>
          <div class="form-group simaps-classic">
            <label for="InputDescription">Description</label>
            <textarea type="text" v-model="updatedDescription" class="form-control simaps-light" id="InputDescription" rows="4"></textarea>
          </div>
          <br/>
          <div class="row">
            <div class="form-group col simaps-classic">
              <label for="InputDistance">Distance</label>
              <input type="number" step="0.1" v-model="updatedDistance" class="form-control simaps-light" id="InputDistance" placeholder="km" :disabled="props.hasTrail">
            </div>
            <div class="form-group col simaps-classic">
              <label for="InputElevation">Dénivelé positif cumulé</label>
              <input type="number" v-model="updatedElevation" class="form-control simaps-light" id="InputElevation" placeholder="m+" :disabled="props.hasTrail">
            </div>
          </div>
          <div class="row">
            <div class="form-group col simaps-classic">
              <label for="InputDuration">Durée</label>
              <input type="time" v-model="durationHHMM" class="form-control simaps-light" id="InputDuration" placeholder="durée">
            </div>
            <div class="form-group col simaps-classic">
              <label for="InputJourney">Type d'itinéraire</label>
              <select v-model="updatedJourney" class="form-select simaps-light" id="InputJourney">
                <option v-for="option in journeys" :value="option">
                  {{ option.name }}
                </option>
              </select>
            </div>
          </div>
          <br/>
          <div class="form-group simaps-classic">
            <label for="InputDifficulty">Difficulté</label>
            <input v-model="updatedDifficulty" type="range" class="range-cust form-range" min="1" max="4" id="InputDifficulty">
          </div>
          <br/>
          <div class="modal-footer">
            <button type="submit" class="btn btn-danger">Mettre à jour</button>
          </div>
        </form>
      </div>
      <div v-if="showResponse" class="modal-body">
        <div class="row" style="margin-left: 10px; margin-right: 10px;">
          <AlertComponent :message="message" :success="success"></AlertComponent>
        </div>
      </div>
    </div>
  </div>
</div>

</template>

<style>

.range-cust::-webkit-slider-thumb {
  background: #3C002E !important;
}
.range-cust::-moz-range-thumb {
  background: #3C002E !important;
}
.range-cust::-ms-thumb {
  background: #3C002E !important;
}

</style>


