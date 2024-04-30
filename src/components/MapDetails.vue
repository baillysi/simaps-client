<script setup>

import 'leaflet/dist/leaflet.css';
import { Modal } from 'bootstrap';

import { LMap, LTileLayer, LPolyline, LPopup} from '@vue-leaflet/vue-leaflet';

import { ref, onMounted, watch, computed } from 'vue';
import axios from 'axios';

import CreateComponent from './CreateComponent.vue';
import UpdateComponent from './UpdateComponent.vue';
import DeleteComponent from './DeleteComponent.vue';
import AlertComponent from './AlertComponent.vue';

const props = defineProps({
  id: String
})

const hikes = ref([])
const hikeDetails = ref('')

const selectedHike = ref(0)

const journeys = ref([])

const message = ref('')
const showMessage = ref(false)

const search = ref('')
const currentOrder = ref('') 
const sortedHikes = computed(() => {
  return currentOrder.value == 'Name' ?
  hikes.value.sort((a, b) => {
  let fa = a.name.toLowerCase(), fb = b.name.toLowerCase();
  if (fa < fb) {
    return -1;
  }
  if (fa > fb) {
    return 1;
  }
  return 0;
  }):
  hikes.value.sort((a, b) => {
  if (a.id < b.id) {
    return -1;
  }
  if (a.id > b.id) {
    return 1;
  }
  return 0;
  })
})
const filteredHikes = computed (() => {
  return sortedHikes.value.filter(
        (hike) =>
          hike.name
            .toLowerCase()
            .includes(search.value.toLowerCase()))
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

async function getJourneys() {
  const response = await axios.get('http://localhost:5001/journeys')
  journeys.value = response.data
}

// custom validation 
// check bootstrap native validation or third part library like veevalidate + server side validation
// use of js functions to show or hide modals instead of native data-bs-dismiss to add form validation logic
// TODO refacto

async function showCreate() {
  let myModal = Modal.getOrCreateInstance(document.getElementById('#create'));
  myModal.show();
}

async function showUpdate() {
  let myModal = Modal.getOrCreateInstance(document.getElementById('#update'));
  myModal.show();
}

async function showDelete() {
  let myModal = Modal.getOrCreateInstance(document.getElementById('#delete'));
  myModal.show();
}

async function hideCreate() {
  let myModal = Modal.getOrCreateInstance(document.getElementById('#create'));
  myModal.hide();
}

async function hideUpdate() {
  let myModal = Modal.getOrCreateInstance(document.getElementById('#update'));
  myModal.hide();
}

async function hideDelete() {
  let myModal = Modal.getOrCreateInstance(document.getElementById('#delete'));
  myModal.hide();
}
</script>

<template>

  <div class="row" style="margin-left: 40px; margin-right: 40px;">

    <div class="col-lg-7" style='padding: 10px;'>

      <div class="map" v-if="ismapdata" style='border: 2px solid #226d68;'>
        <l-map ref="map" :zoom="13" :center="mapcenter" :use-global-leaflet="false">
          <l-tile-layer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            layer-type="base"
            name="OpenStreetMap"
          ></l-tile-layer>
          <l-polyline v-for="hike in sortedHikes" :key="hike.id" :lat-lngs="hike.coordinates" :opacity="selectedHike == hike.id ? 1 : 0.4" :color="'red'">
            <l-popup>{{ hike.name }} <br> {{ hike.distance }}km </l-popup>
          </l-polyline>
        </l-map>
      </div>
    </div>

    <div class="col-lg-5 overflow-auto" style='padding: 10px; max-height: 680px;'>

      <div class="row" style="margin: 10px;">
        <div class="col-4">
          <input class="form-control" placeholder="Search" v-model="search"/>
        </div>
        <div class="col-4">
          <select v-model="currentOrder" class="form-select" @change="getZoneDetails()">
            <option disabled value="">Sort</option>
            <option>Name</option>
            <option>Index</option>
          </select>
        </div>
      </div>
      <br/>

      <div class="row" style="margin-left: 10px; margin-right: 10px;">
        <button class="btn btn-outline-secondary" @click="getJourneys(), showCreate()">Create your own hike</button>
      </div>
      <br/>

      <div class="accordion accordion-flush" id="accordionFlushParent">
        <div class="accordion-item" v-for="(hike, index) in filteredHikes" :key="hike.id">
          <h2 class="accordion-header" id="flush-headingOne">
            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" :data-bs-target="'#flush-collapseOne'+index" aria-expanded="false" aria-controls="flush-collapseOne">
              <div class="col-6">
                {{ hike.name}}
              </div>
              <div class="col-3">
                <span v-if="hike.difficulty == 1" class="badge bg-success">Easy</span>
                <span v-if="hike.difficulty == 2" class="badge bg-primary">Medium</span>
                <span v-if="hike.difficulty == 3" class="badge bg-danger">Difficult</span>
                <span v-if="hike.difficulty == 4" class="badge bg-dark">Extreme</span>
              </div>
              <div class="col-3">
                <i v-for="rate in hike.rates" class="pi pi-star-fill" style="font-size: 1rem; color:#226D68;"></i>
                <i v-for="rate in (4 - hike.rates)" class="pi pi-star" style="font-size: 1rem; color:#226D68;"></i>
              </div>
            </button>
          </h2>
          <div :id="'flush-collapseOne'+index" class="accordion-collapse collapse" aria-labelledby="flush-headingOne" data-bs-parent="#accordionFlushParent">
            <div class="accordion-body">
              <span class="badge bg-info">{{ hike.distance }} km</span>
              <span class="badge bg-info">{{ hike.elevation }} m+</span> 
              <span class="badge bg-info">{{ hike.duration }} hours</span>
              <span class="badge bg-info">{{ hike.journey.name }}</span>
              <br/><br/>
              {{ hike.description }}
              <br/><br/>
              <div class="col text-end">
                <button class="btn btn-light" @click="getHikeDetails(hike), selectedHike = hike.id" data-toggle="tooltip" title="see on map">
                  <i class="pi pi-eye" style="color:#226D68;"></i>
                </button>
                <button class="btn btn-light" @click="getHikeDetails(hike), getJourneys(), showUpdate()" data-toggle="tooltip" title="update data">
                  <i class="pi pi-file-edit" style="color:#226D68;"></i>
                </button>
                <button class="btn btn-light" data-toggle="tooltip" title="upload gpx">
                  <i class="pi pi-upload" style="color:#226D68;"></i>
                </button>
                <button class="btn btn-light" @click="getHikeDetails(hike), showDelete()" data-toggle="tooltip" title="delete hike">
                  <i class="pi pi-trash" style="color:#D6955B;"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <br/>

      <div class="row" style="margin-left: 10px; margin-right: 10px;">
        <AlertComponent :message="message" v-if="showMessage"></AlertComponent>
      </div>

    </div>
  </div>
  
  <!-- Create -->
  <CreateComponent :zoneId="props.id" :journeys="journeys" @exit="getZoneDetails(), message = 'Hike created!', showMessage = true, hideCreate()">
  </CreateComponent>

  <!-- Update -->
  <UpdateComponent :hikeId="String(hikeDetails.id)" :zoneId="props.id" :journeys="journeys" 
  :currentName="hikeDetails.name" 
  :currentDistance="hikeDetails.distance" 
  :currentElevation="hikeDetails.elevation" 
  :currentDifficulty="hikeDetails.difficulty" 
  :currentDuration="hikeDetails.duration" 
  :currentJourney="hikeDetails.journey" 
  :currentRates="hikeDetails.rates" 
  :currentDescription="hikeDetails.description" 
  @exit="getZoneDetails(), message = 'Hike updated!', showMessage = true, hideUpdate()" >
  </UpdateComponent>

  <!-- Delete -->
  <DeleteComponent :hikeId="String(hikeDetails.id)" @exit="getZoneDetails(), message = 'Hike deleted!', showMessage = true, hideDelete()">
  </DeleteComponent>
  

</template>

<style>

  .map {
    position: relative;
    height: 680px;  /* or as desired */
    width: 100%;  /* This means "100% of the width of its container", the .col-lg-7 */
  }

  .leaflet-popup-content-wrapper {
    border-radius: 0.5 !important;
    font-size:small;
  }

  .badge.bg-info {
    background-color:#226D68 !important; 
    margin-left: 5px;
    margin-right: 5px;
  }

</style>