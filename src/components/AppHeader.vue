<script setup>

</script>

<template>
  
  <div id="header">
    <nav class="navbar navbar-expand-md navbar-light">
      <div class="container-fluid">
        <a class="navbar-brand">Simaps</a>
        <ul class="navbar-nav me-auto"> 
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
        <form class="form-inline">
          <button class="btn btn-outline-secondary" type="button">Login</button>
        </form>
      </div>
    </nav>
    <hr>
  </div>

</template>

<style>

  .navbar-brand {
    color: #226D68 !important;
    font-weight: bold;
    font-size: 35px !important;
    margin-bottom: 8px;
    padding-right: 30px;
  }

  #header {
    margin-top:30px;
    padding-left: 40px;
    padding-right: 40px;
  }

  .nav-link {
    color: #18534F !important;
  }
  

</style>


