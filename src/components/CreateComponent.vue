<script setup>

import axios from 'axios';
import { ref, toRef, watch } from 'vue';

const emit = defineEmits(['exit'])

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

// Dummy data to create new hike
const hosts = ref('')
const gpx = ref('')

async function createHike() {
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
    hosts: hosts.value,
    gpx: gpx.value,
  }

  await axios.post(import.meta.env.VITE_APP_ROOT_API + '/hikes', payload)
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
  hosts.value = ''
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
        <h1 class="modal-title fs-5" id="#create">Créer un itinéraire</h1>
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
          <div class="form-group">
            <label for="InputName">Nom</label>
            <input type="text" v-model="name" class="form-control" id="InputName">
          </div>
          <div class="form-group">
            <label for="InputDescription">Description</label>
            <textarea type="text" v-model="description" class="form-control" id="InputDescription" rows="4"></textarea>
          </div>
          <br/>
          <div class="row">
            <div class="form-group col">
              <label for="InputDistance">Distance</label>
              <input type="number" v-model="distance" class="form-control" id="InputDistance" placeholder="km">
            </div>
            <div class="form-group col">
              <label for="InputElevation">Dénivelé positif cumulé</label>
              <input type="number" v-model="elevation" class="form-control" id="InputElevation" placeholder="m+">
            </div>
          </div>
          <div class="row">
            <div class="form-group col">
              <label for="InputDuration">Durée</label>
              <input type="number" v-model="duration" class="form-control" id="InputDuration" placeholder="heures">
            </div>
            <div class="form-group col">
              <label for="InputJourney">Type d'itinéraire</label>
              <select v-model="journey" class="form-select" id="InputJourney">
                <option v-for="option in journeys" :value="option">
                  {{ option.name }}
                </option>
              </select>
            </div>
          </div>
          <br/>
          <div class="form-group">
            <label for="InputDifficulty">Difficulté</label>
            <input v-model="difficulty" type="range" class="form-range" min="0" max="4" id="InputDifficulty">
          </div>
          <div class="form-group">
            <label for="InputRates">Intérêt</label>
            <input v-model="rates" type="range" class="form-range" min="0" max="4" id="InputRates">
          </div>
          <br/>
          <div class="modal-footer">
            <button type="submit" class="btn btn-success">Créer</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</div>

</template>

<style>

</style>


