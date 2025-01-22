<script setup>

const props = defineProps({
  message: String,
  success: Boolean
})

</script>

<template>
  
<div>
  <div v-if="success" class="alert alert-success" role="alert">{{ message }} &#x1F609</div>
  <div v-if="!success" class="alert alert-danger" role="alert">{{ message }} &#x1F609</div>
</div>

</template>

<style>

.alert.alert-success {
  background-color: #fff !important;
  color: #FF803D;
  border: #FF803D solid 1px;
}

.alert.alert-danger {
  background-color: #fff !important;
  color: #9F0000;
  border: #9F0000 solid 1px;
}

</style>


