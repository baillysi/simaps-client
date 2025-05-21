<script setup>
import { ref, computed } from 'vue'
import LoginComponent from './LoginComponent.vue'
import { useAuthStore } from '@/stores/auth'
import LogoutComponent from './LogoutComponent.vue'

const authStore = useAuthStore()

const isLoginModalOpen = ref(false) // Variable pour gérer l'ouverture du modal
const isLogoutModalOpen = ref(false) // Variable pour gérer l'ouverture du modal

// Computed pour savoir si l'utilisateur est connecté
const userIsLoggedIn = computed(() => authStore.isLoggedIn)

// Fonction pour ouvrir/fermer le modal
function toggleLoginModal() {
  isLoginModalOpen.value = !isLoginModalOpen.value
}

function toggleLogoutModal() {
  isLogoutModalOpen.value = !isLogoutModalOpen.value
}
</script>

<template>
  <div class="bg-white p-3 shadow-md sticky top-0 z-10">
    <div class="max-w-7xl mx-auto flex justify-between items-center">
      <router-link class="flex items-center" to="/">
        <img src="./icons/logo.svg" alt="Kavalé Logo" class="h-16 w-auto" />
      </router-link>

      <ul class="flex space-x-8">
        <li>
          <router-link
            class="text-[#3C002E] font-inter text-lg hover:text-[#FF803D]"
            :class="{ 'font-bold': $route.path === '/' }"
            to="/"
          >
            Accueil
          </router-link>
        </li>
        <li>
          <router-link
            class="text-[#3C002E] font-inter text-lg hover:text-[#FF803D]"
            :class="{ 'font-bold': $route.path === '/maps/reunion' }"
            to="/maps/reunion"
          >
            Réunion
          </router-link>
        </li>
        <li>
          <router-link
            class="text-[#3C002E] font-inter text-lg hover:text-[#FF803D]"
            :class="{ 'font-bold': $route.path === '/about' }"
            to="/about"
          >
            À propos
          </router-link>
        </li>
      </ul>

      <div class="flex items-center">
        <!-- Affiche "Mon compte" si l'utilisateur est connecté, sinon affiche "Se connecter" -->
        <button
          v-if="!userIsLoggedIn"
          class="text-[#3C002E] font-inter border-2 border-[#3C002E] px-4 py-2 rounded hover:bg-[#3C002E] hover:text-white"
          @click="toggleLoginModal"
        >
          Se connecter
        </button>

        <button
          v-else
          class="text-[#3C002E] font-inter border-2 border-[#3C002E] px-4 py-2 rounded hover:bg-[#3C002E] hover:text-white"
          @click="toggleLogoutModal"
        >
          Mon compte
        </button>
      </div>
    </div>
  </div>

  <!-- Modal LogoutComponent -->
  <LogoutComponent v-if="isLogoutModalOpen" @close="toggleLogoutModal" />
  <!-- Modal LoginComponent -->
  <LoginComponent v-if="isLoginModalOpen" @close="toggleLoginModal" />
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
  width: 100%;
}
</style>
