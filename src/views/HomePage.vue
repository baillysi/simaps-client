<script setup>

import AppFooter from '../components/AppFooter.vue'
import router from '../router'

// equivalent to router-link but enables the use native @click method
async function goToMaps() {
  router.push('/maps')
}
 
</script>

<template>

<div class="container-fluid" style="text-align:center;">
  
  <h1 class="simaps-bold" style="font-size: 70px;">Cartes & Randonnées.</h1>

  <figure class="text-center">
    <blockquote class="blockquote">
      <h6 class="simaps-light">A mes montagnes, reconnaissant, infiniment, pour le bien-être intérieur que ma jeunesse a retiré de leur sévère école.</h6>
    </blockquote>
    <figcaption class="blockquote-footer">
      Walter Bonatti
    </figcaption>
  </figure>
  <br/>

  <div class="container-fluid">
    <div class="row">
      <div class="col-lg-3">
        <div class="list-group list-group-flush">
          <button type="button" class="list-group-item custom-border-1" @click="goToMaps()">Réunion</button>
          <button type="button" class="list-group-item custom-border-2" disabled style="opacity: 0.5;">Pyrénées</button>
          <button type="button" class="list-group-item custom-border-1" disabled style="opacity: 0.5;">Cévennes</button>
        </div>
      </div>
      <div class="col-lg-6" >
        <img src="/illustration.svg">
      </div>
      <div class="col-lg-3">
        <div class="list-group list-group-flush">
          <button type="button" class="list-group-item custom-border-4" disabled style="opacity: 0.5;">Vanoise</button>
          <button type="button" class="list-group-item custom-border-3" disabled style="opacity: 0.5;">Écrins</button>
          <button type="button" class="list-group-item custom-border-4" disabled style="opacity: 0.5;">Mont-Blanc</button>
        </div>
      </div>
    </div>
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

  .list-group-item {
    margin-left: 20px;
    margin-right: 20px;
    color:#3C002E !important;
    font-family: "Inter", sans-serif !important;
    font-optical-sizing: auto;
    font-weight: 800 !important;
    font-style: normal;
    font-size: 25px !important;
  }

  .list-group-item:hover {
    color: #fff !important;
    background-color:#3C002E !important;
  }

  .custom-border-1 {
    border:#3C002E solid 2px !important;
    border-top: none !important;
    border-right:none !important;
  }

  .custom-border-2 {
    border:#3C002E solid 2px !important;
    border-top: none !important;
    border-left:none !important;
  }

  .custom-border-3 {
    border:#3C002E solid 2px !important;
    border-bottom: none !important;
    border-right:none !important;
  }

  .custom-border-4 {
    border:#3C002E solid 2px !important;
    border-bottom: none !important;
    border-left:none !important;
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
    padding-right: 40px !important;
    padding-left: 40px !important;
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
    margin-top: 5px;
    margin-bottom: 5px;
  }

  .simaps-light {
    color: #3C002E !important;
    font-family: "Inter", sans-serif;
    font-optical-sizing: auto;
    font-weight: 400 !important;
    font-style: normal;
  }

</style>