<script setup>

import 'leaflet/dist/leaflet.css';
import { LMap, LTileLayer } from '@vue-leaflet/vue-leaflet';
import { ref, computed } from 'vue';

const props = defineProps({
  zone: String
})

const zoom = ref(9)

const centroidReunion = ref([-21.093988981873036, 55.49092544120333])
const centroidRodrigues = ref([-19.704283864132748, 63.44646333715872])
const centroidMaurice = ref([-20.160720261354005, 57.50003722462224])

</script>

<template>

  <div class="container" style="text-align:center;">

    <div class="vue-map-container" v-if="zone === 'maurice'">
      <l-map ref="map" :zoom="zoom" :center="centroidMaurice">
        <l-tile-layer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          layer-type="base"
          name="OpenStreetMap"
        ></l-tile-layer>
      </l-map>
    </div>

    <div class="vue-map-container" v-else-if="zone === 'reunion'">
      <l-map ref="map" :zoom="zoom" :center="centroidReunion">
        <l-tile-layer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          layer-type="base"
          name="OpenStreetMap"
        ></l-tile-layer>
      </l-map>
    </div>

    <div class="vue-map-container" v-else-if="zone === 'rodrigues'">
      <l-map ref="map" :zoom="zoom" :center="centroidRodrigues">
        <l-tile-layer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          layer-type="base"
          name="OpenStreetMap"
        ></l-tile-layer>
      </l-map>
    </div>

  </div>

</template>

<style>

  .vue-map-container {
    height:600px; 
    width:800px; 
    display: block;
  }

</style>