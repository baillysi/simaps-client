<script setup>

import 'leaflet/dist/leaflet.css';

import { LMap, LTileLayer, LPolyline } from '@vue-leaflet/vue-leaflet';

import { ref, onMounted, watch, computed } from 'vue';
import axios from 'axios';
import ModalComponent from './ModalComponent.vue';
import AlertComponent from './AlertComponent.vue';

const props = defineProps({
  id: String
})

const hikes = ref([])
const hikeDetails = ref('')
const showDetails = ref(false)

const selectedHike = ref(0)

const message = ref('')
const showMessage = ref(false)

const sortedHikes = computed(() => {
  return hikes.value.sort((a, b) => {
  if (a.id < b.id) {
    return -1;
  }
  if (a.id > b.id) {
    return 1;
  }
  return 0;
  })
})

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
          <l-polyline v-for="hike in sortedHikes" :key="hike.id" :lat-lngs="hike.coordinates" :opacity="selectedHike == hike.id ? 1 : 0.4" :color="'red'"></l-polyline>
        </l-map>
      </div>
    </div>

    <div class="col-md-5" style='border: 2px solid #226d68;padding: 15px;'>

      <div class="row" style="margin-left: 10px; margin-right: 10px;">
        <div class="col-lg-7" style='padding: 10px;'>
          <ul class="list-group list-group-flush">
            <li class="list-group-item list-group-item-action d-flex justify-content-between align-items-center" v-for="hike in sortedHikes" :key="hike.id">
             <div class="col-auto overflow-hidden">
                {{ hike.name }}
                <button class="btn btn-light" data-bs-toggle="modal" data-bs-target="#deleteModal" @click="getHikeDetails(hike), showDetails = false">
                  <i class="pi pi-trash" style="color:226D68;"></i>
                </button>
                <button class="btn btn-light" @click="getHikeDetails(hike), showDetails = true, selectedHike = hike.id">
                  <i class="pi pi-eye" style="color:226D68;"></i>
                </button>
                <button class="btn btn-light" data-bs-toggle="modal" data-bs-target="#putModal" @click="getHikeDetails(hike), showDetails = false">
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

        <div class="col-lg-5" style='padding: 18px;' v-if="showDetails">
          <li>Distance : {{ hikeDetails.distance }} km</li>
          <li>Name : {{ hikeDetails.name }}</li>
        </div>
      </div>

      <br/>

      <div class="row" style="margin-left: 10px; margin-right: 10px;">
        <!-- Button trigger modal -->
        <button class="btn btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#addModal">Create new hike</button>
      </div>

      <br/>

      <div class="row" style="margin-left: 10px; margin-right: 10px;">
        <AlertComponent :message="message" v-if="showMessage"></AlertComponent>
      </div>

    </div>

  </div>
  
  <!-- Modal -->
  <ModalComponent :zoneId="props.id" :currentName="hikeDetails.name" :currentDistance="hikeDetails.distance" :hikeId="String(hikeDetails.id)" @exitCreated="getZoneDetails(), showDetails = false, message = 'Hike created!', showMessage = true" @exitUpdated="getZoneDetails(), showDetails = false, message = 'Hike updated!', showMessage = true" @exitDeleted="getZoneDetails(), showDetails = false, message = 'Hike deleted!', showMessage = true"></ModalComponent>

</template>

<style>

  .map {
      position: relative;
      height: 600px;  /* or as desired */
      width: 100%;  /* This means "100% of the width of its container", the .col-md-7 */
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