<script setup>

</script>

<template>

  <div class="container" style="text-align:center; margin-top: 30px;">
    <h1 style="font-family: Helvetica, Arial, sans-serif; font-size:bold; color:#18534F;">Cartes & Randonnées.</h1>
    <br/>

    <figure class="text-center">
      <blockquote class="blockquote">
        <h6 style="font-size:bold; color:#18534F;">C’est le fait de ne pas connaître exactement le chemin, la carte jetée qui fait du soleil couchant le guide et rend le décor vivant.</h6>
      </blockquote>
      <figcaption class="blockquote-footer">
        Art Garfunkel
      </figcaption>
    </figure>
    <br/>

    <div class="container-fluid">
      <img src="/img.png">
    </div>
    <br/><br/>
    
    <router-link class="btn btn-outline-secondary btn-lg" to="/maps">Accès aux Cartes</router-link>
    
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