<script setup>

import axios from 'axios';
import { ref, toRef, watch } from 'vue';

const emit = defineEmits(['exitCreated', 'exitUpdated', 'exitDeleted'])

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
})

const name = ref('')
const distance = ref('')
const elevation = ref('')
const difficulty = ref('')
const duration = ref('')
const journey = ref([])
const rates = ref('')
const description = ref('')

// Dummy data to create new hike
const hosts = ref('')
const gpx = ref('')

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

async function addNewHike() {
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

  await axios.post('http://localhost:5001/hikes', payload)
      .then((res) => {
          console.log(res.status);
          emit('exitCreated');
      })
      .catch((error) => {
          console.log(error);
      })
  name.value = ''
  distance.value = ''
  elevation.value = ''
  difficulty.value = ''
  duration.value = ''
  journey.value = ''
  rates.value = ''
  description.value = ''
  hosts.value = ''
  gpx.value = ''
}

async function updateHike() {
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
  await axios.put('http://localhost:5001/hikes/' + props.hikeId, payload)
      .then((res) => {
          console.log(res.status);
          emit('exitUpdated');
      })
      .catch((error) => {
          console.log(error);
      })
}

async function deleteHike() {
  await axios.delete('http://localhost:5001/hikes/' + props.hikeId)
      .then((res) => {
          console.log(res.status);
          emit('exitDeleted');
      })
      .catch((error) => {
          console.log(error);
      });
}

</script>

<template>

<div class="modal fade" id="addModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="exampleModalLabel">Create your own hike</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <form @submit.prevent="addNewHike" novalidate>
          <div class="form-group">
            <label for="InputName">Name</label>
            <input v-model="name" class="form-control" id="InputName">
          </div>
          <div class="form-group">
            <label for="InputDescription">Description</label>
            <textarea v-model="description" class="form-control" id="InputDescription" rows="4"></textarea>
          </div>
          <br/>
          <div class="form-group">
            <label for="InputDistance">Distance</label>
            <input v-model="distance" class="form-control" id="InputDistance" placeholder="km">
          </div>
          <div class="form-group">
            <label for="InputElevation">Positive elevation</label>
            <input v-model="elevation" class="form-control" id="InputElevation" placeholder="m+">
          </div>
          <div class="form-group">
            <label for="InputDuration">Duration</label>
            <input v-model="duration" class="form-control" id="InputDuration" placeholder="hours">
          </div>
          <label for="InputJourney">Journey type</label>
          <select v-model="journey" class="form-select" id="InputJourney">
            <option v-for="option in journeys" :value="option">
              {{ option.name }}
            </option>
          </select>
          <br/>
          <div class="form-group">
            <label for="InputDifficulty">Difficulty</label>
            <input v-model="difficulty" type="range" class="form-range" min="0" max="4" id="InputDifficulty">
          </div>
          <div class="form-group">
            <label for="InputRates">Interest</label>
            <input v-model="rates" type="range" class="form-range" min="0" max="4" id="InputRates">
          </div>
          <br/>
          <button class="btn btn-outline-secondary" data-bs-dismiss="modal">Create</button>
        </form>
      </div>
    </div>
  </div>
</div>

<div class="modal fade" id="putModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="exampleModalLabel">Update hike</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <form @submit.prevent="updateHike">
          <div class="form-group">
            <label for="InputName">Name</label>
            <input v-model="updatedName" class="form-control" id="InputName">
          </div>
          <div class="form-group">
            <label for="InputDescription">Description</label>
            <textarea v-model="updatedDescription" class="form-control" id="InputDescription" rows="4"></textarea>
          </div>
          <br/>
          <div class="form-group">
            <label for="InputDistance">Distance - <small><i>km</i></small></label>
            <input v-model="updatedDistance" class="form-control" id="InputDistance" placeholder="km">
          </div>
          <div class="form-group">
            <label for="InputElevation">Positive elevation - <small><i>m+</i></small></label>
            <input v-model="updatedElevation" class="form-control" id="InputElevation" placeholder="m+">
          </div>
          <div class="form-group">
            <label for="InputDuration">Duration - <small><i>hours</i></small></label>
            <input v-model="updatedDuration" class="form-control" id="InputDuration" placeholder="hours">
          </div>
          <label for="InputJourney">Journey type</label>
          <select v-model="updatedJourney" class="form-select" id="InputJourney" >
            <option v-for="option in journeys" :value="option">
              {{ option.name }}
            </option>
          </select>
          <br/>
          <div class="form-group">
            <label for="InputDifficulty">Difficulty</label>
            <input v-model="updatedDifficulty" type="range" class="form-range" min="0" max="4" id="InputDifficulty">
          </div>
          <div class="form-group">
            <label for="InputRates">Interest</label>
            <input v-model="updatedRates" type="range" class="form-range" min="0" max="4" id="InputRates">
          </div>
          <br/>
          <button class="btn btn-outline-secondary" data-bs-dismiss="modal">Update</button>
        </form>
      </div>
    </div>
  </div>
</div>

<div class="modal fade" id="deleteModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-confirm">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="exampleModalLabel">Are you sure ?</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <p>Do you really want to delete these records? This process cannot be undone.</p>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
        <button class="btn btn-danger" data-bs-dismiss="modal" @click="deleteHike">Delete</button>
      </div>
    </div>
  </div>
</div>

</template>

<style>

</style>


