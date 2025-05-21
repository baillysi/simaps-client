<script setup>
import { ref, defineEmits } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const emit = defineEmits(['close'])
const isLoading = ref(false)

async function signInAsGuest() {
  isLoading.value = true
  await authStore.signInAsGuest()
  isLoading.value = false
  emit('close') // Ferme le modal après la connexion en tant qu'invité
}

function signInWithGoogle() {
  authStore.signInWithGoogle()
  emit('close') // Ferme le modal après la connexion avec Google
}

function signInWithGithub() {
  authStore.signInWithGithub()
  emit('close') // Ferme le modal après la connexion avec GitHub
}
</script>

<template>
  <div class="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-20">
    <div class="bg-white p-6 rounded shadow-lg w-full max-w-sm">
      
      <div class="flex justify-between items-center">
        <h3 class="text-lg text-[#3C002E] font-inter font-semibold">Se connecter</h3>

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

      <!-- Affichage du loader pendant la connexion -->
      <div v-if="isLoading" class="flex justify-center items-center mt-4">
        <div class="animate-spin border-t-4 border-[#3C002E] border-solid w-8 h-8 rounded-full"></div>
      </div>

      <div class="mt-4">
        <button
          class="w-full font-inter bg-blue-500 text-white p-2 rounded mb-2"
          @click="signInWithGoogle"
        >
          Se connecter avec Google
        </button>
        <button
          class="w-full font-inter bg-gray-800 text-white p-2 rounded mb-2"
          @click="signInWithGithub"
        >
          Se connecter avec GitHub
        </button>
        <button
          class="w-full font-inter bg-gray-300 text-black p-2 rounded"
          @click="signInAsGuest"
        >
          Continuer en tant qu'invité
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
