<script setup>

import { ref } from 'vue';

import AppFooter from '../components/AppFooter.vue'
import router from '../router'

const zone = ref('')

function goToMaps() {
  router.push({ name: 'MapComponent', params: { zone: zone.value } })
}
 
</script>

<template>

<div class="container-fluid" style="text-align:center;">
  <h1 class="simaps-bold d-none d-lg-block" style="font-size: 75px;">Cartes & Randonnées.</h1>
  <h1 class="simaps-bold d-lg-none" style="font-size: 55px;">Cartes & Randonnées.</h1>
  <h6 class="simaps-light" style="padding-bottom: 30px;">La cartographie des plus beaux massifs, pour préparer vos trails et randonnées.</h6>
  <div class="container-fluid">
    <img src="/illustration.svg" style="max-height: 500px;">
  </div>
  <br/>
  <br/>
  <div class="btn-group" role="group">
    <button type="button" class="btn btn-outline-secondary" @click="zone = 'reunion', goToMaps()">Île de la Réunion</button>
  </div>
</div>

<AppFooter/>
  
</template>

<style>

@import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap');

.btn-outline-primary {
  border-color: #FF803D !important;
  color: #fff !important;
  background-color:#FF803D !important;
}

.btn-outline-secondary {
  color:#3C002E !important;
  font-family: "Inter", sans-serif !important;
  font-optical-sizing: auto;
  font-weight: 650 !important;
  font-style: normal;
  padding-right: 45px !important;
  padding-left: 45px !important;
}

.btn-outline-secondary:hover {
  color: #fff !important;
  background-color:#3C002E !important;
}

.btn-danger {
  border-color: #FF803D !important;
  background-color: #fff !important;
  color: #FF803D !important;
  font-family: "Inter", sans-serif !important;
  font-optical-sizing: auto;
  font-weight: 650 !important;
  font-style: normal;
}

.btn-danger:hover {
  color: #fff !important;
  background-color:#FF803D !important;
}

.btn-dark {
  border-color: #9F0000 !important;
  background-color: #fff !important;
  color: #9F0000 !important;
  font-family: "Inter", sans-serif !important;
  font-optical-sizing: auto;
  font-weight: 650 !important;
  font-style: normal;
}

.btn-dark:hover {
  color: #fff !important;
  background-color:#9F0000 !important;
}

.simaps-classic {
  color: #3C002E !important;
  font-family: "Inter", sans-serif;
  font-optical-sizing: auto;
  font-weight: 550 !important;
  font-style: normal;
}

.simaps-bold {
  color: #3C002E !important;
  font-family: "Inter", sans-serif;
  font-optical-sizing: auto;
  font-weight: 800 !important;
  font-style: normal;
}

.simaps-light {
  color: #3C002E !important;
  font-family: "Inter", sans-serif;
  font-optical-sizing: auto;
  font-weight: 400 !important;
  font-style: normal;
}

</style>