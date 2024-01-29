<script setup>

import 'leaflet/dist/leaflet.css';
import { ref, computed } from 'vue';
import { LMap, LTileLayer } from '@vue-leaflet/vue-leaflet';

import MapDetails from '../components/MapDetails.vue'


const props = defineProps({
  zone: String
})

const zoom = ref(9)

const centroidReunion = ref([-21.093988981873036, 55.49092544120333])
const centroidRodrigues = ref([-19.704283864132748, 63.44646333715872])
const centroidMaurice = ref([-20.160720261354005, 57.50003722462224])

</script>

<template>

  <div class="row" style="margin-left: 50px; margin-right: 50px;">

    <div class="col-md-7" style='border: 2px solid #226d68; border-right: 0;padding: 15px;' v-if="zone === 'maurice'">
      <div id="map">
        <l-map ref="map" :zoom="zoom" :center="centroidMaurice">
          <l-tile-layer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            layer-type="base"
            name="OpenStreetMap"
          ></l-tile-layer>
        </l-map>
      </div>
    </div>


    <div class="col-md-7" style='border: 2px solid #226d68; border-right: 0;padding: 15px;' v-else-if="zone === 'reunion'">
      <div id="map">
        <l-map ref="map" :zoom="zoom" :center="centroidReunion">
          <l-tile-layer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            layer-type="base"
            name="OpenStreetMap"
          ></l-tile-layer>
        </l-map>
      </div>
    </div>


    <div class="col-md-7" style='border: 2px solid #226d68; border-right: 0; padding: 15px;' v-else-if="zone === 'rodrigues'">
      <div id="map">
        <l-map ref="map" :zoom="zoom" :center="centroidRodrigues">
          <l-tile-layer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            layer-type="base"
            name="OpenStreetMap"
          ></l-tile-layer>
        </l-map>
      </div>
    </div>

    <map-details/>

  </div>

</template>

<style>

  #map {
    position: relative;
    height: 600px;  /* or as desired */
    width: 100%;  /* This means "100% of the width of its container", the .col-md-8 */
}

</style>