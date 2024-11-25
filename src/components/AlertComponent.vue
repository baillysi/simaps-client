<script setup>

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
  color: #FF803D;
  border: #FF803D solid 1px;
}

</style>


