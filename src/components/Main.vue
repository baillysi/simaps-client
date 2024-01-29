<script setup>

</script>

<template>

  <div class="container" style="text-align:center; margin-top: 50px;">
    <div class="container-fluid">
      <img src="../assets/img.png">
    </div>
    <br/><br/><br/>
    
    <div class="btn-group btn-group-lg" role="group" aria-label="Basic mixed styles example">
      <router-link class="btn btn-outline-secondary" to="/about">Maps</router-link>
      <router-link class="btn btn-outline-secondary" to="/about">Hosts</router-link>
    </div>
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
    color:#d6955b !important;
    font-weight: bold !important;
    padding-right: 50px !important;
    padding-left: 50px !important;
  }

  .btn-outline-secondary:hover {
    background-color:#226d68 !important;
  }

</style>


