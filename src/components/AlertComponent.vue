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
    color: #EF4C20;
    border: #EF4C20 solid 1px;
  }

</style>


