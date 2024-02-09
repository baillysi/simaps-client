<script setup>

import 'leaflet/dist/leaflet.css';
import { LMap, LTileLayer, LMarker } from '@vue-leaflet/vue-leaflet';
import { ref, onMounted } from 'vue';
import axios from 'axios';

const props = defineProps({
  id: String
})

const data = ref('')

const name = ref('')
const zone = ref('')
const price = ref('')

onMounted(async () => {
  const response = await axios.get('http://localhost:5001/hosts/' + props.id)
  data.value = response.data
})

async function addHost() {

  const payload = {
    name: name.value,
    zone: zone.value,
    price: price.value,
  }

  await axios.post('http://localhost:5001/hosts', payload)
      .then((res) => {
          console.log(res.status);
      })
      .catch((error) => {
          console.log(error);
      });
}

</script>

<template>

  <div class="row" style="margin-left: 40px; margin-right: 40px;">

    <div class="col-md-7" style='border: 2px solid #226d68; border-right: 0;padding: 15px;'>
      <div class="map">
        <l-map ref="map" :zoom="9" :center="[-21.093988981873036, 55.49092544120333]" :use-global-leaflet="false">
          <l-tile-layer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            layer-type="base"
            name="OpenStreetMap"
          ></l-tile-layer>
          <l-marker :lat-lng="[-21.019387053324387, 55.424319458353594]"></l-marker>
          <l-marker :lat-lng="[-21.1021375601261, 55.434908934125886]"></l-marker>
        </l-map>
      </div>
    </div>

    <div class="col-md-5" style='border: 2px solid #226d68;padding: 15px;'>
      <p>Map details ! Retrouvez toutes les informations relatives au projet Simaps sur GitHub</p><br/>
      <ul>
        <li>
          {{ data.zone }}
        </li>
        <li>
          {{ data.price }}
        </li>
      </ul>

      <form @submit.prevent="addHost">
        <input v-model="name" placeholder="name"><br/>
        <input v-model="zone" placeholder="zone"><br/>
        <input v-model="price" placeholder="price"><br/>
        <button class="btn btn-outline-secondary">Add Host</button>    
      </form>
      

    </div>


  </div>

</template>

<style>

  .map {
      position: relative;
      height: 600px;  /* or as desired */
      width: 100%;  /* This means "100% of the width of its container", the .col-md-8 */
  }

</style>


