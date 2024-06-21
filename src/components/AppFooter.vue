<script setup>

</script>

<template>
  
  <div id="footer">
    <nav class="navbar navbar-expand navbar-light">
      <hr>
      <div class="container-fluid justify-content-center">
        <ul class="navbar-nav">
          <li class="nav-item">
            <router-link class="nav-link" to="/home">Accueil</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/maps">Cartes</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/about">À propos</router-link>
          </li>
        </ul>
      </div>
    </nav>
    <hr>
    <span>&copy;2024 Simon BAILLY. Tous droits réservés.</span>
  </div>

</template>

<style>

  #footer {
    text-align: center;
    margin-top: auto;
    margin-bottom: 30px;
    padding-left: 40px;
    padding-right: 40px;
    padding-top: 100px;
  }

</style>


