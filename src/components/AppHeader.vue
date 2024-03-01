<script setup>

</script>

<template>
  
  <div id="header">
    <nav class="navbar navbar-expand-lg navbar-light">
      <div class="container-fluid">
        <a class="navbar-brand">Simaps</a>
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <router-link class="nav-link" to="/home">Home</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/about">About</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/maps">Maps</router-link>
          </li>
        </ul>
      </div>
    </nav>
    <hr>
  </div>

</template>

<style>

  .navbar-brand {
    color: #2d728f !important;
    font-weight: bold;
    font-size: 35px !important;
    padding: 2%;
    margin-bottom: 8px;
  }

  #header {
    margin-top: 50px;
    padding-left: 40px;
    padding-right: 40px;
  }

  .nav-link .active {
    color: red !important;
  }

</style>


