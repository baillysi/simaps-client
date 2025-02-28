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

const isResponseLoading = ref(false)
const isResponseLoaded = ref(false)
const alertMessage = ref('')
const alertSuccess = ref(false)

async function deleteHike() {
  isResponseLoading.value = true
  const token = await authStore.auth.currentUser.getIdToken()
  const headers = { 
    Authorization: 'Bearer ' + token
  };

  await axios.delete(import.meta.env.VITE_APP_ROOT_API + '/hikes/' + props.hikeId, { headers })
      .then((res) => {
          console.log(res.status)
          isResponseLoading.value = false
          isResponseLoaded.value = true
          alertSuccess.value = true
          alertMessage.value = 'Itinéraire supprimé'
      })
      .catch((error) => {
          console.log(error)
          isResponseLoading.value = false
          isResponseLoaded.value = true
          alertSuccess.value = false
          alertMessage.value = 'Une erreur est survenue'
      });
}
</script>

<template>

<div class="modal fade" id="#delete" tabindex="-1" aria-labelledby="#delete" aria-hidden="false">
  <div class="modal-dialog modal-confirm">
    <div class="modal-content simaps-classic">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="#delete">Êtes-vous certain ?</h1>
        <button v-if="isResponseLoaded" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="emit('exit')"></button>
        <button v-else type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" ></button>
      </div>
      <div v-if="!isResponseLoaded" class="modal-body">
        <p>Voulez-vous vraiment supprimer l'itinéraire ? Cette action est irréversible.</p>
      </div>
      <div v-if="!isResponseLoaded"  class="modal-footer">
        <button class="btn btn-danger" @click="deleteHike()">Supprimer l'itinéraire</button>
      </div>
      <div v-else class="modal-body">
        <div class="row" style="margin-left: 10px; margin-right: 10px;">
          <AlertComponent :message="alertMessage" :success="alertSuccess"></AlertComponent>
        </div>
      </div>
    </div>
  </div>
</div>

</template>

<style>

</style>


