<script setup>

import axios from 'axios';
import { ref, computed } from 'vue';

// user session
import { useFirebaseAuth } from 'vuefire';
const auth = useFirebaseAuth()

const emit = defineEmits(['exit', 'close'])

const props = defineProps({
  hikeId: String,
})

const title = ref('')
const note = ref('')
const rate = ref(2)

async function createReview() {
  emit('close')
  const payload = {
    hike_id: props.hikeId,
    title: title.value,
    note: note.value,
    rate: rate.value,
  }

  // add authorization to protect API
  const token = await auth.currentUser.getIdToken()
  const headers = { 
    Authorization: 'Bearer ' + token
  };

  await axios.post(import.meta.env.VITE_APP_ROOT_API + '/reviews', payload, { headers })
      .then((res) => {
          console.log(res.status);
          resetData();
          emit('exit');
      })
      .catch((error) => {
          console.log(error);
          resetData();
      })
}

async function resetData() {
  title.value = ''
  note.value = ''
  rate.value = 2
  errors.value = []
}

// custom form validation
const errors = ref([])
async function onSubmit() {
  errors.value = []
  if (!title.value) {
    errors.value.push('Le titre est obligatoire.')
  }
  if (!note.value) {
    errors.value.push('La description est obligatoire.')
  }
  if (!rate.value) {
    errors.value.push('La note est obligatoire.')
  }
  if (errors.value.length == 0) {
    createReview()
  }
}

</script>

<template>

<div class="modal fade" data-bs-backdrop="static" id="#newReview" tabindex="-1" aria-labelledby="#newReview" aria-hidden="false">
  <div class="modal-dialog modal-lg modal-dialog-scrollable">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title simaps-bold fs-5" id="#newReview">Laisser un avis</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="resetData()"></button>
      </div>
      <div class="modal-body">
        <form @submit.prevent="onSubmit()" novalidate> 
          <p v-if="errors.length">
            <b>Veuillez corriger les erreurs suivantes :</b>
            <ul>
              <li v-for="error in errors" style="color:#D6955B;">{{ error }}</li>
            </ul>
          </p>
          <div class="form-group simaps-classic">
            <label for="InputTitle">Résumé</label>
            <input type="text" v-model="title" class="form-control simaps-light" id="InputTitle">
          </div>
          <div class="form-group simaps-classic">
            <label for="InputNote">Description</label>
            <textarea type="text" v-model="note" class="form-control simaps-light" id="InputNote" rows="4"></textarea>
          </div>
          <br/>
          <div class="form-group simaps-classic">
            <label for="InputRate">Note</label>
            <input v-model="rate" type="range" class="form-range range-cust" min="1" max="4" id="InputRate">
          </div>
          <br/>
          <div class="modal-footer">
            <button type="submit" class="btn btn-danger">Envoyer</button> {{ auth.currentUser.isAnonymous }}
          </div>
        </form>
      </div>
    </div>
  </div>
</div>

</template>

<style>

.range-cust::-webkit-slider-thumb {
  background: #3C002E !important;
}
.range-cust::-moz-range-thumb {
  background: #3C002E !important;
}
.range-cust::-ms-thumb {
  background: #3C002E !important;
}

</style>


