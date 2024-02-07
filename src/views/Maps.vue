<script setup>

import 'leaflet/dist/leaflet.css';
import { ref } from 'vue';
import { LMap, LTileLayer } from '@vue-leaflet/vue-leaflet';
import axios from 'axios'

import MapDetails from '../components/MapDetails.vue'

let data = ref('')

const props = defineProps({
  zone: String
})

const infoReunion = ref({
  area: 2512,
  hab: 863100,
  centroidReunion: [-21.093988981873036, 55.49092544120333],
  zoom: ref(9)
})

const infoMaurice = ref({
  area: 2040,
  hab: 1266000,
  centroidMaurice: [-20.160720261354005, 57.50003722462224],
  zoom: ref(9)
})

const infoRodrigues = ref({
  area: 108,
  hab: 41669,
  centroidRodrigues: [-19.704283864132748, 63.44646333715872],
  zoom: ref(11)
})

async function getHosts() {
  const response = await axios.get('http://localhost:5001/hosts')
  data.value = response.data
}

</script>

<template>

  <!-- TODO : essayer de passer les données de manière dynamique avec les props / slots (via router-link ?) et éviter rendu conditionnel -->

  <div class="row" style="margin-left: 50px; margin-right: 50px;">

    <div class="col-md-7" style='border: 2px solid #226d68; border-right: 0;padding: 15px;' v-if="zone === 'maurice'">
      <div class="map">
        <l-map ref="map" :zoom="infoMaurice.zoom" :center="infoMaurice.centroidMaurice" :use-global-leaflet="false">
          <l-tile-layer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            layer-type="base"
            name="OpenStreetMap"
          ></l-tile-layer>
        </l-map>
      </div>
    </div>


    <div class="col-md-7" style='border: 2px solid #226d68; border-right: 0;padding: 15px;' v-else-if="zone === 'reunion'">
      <div class="map">
        <l-map ref="map" :zoom="infoReunion.zoom" :center="infoReunion.centroidReunion" :use-global-leaflet="false">
          <l-tile-layer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            layer-type="base"
            name="OpenStreetMap"
          ></l-tile-layer>
        </l-map>
      </div>
    </div>


    <div class="col-md-7" style='border: 2px solid #226d68; border-right: 0; padding: 15px;' v-else-if="zone === 'rodrigues'">
      <div class="map">
        <l-map ref="map" :zoom="infoRodrigues.zoom" :center="infoRodrigues.centroidRodrigues" :use-global-leaflet="false">
          <l-tile-layer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            layer-type="base"
            name="OpenStreetMap"
          ></l-tile-layer>
        </l-map>
      </div>
    </div>

    <map-details>

      <template v-slot:title>
        <h4>{{ zone.toUpperCase() }}</h4>
      </template>

      <template v-slot:description>
        <ul v-if="zone === 'maurice'">
          <li>
            superficie : {{ infoMaurice.area }} km<sup>2</sup>
          </li>
          <li>
            nombre d'habitants : {{ infoMaurice.hab }}
          </li>
        </ul>
        <ul v-if="zone === 'reunion'">
          <li>
            superficie : {{ infoReunion.area }} km<sup>2</sup>
          </li>
          <li>
            nombre d'habitants : {{ infoReunion.hab }}
          </li>
        </ul>
        <ul v-if="zone === 'rodrigues'">
          <li>
            superficie : {{ infoRodrigues.area }} km<sup>2</sup>
          </li>
          <li>
            nombre d'habitants : {{ infoRodrigues.hab }}
          </li>
        </ul>
      </template>

      <template v-slot:hosts>
        <button class="btn btn-outline-secondary" @click="getHosts">Hosts</button>
        <br/><br/>
        <tr v-for="(host, index) in data" :key="index">
          <td style="padding-right: 15px">{{ host.name }}</td>
          <td>{{ host.zone }}</td>
        </tr>
      </template>
      
    </map-details>

  </div>

</template>

<style>

  .map {
    position: relative;
    height: 600px;  /* or as desired */
    width: 100%;  /* This means "100% of the width of its container", the .col-md-8 */
}

</style>