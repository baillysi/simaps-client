<script setup>

import { ref } from 'vue';
import { Modal } from 'bootstrap';
import router from '../router';

// user session
import { useFirebaseAuth } from 'vuefire';
import { onAuthStateChanged } from 'firebase/auth';

const auth = useFirebaseAuth()
const isLoggedIn = ref(false)

// native vuefire watcher to check whether user logged or not
onAuthStateChanged(auth, (user) => {
  if (user) {
    isLoggedIn.value = true
  } 
  else {
    isLoggedIn.value = false
  }
});

// equivalent to router-link but enables the use native @click method
async function goToMaps() {
  router.push('/maps')
}

async function showLogin() {
  let myModal = Modal.getOrCreateInstance(document.getElementById('#login'));
  myModal.show();
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
          <li class="nav-item">
            <button class="nav-link inter-maps" @click="isLoggedIn ? goToMaps() : showLogin()">Cartes</button>
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
    font-weight: 500 !important;
    font-style: normal;
    opacity: 0.5;
  }

</style>


