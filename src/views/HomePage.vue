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
    <h1 style="font-family: Helvetica, Arial, sans-serif; font-size:bold; color:#18534F;">Cartes & Randonnées.</h1>
    <br/>

    <figure class="text-center">
      <blockquote class="blockquote">
        <h6 style="font-size:bold; color:#18534F;">C’est le fait de ne pas connaître exactement le chemin, la carte jetée qui fait du soleil couchant le guide et rend le décor vivant.</h6>
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
    
    <button class="btn btn-outline-secondary btn-lg" @click="isLoggedIn ? goToMaps() : showLogin()">Accès aux Cartes</button>
    
  </div>
  
</template>

<style>

  img {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    opacity: 0.85;
  }

  .btn-outline-secondary {
    color:#D6955B !important;
    font-weight: bold !important;
    padding-right: 50px !important;
    padding-left: 50px !important;
  }

  .btn-outline-secondary:hover {
    background-color:#226D68 !important;
  }

</style>