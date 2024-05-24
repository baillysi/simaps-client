<script setup>

import L from 'leaflet'
globalThis.L = L

import 'leaflet/dist/leaflet.css';

// vue components for Leaflet Maps - vue3
// regularly check vue-leaflet project to implement new components https://github.com/vue-leaflet/vue-leaflet
import { LMap, LTileLayer, LPopup, LControlScale, LControlLayers, LLayerGroup, LMarker, LIcon, LGeoJson } from '@vue-leaflet/vue-leaflet';

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
import hostCustomMarker from './icons/host.png'

import { Modal } from 'bootstrap';
import axios from 'axios';

import CreateComponent from './CreateComponent.vue';
import UpdateComponent from './UpdateComponent.vue';
import DeleteComponent from './DeleteComponent.vue';
import AlertComponent from './AlertComponent.vue';

import { ref, onMounted, watch, computed } from 'vue';

// hikes data form
const props = defineProps({
  id: String
})

const hikes = ref([])
const hikeDetails = ref('')

const selectedHike = ref('')

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

// leaflet map
const myMap = ref(null)
const mapcenter = ref('')
const ismapdata = ref(false)

watch(mapcenter, () => {
  ismapdata.value = true;
})

const selectedStyle = ref(
  {
    'color':'#D6955B', 
    'weight': 5
  }
)

const unselectedStyle = ref(
  {
    'color':'#226D68',
    'weight': 5
  }
)

const strokeStyle = ref(
  {
    'color':'#FFFFFF',
    'weight': 7
  }
)

// leaflet elevation profile
const colorMappings = {
    Simaps: {
        'Elevation': {
            text: 'Altitude',
            color: '#D6955B'
        }
    }
  }


const options = {
    mappings: colorMappings,
    height: 280,
    expand: true,
    expandControls : true,
    graphStyle: {
      'opacity': 1,
      'fill-opacity': 0.6,
      'stroke-width': '3px',
    },
    translation: {
      distance: "distance",
      elevation: "elevation",
      segment_length: "total",
      type: "type",
      legend: "Height Graph"
    }
}

const myHeightGraph = L.control.heightgraph(options)
const myLocateControl = L.control.locate({position: "topleft", strings: { title: "Show me where I am, yo!" }})
const myFullscreenControl = L.control
  .fullscreen({
    position: 'topleft', // change the position of the button can be topleft, topright, bottomright or bottomleft, default topleft
    title: 'Show me the fullscreen!', // change the title of the button, default Full Screen
    titleCancel: 'Exit fullscreen mode', // change the title of the button when fullscreen is on, default Exit Full Screen
    content: null, // change the content of the button, can be HTML, default null
    forceSeparateButton: true, // force separate button to detach from zoom buttons, default false
    forcePseudoFullscreen: true, // force use of pseudo full screen even if full screen API is available, default false
    fullscreenElement: false // Dom element to render in full screen, false by default, fallback to map._container
  })

async function onReady() {
  myLocateControl.addTo(myMap.value.leafletObject)
  myFullscreenControl.addTo(myMap.value.leafletObject)
}

async function showHeightgraph(geojson) {
  myHeightGraph.addTo(myMap.value.leafletObject)
  myHeightGraph.addData([geojson])
}

async function fitBounds(geojson) {
  let feature = L.geoJSON(geojson)
  myMap.value.leafletObject.fitBounds(feature.getBounds())
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

// hosts mock
const hosts = ref([
  {
    coordinates: [-21.112570146489052, 55.43275004423846],
    content : "Col du Taïbit",
  },
  {
    coordinates: [-21.102822430867704, 55.43727970253807],
    content : "Chez Jimmy",
  },
])

// custom validation 
// check bootstrap native validation or third part library like veevalidate + server side validation
// use of js functions to show or hide modals instead of native data-bs-dismiss to add form validation logic
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

onMounted(async () => {
  getZoneDetails()
})

</script>

<template>

  <div class="row" style="margin-left: 40px; margin-right: 40px;">

    <div class="col-lg-7" style='padding: 10px;'>

      <div class="mapContainer" v-if="ismapdata" style='border: 2px solid #226d68;'>
        <l-map ref="myMap" :zoom="13" :center="mapcenter" :use-global-leaflet="true" @ready="onReady()">

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

          <l-geo-json v-for="hike in sortedHikes" :key="hike.id" :geojson="hike.geojson" :options-style="function() {return strokeStyle}">
          </l-geo-json> 

          <l-geo-json @click="selectedHike=hike.id, showHeightgraph(hike.geojson)" v-for="hike in sortedHikes" :key="hike.id" :geojson="hike.geojson" :options-style="selectedHike == hike.id ? function() {return selectedStyle} : function() {return unselectedStyle}">
            <l-popup :options="{ closeButton:true, closeOnClick:true }">{{ hike.name }}<br/> 
              <i v-for="rate in hike.rates" class="pi pi-star-fill" style="font-size: 1rem; color:#226D68;"></i>
              <i v-for="rate in (4 - hike.rates)" class="pi pi-star" style="font-size: 1rem; color:#226D68;"></i>
            </l-popup>
          </l-geo-json> 

          <l-layer-group 
            :visible="false"
            layerType="overlay"
            name="Hosts">
            <l-marker-cluster-group>
              <l-marker
                v-for="(item, index) in hosts"
                :key="index"
                :lat-lng="[item.coordinates[0], item.coordinates[1]]">
                <l-popup>{{ item.content }}</l-popup>
                <l-icon
                  :iconSize="[30, 30]"
                  :icon-url="hostCustomMarker"
                />
              </l-marker>
            </l-marker-cluster-group>
          </l-layer-group>

          <l-control-scale position="bottomleft" :imperial="false" :metric="true"></l-control-scale>

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
                <button class="btn btn-light" @click="getHikeDetails(hike), selectedHike = hike.id, fitBounds(hike.geojson)" data-toggle="tooltip" title="see on map" :disabled="!hike.geojson">
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

  .mapContainer {
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

  .marker-cluster-small {
    background-color: #49afa5 !important;
  }

  .marker-cluster-small div {
    background-color: #1c9489 !important;
    color: #fff !important;
  }

</style>