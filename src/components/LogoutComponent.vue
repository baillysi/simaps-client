<script setup>

const emit = defineEmits(['exit'])

async function logout() {
  emit('exit')
}

</script>

<template>

<div class="modal fade" id="#logout" tabindex="-1" aria-labelledby="#logout" aria-hidden="true">
  <div class="modal-dialog modal-confirm">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="#logout">Êtes-vous certain ?</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <p>Voulez-vous vraiment fermer votre session ?</p>
      </div>
      <div class="modal-footer">
        <button class="btn btn-danger" @click="logout">Se déconnecter</button>
      </div>
    </div>
  </div>
</div>

</template>

<style>

</style>


