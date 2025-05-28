<script setup>

import axios from 'axios';
import { ref, computed } from 'vue';

import AlertComponent from './AlertComponent.vue';

import { useAuthStore } from '@/stores/auth'
const authStore = useAuthStore()

const emit = defineEmits(['exit'])

const props = defineProps({
  zoneId: String,
  journeys: Object,
  regions: Object,
})

// handle axios response 
const isResponseLoading = ref(false)
const isResponseLoaded = ref(false)
const alertMessage = ref('')
const alertSuccess = ref(false)

const errors = ref([])

const hikeName = ref('')
const hikeDistance = ref('')
const hikeElevation = ref('')
const hikeDifficulty = ref(2)
const hikeDuration = ref('')
const hikeJourney = ref([])
const hikeRegion = ref([])
const hikeDescription = ref('')

// Dummy data to create new hike without gpx data
const hikeGpx = ref('')

// from seconds in DB to HHMM
const durationHHMM = computed({
  get() {
    if ( hikeDuration.value !== undefined ) { // to prevent error when updatedDuration is accessed during render but not defined 
      const date = new Date(hikeDuration.value * 1000)
      return date.toISOString().substring(11, 16)
    }
  },
  set(val) {
    var ts = val.split(':');
    hikeDuration.value  = Date.UTC(1970, 0, 1, ts[0], ts[1]) / 1000;
  }
})

async function createHike() {
  isResponseLoading.value = true
  const payload = {
    zone_id: props.zoneId,
    name: hikeName.value,
    distance: hikeDistance.value,
    elevation: hikeElevation.value,
    difficulty: hikeDifficulty.value,
    duration: hikeDuration.value,
    journey: hikeJourney.value,
    region: hikeRegion.value,
    description: hikeDescription.value,
    gpx: hikeGpx.value,
  }

  const token = await authStore.auth.currentUser.getIdToken()
  const headers = { 
    Authorization: 'Bearer ' + token
  };

  await axios.post(import.meta.env.VITE_APP_ROOT_API + 'api/hikes', payload, { headers })
      .then((res) => {
          console.log(res.status)
          isResponseLoading.value = false
          isResponseLoaded.value = true
          alertSuccess.value = true
          alertMessage.value = 'Itinéraire créé !'
      })
      .catch((error) => {
          console.log(error);
          isResponseLoading.value = false
          isResponseLoaded.value = true
          alertSuccess.value = false
          alertMessage.value = 'Une erreur est survenue.'
      })
}

// custom form validation
function onSubmit() {
  errors.value = []
  if (!hikeName.value) {
    errors.value.push('Le nom est obligatoire.')
  }
  if (!hikeDistance.value) {
    errors.value.push('La distance est obligatoire.')
  }
  if (!hikeElevation.value) {
    errors.value.push('Le dénivelé positif est obligatoire.')
  }
  if (!hikeDuration.value) {
    errors.value.push('La durée est obligatoire.')
  }
  if (!hikeJourney.value.name) {
    errors.value.push('Le type d\'itinéraire est obligatoire.')
  }
  if (!hikeRegion.value.name) {
    errors.value.push('La région est obligatoire.')
  }
  if (errors.value.length == 0) {
    createHike()
  }
}

function resetData() {
  hikeName.value = ''
  hikeDistance.value = ''
  hikeElevation.value = ''
  hikeDifficulty.value = 2
  hikeDuration.value = ''
  hikeJourney.value = ''
  hikeRegion.value = ''
  hikeDescription.value = ''
  hikeGpx.value = ''
  errors.value = []
  isResponseLoaded.value = false
  alertSuccess.value = false
  alertMessage.value = ''
}

</script>

<template>

<div class="modal fade" data-bs-backdrop="static" id="#create" tabindex="-1" aria-labelledby="#create" aria-hidden="false">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title simaps-bold fs-5" id="#create">Créer un itinéraire</h1>
        <button v-if="isResponseLoaded" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="resetData(), emit('exit')"></button>
        <button v-else type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="resetData()"></button>
      </div>
      <div v-if="!isResponseLoaded" class="modal-body">
        <form @submit.prevent="onSubmit()" novalidate> 
          <div v-if="errors.length">
            <b>Veuillez corriger les erreurs suivantes :</b>
            <ul>
              <li v-for="error in errors" style="color:#D6955B;">{{ error }}</li>
            </ul>
          </div>
          <div class="form-group simaps-classic">
            <label for="InputName">Nom</label>
            <input type="text" v-model="hikeName" class="form-control simaps-light" id="InputName">
          </div>
          <div class="form-group simaps-classic">
            <label for="InputRegion">Région</label>
            <select v-model="hikeRegion" class="form-select simaps-light" id="InputRegion">
              <option v-for="option in regions" :value="option">
                {{ option.name }}
              </option>
            </select>
          </div>
          <div class="form-group simaps-classic">
            <label for="InputDescription">Description</label>
            <textarea type="text" v-model="hikeDescription" class="form-control simaps-light" id="InputDescription" rows="4"></textarea>
          </div>
          <br/>
          <div class="row">
            <div class="form-group col simaps-classic">
              <label for="InputDistance">Distance</label>
              <input type="number" step="0.1" v-model="hikeDistance" class="form-control simaps-light" id="InputDistance" placeholder="km">
            </div>
            <div class="form-group col simaps-classic">
              <label for="InputElevation">Dénivelé positif cumulé</label>
              <input type="number" v-model="hikeElevation" class="form-control simaps-light" id="InputElevation" placeholder="m+">
            </div>
          </div>
          <div class="row">
            <div class="form-group col simaps-classic">
              <label for="InputDuration">Durée</label>
              <input type="time" v-model="durationHHMM" class="form-control simaps-light" id="InputDuration" placeholder="durée">
            </div>
            <div class="form-group col simaps-classic">
              <label for="InputJourney">Type d'itinéraire</label>
              <select v-model="hikeJourney" class="form-select simaps-light" id="InputJourney">
                <option v-for="option in journeys" :value="option">
                  {{ option.name }}
                </option>
              </select>
            </div>
          </div>
          <br/>
          <div class="form-group simaps-classic">
            <label for="InputDifficulty">Difficulté</label>
            <input v-model="hikeDifficulty" type="range" class="form-range range-cust" min="1" max="4" id="InputDifficulty">
          </div>
          <br/>
          <div class="modal-footer">
            <button type="submit" class="btn btn-danger">Créer</button>
          </div>
        </form>
      </div>
      <div v-if="isResponseLoaded" class="modal-body">
        <div class="row" style="margin-left: 10px; margin-right: 10px;">
          <AlertComponent :message="alertMessage" :success="alertSuccess"></AlertComponent>
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


