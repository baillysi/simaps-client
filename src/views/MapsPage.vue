<script setup>

</script>

<template>

<div class="container" style="text-align:center; margin-top: 50px;">

  <div class="row row-cols-1 row-cols-md-3">
    <div class="col mb-4">
      <div class="card h-100">
        <img src="../assets/card.png" class="card-img-top" alt="...">
        <div class="card-body">
          <h5 class="card-title">Mafate</h5>
          <p class="card-text">This is a longer card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
        </div>
      </div>
    </div>
    <div class="col mb-4">
      <div class="card h-100">
        <img src="../assets/card.png" class="card-img-top" alt="...">
        <div class="card-body">
          <h5 class="card-title">Cilaos</h5>
          <p class="card-text">This is a short text</p>
        </div>
        <router-link class="btn btn-outline-secondary" :to="{ name: 'MapDetails', params: { id : 1 }}">Get details</router-link>
      </div>
    </div>
    <div class="col mb-4">
      <div class="card h-100">
        <img src="../assets/card.png" class="card-img-top" alt="...">
        <div class="card-body">
          <h5 class="card-title">Salazie</h5>
          <p class="card-text">This is a longer card with supporting text below as a natural lead-in to additional content.</p>
        </div>
        <router-link class="btn btn-outline-secondary" :to="{ name: 'MapDetails', params: { id : 2 }}">Get details</router-link>
        <div class="card-footer">
          <small class="text-muted">Last updated 3 mins ago</small>
        </div>
      </div>
    </div>
  </div>

</div>

</template>

<style>

  .btn-outline-secondary {
    color:#d6955b !important;
    font-weight: bold !important;
    padding-right: 50px !important;
    padding-left: 50px !important;
  }

  .btn-outline-secondary:hover {
    background-color:#226d68 !important;
  }

</style>