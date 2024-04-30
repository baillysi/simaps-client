<script setup>

import axios from 'axios';
import { ref, toRef, watch } from 'vue';

const emit = defineEmits(['exit'])

const props = defineProps({
  hikeId: String,
})

async function deleteHike() {
  await axios.delete('http://localhost:5001/hikes/' + props.hikeId)
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
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="#delete">Are you sure ?</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <p>Do you really want to delete these records? This process cannot be undone.</p>
      </div>
      <div class="modal-footer">
        <button class="btn btn-danger" @click="deleteHike">Delete</button>
      </div>
    </div>
  </div>
</div>

</template>

<style>

</style>


