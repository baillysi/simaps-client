<script setup>

import axios from 'axios';

// user session
import { useFirebaseAuth } from 'vuefire';
const auth = useFirebaseAuth()

const emit = defineEmits(['exit', 'close'])

const props = defineProps({
  hikeId: String,
})

async function deleteHike() {
  emit('close')

  // add authorization to protect API
  const token = await auth.currentUser.getIdToken()
  const headers = { 
    Authorization: 'Bearer ' + token
  };

  await axios.delete(import.meta.env.VITE_APP_ROOT_API + '/hikes/' + props.hikeId, { headers })
      .then((res) => {
          console.log(res.status);
          emit('exit');
      })
      .catch((error) => {
          console.log(error);
      });
}
</script>

<template>

<div class="modal fade" id="#delete" tabindex="-1" aria-labelledby="#delete" aria-hidden="false">
  <div class="modal-dialog modal-confirm">
    <div class="modal-content simaps-classic">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="#delete">Êtes-vous certain ?</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <p>Voulez-vous vraiment supprimer l'itinéraire ? Cette action est irréversible.</p>
      </div>
      <div class="modal-footer">
        <button class="btn btn-danger" @click="deleteHike">Supprimer l'itinéraire</button>
      </div>
    </div>
  </div>
</div>

</template>

<style>

</style>


