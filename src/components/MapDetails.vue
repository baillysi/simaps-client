<script setup>

import 'leaflet/dist/leaflet.css';
import { LMap, LTileLayer, LMarker } from '@vue-leaflet/vue-leaflet';
import { ref, onMounted, computed, watch } from 'vue';
import axios from 'axios';

const props = defineProps({
  id: String
})

const hikes = ref('')
const hikeDetails = ref('')
const showDetails = ref(false)

const name = ref('')
const distance = ref('')
const hosts = ref('')

const mapcenter = ref('')
const ismapdata = ref(false)

watch(mapcenter, () => {
  ismapdata.value = true
})

onMounted(async () => {
  getZoneDetails()
 })

async function getZoneDetails() {
  const response = await axios.get('http://localhost:5001/zones/' + props.id)
  mapcenter.value = [parseFloat(response.data['lat']), parseFloat(response.data['lng'])]
  hikes.value = response.data['hikes']
}

async function getHikeDetails(hike) {
  const response = await axios.get('http://localhost:5001/hikes/' + hike.id)
  hikeDetails.value = response.data
  showDetails.value = true
}

async function addNewHike() {
  const payload = {
    name: name.value,
    distance: distance.value,
    hosts: hosts.value,
    zone_id: props.id,
  }
  await axios.post('http://localhost:5001/hikes', payload)
      .then((res) => {
          console.log(res.status);
          getZoneDetails();
      })
      .catch((error) => {
          console.log(error);
      })
  name.value = ''
  distance.value = ''
}

async function deleteHike(hike) {
  await axios.delete('http://localhost:5001/hikes/' + hike.id)
      .then((res) => {
          console.log(res.status);
          getZoneDetails();
          showDetails.value = false;
      })
      .catch((error) => {
          console.log(error);
      });
}

</script>

<template>

  <div class="row" style="margin-left: 40px; margin-right: 40px;">

    <div class="col-md-7" style='border: 2px solid #226d68; border-right: 0;padding: 15px;'>

      <div class="map" v-if="ismapdata">
        <l-map ref="map" :zoom="13" :center="mapcenter" :use-global-leaflet="false">
          <l-tile-layer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            layer-type="base"
            name="OpenStreetMap"
          ></l-tile-layer>
          <l-marker :lat-lng="[-21.019387053324387, 55.424319458353594]"></l-marker>
          <l-marker :lat-lng="[-21.1021375601261, 55.434908934125886]"></l-marker>
        </l-map>
      </div>
    </div>

    <div class="col-md-5" style='border: 2px solid #226d68;padding: 15px;'>

      <div class="row" style="margin-left: 10px; margin-right: 10px;">
        <div class="col-md-8" style='padding: 10px;'>
          <ul class="list-group list-group-flush">
            <li class="list-group-item list-group-item-action d-flex justify-content-between align-items-center" v-for="hike in hikes" :key="hike.id">
              <div class="col-auto">
                {{ hike.name }}
                <button class="btn btn-light" @click="deleteHike(hike)">
                  <i class="pi pi-trash" style="color:226D68;"></i>
                </button>
                <button class="btn btn-light" @click="getHikeDetails(hike)">
                  <i class="pi pi-file-edit" style="color:226D68;"></i>
                </button>
              </div>
              <div class="col-auto">
                <i class="pi pi-star-fill" style="font-size: 1rem; color:226D68;"></i>
                <i class="pi pi-star" style="font-size: 1rem; color:226D68;"></i>
                <i class="pi pi-star" style="font-size: 1rem; color:226D68;"></i>
              </div>
            </li>
          </ul>
        </div>
        <div class="col-md-4" style='padding: 18px;' v-if="showDetails">
          <li>Distance : {{ hikeDetails.distance }} km</li>
          <li>Nom : {{ hikeDetails.name }}</li>
        </div>
      </div>

      <br/>

      <div class="row" style="margin-left: 10px; margin-right: 10px;">
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
          <button class="btn btn-outline-secondary">Ajouter</button>    
        </form>
      </div>
    
    </div>

  </div>

</template>

<style>

  .map {
      position: relative;
      height: 600px;  /* or as desired */
      width: 100%;  /* This means "100% of the width of its container", the .col-md-8 */
  }

  .btn-outline-secondary {
    color:#f49e4c !important;
    font-weight: bold !important;
    padding-right: 50px !important;
    padding-left: 50px !important;
  }

  .btn-outline-secondary:hover {
    background-color:#3b8ea5 !important;
  }

</style>