<script setup>

import { ref, onMounted } from 'vue';
import { Modal } from 'bootstrap';
import router from '../router'

import LoginComponent from './LoginComponent.vue';
import LogoutComponent from './LogoutComponent.vue';

// user session
import { useFirebaseAuth } from 'vuefire';
import { onAuthStateChanged } from 'firebase/auth';

const auth = useFirebaseAuth()
const isLoggedIn = ref(false)
const isAuthLoading = ref(false)

// native vuefire watcher to check whether user logged or not
onAuthStateChanged(auth, (user) => {
  isAuthLoading.value = false
  if (user) {
    isLoggedIn.value = true
  } 
  else {
    isLoggedIn.value = false
  }
});

const zone = ref('')

// equivalent to router-link but enables the use native @click method
async function goToMaps() {
  router.push('/maps/' + zone.value)
}

async function showLogin() {
  let myModal = Modal.getOrCreateInstance(document.getElementById('#login'));
  myModal.show();
}

// hideAuth never used due to Redirect methods

async function showLogout() {
  let myModal = Modal.getOrCreateInstance(document.getElementById('#logout'));
  myModal.show();
}

async function hideLogout() {
  let myModal = Modal.getOrCreateInstance(document.getElementById('#logout'));
  myModal.hide();
}

// In most cases, getRedirectResult is not needed. onAuthStateChanged is sufficient for successful flows
// but a developer may want to get the results (OAuth credentials, additional user info, etc)
// or recover from certain errors (email already exists, linking is required, etc) 
// or show error message to the user (account disabled, etc). it has to call this API to get that information.

onMounted(async () => {
  isAuthLoading.value = true
})

</script>

<template>

<div v-if="isAuthLoading" class="overlay">
  <div class="overlay__wrapper">
    <div class="overlay__spinner">
      <div class="spinner-grow" style="width: 3rem; height: 3rem; color:#3C002E" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
  </div>
</div>
  
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
            <li class="nav-item"><button class="dropdown-item simaps-classic" @click="zone = 'ecrins', goToMaps()" disabled>Écrins</button></li>
          </ul>
        </li>
        <li class="nav-item">
          <router-link class="nav-link simaps-classic" to="/about">À propos</router-link>
        </li>
      </ul>

      <form class="form-inline">
        <button v-if="isLoggedIn" class="btn btn-outline-secondary" type="button" @click="showLogin()">Mon compte</button>
        <button v-if="isLoggedIn" class="btn btn-outline-primary" style="margin-left: 5px;" type="button" @click="showLogout()" data-toggle="tooltip" title="Se déconnecter"><i class="pi pi-sign-out"></i></button>
        <button v-if="!isLoggedIn" class="btn btn-outline-secondary" type="button" @click="showLogin()">Se connecter</button>
      </form>

    </div>
  </nav>
</div>

<!-- Login -->
<LoginComponent :isLoggedIn="isLoggedIn" :currentUser="auth.currentUser"></LoginComponent>

<!-- Logout -->
<LogoutComponent @exit="hideLogout()"></LogoutComponent>

</template>

<style>

#header {
  grid-row: header;
  padding-left: 40px;
  padding-right: 40px;
}

.overlay {
  position: fixed;
  z-index: 9999;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: white;
  opacity: 0.5;
}

.overlay__wrapper {
  width: 100%;
  height: 100%;
  position: relative;
}

.overlay__spinner {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
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