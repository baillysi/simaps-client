<template>
    <div v-if="visible" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl p-6 w-full max-w-lg">
        <h2 class="text-2xl font-bold mb-4">
          {{ isEditing ? 'Modifier la randonnée' : 'Nouvelle randonnée' }}
        </h2>
  
        <form @submit.prevent="save">
          <div class="mb-4">
            <label class="block text-sm font-medium mb-1">Nom</label>
            <input
              v-model="localForm.name"
              type="text"
              class="w-full border rounded-lg p-2"
              required
            />
          </div>
  
          <div class="mb-4">
            <label class="block text-sm font-medium mb-1">Distance (km)</label>
            <input
              v-model.number="localForm.distance"
              type="number"
              min="0"
              step="0.1"
              class="w-full border rounded-lg p-2"
              required
            />
          </div>
  
          <div class="mb-4">
            <label class="block text-sm font-medium mb-1">Durée (h)</label>
            <input
              v-model.number="localForm.duration"
              type="number"
              min="0"
              step="0.1"
              class="w-full border rounded-lg p-2"
              required
            />
          </div>
  
          <div class="flex justify-end gap-2 mt-6">
            <button
              type="button"
              class="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
              @click="$emit('close')"
            >
              Annuler
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              Sauvegarder
            </button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
  import { reactive, watch, computed } from 'vue'
  
  const props = defineProps({
    visible: {
      type: Boolean,
      required: true
    },
    hike: {
      type: Object,
      default: null
    }
  })
  
  const emit = defineEmits(['save', 'close'])
  
  const localForm = reactive({
    name: '',
    distance: '',
    duration: ''
  })
  
  const isEditing = computed(() => !!props.hike)
  
  watch(() => props.hike, (newHike) => {
    if (newHike) {
      localForm.name = newHike.name
      localForm.distance = newHike.distance
      localForm.duration = newHike.duration
    } else {
      localForm.name = ''
      localForm.distance = ''
      localForm.duration = ''
    }
  })
  
  function save() {
    emit('save', { ...localForm })
  }
  </script>
  