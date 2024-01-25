<script setup>

</script>

<template>
  
  <div class="container" style="text-align:center;">
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
          <li class="nav-item dropdown">
            <a href="#" class="nav-link dropdown-toggle" data-bs-toggle="dropdown">Maps</a>
            <div class="dropdown-menu">
              <router-link class="nav-link" to="/maps">France</router-link>
              <router-link class="nav-link" to="/maps">Reunion</router-link>
              <router-link class="nav-link" to="/maps">Rodrigues</router-link>
            </div>
          </li>
        </ul>
      </div>
    </nav>
    <hr>
  </div>

</template>

<style>

  .navbar-brand {
    color: #226d68 !important;
    font-weight: bold;
    font-size: 35px !important;
    padding: 2%;
    margin-bottom: 8px;
  }

  .container {
    margin-top: 50px;
  }

  .nav-link .active {
    color: red !important;
  }

</style>


