<script setup>

import { ref, onMounted } from 'vue';
import axios from 'axios';

const count = ref('')

async function getZonesCount() {
  const response = await axios.get(import.meta.env.VITE_APP_ROOT_API + '/zones/count')
  count.value = response.data
}

onMounted(async () => {
  getZonesCount()
})

</script>

<template>

<div class="container" style="text-align:center; margin-top: 50px;">

  <div class="row row-cols-1 row-cols-md-4">

    <div class="col mb-3">
      <div class="card h-100">
        <img src="../assets/mafate.jpg" class="card-img-top" alt="...">
        <div class="card-body">
          <h5 class="card-title">Mafate</h5>
          <p class="card-text">Le cirque le plus sauvage, aucune route n'y mène, un monde à part.</p>
        </div>
        <router-link class="btn btn-outline-secondary" :to="{ name: 'MapDetails', params: { id: 1 }}">{{ count[1] }} itinéraires</router-link>
      </div>
    </div>

    <div class="col mb-3">
      <div class="card h-100">
        <img src="../assets/cilaos.jpg" class="card-img-top" alt="...">
        <div class="card-body">
          <h5 class="card-title">Cilaos</h5>
          <p class="card-text">Au pied du Piton des Neiges, des possibilités infinies d'excursions.</p>
        </div>
        <router-link class="btn btn-outline-secondary" :to="{ name: 'MapDetails', params: { id: 2 }}">{{ count[2] }} itinéraires</router-link>
      </div>
    </div>

    <div class="col mb-3">
      <div class="card h-100">
        <img src="../assets/salazie.jpg" class="card-img-top" alt="...">
        <div class="card-body">
          <h5 class="card-title">Salazie</h5>
          <p class="card-text">Nature verdoyante, cascades et villages de charme. </p>
        </div>
        <router-link class="btn btn-outline-secondary" :to="{ name: 'MapDetails', params: { id: 3 }}">{{ count[3] }} itinéraires</router-link>
      </div>
    </div>

    <div class="col mb-3">
      <div class="card h-100">
        <img src="../assets/volcan.jpg" class="card-img-top" alt="...">
        <div class="card-body">
          <h5 class="card-title">Volcan</h5>
          <p class="card-text">Le cadre grandiose du Piton de la Fournaise, plus que jamais actif.</p>
        </div>
        <router-link class="btn btn-outline-secondary" :to="{ name: 'MapDetails', params: { id: 4 }}">{{ count[4] }} itinéraires</router-link>
      </div>
    </div> 

    <div class="col mb-3">
      <div class="card h-100">
        <img src="../assets/plaines.jpg" class="card-img-top" alt="...">
        <div class="card-body">
          <h5 class="card-title">Plaines</h5>
          <p class="card-text">Entre deux massifs volcaniques, des paysages superbes et atypiques.</p>
        </div>
        <router-link class="btn btn-outline-secondary" :to="{ name: 'MapDetails', params: { id: 5 }}">{{ count[5] }} itinéraires</router-link>
      </div>
    </div>

    <div class="col mb-3">
      <div class="card h-100">
        <img src="../assets/piton.jpg" class="card-img-top" alt="...">
        <div class="card-body">
          <h5 class="card-title">Piton des neiges</h5>
          <p class="card-text">Le plus haut sommet de l'Océan Indien, 3070 mètres.</p>
        </div>
        <router-link class="btn btn-outline-secondary" :to="{ name: 'MapDetails', params: { id: 6 }}">{{ count[6] }} itinéraires</router-link>
      </div>
    </div>

    <div class="col mb-3">
      <div class="card h-100">
        <img src="../assets/nord.jpg" class="card-img-top" alt="...">
        <div class="card-body">
          <h5 class="card-title">Nord</h5>
          <p class="card-text">Région moins explorée, avec comme point culminant la Roche Écrite.</p>
        </div>
        <router-link class="btn btn-outline-secondary" :to="{ name: 'MapDetails', params: { id: 7 }}">{{ count[7] }} itinéraires</router-link>
      </div>
    </div>

    <div class="col mb-3">
      <div class="card h-100">
        <img src="../assets/sud.jpg" class="card-img-top" alt="...">
        <div class="card-body">
          <h5 class="card-title">Sud</h5>
          <p class="card-text">Le Sud Sauvage, pépite à l'ombre du Volcan.</p>
        </div>
        <router-link class="btn btn-outline-secondary" :to="{ name: 'MapDetails', params: { id: 8 }}">{{ count[8] }} itinéraires</router-link>
      </div>
    </div>

    <div class="col mb-3">
      <div class="card h-100">
        <img src="../assets/est.jpg" class="card-img-top" alt="...">
        <div class="card-body">
          <h5 class="card-title">Est</h5>
          <p class="card-text">L'aventure au coeur de la jungle des forêts primaires.</p>
        </div>
        <router-link class="btn btn-outline-secondary" :to="{ name: 'MapDetails', params: { id: 9 }}">{{ count[9] }} itinéraires</router-link>
      </div>
    </div>

    <div class="col mb-3">
      <div class="card h-100">
        <img src="../assets/ouest.jpg" class="card-img-top" alt="...">
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

</style>