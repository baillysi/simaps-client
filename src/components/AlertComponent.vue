<script setup>
import { ref } from 'vue';

const props = defineProps({
  message: String
})

</script>

<template>
<div>
    <div class="alert alert-success" role="alert">{{ message }}</div>
    <br/>
</div>
</template>

<style>

</style>


