<script setup>
import { computed } from 'vue'
import { defineEmits } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const emit = defineEmits(['close'])

// Computed pour affiche l'utilisateur connecté
const currentUser = computed(() => authStore.auth.currentUser)

function signOut() {
  authStore.signOutAll()
  emit('close')
}

</script>

<template>
  <div class="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-20">
    <div class="bg-white p-6 rounded shadow-lg w-full max-w-sm">
      
      <div class="flex justify-between items-center">
        <h3 class="text-lg text-[#3C002E] font-inter font-semibold">Mon compte</h3>

        <!-- Croix pour fermer le modal -->
        <button
          @click="$emit('close')"
          class="text-gray-500 hover:text-[#FF803D] transition-colors duration-200 p-1 rounded-full"
          aria-label="Fermer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Affichage de l'email de l'utilisateur -->
      <div class="mt-4">
        <p class="text-gray-700 font-medium">Email : 
          <span class="text-blue-500">{{ currentUser.email }}</span>
        </p>
      </div>

      <!-- Bouton de déconnexion -->
      <div class="mt-4">
        <button
          class="w-full font-inter bg-blue-500 text-white p-2 rounded mb-2"
          @click="signOut()"
        >
          Se déconnecter
        </button>
      </div>
      
    </div>
  </div>
</template>


<style scoped>

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;550;650;800&display=swap');

.font-inter {
  font-family: 'Inter', sans-serif;
}
/* Ajoute des styles pour ton modal si nécessaire */
</style>



