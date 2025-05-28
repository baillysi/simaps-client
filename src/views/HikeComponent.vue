<script setup>

import L from 'leaflet'
globalThis.L = L

import 'leaflet/dist/leaflet.css'

import { LMap, LTileLayer, LGeoJson, LControlScale, LTooltip, LMarker, LIcon, LControlLayers } from '@vue-leaflet/vue-leaflet'

// native leaflet plugins
import 'leaflet.locatecontrol'
import 'leaflet.locatecontrol/dist/L.Control.Locate.min.css'
import 'leaflet.fullscreen'
import 'leaflet.fullscreen/Control.FullScreen.css'
import 'leaflet.heightgraph'
import 'leaflet.heightgraph/dist/L.Control.Heightgraph.min.css'

import startMarker from '../components/icons/start.svg'
import endMarker from '../components/icons/end.svg'
import viewpointMarker from '../components/icons/viewpoint.svg'

import { useRouter } from 'vue-router'

import axios from 'axios';
import { ref, onMounted, watch, computed, onActivated, onDeactivated } from 'vue'
import { Modal } from 'bootstrap'
import { useResizeObserver } from '@vueuse/core'

import ShareComponent from '../components/ShareComponent.vue'
import DetailComponent from '../components/DetailComponent.vue'
import ReviewComponent from '../components/ReviewComponent.vue'
import AddReviewComponent from '../components/AddReviewComponent.vue'

import { useAuthStore } from '@/stores/auth'
const authStore = useAuthStore()

const props = defineProps({
  id: String
})

const isResponseLoading = ref(false)

const router = useRouter()
const currentPathObject = router.currentRoute.value;
const urlToShare = window.location.origin + currentPathObject.fullPath

// hikes data variables
const hikeDetails = ref([])
const hikeReviews = ref([])
const hikeViewpoints = ref([])

const validatedReviews = computed (() => {
  return hikeReviews.value.filter(
        (review) => review.is_validated === true)
})

const hikeGlobalRate = computed(() => {
  let sum = 0;
  let count = validatedReviews.value.length;
  if (Number(count) == 0) {
    return 4
  }
  for (let i = 0; i < count; i++) {
      sum += validatedReviews.value[i].rate;
  }
  let rate = Number(sum / count).toFixed(0)
  return rate;
})

// leaflet map variables
const myMap = ref(null)
const mapCenter = ref('')
const mapZoom = ref(11)
const isMapDataLoaded = ref(false)
const hikeStartLatLng = ref('')
const hikeEndLatLng = ref('')

const selectedStyle = ref(
  {
    'color':'#9F0000', 
    'weight': 5
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

async function getHikeDetails() {
  const responseHike = await axios.get(import.meta.env.VITE_APP_ROOT_API + 'api/hikes/' + props.id)
  isResponseLoading.value = false
  hikeDetails.value = responseHike.data
  mapCenter.value = [-21.128756, 55.519246]
  let hikeLength = hikeDetails.value.trail.geojson.features[0].geometry.coordinates.length
  hikeStartLatLng.value = [hikeDetails.value.trail.geojson.features[0].geometry.coordinates[0][1], hikeDetails.value.trail.geojson.features[0].geometry.coordinates[0][0]]
  hikeEndLatLng.value = [hikeDetails.value.trail.geojson.features[0].geometry.coordinates[hikeLength - 1][1], hikeDetails.value.trail.geojson.features[0].geometry.coordinates[hikeLength - 1][0]]
}

async function getHikeReviews() {
  const responseReviews = await axios.get(import.meta.env.VITE_APP_ROOT_API + 'api/reviews', { params: { hike_id: props.id } })
  isResponseLoading.value = false
  hikeReviews.value = responseReviews.data
}

async function getHikeViewpoints() {
  const responseViewpoints = await axios.get(import.meta.env.VITE_APP_ROOT_API + 'api/viewpoints', { params: { hike_id: props.id } })
  isResponseLoading.value = false
  hikeViewpoints.value = responseViewpoints.data
}

const tileProviders = ref([
  {
    name: 'OpenStreetMap',
    visible: true,
    attribution:
      '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  },
  {
    name: 'OpenTopoMap',
    visible: false,
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution:
      'Map data: &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>,'+
      ' <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy;'+
      ' <a href="https://opentopomap.org">OpenTopoMap</a>'+ 
      ' (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
  },
  {
    name: 'Satellite IGN',
    visible: false,
    url : "https://data.geopf.fr/wmts?" +
        "&REQUEST=GetTile&SERVICE=WMTS&VERSION=1.0.0" +
        "&STYLE=normal" +
        "&TILEMATRIXSET=PM" +
        "&FORMAT=image/jpeg"+
        "&LAYER=ORTHOIMAGERY.ORTHOPHOTOS"+
	      "&TILEMATRIX={z}" +
        "&TILEROW={y}" +
        "&TILECOL={x}",
    attribution : "Orthophotos - © IGN",
    maxZoom: 18,
	},
  {
    name: 'Plan IGN',
    visible: false,
    url :"https://data.geopf.fr/wmts?" +
        "&REQUEST=GetTile&SERVICE=WMTS&VERSION=1.0.0" +
        "&STYLE=normal" +
        "&TILEMATRIXSET=PM" +
        "&FORMAT=image/png"+
        "&LAYER=GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2"+
	      "&TILEMATRIX={z}" +
        "&TILEROW={y}" +
        "&TILECOL={x}",
    attribution: 'Plan IGNV2 - Carte © IGN/Geoportail',
    maxNativeZoom: 19,
    maxZoom: 22,
	}
])

function onReady() {
  fitBounds(hikeDetails.value.trail.geojson)
  myLocateControl.addTo(myMap.value.leafletObject)
  myFullscreenControl.addTo(myMap.value.leafletObject)
  myHeightGraph.addTo(myMap.value.leafletObject)
  myHeightGraph.addData([hikeDetails.value.trail.geojson])
}

function fitBounds(geojson) {
  let feature = L.geoJSON(geojson)
  myMap.value.leafletObject.fitBounds(feature.getBounds(), true)
}

function zoomUpdated(zoom) {
  mapZoom.value = zoom
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

function showShare() {
  let myModal = Modal.getOrCreateInstance(document.getElementById('#share'));
  myModal.show();
}

function showDetail() {
  let myModal = Modal.getOrCreateInstance(document.getElementById('#detail'));
  myModal.show();
}

function showReview() {
  let myModal = Modal.getOrCreateInstance(document.getElementById('#review'));
  myModal.show();
}

function showNewReview() {
  let myModal = Modal.getOrCreateInstance(document.getElementById('#newReview'));
  myModal.show();
}

function showLogin() {
  let myModal = Modal.getOrCreateInstance(document.getElementById('#login'));
  myModal.show();
}

function makeImgPath(id) {
  return '/mock_img.jpg'
  // return '/' + id + '.jpg'
}

function goBackToMaps() {
  router.push({ name: 'MapComponent', params: { zone: hikeDetails.value.zone } })
}

// lifecycle hooks
onMounted(function () {
  isResponseLoading.value = true
  getHikeDetails()
  getHikeReviews()
  getHikeViewpoints()
})

onActivated(function () {
  window.dispatchEvent(new Event('resize'));
})

onDeactivated(function () {
  fitBounds(hikeDetails.value.trail.geojson);
})

</script>

<template>

<div v-if="isResponseLoading && !authStore.isAuthLoading" class="overlay">
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
      <l-map ref="myMap" :zoom="mapZoom" :center="mapCenter" :use-global-leaflet="true" @ready="onReady()" @update:zoom="zoomUpdated">

        <l-control-layers position="topright"></l-control-layers>
        <l-control-scale position="bottomleft" :imperial="false" :metric="true"></l-control-scale>

        <l-tile-layer
          v-for="tileProvider in tileProviders"
          :key="tileProvider.name"
          :name="tileProvider.name"
          :visible="tileProvider.visible"
          :url="tileProvider.url"
          :attribution="tileProvider.attribution"
          layer-type="base"/>

        <l-geo-json :geojson="hikeDetails.trail.geojson" :options-style="function() {return selectedStyle}">
          <l-tooltip :options="{ sticky:true }" style="font-size: 14px !important; border-radius: 2px;" class="simaps-bold">{{ hikeDetails.name }}<br/> 
            <span v-if="hikeDetails.difficulty == 1" class="badge bg-success">Facile</span>
            <span v-else-if="hikeDetails.difficulty == 2" class="badge bg-primary">Moyen</span>
            <span v-else-if="hikeDetails.difficulty == 3" class="badge bg-danger">Difficile</span>
            <span v-else class="badge bg-dark">Expert</span>
          </l-tooltip>
        </l-geo-json>

      <l-marker :lat-lng="hikeStartLatLng">
        <l-tooltip class="simaps-classic">Départ</l-tooltip>
        <l-icon
          :iconSize="mapZoom >= 15 ? [28, 28] : ((mapZoom >= 13 ? [24, 24] : [18, 18]))"
          :iconAnchor="mapZoom >= 15 ? [14, 28] : ((mapZoom >= 13 ? [12, 24] : [9, 18]))"
          :icon-url="startMarker"/>
      </l-marker>
      <l-marker :lat-lng="hikeEndLatLng">
        <l-tooltip class="simaps-classic">Arrivée</l-tooltip>
        <l-icon
          :iconSize="mapZoom >= 15 ? [27, 27] : ((mapZoom >= 13 ? [22, 22] : [18, 18]))"
          :iconAnchor="mapZoom >= 15 ? [3, 27] : ((mapZoom >= 13 ? [2, 22] : [2, 18]))"
          :icon-url="endMarker"/>
      </l-marker>
      <l-marker
        v-for="(item, index) in hikeViewpoints"
        :key="index"
        :lat-lng="[item.lat, item.lng]">
        <l-tooltip class="simaps-classic">{{ item.name }}</l-tooltip>
        <l-icon
          :iconSize="mapZoom >= 15 ? [45, 45] : ((mapZoom >= 13 ? [30, 30] : [22, 22]))"
          :icon-url="viewpointMarker"/>
      </l-marker>

    </l-map>
    </div>
  </div>

  <div class="col-lg-4" >

    <div class="dataContainer" v-if="isMapDataLoaded" style="min-height: 100%; display: grid; grid-template-rows: column dense; /* dispaly grid to have sticky footer */">

      <div class="d-none d-lg-block">
        <img :src="makeImgPath(props.id)" class="d-block w-100" alt="...">
      </div>
      <br/>

      <div class="row">
        <div class="col-7 simaps-bold fs-5">
            {{ hikeDetails.name }}
        </div>
        <div class="col-3 d-lg-none d-xxl-block">
          <span class="badge bg-light simaps-bold">{{ hikeDetails.region['name'].toUpperCase() }}</span>
        </div>
        <div class="col-2">
          <span v-if="hikeDetails.difficulty == 1" class="badge bg-success">Facile</span>
          <span v-else-if="hikeDetails.difficulty == 2" class="badge bg-primary">Moyen</span>
          <span v-else-if="hikeDetails.difficulty == 3" class="badge bg-danger">Difficile</span>
          <span v-else class="badge bg-dark">Expert</span>
        </div>
      </div>

      <div>
        <i v-for="n in Number(hikeGlobalRate)" class="pi pi-star-fill" style="font-size: 1rem; color:#3C002E;"></i> 
        <i v-for="n in (5 - Number(hikeGlobalRate))" class="pi pi-star" style="font-size: 1rem; color:#3C002E;"></i>
        <button v-if="validatedReviews.length <= 1" type="button" class="btn btn-light btn-sm simaps-light" style="font-size: 12px; margin-left: 5px;" @click="showReview()"><u>{{ validatedReviews.length }} avis validé</u></button>
        <button v-else type="button" class="btn btn-light btn-sm simaps-light" style="font-size: 12px; margin-left: 5px;" @click="showReview()"><u>{{ validatedReviews.length }} avis validés</u></button>
      </div>

      <div>
        <span class="badge bg-info">{{ hikeDetails.distance }} km</span>
        <span class="badge bg-info">{{ hikeDetails.elevation }} m+</span> 
        <span class="badge bg-info">{{ hikeDetails.journey.name }}</span>
        <span data-toggle="tooltip" title="Randonnée classique" class="badge bg-info" style="margin-top: 3px;">
          <img src="/hiker.svg" style="width: 13px;"> {{ (new Date(hikeDetails.duration * 1000)).toISOString().substring(11, 13) }}h{{ (new Date(hikeDetails.duration * 1000)).toISOString().substring(14, 16) }} 
          <i v-if="hikeDetails.journey.id == 1" class="pi pi-replay" style="color:#3C002E;"></i>
          <i v-else-if="hikeDetails.journey.id == 2" class="pi pi-arrow-right-arrow-left" style="color:#3C002E;"></i>
          <i v-else class="pi pi-arrow-right" style="color:#3C002E;"></i>
        </span>
        <span data-toggle="tooltip" title="Trail" class="badge bg-info" style="margin-top: 3px;">
          <img src="/runner.svg" style="width: 15px;"> {{ (new Date(hikeDetails.duration * 1000 / 2.5)).toISOString().substring(11, 13) }}h{{ (new Date(hikeDetails.duration * 1000 / 2.5)).toISOString().substring(14, 16) }} 
          <i v-if="hikeDetails.journey.id == 1" class="pi pi-replay" style="color:#3C002E;"></i>
          <i v-else-if="hikeDetails.journey.id == 2" class="pi pi-arrow-right-arrow-left" style="color:#3C002E;"></i>
          <i v-else class="pi pi-arrow-right" style="color:#3C002E;"></i>
        </span>
      </div>
      <br/>

      <div class="simaps-classic">
        {{ hikeDetails.description }}
      </div>
      <br/>

      <div class="row text-center d-lg-none d-xxl-block">
        <div class="btn-group" role="group" aria-label="Basic example">
          <button type="button" class="btn btn-outline-secondary" style="padding-left: 5px !important; padding-right: 5px !important;" @click="showDetail()">Plus de détails</button>
          <button type="button" class="btn btn-outline-secondary" style="padding-left: 5px !important; padding-right: 5px !important;" @click="authStore.isLoggedIn ? showNewReview() : showLogin()">Laisser un avis</button>
          <button type="button" class="btn btn-outline-secondary" style="padding-left: 5px !important; padding-right: 5px !important;" @click="showShare()">Partager la rando</button>
        </div>
      </div>

      <div class="row text-center d-none d-lg-block d-xxl-none" style="margin-left: 5px; margin-right: 5px; margin-bottom: 5px;">
        <div class="btn-group-vertical" role="group" aria-label="Basic example">
          <button type="button" class="btn btn-outline-secondary" style="padding-left: 5px !important; padding-right: 5px !important;" @click="showDetail()">Plus de détails</button>
          <button type="button" class="btn btn-outline-secondary" style="padding-left: 5px !important; padding-right: 5px !important;" @click="authStore.isLoggedIn ? showNewReview() : showLogin()">Laisser un avis</button>
          <button type="button" class="btn btn-outline-secondary" style="padding-left: 5px !important; padding-right: 5px !important;" @click="showShare()">Partager la rando</button>
        </div>
      </div>

      <div style="margin-top: 10px; margin-bottom: 10px; text-align: end;">
        <button class="btn btn-light simaps-classic" style="font-size: 12px;" @click="goBackToMaps()" data-toggle="tooltip" title="obtenir plus de détails">
          <i class="pi pi-arrow-circle-left" style="color:#3C002E;"></i> <u>Retour à la liste complète</u>
        </button>
      </div>

    </div>
  </div>
</div>

<ShareComponent :url="urlToShare"></ShareComponent>

<DetailComponent></DetailComponent>

<ReviewComponent :hikeReviews="hikeReviews" :hikeName="hikeDetails.name" 
@update="getHikeReviews()">
</ReviewComponent>

<AddReviewComponent :hikeId="String(hikeDetails.id)"
@exit="getHikeReviews()">
</AddReviewComponent>


</template>

<style>

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

</style>