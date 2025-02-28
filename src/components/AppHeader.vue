<script setup>

import { ref } from 'vue';
import { Modal } from 'bootstrap';
import router from '../router'

import LoginComponent from './LoginComponent.vue';
import LogoutComponent from './LogoutComponent.vue';

import { useAuthStore } from '@/stores/auth'
const authStore = useAuthStore()

const zone = ref('')

function goToMaps() {
  router.push({ name: 'MapComponent', params: { zone: zone.value } })
}

function showLogin() {
  let myModal = Modal.getOrCreateInstance(document.getElementById('#login'));
  myModal.show();
}

function showLogout() {
  let myModal = Modal.getOrCreateInstance(document.getElementById('#logout'));
  myModal.show();
}

</script>

<template>
  
<div id="header">
  <nav class="navbar navbar-expand-md navbar-light">
    <div class="container-fluid">
      <router-link class="navbar-brand" to="/"><img src="./icons/logo.svg" alt="Kavalé Logo"/></router-link>
      <ul class="navbar-nav me-auto"> 
        <li class="nav-item">
          <router-link class="nav-link simaps-classic" to="/">Accueil</router-link>
        </li>
        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle simaps-classic" id="navbarDropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            Cartes
          </a>
          <ul class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
            <li class="nav-item"><button class="dropdown-item simaps-classic" @click="zone = 'reunion', goToMaps()">Réunion</button></li>
          </ul>
        </li>
        <li class="nav-item">
          <router-link class="nav-link simaps-classic" to="/about">À propos</router-link>
        </li>
      </ul>
      <form class="form-inline">
        <button v-if="authStore.isLoggedIn" class="btn btn-outline-secondary" type="button" @click="showLogin()">Mon compte</button>
        <button v-if="authStore.isLoggedIn" class="btn btn-outline-primary" style="margin-left: 5px;" type="button" @click="showLogout()" data-toggle="tooltip" title="Logout"><i class="pi pi-sign-out"></i></button>
        <button v-else class="btn btn-outline-secondary" type="button" @click="showLogin()">Se connecter</button>
      </form>
    </div>
  </nav>
</div>

<LoginComponent></LoginComponent>
<LogoutComponent></LogoutComponent>

</template>

<style>

#header {
  grid-row: header;
  padding-left: 40px;
  padding-right: 40px;
}

.navbar-brand {
  padding-right: 10px;
  padding-left: 10px;
  width: 125px;
}

.nav-link {
  font-size: 17px !important;
  margin-right: 10px;
}

.dropdown-item.simaps-classic:hover {
  background-color: #3C002E;
  color: #fff !important;
}


</style>