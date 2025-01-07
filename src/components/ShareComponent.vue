<script setup>

import { ref } from 'vue'

const props = defineProps({
  url: String
})

const message = ref('Copier le lien')

function copyToClipboard() {
  var copyText = document.getElementById("urlToShare");
  copyText.select();
  copyText.setSelectionRange(0, 99999);
  navigator.clipboard.writeText(copyText.value);
  message.value = ('Lien copié!')
}

</script>

<template>
  
<div class="modal fade" id="#share" tabindex="-1" aria-labelledby="#share" aria-hidden="false">
  <div class="modal-dialog modal-confirm">
    <div class="modal-content simaps-classic">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="#share">Partager la randonnée</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="message = 'Copier le lien'"></button>
      </div>
      <div class="modal-body">
        <div class="form-group simaps-classic">
          <input type="text" :value="props.url" class="form-control simaps-light" id="urlToShare" readonly>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-danger" @click="copyToClipboard()" data-toggle="tooltip" :title="'Copier le lien dans le presse-papier'">{{ message }}</button>
      </div>
    </div>
  </div>
</div>

</template>

<style>

</style>


