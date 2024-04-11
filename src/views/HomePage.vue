<script setup>

</script>

<template>

  <div class="container" style="text-align:center; margin-top: 30px;">
    <h1 style="font-family:'Courier New', Courier, monospace; font-size:bold; color:#18534F;">Maps and Hikes.</h1>
    <br/>
    <div class="container-fluid">
      <img src="../assets/img.png">
    </div>
    <br/><br/>
    
    <div class="btn-group btn-group-lg" role="group" aria-label="Basic mixed styles example">
      <router-link class="btn btn-outline-secondary" to="/maps">Maps</router-link>
      <router-link class="btn btn-outline-secondary" to="/about">About</router-link>
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
    color:#D6955B !important;
    font-weight: bold !important;
    padding-right: 50px !important;
    padding-left: 50px !important;
  }

  .btn-outline-secondary:hover {
    background-color:#226D68 !important;
  }

</style>