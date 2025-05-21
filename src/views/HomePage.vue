<script setup>
import { ref } from 'vue'
import AppHeader from '../components/AppHeader.vue'
import AppFooter from '../components/AppFooter.vue'
import router from '../router'

const zone = ref('')

function goToMaps() {
  router.push({ name: 'MapComponent', params: { zone: zone.value } })
}
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <AppHeader />

    <!-- Contenu principal -->
    <div class="flex-grow text-center px-4 mt-8">
      <h1 class="text-[#3C002E] font-bold font-inter text-[50px] lg:text-[75px]">
        Cartes & Randonnées.
      </h1>
      <h6 class="text-[#3C002E] font-inter font-normal text-base mb-4">
        La cartographie des plus beaux massifs, pour préparer vos trails et randonnées.
      </h6>
      <div class="flex justify-center mb-12">
        <img src="/illustration.svg" alt="Illustration" class="max-h-[500px] object-contain" />
      </div>
      <!-- Bouton -->
      <div class="flex justify-center">
        <button
          @click="zone = 'reunion'; goToMaps()"
          class="px-8 py-3 rounded border-1 border-[#3C002E] text-[#3C002E] font-inter font-semibold transition duration-200 hover:bg-[#3C002E] hover:text-white">
          Île de la Réunion
        </button>
      </div>
    </div>

    <AppFooter />
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;550;650;800&display=swap');

.font-inter {
  font-family: 'Inter', sans-serif;
}

#header {
  position: sticky;
  top: 0;
  z-index: 10;
}
</style>
