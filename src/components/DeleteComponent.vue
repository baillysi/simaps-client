<script setup>

import { ref } from 'vue';

import axios from 'axios';

import AlertComponent from './AlertComponent.vue';

import { useAuthStore } from '@/stores/auth'
const authStore = useAuthStore()

const emit = defineEmits(['exit'])

const props = defineProps({
  hikeId: String,
})

// handle axios response 
const isResponseLoading = ref(false)
const showResponse = ref(false)
const message = ref('')
const success = ref(false)

async function deleteHike() {
  isResponseLoading.value = true

  // add authorization to protect API
  const token = await authStore.auth.currentUser.getIdToken()
  const headers = { 
    Authorization: 'Bearer ' + token
  };

  await axios.delete(import.meta.env.VITE_APP_ROOT_API + '/hikes/' + props.hikeId, { headers })
      .then((res) => {
          console.log(res.status)
          isResponseLoading.value = false
          showResponse.value = true
          success.value = true
          message.value = 'Itinéraire supprimé'
      })
      .catch((error) => {
          console.log(error)
          isResponseLoading.value = false
          showResponse.value = true
          success.value = false
          message.value = 'Une erreur est survenue'
      });
}
</script>

<template>

<div class="modal fade" id="#delete" tabindex="-1" aria-labelledby="#delete" aria-hidden="false">
  <div class="modal-dialog modal-confirm">
    <div class="modal-content simaps-classic">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="#delete">Êtes-vous certain ?</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="emit('exit')"></button>
      </div>
      <div v-if="!showResponse" class="modal-body">
        <p>Voulez-vous vraiment supprimer l'itinéraire ? Cette action est irréversible.</p>
      </div>
      <div v-if="!showResponse"  class="modal-footer">
        <button class="btn btn-danger" @click="deleteHike()">Supprimer l'itinéraire</button>
      </div>
      <div v-if="showResponse" class="modal-body">
        <div class="row" style="margin-left: 10px; margin-right: 10px;">
          <AlertComponent :message="message" :success="success"></AlertComponent>
        </div>
      </div>
    </div>
  </div>
</div>

</template>

<style>

</style>


