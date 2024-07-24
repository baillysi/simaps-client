<script setup>

const props = defineProps({
  message: String,
  success: Boolean,
})

</script>

<template>
<div>
    <div v-if="success" class="alert alert-success" role="alert">{{ message }}</div>
    <div v-if="!success" class="alert alert-danger" role="alert">{{ message }}</div>
    <br/>
</div>
</template>

<style>

</style>


