<script setup>

import axios from 'axios';
import { ref } from 'vue';

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

const title = ref('')
const note = ref('')

// star rating
const rate = ref(''); 
const maxRatings = ref(5);

function setRating(newRate) {
  rate.value = newRate;
}

async function createReview() {
  isResponseLoading.value = true
  const payload = {
    hike_id: props.hikeId,
    title: title.value,
    note: note.value,
    rate: rate.value,
  }

  // add authorization to protect API
  const token = await authStore.auth.currentUser.getIdToken()
  const headers = { 
    Authorization: 'Bearer ' + token
  };

  await axios.post(import.meta.env.VITE_APP_ROOT_API + '/reviews', payload, { headers })
      .then((res) => {
          console.log(res.status);
          isResponseLoading.value = false
          showResponse.value = true
          success.value = true
          message.value = 'Merci pour votre avis ! Il sera bientôt visible'
      })
      .catch((error) => {
          console.log(error);
          isResponseLoading.value = false
          showResponse.value = true
          success.value = false
          message.value = 'Une erreur est survenue'
      })
}

async function resetData() {
  title.value = ''
  note.value = ''
  rate.value = 0
  errors.value = []

  showResponse.value = false
  success.value = false
  message.value = ''
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

<div v-if="isResponseLoading" class="overlay">
  <div class="overlay__wrapper">
    <div class="overlay__spinner">
      <div class="spinner-grow" style="width: 3rem; height: 3rem; color:#3C002E" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
  </div>
</div>

<div class="modal fade" id="#newReview" tabindex="-1" aria-labelledby="#newReview" aria-hidden="false">
  <div class="modal-dialog modal-lg modal-dialog-scrollable">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title simaps-classic fs-5" id="#newReview">Laisser un avis</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="resetData(), emit('exit')"></button>
      </div>
      <div v-if="!showResponse" class="modal-body">
        <form @submit.prevent="onSubmit()" novalidate> 
          <div v-if="errors.length">
            <b>Veuillez corriger les erreurs suivantes :</b>
            <ul>
              <li v-for="error in errors" style="color:#D6955B;">{{ error }}</li>
            </ul>
          </div>
          <div class="form-group simaps-classic">
            <div class="row">
              <div class="col"><label for="InputTitle">Titre</label></div>
              <div class="col text-end"><small class="simaps-light">(max 50 caractères)</small></div>
            </div>
            <input type="text" v-model="title" class="form-control simaps-light" id="InputTitle" maxlength="50">
          </div>
          <div class="form-group simaps-classic">
            <div class="row">
              <div class="col"><label for="InputNote">Description</label></div>
              <div class="col text-end"><small class="simaps-light">(max 500 caractères)</small></div>
            </div>
            <textarea type="text" v-model="note" class="form-control simaps-light" id="InputNote" rows="4" maxlength="500"></textarea>
          </div>
          <br/>
          <div class="simaps-classic wrapper">
            Note : <span v-for="star in maxRatings" :key="star" class="star" :class="{ filled: star <= rate }" @click="setRating(star)"><i class="pi pi-star-fill"></i></span>
          </div>
          <br/>
          <div class="modal-footer">
            <button type="submit" class="btn btn-danger">Envoyer</button>
          </div>
        </form>
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

.range-cust::-webkit-slider-thumb {
  background: #3C002E !important;
}
.range-cust::-moz-range-thumb {
  background: #3C002E !important;
}
.range-cust::-ms-thumb {
  background: #3C002E !important;
}

.wrapper {
  display: flex;
  align-items: center;
  gap: 2px;
}

.star {
  cursor: pointer;
  color: #AFAAC0;
}

.star:first-of-type {
  padding-left: 2px;
}

.star:last-of-type {
  padding-right: 2px;
}

.star:hover,
.star:active,
.star.filled {
  color: #3C002E;
}

</style>


