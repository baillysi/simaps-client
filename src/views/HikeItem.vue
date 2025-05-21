<template>
    <li
      @click="select"
      class="p-4 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200"
    >
      <h3 class="text-lg font-semibold">{{ hike.name }}</h3>
      <p class="text-sm text-gray-600">{{ hike.distance }} km - {{ hike.duration }} h</p>
    </li>
  </template>
  
  <script setup>
  const props = defineProps({
    hike: {
      type: Object,
      required: true
    }
  })
  
  const emit = defineEmits(['select'])
  
  function select() {
    emit('select', hike)
  }
  </script>
  