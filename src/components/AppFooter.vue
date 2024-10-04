<script setup>

import router from '../router';

// equivalent to router-link but enables the use native @click method
async function goToMaps() {
  router.push('/maps')
}

</script>

<template>
  
  <div id="footer">
    <nav class="navbar navbar-expand navbar-light">
      <div class="container-fluid justify-content-center">
        <ul class="navbar-nav">
          <li class="nav-item">
            <router-link class="nav-link inter-maps" to="/">Accueil</router-link>
          </li>
          <li class="nav-item dropdown dropup">
            <a class="nav-link dropdown-toggle inter-maps" href="#" id="navbarDropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              Cartes
            </a>
            <ul class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
              <li class="nav-item"><button class="dropdown-item inter-maps" @click="goToMaps()">Réunion</button></li>
            </ul>
          </li>
          <li class="nav-item">
            <router-link class="nav-link inter-maps" to="/about">À propos</router-link>
          </li>
        </ul>
      </div>
    </nav>
    <span class="inter-footer">&#127279;2024 Simon BAILLY. Licence publique générale GNU v3.0.</span>
  </div>

</template>

<style>

  #footer {
    text-align: center;
    margin-top: auto;
    margin-bottom: 30px;
    padding-left: 40px;
    padding-right: 40px;
    padding-top: 80px;
  }

  .inter-footer {
    color: #390040 !important;
    font-family: "Inter", sans-serif;
    font-optical-sizing: auto;
    font-weight: 550 !important;
    font-style: normal;
    opacity: 0.5;
  }

</style>


