<script setup>

import axios from 'axios';
import { ref, toRef, watch } from 'vue';

const emit = defineEmits(['exit', 'close'])

const props = defineProps({
  zoneId: String,
  hikeId: String,
  currentName: String,
  currentDistance: Number,
  currentElevation: Number,
  currentDifficulty: Number,
  currentDuration: Number,
  currentJourney: Object,
  currentRates: Number,
  currentDescription: String,
  journeys: Object,
  hasTrail: Boolean,
})

const updatedName = ref('')
const updatedDistance = ref('')
const updatedElevation = ref('')
const updatedDifficulty = ref('')
const updatedDuration = ref('')
const updatedJourney = ref([])
const updatedRates = ref('')
const updatedDescription = ref('')


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

watch(toRef(props, 'currentRates'), (value) => {
  updatedRates.value = toRef(props, 'currentRates').value; 
});

watch(toRef(props, 'currentDescription'), (value) => {
  updatedDescription.value = toRef(props, 'currentDescription').value; 
});

async function updateHike() {
  emit('close')
  const payload = {
    name: updatedName.value,
    distance: updatedDistance.value,
    elevation: updatedElevation.value,
    difficulty: updatedDifficulty.value,
    duration: updatedDuration.value,
    journey: updatedJourney.value,
    rates: updatedRates.value,
    description: updatedDescription.value,
  }
  await axios.put(import.meta.env.VITE_APP_ROOT_API + '/hikes/' + props.hikeId, payload)
      .then((res) => {
          console.log(res.status);
          emit('exit');
      })
      .catch((error) => {
          console.log(error);
      })
}

async function resetData() {
  updatedName.value = toRef(props, 'currentName').value
  updatedDistance.value = toRef(props, 'currentDistance').value
  updatedElevation.value = toRef(props, 'currentElevation').value
  updatedDifficulty.value = toRef(props, 'currentDifficulty').value
  updatedDuration.value = toRef(props, 'currentDuration').value
  updatedJourney.value = toRef(props, 'currentJourney').value
  updatedRates.value = toRef(props, 'currentRates').value
  updatedDescription.value = toRef(props, 'currentDescription').value
  errors.value = []
}

// custom form validation
const errors = ref([])
async function onSubmit() {
  errors.value = []
  if (!updatedName.value) {
    errors.value.push('Name is required.')
  }
  if (!updatedDistance.value) {
    errors.value.push('Distance is required.')
  }
  if (!updatedElevation.value) {
    errors.value.push('Positive elevation is required.')
  }
  if (!updatedDuration.value) {
    errors.value.push('Duration is required.')
  }
  if (!updatedJourney.value.name) {
    errors.value.push('Journey type is required.')
  }
  if (errors.value.length == 0) {
    updateHike()
  }
}

</script>

<template>

<div class="modal fade" data-bs-backdrop="static" id="#update" tabindex="-1" aria-labelledby="#update" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="#update">Mettre à jour l'itinéraire</h1>
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
            <label for="UpName">Nom</label>
            <input type="text" v-model="updatedName" class="form-control" id="UpName">
          </div>
          <div class="form-group">
            <label for="UpDescription">Description</label>
            <textarea type="text" v-model="updatedDescription" class="form-control" id="UpDescription" rows="4"></textarea>
          </div>
          <br/>
          <div class="row">
            <div class="form-group col">
              <label for="UpDistance">Distance</label>
              <input type="number" v-model="updatedDistance" class="form-control" id="UpDistance" placeholder="km" :disabled="props.hasTrail">
            </div>
            <div class="form-group col">
              <label for="UpElevation">Dénivelé positif cumulé</label>
              <input type="number" v-model="updatedElevation" class="form-control" id="UpElevation" placeholder="m+" :disabled="props.hasTrail">
            </div>
          </div>
          <div class="row">
            <div class="form-group col">
              <label for="UpDuration">Durée</label>
              <input type="number" v-model="updatedDuration" class="form-control" id="UpDuration" placeholder="heures">
            </div>
            <div class="form-group col">
              <label for="UpJourney">Type d'itinéraire</label>
              <select v-model="updatedJourney" class="form-select" id="UpJourney">
                <option v-for="option in journeys" :value="option">
                  {{ option.name }}
                </option>
              </select>
            </div>
          </div>
          <br/>
          <div class="form-group">
            <label for="UpDifficulty">Difficulté</label>
            <input v-model="updatedDifficulty" type="range" class="form-range" min="0" max="4" id="UpDifficulty">
          </div>
          <div class="form-group">
            <label for="UpRates">Intérêt</label>
            <input v-model="updatedRates" type="range" class="form-range" min="0" max="4" id="UpRates">
          </div>
          <br/>
          <div class="modal-footer">
            <button type="submit" class="btn btn-primary">Mettre à jour</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</div>

</template>

<style>

</style>


