<script setup>

import router from '../router'

// equivalent to router-link but enables the use native @click method
async function goToMaps() {
  router.push('/maps')
}
 
</script>

<template>

  <div class="container" style="text-align:center; margin-top: 30px;">
    <h1 class="inter-maps-bold" style="font-size: 60px;">Cartes & Randonnées.</h1>

    <figure class="text-center">
      <blockquote class="blockquote">
        <h6 class="inter-maps-light">C’est le fait de ne pas connaître exactement le chemin, la carte jetée qui fait du soleil couchant le guide et rend le décor vivant.</h6>
      </blockquote>
      <figcaption class="blockquote-footer">
        Art Garfunkel
      </figcaption>
    </figure>
    <br/>

    <div class="container-fluid illustration">
      <img src="/illustration.svg">
    </div>
    <br/><br/>
    
    <button class="btn btn-outline-secondary" @click="goToMaps()">Île de la Réunion</button>
    
  </div>
  
</template>

<style>

  @import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap');

  img {
    max-width: 100%;
    height: auto;
  }

  .illustration {
    max-width: 83%;
    height: auto;
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
    color: #FFFFFF !important;
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
    color: #FFFFFF !important;
    background-color:#FF803D !important;
  }

  .btn-outline-primary {
    border-color: #FF803D !important;
    color: #FFFFFF !important;
    background-color:#FF803D !important;
  }

  .inter-maps {
    color: #3C002E !important;
    font-family: "Inter", sans-serif;
    font-optical-sizing: auto;
    font-weight: 550 !important;
    font-style: normal;
  }

  .inter-maps-bold {
    color: #390040 !important;
    font-family: "Inter", sans-serif;
    font-optical-sizing: auto;
    font-weight: 800 !important;
    font-style: normal;
  }

  .inter-maps-light {
    color: #390040 !important;
    font-family: "Inter", sans-serif;
    font-optical-sizing: auto;
    font-weight: 400 !important;
    font-style: normal;
  }

</style>