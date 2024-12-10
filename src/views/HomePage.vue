<script setup>

import { ref } from 'vue';

import AppFooter from '../components/AppFooter.vue'
import router from '../router'

const zone = ref('')

// equivalent to router-link but enables the use native @click method
async function goToMaps() {
  router.push('/maps/' + zone.value)
}
 
</script>

<template>

<div class="container-fluid" style="text-align:center;">
  
  <h1 class="simaps-bold" style="font-size: 75px;">Cartes & Randonnées.</h1>

  <figure class="text-center">
    <blockquote class="blockquote">
      <h6 class="simaps-light">A mes montagnes, reconnaissant, infiniment, pour le bien-être intérieur que ma jeunesse a retiré de leur sévère école.</h6>
    </blockquote>
    <figcaption class="blockquote-footer">
      Walter Bonatti
    </figcaption>
  </figure>
  
  <div class="container" >
    <img src="/illustration.svg" style="max-width: 80%;">
  </div>

  <br/>
  <br/>

  <div class="btn-group" role="group">
    <button type="button" class="btn btn-outline-secondary" @click="zone = 'reunion', goToMaps()">Île de la Réunion</button>
    <button type="button" class="btn btn-outline-secondary disabled" @click="zone = 'ecrins', goToMaps()">Massif des Écrins</button>
  </div>

</div>

<AppFooter />
  
</template>

<style>

  @import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap');

  img {
    max-width: 100%;
    height: auto;
  }

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
    padding-right: 50px !important;
    padding-left: 50px !important;
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