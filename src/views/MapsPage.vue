<script setup>

</script>

<template>

<div class="container" style="text-align:center; margin-top: 50px;">

  <div class="row row-cols-1 row-cols-md-4">

    <div class="col mb-3">
      <div class="card h-100">
        <img src="../assets/mafate.jpg" class="card-img-top" alt="...">
        <div class="card-body">
          <h5 class="card-title">Mafate</h5>
          <p class="card-text">This is a longer card with supporting text below as a natural lead-in to additional content.</p>
        </div>
        <router-link class="btn btn-outline-secondary" :to="{ name: 'MapDetails', params: { id: 1 }}">Details</router-link>
        <div class="card-footer">
          <small class="text-muted">Last updated 3 mins ago</small>
        </div>
      </div>
    </div>

    <div class="col mb-3">
      <div class="card h-100">
        <img src="../assets/cilaos.jpg" class="card-img-top" alt="...">
        <div class="card-body">
          <h5 class="card-title">Cilaos</h5>
          <p class="card-text">This is a longer card with supporting text below as a natural lead-in to additional content.</p>
        </div>
        <router-link class="btn btn-outline-secondary" :to="{ name: 'MapDetails', params: { id: 2 }}">Details</router-link>
        <div class="card-footer">
          <small class="text-muted">Last updated 3 mins ago</small>
        </div>
      </div>
    </div>

    <div class="col mb-3">
      <div class="card h-100">
        <img src="../assets/salazie.jpg" class="card-img-top" alt="...">
        <div class="card-body">
          <h5 class="card-title">Salazie</h5>
          <p class="card-text">This is a longer card with supporting text below as a natural lead-in to additional content.</p>
        </div>
        <router-link class="btn btn-outline-secondary" :to="{ name: 'MapDetails', params: { id: 3 }}">Details</router-link>
        <div class="card-footer">
          <small class="text-muted">Last updated 3 mins ago</small>
        </div>
      </div>
    </div>

    <div class="col mb-3">
      <div class="card h-100">
        <img src="../assets/volcan.jpg" class="card-img-top" alt="...">
        <div class="card-body">
          <h5 class="card-title">Volcan</h5>
          <p class="card-text">This is a longer card with supporting text below as a natural lead-in to additional content.</p>
        </div>
        <router-link class="btn btn-outline-secondary" :to="{ name: 'MapDetails', params: { id: 4 }}">Details</router-link>
        <div class="card-footer">
          <small class="text-muted">Last updated 3 mins ago</small>
        </div>
      </div>
    </div> 

    <div class="col mb-3">
      <div class="card h-100">
        <img src="../assets/plaines.jpg" class="card-img-top" alt="...">
        <div class="card-body">
          <h5 class="card-title">Plaines</h5>
          <p class="card-text">This is a longer card with supporting text below as a natural lead-in to additional content.</p>
        </div>
        <router-link class="btn btn-outline-secondary" :to="{ name: 'MapDetails', params: { id: 5 }}">Details</router-link>
        <div class="card-footer">
          <small class="text-muted">Last updated 3 mins ago</small>
        </div>
      </div>
    </div>

    <div class="col mb-3">
      <div class="card h-100">
        <img src="../assets/piton.jpg" class="card-img-top" alt="...">
        <div class="card-body">
          <h5 class="card-title">Piton des neiges</h5>
          <p class="card-text">This is a longer card with supporting text below as a natural lead-in to additional content.</p>
        </div>
        <router-link class="btn btn-outline-secondary" :to="{ name: 'MapDetails', params: { id: 6 }}">Details</router-link>
        <div class="card-footer">
          <small class="text-muted">Last updated 3 mins ago</small>
        </div>
      </div>
    </div>

    <div class="col mb-3">
      <div class="card h-100">
        <img src="../assets/nord.jpg" class="card-img-top" alt="...">
        <div class="card-body">
          <h5 class="card-title">Nord</h5>
          <p class="card-text">This is a longer card with supporting text below as a natural lead-in to additional content.</p>
        </div>
        <router-link class="btn btn-outline-secondary" :to="{ name: 'MapDetails', params: { id: 7 }}">Details</router-link>
        <div class="card-footer">
          <small class="text-muted">Last updated 3 mins ago</small>
        </div>
      </div>
    </div>

    <div class="col mb-3">
      <div class="card h-100">
        <img src="../assets/sud.jpg" class="card-img-top" alt="...">
        <div class="card-body">
          <h5 class="card-title">Sud</h5>
          <p class="card-text">This is a longer card with supporting text below as a natural lead-in to additional content.</p>
        </div>
        <router-link class="btn btn-outline-secondary" :to="{ name: 'MapDetails', params: { id: 8 }}">Details</router-link>
        <div class="card-footer">
          <small class="text-muted">Last updated 3 mins ago</small>
        </div>
      </div>
    </div>

    <div class="col mb-3">
      <div class="card h-100">
        <img src="../assets/est.jpg" class="card-img-top" alt="...">
        <div class="card-body">
          <h5 class="card-title">Est</h5>
          <p class="card-text">This is a longer card with supporting text below as a natural lead-in to additional content.</p>
        </div>
        <router-link class="btn btn-outline-secondary" :to="{ name: 'MapDetails', params: { id: 9 }}">Details</router-link>
        <div class="card-footer">
          <small class="text-muted">Last updated 3 mins ago</small>
        </div>
      </div>
    </div>

    <div class="col mb-3">
      <div class="card h-100">
        <img src="../assets/ouest.jpg" class="card-img-top" alt="...">
        <div class="card-body">
          <h5 class="card-title">Ouest</h5>
          <p class="card-text">This is a longer card with supporting text below as a natural lead-in to additional content.</p>
        </div>
        <router-link class="btn btn-outline-secondary" :to="{ name: 'MapDetails', params: { id: 10 }}">Details</router-link>
        <div class="card-footer">
          <small class="text-muted">Last updated 3 mins ago</small>
        </div>
      </div>
    </div>


  </div>

  

</div>

</template>

<style>

</style>