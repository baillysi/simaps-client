<script setup>

import { useAuthStore } from '@/stores/auth'
const authStore = useAuthStore()

</script>

<template>

<div class="modal fade" id="#logout" tabindex="-1" aria-labelledby="#logout" aria-hidden="false">
  <div class="modal-dialog modal-confirm">
    <div class="modal-content simaps-classic">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="#logout">Êtes-vous certain ?</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <p>Voulez-vous vraiment fermer votre session ?</p>
      </div>
      <div class="modal-footer">
        <button class="btn btn-danger" @click="authStore.signOutAll" data-bs-dismiss="modal" aria-label="Logout">Se déconnecter</button>
      </div>
    </div>
  </div>
</div>

</template>


<style>

</style>



