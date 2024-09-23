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

  .alert.alert-success {
    background-color: #fff !important;
    color: #FF953D;
    border: #FF953D solid 1px;
  }

</style>


