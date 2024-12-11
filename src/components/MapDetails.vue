<script setup>

import L from 'leaflet'
globalThis.L = L

import 'leaflet/dist/leaflet.css';

// vue components for Leaflet Maps - vue3
// regularly check vue-leaflet project to implement new components https://github.com/vue-leaflet/vue-leaflet
import { LMap, LTileLayer, LPopup, LControlScale, LControlLayers, LLayerGroup, LMarker, LIcon, LGeoJson, LTooltip } from '@vue-leaflet/vue-leaflet';

// wrapper seems to be compatible with vue3
import { LMarkerClusterGroup } from 'vue-leaflet-markercluster';
import 'vue-leaflet-markercluster/dist/style.css';

// native leaflet plugins
import 'leaflet.locatecontrol'
import 'leaflet.locatecontrol/dist/L.Control.Locate.min.css'
import 'leaflet.fullscreen'
import 'leaflet.fullscreen/Control.FullScreen.css'
import 'leaflet.heightgraph'
import 'leaflet.heightgraph/dist/L.Control.Heightgraph.min.css'


// custom markers
// todo use font-awesome
import hostCustomMarker from './icons/host.svg'
import viewpointCustomMarker from './icons/viewpoint.svg'

import { Collapse, Modal } from 'bootstrap';
import axios from 'axios';
import GeoJsonToGpx from "@dwayneparton/geojson-to-gpx"

import CreateComponent from './CreateComponent.vue';
import UpdateComponent from './UpdateComponent.vue';
import DeleteComponent from './DeleteComponent.vue';
import AlertComponent from './AlertComponent.vue';
import LoginComponent from './LoginComponent.vue';

import AppFooter from '../components/AppFooter.vue'

import { ref, onMounted, watch, computed } from 'vue';
import { useResizeObserver } from '@vueuse/core'

// user session
import { useFirebaseAuth} from 'vuefire';
import { onAuthStateChanged } from 'firebase/auth';

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

// hikes data form
const props = defineProps({
  zone: String
})

const isResponseLoading = ref(false)

const hikes = ref([])
const hikeDetails = ref('')
const zone_id = ref('')

const hoveredHike = ref('')
const selectedHike = ref('')

const journeys = ref([])

const viewpoints = ref([])

const message = ref('')
const showMessage = ref(false)

const searchName = ref('')
const searchDifficulty = ref('')

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
  }): currentOrder.value == 'Notes' ?

  hikes.value.sort((a, b) => {
  let fa = a.rates, fb = b.rates;
  if (fa < fb) {
    return 1;
  }
  if (fa > fb) {
    return -1;
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
            .includes(searchName.value.toLowerCase())
          &&
          hike.difficulty.toString()
            .toLowerCase()
            .includes(searchDifficulty.value.toLowerCase())
          )
})
const geojsonHikes = computed (() => {
  return filteredHikes.value.filter(
        (hike) =>
          hike.trail.geojson
          )
})

function resetFilters() {
  searchDifficulty.value = ""
  searchName.value = ""
  currentOrder.value = ""
}

async function getZoneDetails() {
  const response = await axios.get(import.meta.env.VITE_APP_ROOT_API + '/zones/' + props.zone)
  isResponseLoading.value = false
  mapcenter.value = [parseFloat(response.data['lat']), parseFloat(response.data['lng'])]
  zone_id.value = response.data['id'].toString()
  hikes.value = response.data['hikes']
  viewpoints.value = response.data['viewpoints']
}

async function getJourneys() {
  const response = await axios.get(import.meta.env.VITE_APP_ROOT_API + '/journeys')
  journeys.value = response.data
}

// leaflet map
const myMap = ref(null)
const mapcenter = ref('')
const mapzoom = ref(11)
const ismapdata = ref(false)

watch(mapcenter, () => {
  ismapdata.value = true;
})

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
  myLocateControl.addTo(myMap.value.leafletObject)
  myFullscreenControl.addTo(myMap.value.leafletObject)
}

function showHeightgraph(geojson) {
  myHeightGraph.addTo(myMap.value.leafletObject)
  myHeightGraph.addData([geojson])
}

function fitBounds(geojson) {
  let feature = L.geoJSON(geojson)
  myMap.value.leafletObject.fitBounds(feature.getBounds())
}

function zoomUpdated(zoom) {
  mapzoom.value = zoom
}

function fitBoundsZone(mapcenter) {
  myMap.value.leafletObject.setView(mapcenter, 11)
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

  // Will convert geojson into xml document
  const gpx = GeoJsonToGpx(geojson, options);

  // convert document to string or post process it
  const gpxString = new XMLSerializer().serializeToString(gpx);

  // @see https://stackoverflow.com/questions/10654971/create-text-file-from-string-using-js-and-html5
  const link = document.createElement('a');
  link.download = name.concat(".gpx");
  const blob = new Blob([gpxString], {type: 'text/xml'});
  link.href = window.URL.createObjectURL(blob);
  link.click();
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

// hosts mock
const hosts = ref([
  {
    coordinates: [-21.102668429846773, 55.43360219548072],
    content : "Gîte Expédit Orchidée Sauvage",
  },
  {
    coordinates: [-21.039630277641255, 55.42612640797504],
    content : "Gîte de l'Îlet à Bourse",
  },
  {
    coordinates: [-21.02746246920337, 55.42801488437272],
    content : "Chez Rudy",
  },
  {
    coordinates: [-21.079125627796877, 55.423750907575055],
    content : "Chez Marie France et Crissou",
  },
])

// custom validation 
// check bootstrap native validation or third part library like veevalidate + server side validation
// use of js functions to show or hide modals instead of native data-bs-dismiss to add form validation logic

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

function hideCreate() {
  let myModal = Modal.getOrCreateInstance(document.getElementById('#create'));
  myModal.hide();
}

function hideUpdate() {
  let myModal = Modal.getOrCreateInstance(document.getElementById('#update'));
  myModal.hide();
}

function hideDelete() {
  let myModal = Modal.getOrCreateInstance(document.getElementById('#delete'));
  myModal.hide();
}

function showSelected(index) {
  const details = document.getElementById('flush-collapseOne'+index);
  const detailsCollapse = Collapse.getOrCreateInstance(details);
  detailsCollapse.show();
  details.addEventListener('shown.bs.collapse', ev =>  {
      document.querySelector('#flush-collapseOne'+index).scrollIntoView({ behavior: 'smooth', block: "center"});
  });
}

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
    <div class="mapContainer" v-if="ismapdata">

      <l-map ref="myMap" :zoom="10" :center="mapcenter" :use-global-leaflet="true" @ready="onReady()" @update:zoom="zoomUpdated">

        <l-control-layers position="topright"></l-control-layers>

        <l-tile-layer
          v-for="tileProvider in tileProviders"
          :key="tileProvider.name"
          :name="tileProvider.name"
          :visible="tileProvider.visible"
          :url="tileProvider.url"
          :attribution="tileProvider.attribution"
          layer-type="base"
        />

        <l-geo-json @click="selectedHike=hike.id, showSelected(index), showHeightgraph(hike.trail.geojson), fitBounds(hike.trail.geojson)" 
        @mouseover="hoveredHike=hike.id" 
        @mouseout="hoveredHike=''" 
        v-for="(hike, index) in geojsonHikes" :key="hike.id" :geojson="hike.trail.geojson" 
        :options-style="selectedHike == hike.id ? function() {return selectedStyle} : ( hoveredHike == hike.id ? function() {return hoveredStyle} : ( mapzoom >= 13 ? function() {return outedStyle} : function() {return outedLightStyle} ) )">

          <l-tooltip :options="{ sticky:true }" style="font-size: 14px !important; border-radius: 2px;" class="simaps-bold">{{ hike.name }}<br/> 
            <i v-for="rate in hike.rates" class="pi pi-star-fill" style="font-size: 1rem; color:#3C002E;"></i> 
            <i v-for="rate in (4 - hike.rates)" class="pi pi-star" style="font-size: 1rem; color:#3C002E;"></i><br/>
            <span v-if="hike.difficulty == 1" class="badge bg-success">Facile</span>
            <span v-if="hike.difficulty == 2" class="badge bg-primary">Moyen</span>
            <span v-if="hike.difficulty == 3" class="badge bg-danger">Difficile</span>
            <span v-if="hike.difficulty == 4" class="badge bg-dark">Expert</span>
          </l-tooltip>

        </l-geo-json> 

        <l-layer-group 
          :visible="false"
          layerType="overlay"
          name="Points de vue">
          <l-marker
            v-for="(item, index) in viewpoints"
            :key="index"
            :lat-lng="[item.lat, item.lng]">
            <l-popup class="simaps-classic">{{ item.name }}</l-popup>
            <l-icon
              :iconSize="mapzoom >= 15 ? [35, 35] : ((mapzoom >= 13 ? [25, 25] : [18, 18]))"
              :icon-url="viewpointCustomMarker"
            />
          </l-marker>
        </l-layer-group>

        <l-layer-group
          :visible="false"
          layerType="overlay"
          name="Gîtes">
          <l-marker-cluster-group>
            <l-marker
              v-for="(item, index) in hosts"
              :key="index"
              :lat-lng="[item.coordinates[0], item.coordinates[1]]">
              <l-popup class="simaps-classic">{{ item.content }}</l-popup>
              <l-icon
                :iconSize="mapzoom >= 15 ? [35, 35] : ((mapzoom >= 13 ? [25, 25] : [18, 18]))"
                :icon-url="hostCustomMarker"
              />
            </l-marker>
          </l-marker-cluster-group>
        </l-layer-group>

        <l-control-scale position="bottomleft" :imperial="false" :metric="true"></l-control-scale>

      </l-map>
    </div>
  </div>

  <div class="col-lg-4">

    <div class="row" style="margin-left: 40px; margin-right: 40px; margin-bottom: 40px;" >
      <button class="btn btn-outline-secondary" @click="isLoggedIn ? (getJourneys(), showCreate()) : showLogin()" :disabled="!isAdmin">+ nouvel itinéraire</button>
    </div>

    <div class="dataContainer">

      <div class="row" style="margin: 10px;">
        <div class="col-5">
          <input class="form-control form-control-sm simaps-classic" placeholder="Nom" v-model="searchName"/>
        </div>
        <div class="col-5" >
          <select class="form-select form-select-sm simaps-classic" v-model="searchDifficulty">
            <option selected disabled value="">Niveau</option>
            <option value="1">Facile</option>
            <option value="2">Moyen</option>
            <option value="3">Difficile</option>
            <option value="4">Expert</option>
          </select>
        </div>
        <div class="col-2 simaps-classic">
          <button class="btn btn-light btn-sm" @click="resetFilters()" data-toggle="tooltip" title="réinitialiser">
            <i class="pi pi-filter-slash" style="color:#3C002E;"></i>
          </button>
        </div>
      </div>
      <br/>

      <div class="accordion accordion-flush" id="accordionFlushParent">
        <div class="accordion-item" v-for="(hike, index) in geojsonHikes" :key="hike.id">
          <h2 class="accordion-header" id="flush-headingOne">
            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" :data-bs-target="'#flush-collapseOne'+index" aria-expanded="false" aria-controls="flush-collapseOne"
            @mouseover="hoveredHike = hike.id" 
            @mouseout="hoveredHike=''" 
            @click="selectedHike = hike.id, showHeightgraph(hike.trail.geojson), fitBounds(hike.trail.geojson)">
              <div class="col-8 simaps-bold" style="padding-right: 10px !important;">
                {{ hike.name }}
              </div>
              <div class="col-4">
                <span v-if="hike.difficulty == 1" class="badge bg-success">Facile</span>
                <span v-if="hike.difficulty == 2" class="badge bg-primary">Moyen</span>
                <span v-if="hike.difficulty == 3" class="badge bg-danger">Difficile</span>
                <span v-if="hike.difficulty == 4" class="badge bg-dark">Expert</span>
              </div>
            </button>
          </h2>
          <div :id="'flush-collapseOne'+index" class="accordion-collapse collapse" aria-labelledby="flush-headingOne" data-bs-parent="#accordionFlushParent">
            <div class="accordion-body simaps-light">
              <span class="badge bg-info">{{ hike.distance }} km</span>
              <span class="badge bg-info">{{ hike.elevation }} m+</span> 
              <span class="badge bg-info">{{ (new Date(hike.duration * 1000)).toISOString().substring(11, 13) }}h{{ (new Date(hike.duration * 1000)).toISOString().substring(14, 16) }}</span>
              <span class="badge bg-info">{{ hike.journey.name }}</span>
              <br/><br/>
              {{ hike.description }}
              <br/><br/>
              <div class="col text-end">
                <button v-if="isAdmin" class="btn btn-light" @click="isLoggedIn ? (getJourneys(), showUpdate(), hikeDetails = hike) : showLogin()" data-toggle="tooltip" title="mettre à jour l'itinéraire">
                  <i class="pi pi-file-edit" style="color:#3C002E;"></i>
                </button>
                <button v-if="hike.trail.geojson" class="btn btn-light"  @click="downloadGPX(hike.trail.geojson, hike.name)" data-toggle="tooltip" title="télécharger la trace gpx">
                  <i class="pi pi-download" style="color:#3C002E;"></i>
                </button>
                <button v-if="isAdmin" class="btn btn-light" @click="showDelete(), hikeDetails = hike" data-toggle="tooltip" title="supprimer l'itinéraire">
                  <i class="pi pi-trash" style="color:#FF803D;"></i>
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

</div>

<!-- Create -->
<CreateComponent :zoneId="zone_id" :journeys="journeys" 
@close="hideCreate(), isResponseLoading=true"
@exit="getZoneDetails(), message = 'Itinéraire créé!', showMessage = true, fitBoundsZone(mapcenter)">
</CreateComponent>

<!-- Update -->
<UpdateComponent :hikeId="String(hikeDetails.id)" :zoneId="zone_id" :journeys="journeys" 
:currentName="hikeDetails.name" 
:currentDistance="hikeDetails.distance" 
:currentElevation="hikeDetails.elevation" 
:currentDifficulty="hikeDetails.difficulty" 
:currentDuration="hikeDetails.duration" 
:currentJourney="hikeDetails.journey" 
:currentRates="hikeDetails.rates" 
:currentDescription="hikeDetails.description"
:hasTrail="hikeDetails.trail == 'None' ? false : true"
@close="hideUpdate(), isResponseLoading=true"
@exit="getZoneDetails(), message = 'Itinéraire mis à jour!', showMessage = true, fitBoundsZone(mapcenter), hikeDetails = ''">
</UpdateComponent>

<!-- Delete -->
<DeleteComponent :hikeId="String(hikeDetails.id)"
@close="hideDelete(), isResponseLoading=true"
@exit="getZoneDetails(), message = 'Itinéraire supprimé!', showMessage = true, hikeDetails = ''">
</DeleteComponent>

<!-- Login -->
<LoginComponent :isLoggedIn="isLoggedIn" :currentUser="auth.currentUser"></LoginComponent>

</template>

<style>

.mapContainer {
  position: relative;
  height: 100%;
  width: 100%;  /* This means "100% of the width of its container", the .col-lg-8 */
  /* filter: invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%); */
}

.dataContainer {
  position: relative;
  max-height: calc(100vh - 141px - 12px - 62px);
  width: 100%;  /* This means "100% of the width of its container", the .col-lg-4 */
  overflow: auto;
  padding-right: 12px;
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
  margin-left: 5px;
  margin-right: 5px;
  font-family: "Inter", sans-serif;
  font-optical-sizing: auto;
  font-weight: 500 !important;
  font-style: normal;
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