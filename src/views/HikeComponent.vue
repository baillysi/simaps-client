<script setup>

import L from 'leaflet'
globalThis.L = L

import { useRouter } from 'vue-router'

import 'leaflet/dist/leaflet.css'
import { LMap, LTileLayer, LGeoJson, LControlScale, LTooltip } from '@vue-leaflet/vue-leaflet'

import axios from 'axios';
import { ref, onMounted, watch, computed } from 'vue'
import { Modal } from 'bootstrap'
import { useResizeObserver } from '@vueuse/core'

import ShareComponent from '../components/ShareComponent.vue'
import DetailComponent from '../components/DetailComponent.vue'
import ReviewComponent from '../components/ReviewComponent.vue'
import NewReviewComponent from '../components/NewReviewComponent.vue'
import LoginComponent from '../components/LoginComponent.vue'

// user session
import { useFirebaseAuth} from 'vuefire'
import { onAuthStateChanged } from 'firebase/auth'

const auth = useFirebaseAuth()
const isLoggedIn = ref(false)
const isAdmin = ref(false)

// native vuefire watcher to check whether user logged or not
// we wait for user to be loaded to call create / update / delete hike as it requires token
onAuthStateChanged(auth, (user) => {
  if (user) {
    isLoggedIn.value = true
    // check specific user
    if (auth.currentUser.uid == 'iREE0Ruwi8gskaW6511J2ceYMdE3') {
      isAdmin.value = true
    } 
  } 
  else {
    isLoggedIn.value = false
  }
});

function showLogin() {
  let myModal = Modal.getOrCreateInstance(document.getElementById('#login'));
  myModal.show();
}

const props = defineProps({
  id: String
})

const router = useRouter()
const currentPathObject = router.currentRoute.value;
const urlToShare = window.location.origin + currentPathObject.fullPath

const isResponseLoading = ref(false)
const hikeDetails = ref([])
const hikeReviews = ref([])

// hikeGlobalrate : if not reviews then set average rate
const hikeGlobalrate = computed(() => {
  let sum = 0;
  let count = hikeReviews.value.length;
  if (Number(count) == 0) {
    return 2
  }
  for (let i = 0; i < count; i++) {
      sum += hikeReviews.value[i].rate;
  }
  let rate = Number(sum / count).toFixed(0)
  return rate;
})

// leaflet map
const myMap = ref(null)
const mapcenter = ref('')
const mapzoom = ref(11)
const ismapdata = ref(false)
const attribution = ref('&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors')

watch(mapcenter, () => {
  ismapdata.value = true;
})

const selectedStyle = ref(
  {
    'color':'#9F0000', 
    'weight': 6
  }
)

// leaflet elevation profile
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

function onReady() {
  fitBounds(hikeDetails.value.trail.geojson)
  myLocateControl.addTo(myMap.value.leafletObject)
  myFullscreenControl.addTo(myMap.value.leafletObject)
  myHeightGraph.addTo(myMap.value.leafletObject)
  myHeightGraph.addData([hikeDetails.value.trail.geojson])
}

// make heightgraph responsive
useResizeObserver(myMap, (entries) => {
  const entry = entries[0]
  const { width } = entry.contentRect
  if (myHeightGraph._data) {
    if (width <= 670 && width > 470) {
      myHeightGraph.resize({width: 450, height: 157.5})
    }
    else if (width <= 470){
      myHeightGraph.resize({width: 350, height: 157.5})
    }
    else {
      myHeightGraph.resize({width: 650, height: 227.5})
    }
  }
})

function fitBounds(geojson) {
  let feature = L.geoJSON(geojson)
  myMap.value.leafletObject.fitBounds(feature.getBounds())
}

function zoomUpdated(zoom) {
  mapzoom.value = zoom
}

async function getHikeDetails() {
  const responseHike = await axios.get(import.meta.env.VITE_APP_ROOT_API + '/hikes/' + props.id)
  isResponseLoading.value = false
  hikeDetails.value = responseHike.data
  mapcenter.value = [-21.128756, 55.519246]
}

async function getHikeReviews() {
  const responseReviews = await axios.get(import.meta.env.VITE_APP_ROOT_API + '/reviews', { params: { hike_id: props.id } })
  isResponseLoading.value = false
  hikeReviews.value = responseReviews.data
}

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

function hideNewReview() {
  let myModal = Modal.getOrCreateInstance(document.getElementById('#newReview'));
  myModal.hide();
}

onMounted(async () => {
  isResponseLoading.value = true
  getHikeDetails()
  getHikeReviews()
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
    <div class="mapContainer" v-if="ismapdata">
      <l-map ref="myMap" :zoom="mapzoom" :center="mapcenter" :use-global-leaflet="true" @ready="onReady()" @update:zoom="zoomUpdated">
      <l-tile-layer :url="'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'" :attribution="attribution"></l-tile-layer>
      <l-geo-json :geojson="hikeDetails.trail.geojson" :options-style="function() {return selectedStyle}">
        <l-tooltip :options="{ sticky:true }" style="font-size: 14px !important; border-radius: 2px;" class="simaps-bold">{{ hikeDetails.name }}<br/> 
          <span v-if="hikeDetails.difficulty == 1" class="badge bg-success">Facile</span>
          <span v-if="hikeDetails.difficulty == 2" class="badge bg-primary">Moyen</span>
          <span v-if="hikeDetails.difficulty == 3" class="badge bg-danger">Difficile</span>
          <span v-if="hikeDetails.difficulty == 4" class="badge bg-dark">Expert</span>
        </l-tooltip>
      </l-geo-json>
      <l-control-scale position="bottomleft" :imperial="false" :metric="true"></l-control-scale>
    </l-map>
    </div>
  </div>

  <div class="col-lg-4" >

    <div class="dataContainer" v-if="ismapdata">

      <div id="carouselExampleIndicators" class="carousel slide">
        <div class="carousel-indicators">
          <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
          <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
          <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
        </div>
        <div class="carousel-inner">
          <div class="carousel-item active">
            <img src="/cilaos.jpg" class="d-block w-100" alt="...">
          </div>
          <div class="carousel-item">
            <img src="/est.jpg" class="d-block w-100" alt="...">
          </div>
          <div class="carousel-item">
            <img src="/ouest.jpg" class="d-block w-100" alt="...">
          </div>
        </div>
        <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
          <span class="carousel-control-prev-icon" aria-hidden="false"></span>
          <span class="visually-hidden">Previous</span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
          <span class="carousel-control-next-icon" aria-hidden="false"></span>
          <span class="visually-hidden">Next</span>
        </button>
      </div>
      <br/>

      <div class="row">
        <div class="col-7 simaps-bold fs-5" style="padding-right: 10px !important;">
            {{ hikeDetails.name }}
        </div>
        <div class="col-3 d-lg-none d-xxl-block">
          <span class="badge bg-light simaps-bold">{{ hikeDetails.region['name'].toUpperCase() }}</span>
        </div>
        <div class="col-2">
          <span v-if="hikeDetails.difficulty == 1" class="badge bg-success">Facile</span>
          <span v-if="hikeDetails.difficulty == 2" class="badge bg-primary">Moyen</span>
          <span v-if="hikeDetails.difficulty == 3" class="badge bg-danger">Difficile</span>
          <span v-if="hikeDetails.difficulty == 4" class="badge bg-dark">Expert</span>
        </div>
      </div>

      <div>
        <i v-for="n in Number(hikeGlobalrate)" class="pi pi-star-fill" style="font-size: 1rem; color:#3C002E;"></i> 
        <i v-for="n in (4 - Number(hikeGlobalrate))" class="pi pi-star" style="font-size: 1rem; color:#3C002E;"></i>
        <button type="button" class="btn btn-light btn-sm simaps-light" style="font-size: 12px; margin-left: 5px;" @click="showReview()"><u>{{ hikeReviews.length }} avis</u></button>
      </div>
      <br/>

      <div>
        <span class="badge bg-info">{{ hikeDetails.distance }} km</span>
        <span class="badge bg-info">{{ hikeDetails.elevation }} m+</span> 
        <span class="badge bg-info">{{ (new Date(hikeDetails.duration * 1000)).toISOString().substring(11, 13) }}h{{ (new Date(hikeDetails.duration * 1000)).toISOString().substring(14, 16) }}</span>
        <span class="badge bg-info">{{ hikeDetails.journey.name }}</span>
      </div>
      <br/>

      <div class="simaps-classic">
        {{ hikeDetails.description }}
      </div>
      <br/><br/>

      <div class="row text-center d-none d-xxl-block">
        <div class="btn-group" role="group" aria-label="Basic example">
          <button type="button" class="btn btn-outline-secondary" style="padding-left: 5px !important; padding-right: 5px !important;" @click="showDetail()">Plus de détails</button>
          <button type="button" class="btn btn-outline-secondary" style="padding-left: 5px !important; padding-right: 5px !important;" @click="isLoggedIn ? showNewReview() : showLogin()">Laisser un avis</button>
          <button type="button" class="btn btn-outline-secondary" style="padding-left: 5px !important; padding-right: 5px !important;" @click="showShare()">Partager la rando</button>
        </div>
      </div>

      <div class="row text-center d-xxl-none" style="margin-left: 5px; margin-right: 5px; margin-bottom: 5px;">
        <div class="btn-group-vertical" role="group" aria-label="Basic example">
          <button type="button" class="btn btn-outline-secondary" style="padding-left: 5px !important; padding-right: 5px !important;" @click="showDetail()">Plus de détails</button>
          <button type="button" class="btn btn-outline-secondary" style="padding-left: 5px !important; padding-right: 5px !important;" @click="isLoggedIn ? showNewReview() : showLogin()">Laisser un avis</button>
          <button type="button" class="btn btn-outline-secondary" style="padding-left: 5px !important; padding-right: 5px !important;" @click="showShare()">Partager la rando</button>
        </div>
      </div>

    </div>
  </div>
</div>

<!-- Share hike -->
<ShareComponent :url="urlToShare"></ShareComponent>

<!-- Get hike details -->
<DetailComponent></DetailComponent>

<!-- Review hike -->
<ReviewComponent :hikeReviews="hikeReviews" :hikeName="hikeDetails.name"></ReviewComponent>

<!-- New Review -->
<NewReviewComponent :hikeId="String(hikeDetails.id)"
@close="hideNewReview(), isResponseLoading=true"
@exit="getHikeReviews(), message = 'Merci pour votre avis!', showMessage = true">
</NewReviewComponent>

<!-- Login -->
<LoginComponent :isLoggedIn="isLoggedIn" :currentUser="auth.currentUser"></LoginComponent>

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

.mapContainer {
  position: relative;
  height: 100%;
  width: 100%; 
}

.dataContainer {
  position: relative;
  max-height: calc(100vh - 137px);
  width: 100%;  /* This means "100% of the width of its container", the .col-lg-4 */
  overflow: auto;
  padding-right: 12px;
}

</style>