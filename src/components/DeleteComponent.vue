<script setup>

import axios from 'axios';

const emit = defineEmits(['exit', 'close'])

const props = defineProps({
  hikeId: String,
})

async function deleteHike() {
  emit('close')
  await axios.delete(import.meta.env.VITE_APP_ROOT_API + '/hikes/' + props.hikeId)
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

<div class="modal fade" id="#delete" tabindex="-1" aria-labelledby="#delete" aria-hidden="true">
  <div class="modal-dialog modal-confirm">
    <div class="modal-content inter-maps">
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


