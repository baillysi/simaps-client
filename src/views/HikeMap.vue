<script setup>
import { ref, reactive, onMounted } from 'vue'
import L from 'leaflet'
import axios from 'axios'

import HikeItem from './HikeItem.vue'
import HikeModal from './HikeModal.vue'

const mapContainer = ref(null)
const map = ref(null)

const hikes = ref([])
const selectedHike = ref(null)
const showModal = ref(false)

async function getHikes() {
  const response = await axios.get(import.meta.env.VITE_APP_ROOT_API + 'api/hikes', { params: { zone_id: 1 } })
  hikes.value = response.data
}

onMounted(() => {
  map.value = L.map(mapContainer.value).setView([48.8566, 2.3522], 13)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
  }).addTo(map.value)

  getHikes()
})

function selectHike(hike) {
  selectedHike.value = hike
  showModal.value = true
}

function openNewHikeModal() {
  selectedHike.value = null
  showModal.value = true
}

function saveHike(newHike) {
  if (selectedHike.value) {
    selectedHike.value.name = newHike.name
    selectedHike.value.distance = newHike.distance
    selectedHike.value.duration = newHike.duration
  } else {
    hikes.value.push({
      id: Date.now(),
      ...newHike
    })
  }
  closeModal()
}

function closeModal() {
  showModal.value = false
}
</script>

<template>
    <div class="relative w-full h-screen">
      <div ref="mapContainer" class="absolute inset-0 z-0"></div>
  
      <!-- Sidebar -->
      <div class="absolute top-0 left-0 w-80 bg-white shadow-lg h-full overflow-y-auto p-4 z-10">
        <h2 class="text-xl font-bold mb-4">Liste des randonnées</h2>
  
        <button
          class="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 mb-4"
          @click="openNewHikeModal"
        >
          Ajouter une randonnée
        </button>
  
        <ul class="space-y-4">
          <HikeItem
            v-for="hike in hikes"
            :key="hike.id"
            :hike="hike"
            @select="selectHike"
          />
        </ul>
      </div>
  
      <!-- Modal -->
      <HikeModal
        :visible="showModal"
        :hike="selectedHike"
        @save="saveHike"
        @close="closeModal"
      />
    </div>
  </template>

  