<script setup>

import 'leaflet/dist/leaflet.css';
import { LMap, LTileLayer } from '@vue-leaflet/vue-leaflet';
import { ref } from 'vue';

const zoom = ref(10)

</script>

<template>

  <div class="vue-map-container">
    <l-map ref="map" v-model:zoom="zoom" :center="[-21.093988981873036, 55.49092544120333]">
      <l-tile-layer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        layer-type="base"
        name="OpenStreetMap"
      ></l-tile-layer>
    </l-map>
  </div>

</template>

<style>

  .vue-map-container {
    height:600px; 
    width:800px; 
    margin-left: 16.3%;
  }

</style>