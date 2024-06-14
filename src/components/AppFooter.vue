<script setup>

</script>

<template>
  
  <div id="footer">
    <nav class="navbar navbar-expand navbar-light">
      <hr>
      <div class="container-fluid justify-content-center">
        <ul class="navbar-nav">
          <li class="nav-item">
            <router-link class="nav-link" to="/home">Home</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/about">About</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/maps">Maps</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/about">Books</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/about">FAQs</router-link>
          </li>
        </ul>
      </div>
    </nav>
    <hr>
    <span>&copy;2024 Simon BAILLY. All rights reserved.</span>
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


