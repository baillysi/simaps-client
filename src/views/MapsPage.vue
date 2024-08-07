<script setup>

import { ref, onMounted } from 'vue';
import axios from 'axios';

// user session
import { useFirebaseAuth} from 'vuefire';
import { onAuthStateChanged } from 'firebase/auth';

const auth = useFirebaseAuth()
const isLoggedIn = ref(false)
const isAuthLoading = ref(false)

onAuthStateChanged(auth, (user) => {
  if (user) {
    isLoggedIn.value = true
    getZonesCount()
  } 
  else {
    isLoggedIn.value = false
  }
});

const count = ref('')

async function getZonesCount() {
   // add authorization to protect API
  const token = await auth.currentUser.getIdToken()
  const headers = { 
    Authorization: 'Bearer ' + token
  };
  const response = await axios.get(import.meta.env.VITE_APP_ROOT_API + '/zones/count', { headers })
  isAuthLoading.value = false
  count.value = response.data
}

onMounted(async () => {
  isAuthLoading.value = true
})

</script>

<template>

<div v-if="isAuthLoading" class="overlay">
  <div class="overlay__wrapper">
      <div class="overlay__spinner">
        <div class="spinner-grow" style="width: 3rem; height: 3rem; color:#226d68" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
  </div>
</div>

<div class="container" style="text-align:center; margin-top: 50px;">

  <div class="row row-cols-1 row-cols-md-4">

    <div class="col mb-3">
      <div class="card h-100">
        <img src="/mafate.jpg" class="card-img-top" alt="...">
        <div class="card-body">
          <h5 class="card-title">Mafate</h5>
          <p class="card-text">Le cirque le plus sauvage, aucune route n'y mène, un monde à part.</p>
        </div>
        <router-link class="btn btn-outline-secondary" :to="{ name: 'MapDetails', params: { id: 1 }}">{{ count[1] }} itinéraires</router-link>
      </div>
    </div>

    <div class="col mb-3">
      <div class="card h-100">
        <img src="/cilaos.jpg" class="card-img-top" alt="...">
        <div class="card-body">
          <h5 class="card-title">Cilaos</h5>
          <p class="card-text">Au pied du Piton des Neiges, des possibilités infinies d'excursions.</p>
        </div>
        <router-link class="btn btn-outline-secondary" :to="{ name: 'MapDetails', params: { id: 2 }}">{{ count[2] }} itinéraires</router-link>
      </div>
    </div>

    <div class="col mb-3">
      <div class="card h-100">
        <img src="/salazie.jpg" class="card-img-top" alt="...">
        <div class="card-body">
          <h5 class="card-title">Salazie</h5>
          <p class="card-text">Nature verdoyante, cascades et villages de charme. </p>
        </div>
        <router-link class="btn btn-outline-secondary" :to="{ name: 'MapDetails', params: { id: 3 }}">{{ count[3] }} itinéraires</router-link>
      </div>
    </div>

    <div class="col mb-3">
      <div class="card h-100">
        <img src="/volcan.jpg" class="card-img-top" alt="...">
        <div class="card-body">
          <h5 class="card-title">Volcan</h5>
          <p class="card-text">Le cadre grandiose du Piton de la Fournaise, plus que jamais actif.</p>
        </div>
        <router-link class="btn btn-outline-secondary" :to="{ name: 'MapDetails', params: { id: 4 }}">{{ count[4] }} itinéraires</router-link>
      </div>
    </div> 

    <div class="col mb-3">
      <div class="card h-100">
        <img src="/plaines.jpg" class="card-img-top" alt="...">
        <div class="card-body">
          <h5 class="card-title">Plaines</h5>
          <p class="card-text">Entre deux massifs volcaniques, des paysages superbes et atypiques.</p>
        </div>
        <router-link class="btn btn-outline-secondary" :to="{ name: 'MapDetails', params: { id: 5 }}">{{ count[5] }} itinéraires</router-link>
      </div>
    </div>

    <div class="col mb-3">
      <div class="card h-100">
        <img src="/piton.jpg" class="card-img-top" alt="...">
        <div class="card-body">
          <h5 class="card-title">Piton des neiges</h5>
          <p class="card-text">Le plus haut sommet de l'Océan Indien, 3070 mètres.</p>
        </div>
        <router-link class="btn btn-outline-secondary" :to="{ name: 'MapDetails', params: { id: 6 }}">{{ count[6] }} itinéraires</router-link>
      </div>
    </div>

    <div class="col mb-3">
      <div class="card h-100">
        <img src="/nord.jpg" class="card-img-top" alt="...">
        <div class="card-body">
          <h5 class="card-title">Nord</h5>
          <p class="card-text">Région moins explorée, avec comme point culminant la Roche Écrite.</p>
        </div>
        <router-link class="btn btn-outline-secondary" :to="{ name: 'MapDetails', params: { id: 7 }}">{{ count[7] }} itinéraires</router-link>
      </div>
    </div>

    <div class="col mb-3">
      <div class="card h-100">
        <img src="/sud.jpg" class="card-img-top" alt="...">
        <div class="card-body">
          <h5 class="card-title">Sud</h5>
          <p class="card-text">Le Sud Sauvage, pépite à l'ombre du Volcan.</p>
        </div>
        <router-link class="btn btn-outline-secondary" :to="{ name: 'MapDetails', params: { id: 8 }}">{{ count[8] }} itinéraires</router-link>
      </div>
    </div>

    <div class="col mb-3">
      <div class="card h-100">
        <img src="/est.jpg" class="card-img-top" alt="...">
        <div class="card-body">
          <h5 class="card-title">Est</h5>
          <p class="card-text">L'aventure au coeur de la jungle des forêts primaires.</p>
        </div>
        <router-link class="btn btn-outline-secondary" :to="{ name: 'MapDetails', params: { id: 9 }}">{{ count[9] }} itinéraires</router-link>
      </div>
    </div>

    <div class="col mb-3">
      <div class="card h-100">
        <img src="/ouest.jpg" class="card-img-top" alt="...">
        <div class="card-body">
          <h5 class="card-title">Ouest</h5>
          <p class="card-text">Des points de vue célèbres et des itinéraires sportifs.</p>
        </div>
        <router-link class="btn btn-outline-secondary" :to="{ name: 'MapDetails', params: { id: 10 }}">{{ count[10] }} itinéraires</router-link>
      </div>
    </div>


  </div>
</div>

</template>

<style>

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

</style>