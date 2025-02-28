<script setup>

import L from 'leaflet'
globalThis.L = L

import 'leaflet/dist/leaflet.css'

// vue components for Leaflet Maps - vue3
// regularly check vue-leaflet project to implement new components https://github.com/vue-leaflet/vue-leaflet
import { LMap, LTileLayer, LControlScale, LGeoJson, LTooltip } from '@vue-leaflet/vue-leaflet'

// native leaflet plugins
import 'leaflet.locatecontrol'
import 'leaflet.locatecontrol/dist/L.Control.Locate.min.css'
import 'leaflet.fullscreen'
import 'leaflet.fullscreen/Control.FullScreen.css'
import 'leaflet.heightgraph'
import 'leaflet.heightgraph/dist/L.Control.Heightgraph.min.css'

import { Collapse, Modal } from 'bootstrap'
import axios from 'axios'
import GeoJsonToGpx from "@dwayneparton/geojson-to-gpx"

import CreateComponent from '../components/CreateComponent.vue'
import UpdateComponent from '../components/UpdateComponent.vue'
import DeleteComponent from '../components/DeleteComponent.vue'
import LoginComponent from '../components/LoginComponent.vue'

import { ref, onMounted, watch, computed } from 'vue'
import router from '../router';
import { useResizeObserver } from '@vueuse/core'

import { useAuthStore } from '@/stores/auth'
const authStore = useAuthStore()

const props = defineProps({
  zone: String
})

const isResponseLoading = ref(false)

// hikes data variables
const hikes = ref([])
const hikeDetails = ref('')
const zoneId = ref('')

const hoveredHike = ref('')
const selectedHike = ref('')

const journeys = ref([])
const regions = ref([])
const regionsAll = ref([])

const searchName = ref('')
const searchDifficulty = ref('')
const searchRegion = ref('')
const currentOrder = ref('')

const sortedHikes = computed(() => {
  return currentOrder.value == 'Difficulté' ?
  hikes.value.sort((a, b) => {
  let fa = a.difficulty, fb = b.difficulty;
  if (fa < fb) {
    return 1;
  }
  if (fa > fb) {
    return -1;
  }
  return 0;
  }): currentOrder.value == 'Région' ?
  hikes.value.sort((a, b) => {
  let fa = a.region['id'], fb = b.region['id'];
  if (fa < fb) {
    return 1;
  }
  if (fa > fb) {
    return -1;
  }
  return 0;
  }):
  hikes.value.sort((a, b) => {
  if (a.region['id'] < b.region['id']) {
    return -1;
  }
  if (a.region['id'] > b.region['id']) {
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
            .includes(searchName.value.toLowerCase())
          &&
          hike.difficulty.toString()
            .toLowerCase()
            .includes(searchDifficulty.value.toLowerCase())
          &&
          hike.region['id'].toString()
            .toLowerCase()
            .includes(searchRegion.value.toString().toLowerCase())
          &&
          hike.trail.geojson)
})
const sortedRegionsAll = computed(() => {
  return regionsAll.value.sort((a, b) => {
  if (a.id < b.id) {
    return -1;
  }
  if (a.id > b.id) {
    return 1;
  }
  return 0;
  })
})

// leaflet map variables
const myMap = ref(null)
const mapCenter = ref('')
const mapZoom = ref(11)
const isMapDataLoaded = ref(false)
const attribution = ref('&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors')

const selectedStyle = ref(
  {
    'color':'#9F0000', 
    'weight': 6
  }
)
const hoveredStyle = ref(
  {
    'color':'#FF803D', 
    'weight': 6
  }
)
const outedStyle = ref(
  {
    'color':'#3C002E',
    'weight': 5
  }
)
const outedLightStyle = ref(
  {
    'color':'#3C002E',
    'weight': 3
  }
)
const colorMappings = {
    Simaps: {
        'Elevation': {
            text: 'Altitude',
            color: '#FF803D'
        }
    }
  }
const heightgraphOptions = {
    mappings: colorMappings,
    width: 650,
    height: 227.5,
    expand: true,
    expandControls : true,
    graphStyle: {
      'opacity': 1,
      'fill-opacity': 0.6,
      'stroke-width': '3px',
    },
    translation: {
      distance: "distance",
      elevation: "altitude",
      segment_length: "total",
      type: "type",
      legend: "Profil Altimétrique"
    }
}

const myHeightGraph = L.control.heightgraph(heightgraphOptions)
const myLocateControl = L.control.locate({position: "topleft", strings: { title: "localisation" }})
const myFullscreenControl = L.control
  .fullscreen({
    position: 'topleft', // change the position of the button can be topleft, topright, bottomright or bottomleft, default topleft
    title: 'mode plein écran', // change the title of the button, default Full Screen
    titleCancel: 'sortir plein écran', // change the title of the button when fullscreen is on, default Exit Full Screen
    content: null, // change the content of the button, can be HTML, default null
    forceSeparateButton: true, // force separate button to detach from zoom buttons, default false
    forcePseudoFullscreen: false, // force use of pseudo full screen even if full screen API is available, default false
    fullscreenElement: false // Dom element to render in full screen, false by default, fallback to map._container
  })


async function getZoneDetails() {
  const responseZone = await axios.get(import.meta.env.VITE_APP_ROOT_API + '/zones/' + props.zone)
  const responseRegion = await axios.get(import.meta.env.VITE_APP_ROOT_API + '/regions/'+ props.zone)
  isResponseLoading.value = false
  mapCenter.value = [parseFloat(responseZone.data['lat']), parseFloat(responseZone.data['lng'])]
  zoneId.value = responseZone.data['id'].toString()
  hikes.value = responseZone.data['hikes']
  regionsAll.value = responseRegion.data
}

async function getJourneys() {
  const response = await axios.get(import.meta.env.VITE_APP_ROOT_API + '/journeys')
  journeys.value = response.data
}

async function getRegions() {
  const response = await axios.get(import.meta.env.VITE_APP_ROOT_API + '/regions')
  regions.value = response.data
}

function resetData() {
  selectedHike.value = ''
  hideHeightgraph()
}

function resetDataAndFilters() {
  selectedHike.value = ''
  hideHeightgraph()
  fitBoundsZone(mapCenter.value)
  searchDifficulty.value = ''
  searchRegion.value = ''
  searchName.value = ''
  currentOrder.value = ''
}

function onReady() {
  myLocateControl.addTo(myMap.value.leafletObject)
  myFullscreenControl.addTo(myMap.value.leafletObject)
}

function showHeightgraph(geojson) {
  myHeightGraph.addTo(myMap.value.leafletObject)
  myHeightGraph.addData([geojson])
}

function hideHeightgraph() {
  myHeightGraph.remove()
  // to prevent errors in useResizeObserver
  myHeightGraph._data = undefined
}

function zoomUpdated(zoom) {
  mapZoom.value = zoom
}

function fitBounds(geojson) {
  let feature = L.geoJSON(geojson)
  myMap.value.leafletObject.fitBounds(feature.getBounds(), true)
}

function fitBoundsRegion() {
  if (filteredHikes.value.length != 0) {
    let feature = L.geoJSON(filteredHikes.value[0].trail.geojson)
    var bounds = feature.getBounds()
  }
  else {
    return;
  }
  for (let i = 0; i < filteredHikes.value.length; i++) {
    let feature = L.geoJSON(filteredHikes.value[i].trail.geojson)
    bounds.extend(feature.getBounds())
  }
  myMap.value.leafletObject.fitBounds(bounds, true)
}

function fitBoundsZone(mapCenter) {
  myMap.value.leafletObject.setView(mapCenter, 10)
}

function downloadGPX(geojson, name) {
  const options = {
    metadata: {
      name: name,
      author: {
        name: 'Simon Bailly (based on Dwayne Parton\' work)',
        link: {
          href: 'https://www.dwayneparton.com'
        }
      }
    }
  }
  const gpx = GeoJsonToGpx(geojson, options);
  const gpxString = new XMLSerializer().serializeToString(gpx);
  const link = document.createElement('a');
  link.download = name.concat(".gpx");
  const blob = new Blob([gpxString], {type: 'text/xml'});
  link.href = window.URL.createObjectURL(blob);
  link.click();
}

// watchers to load map and make heightgraph responsive
watch(mapCenter, () => {
  isMapDataLoaded.value = true;
})

useResizeObserver(myMap, (entries) => {
  const entry = entries[0]
  const { width } = entry.contentRect
  if (myHeightGraph._data) {
    if (width <= 670 && width > 470) {
      myHeightGraph.resize({width: 450, height: 192.5})
    }
    else if (width <= 470){
      myHeightGraph.resize({width: 350, height: 157.5})
    }
    else {
      myHeightGraph.resize({width: 650, height: 227.5})
    }
  }
})

// use of js functions to show or hide modals instead of native bootstrap data-bs-dismiss to add form validation logic
function showCreate() {
  let myModal = Modal.getOrCreateInstance(document.getElementById('#create'));
  myModal.show();
}

function showUpdate() {
  let myModal = Modal.getOrCreateInstance(document.getElementById('#update'));
  myModal.show();
}

function showDelete() {
  let myModal = Modal.getOrCreateInstance(document.getElementById('#delete'));
  myModal.show();
}

function showLogin() {
  let myModal = Modal.getOrCreateInstance(document.getElementById('#login'));
  myModal.show();
}

function showSelected(hike) {
  const details = document.getElementById('flush-collapseOne'+hike.id);
  const detailsCollapse = Collapse.getOrCreateInstance(details);
  detailsCollapse.show();
  details.addEventListener('shown.bs.collapse', ev =>  {
      document.querySelector('#flush-collapseOne'+hike.id).scrollIntoView({ behavior: 'smooth', block: "center"});
  });
}

// routing
function goToHike(hike) {
  router.push({ name: 'HikeComponent', params: { id: hike.id } })
}

// lifecycle hook
onMounted(async () => {
  isResponseLoading.value = true
  getZoneDetails()
})

</script>

<template>

<div v-if="isResponseLoading" class="overlay">
  <div class="overlay__wrapper">
      <div class="overlay__spinner">
        <div class="spinner-grow" style="width: 3rem; height: 3rem; color:#3C002E" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
  </div>
</div>

<div class="row">

  <div class="col-lg-8">
    <div class="mapContainer" v-if="isMapDataLoaded">

      <l-map ref="myMap" :zoom="10" :center="mapCenter" :use-global-leaflet="true" @ready="onReady()" @update:zoom="zoomUpdated">

        <l-control-scale position="bottomleft" :imperial="false" :metric="true"></l-control-scale>
        <l-tile-layer :url="'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'" :attribution="attribution"></l-tile-layer>

        <l-geo-json @click="selectedHike=hike.id, showSelected(hike), showHeightgraph(hike.trail.geojson), fitBounds(hike.trail.geojson)" 
        @mouseover="hoveredHike=hike.id" 
        @mouseout="hoveredHike=''" 
        v-for="hike in filteredHikes" :key="hike.id" :geojson="hike.trail.geojson" 
        :options-style="selectedHike == hike.id ? function() {return selectedStyle} : ( hoveredHike == hike.id ? function() {return hoveredStyle} : ( mapZoom >= 13 ? function() {return outedStyle} : function() {return outedLightStyle} ) )">
          <l-tooltip :options="{ sticky:true }" style="font-size: 14px !important; border-radius: 2px;" class="simaps-bold">{{ hike.name }}<br/> 
            <span v-if="hike.difficulty == 1" class="badge bg-success">Facile</span>
            <span v-else-if="hike.difficulty == 2" class="badge bg-primary">Moyen</span>
            <span v-else-if="hike.difficulty == 3" class="badge bg-danger">Difficile</span>
            <span v-else class="badge bg-dark">Expert</span>
          </l-tooltip>
        </l-geo-json> 

      </l-map>
    </div>
  </div>

  <div class="col-lg-4">

    <div v-if="authStore.isAdmin" class="row" style="margin-left: 40px; margin-right: 40px; margin-bottom: 20px;" >
      <button class="btn btn-outline-secondary" @click="getJourneys(), getRegions(), showCreate()">+ nouvel itinéraire</button>
    </div>

    <div class="dataContainer">

      <div class="row" style="margin: 10px;">
        <div class="col-lg-5 col-4" >
          <select class="form-select form-select-sm simaps-classic" v-model="searchRegion" @click="resetData(), fitBoundsRegion()" data-bs-toggle="collapse" :data-bs-target="'#flush-collapseOne'+selectedHike">
            <option selected disabled value="">Région</option>
            <option v-for="region in sortedRegionsAll" :value="region.id">{{ region.name }}</option>
          </select>
        </div>
        <div class="col-lg-5 col-4" >
          <select class="form-select form-select-sm simaps-classic" v-model="searchDifficulty" @click="resetData()" data-bs-toggle="collapse" :data-bs-target="'#flush-collapseOne'+selectedHike">
            <option selected disabled value="">Niveau</option>
            <option value="1">Facile</option>
            <option value="2">Moyen</option>
            <option value="3">Difficile</option>
            <option value="4">Expert</option>
          </select>
        </div>
        <div class="col-lg-2 col-4 simaps-classic">
          <button class="btn btn-light btn-sm" @click="resetDataAndFilters()" data-toggle="tooltip" title="réinitialiser" data-bs-toggle="collapse" :data-bs-target="'#flush-collapseOne'+selectedHike">
            <i class="pi pi-filter-slash" style="color:#3C002E;"></i>
          </button>
        </div>
      </div>

      <div class="accordion accordion-flush" id="accordionFlushParent">
        <div class="accordion-item" v-for="hike in filteredHikes" :key="hike.id">
          <h2 class="accordion-header" id="flush-headingOne">
            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" :data-bs-target="'#flush-collapseOne'+hike.id" aria-expanded="false" aria-controls="flush-collapseOne"
            @mouseover="hoveredHike = hike.id" 
            @mouseout="hoveredHike=''" 
            @click="selectedHike = hike.id, showHeightgraph(hike.trail.geojson), fitBounds(hike.trail.geojson)">
              <div class="col-7 simaps-bold" style="padding-right: 10px !important;">
                {{ hike.name }}
              </div>
              <div class="col-3 d-lg-none d-xxl-block">
                <span class="badge bg-light simaps-bold">{{ hike.region['name'].toUpperCase() }}</span>
              </div>
              <div class="col-2">
                <span v-if="hike.difficulty == 1" class="badge bg-success">Facile</span>
                <span v-else-if="hike.difficulty == 2" class="badge bg-primary">Moyen</span>
                <span v-else-if="hike.difficulty == 3" class="badge bg-danger">Difficile</span>
                <span v-else class="badge bg-dark">Expert</span>
              </div>
            </button>
          </h2>
          <div :id="'flush-collapseOne'+hike.id" class="accordion-collapse collapse" aria-labelledby="flush-headingOne" data-bs-parent="#accordionFlushParent">
            <div class="accordion-body simaps-light">
              <span class="badge bg-info">{{ hike.distance }} km</span>
              <span class="badge bg-info">{{ hike.elevation }} m+</span> 
              <span class="badge bg-info">{{ (new Date(hike.duration * 1000)).toISOString().substring(11, 13) }}h{{ (new Date(hike.duration * 1000)).toISOString().substring(14, 16) }} 
                <i v-if="hike.journey.id == 1" class="pi pi-replay" style="color:#3C002E;"></i>
                <i v-else-if="hike.journey.id == 2" class="pi pi-arrow-right-arrow-left" style="color:#3C002E;"></i>
                <i v-else class="pi pi-arrow-right" style="color:#3C002E;"></i>
              </span>
              <span class="badge bg-info">{{ hike.journey.name }}</span>
              <br/><br/>
              {{ hike.description }}
              <br/><br/>
              <div class="row">
                <div class="col d-lg-none d-xl-block text-start">
                  <button class="btn btn-light simaps-classic" @click="goToHike(hike)" data-toggle="tooltip" title="obtenir plus de détails">
                    <i class="pi pi-arrow-circle-right" style="color:#3C002E;"></i> <u>voir le détail</u>
                  </button>
                </div>
                <div class="col d-none d-lg-block d-xl-none">
                  <button class="btn btn-light simaps-classic" @click="goToHike(hike)" data-toggle="tooltip" title="obtenir plus de détails">
                    <i class="pi pi-info-circle" style="color:#3C002E;"></i>
                  </button>
                </div>
                <div class="col text-end">
                  <button v-if="authStore.isAdmin" class="btn btn-light" @click="getJourneys(), getRegions(), showUpdate(), hikeDetails = hike" data-toggle="tooltip" title="mettre à jour l'itinéraire">
                    <i class="pi pi-file-edit" style="color:#3C002E;"></i>
                  </button>
                  <button v-if="hike.trail.geojson" class="btn btn-light"  @click="downloadGPX(hike.trail.geojson, hike.name)" data-toggle="tooltip" title="télécharger la trace gpx">
                    <i class="pi pi-download" style="color:#3C002E;"></i>
                  </button>
                  <button v-if="authStore.isAdmin" class="btn btn-light" @click="showDelete(), hikeDetails = hike" data-toggle="tooltip" title="supprimer l'itinéraire">
                    <i class="pi pi-trash" style="color:#FF803D;"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

</div>

<CreateComponent :zoneId="zoneId" :regions="regions" :journeys="journeys" 
@exit="isResponseLoading=true, getZoneDetails(), resetDataAndFilters()">
</CreateComponent>

<UpdateComponent :hikeId="String(hikeDetails.id)" :zoneId="zoneId" :journeys="journeys" :regions="regions" 
:currentName="hikeDetails.name" 
:currentDistance="hikeDetails.distance" 
:currentElevation="hikeDetails.elevation" 
:currentDifficulty="hikeDetails.difficulty" 
:currentDuration="hikeDetails.duration" 
:currentJourney="hikeDetails.journey" 
:currentRegion="hikeDetails.region" 
:currentDescription="hikeDetails.description" 
:hasTrail="hikeDetails.trail == 'None' ? false : true" 
@exit="isResponseLoading=true, getZoneDetails(), resetDataAndFilters(), hikeDetails = ''">
</UpdateComponent>

<DeleteComponent :hikeId="String(hikeDetails.id)"
@exit="isResponseLoading=true, getZoneDetails(), resetDataAndFilters(), hikeDetails = ''">
</DeleteComponent>

<LoginComponent></LoginComponent>

</template>

<style>

.mapContainer {
  position: relative;
  min-height: 600px;
  height: 100%;
  width: 100%;  /* This means "100% of the width of its container", the .col-lg-8 */
  /* filter: invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%); */
}

.dataContainer {
  position: relative;
  max-height: calc(100vh - 110px);
  width: 100%;  /* This means "100% of the width of its container", the .col-lg-4 */
  overflow: auto;
  padding-right: 12px;
  padding-left: 6px;
}

.overlay {
  position: fixed;
  z-index: 9999;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: white;
  opacity: 0.5;
}

.overlay__wrapper {
  width: 100%;
  height: 100%;
  position: relative;
}

.overlay__spinner {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.leaflet-popup-content-wrapper {
  border-radius: 0.5 !important;
  font-size:small;
}

.accordion-button:link, .accordion-button:visited, .accordion-button:hover, .accordion-button:active  {
  background-color: rgba(24, 0, 18, .3)  !important;
  color:#fff !important;
  text-decoration: none !important;
  border: hidden !important;
  border-color: #fff !important;
  box-shadow: 0px !important;
}

.accordion-button:not(.collapsed) {
  color: #fff  !important;
  background-color: rgba(24, 0, 18, .3)  !important;
}

.accordion-button:focus {
  z-index: 3;
  border-color: #fff !important;
  outline: 0;
  box-shadow: 0 0 0 .25rem #FFF !important;
}

.badge.bg-info {
  color:#3C002E !important; 
  background-color: #fff !important;
  border: #3C002E solid 1px;
  margin-right: 8px;
  margin-bottom: 2px;
  font-family: "Inter", sans-serif;
  font-optical-sizing: auto;
  font-weight: 500 !important;
  font-style: normal;
  cursor: default;
}

.badge.bg-success {
  background-color:#FFC13C !important;
  font-family: "Inter", sans-serif;
  font-optical-sizing: auto;
  font-weight: 500 !important;
  font-style: normal;
}

.badge.bg-primary {
  background-color:#FE8935 !important;
  font-family: "Inter", sans-serif;
  font-optical-sizing: auto;
  font-weight: 500 !important;
  font-style: normal;
}

.badge.bg-danger {
  background-color:#FF4B27 !important; 
  font-family: "Inter", sans-serif;
  font-optical-sizing: auto;
  font-weight: 500 !important;
  font-style: normal;
}

.badge.bg-dark {
  background-color:#9F0000 !important;
  font-family: "Inter", sans-serif;
  font-optical-sizing: auto;
  font-weight: 500 !important;
  font-style: normal;
}

.marker-cluster-small {
  background-color: #FE8935 !important;
}

.marker-cluster-small div {
  background-color: #FE8935 !important;
  color: #fff !important;
}

</style>