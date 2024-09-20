<script setup>

import { ref } from 'vue';
import { Modal } from 'bootstrap';
import router from '../router'

// user session
import { useFirebaseAuth} from 'vuefire';
import { onAuthStateChanged } from 'firebase/auth';

const auth = useFirebaseAuth()
const isLoggedIn = ref(false)

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

  <div class="container" style="text-align:center; margin-top: 30px;">
    <h1 class="inter-maps" >Cartes & Randonnées.</h1>
    <br/>

    <figure class="text-center">
      <blockquote class="blockquote">
        <h6 class="inter-maps">C’est le fait de ne pas connaître exactement le chemin, la carte jetée qui fait du soleil couchant le guide et rend le décor vivant.</h6>
      </blockquote>
      <figcaption class="blockquote-footer">
        Art Garfunkel
      </figcaption>
    </figure>
    <br/>

    <div class="container-fluid">
      <img src="/img.png">
    </div>
    <br/><br/>
    
    <button class="btn btn-outline-secondary" @click="isLoggedIn ? goToMaps() : showLogin()">Accès aux Cartes</button>
    
  </div>
  
</template>

<style>

  @import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap');

  img {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    opacity: 0.85;
  }

  .btn-outline-secondary {
    color:#390040 !important;
    font-family: "Inter", sans-serif !important;
    font-optical-sizing: auto;
    font-weight: 500 !important;
    font-style: normal;
    padding-right: 40px !important;
    padding-left: 40px !important;
  }

  .btn-outline-secondary:hover {
    color: #FFFFFF !important;
    background-color:#390040 !important;
  }

  .btn-danger {
    background-color: #EF4C20 !important;
  }

  .inter-maps {
    color: #390040 !important;
    font-family: "Inter", sans-serif;
    font-optical-sizing: auto;
    font-weight: 550 !important;
    font-style: normal;
  }


</style>