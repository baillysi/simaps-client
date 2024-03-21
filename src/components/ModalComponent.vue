<script setup>

import axios from 'axios';
import { ref, toRef, watch } from 'vue';

const emit = defineEmits(['exitCreated', 'exitUpdated', 'exitDeleted'])

const props = defineProps({
  zoneId: String,
  hikeId: String,
  currentName: String,
  currentDistance: Number
})

const name = ref('')
const distance = ref('')

// Dummy data
const hosts = ref('')
const gpx = ref('')

const updatedName = ref('')
const updatedDistance = ref('')

watch(toRef(props, 'currentName'), (value) => {
  updatedName.value = toRef(props, 'currentName').value; 
});

watch(toRef(props, 'currentDistance'), (value) => {
  updatedDistance.value = toRef(props, 'currentDistance').value; 
});

async function addNewHike() {
  const payload = {
    name: name.value,
    distance: distance.value,
    hosts: hosts.value,
    zone_id: props.zoneId,
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
}

async function updateHike() {
  const payload = {
    name: updatedName.value,
    distance: updatedDistance.value,
  }
  await axios.put('http://localhost:5001/hikes/' + props.hikeId, payload)
      .then((res) => {
          console.log(res.status);
          emit('exitUpdated');
      })
      .catch((error) => {
          console.log(error);
      })
  name.value = ''
  distance.value = ''
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
        <h1 class="modal-title fs-5" id="exampleModalLabel">Create new hike</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <form @submit.prevent="addNewHike">
          <div class="form-group">
            <label for="InputName">Hike name</label>
            <input v-model="name" class="form-control" id="InputName" placeholder="nom">
          </div>
          <div class="form-group">
            <label for="InputDistance">Hike distance</label>
            <input v-model="distance" class="form-control" id="InputDistance" placeholder="distance">
            <small class="form-text text-muted">Use km metrics</small>
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
            <label for="InputName">Hike name</label>
            <input v-model="updatedName" class="form-control" id="InputName" placeholder="nom">
          </div>
          <div class="form-group">
            <label for="InputDistance">Hike distance</label>
            <input v-model="updatedDistance" class="form-control" id="InputDistance" placeholder="distance">
            <small class="form-text text-muted">Use km metrics</small>
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


