<script setup>

const emit = defineEmits(['exit'])

async function login () {
  emit('exit')
}

</script>

<template>

<div class="modal fade" data-bs-backdrop="static" id="#auth" tabindex="-1" aria-labelledby="#auth" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="#auth">Mon compte</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <div class="row" style="margin-left: 80px; margin-right: 80px;">
          <button type="submit" class="btn btn-outline-secondary" @click="login()">Se connecter</button>
        </div>
      </div>
    </div>
  </div>
</div>

</template>

<style>

</style>


