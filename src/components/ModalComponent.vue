<script setup>

import axios from 'axios';
import { ref } from 'vue';

const emit = defineEmits(['exit'])

const props = defineProps({
  zoneId: String
})

const name = ref('')
const distance = ref('')
const hosts = ref('')

async function addNewHike() {
  const payload = {
    name: name.value,
    distance: distance.value,
    hosts: hosts.value,
    zone_id: props.zoneId,
  }
  await axios.post('http://localhost:5001/hikes', payload)
      .then((res) => {
          console.log(res.status);
          emit('exit');
      })
      .catch((error) => {
          console.log(error);
      })
  name.value = ''
  distance.value = ''
}

</script>

<template>

<div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="exampleModalLabel">Add new hike</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <form @submit.prevent="addNewHike">
          <div class="form-group">
            <label for="InputName">Nom de la randonnée</label>
            <input v-model="name" class="form-control" id="InputName" placeholder="nom">
          </div>
          <div class="form-group">
            <label for="InputDistance">Distance</label>
            <input v-model="distance" class="form-control" id="InputDistance" placeholder="distance">
            <small class="form-text text-muted">Renseignez la distance en km</small>
          </div>
          <br/>
          <button class="btn btn-outline-secondary" data-bs-dismiss="modal">Ajouter</button>
        </form>
      </div>
    </div>
  </div>
</div>

</template>

<style>

</style>


