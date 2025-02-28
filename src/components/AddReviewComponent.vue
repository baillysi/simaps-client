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

// handle axios response data
const isResponseLoading = ref(false)
const isResponseLoaded = ref(false)
const alertMessage = ref('')
const alertSuccess = ref(false)

const reviewTitle = ref('')
const reviewNote = ref('')

const errors = ref([])

// star rating
const reviewRate = ref(''); 
const maxRatings = ref(5);

function setRating(newRate) {
  reviewRate.value = newRate;
}

async function createReview() {
  isResponseLoading.value = true

  const payload = {
    hike_id: props.hikeId,
    title: reviewTitle.value,
    note: reviewNote.value,
    rate: reviewRate.value,
  }

  const token = await authStore.auth.currentUser.getIdToken()
  const headers = { 
    Authorization: 'Bearer ' + token
  };

  await axios.post(import.meta.env.VITE_APP_ROOT_API + '/reviews', payload, { headers })
      .then((res) => {
          console.log(res.status);
          isResponseLoading.value = false
          isResponseLoaded.value = true
          alertSuccess.value = true
          alertMessage.value = 'Merci pour votre avis ! Il sera bientôt visible.'
      })
      .catch((error) => {
          console.log(error);
          isResponseLoading.value = false
          isResponseLoaded.value = true
          alertSuccess.value = false
          alertMessage.value = 'Une erreur est survenue.'
      })
}

// custom form validation
function onSubmit() {
  errors.value = []
  if (!reviewTitle.value) {
    errors.value.push('Le titre est obligatoire.')
  }
  if (!reviewNote.value) {
    errors.value.push('La description est obligatoire.')
  }
  if (!reviewRate.value) {
    errors.value.push('La note est obligatoire.')
  }
  if (errors.value.length == 0) {
    createReview()
  }
}

function resetData() {
  reviewTitle.value = ''
  reviewNote.value = ''
  reviewRate.value = 0
  errors.value = []
  isResponseLoaded.value = false
  alertSuccess.value = false
  alertMessage.value = ''
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
        <button v-if="isResponseLoaded" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="resetData(), emit('exit')"></button>
        <button v-else type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="resetData()"></button>
      </div>
      <div v-if="!isResponseLoaded" class="modal-body">
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
            <input type="text" v-model="reviewTitle" class="form-control simaps-light" id="InputTitle" maxlength="50">
          </div>
          <div class="form-group simaps-classic">
            <div class="row">
              <div class="col"><label for="InputNote">Description</label></div>
              <div class="col text-end"><small class="simaps-light">(max 500 caractères)</small></div>
            </div>
            <textarea type="text" v-model="reviewNote" class="form-control simaps-light" id="InputNote" rows="4" maxlength="500"></textarea>
          </div>
          <br/>
          <div class="simaps-classic wrapper">
            Note : <span v-for="star in maxRatings" :key="star" class="star" :class="{ filled: star <= reviewRate }" @click="setRating(star)"><i class="pi pi-star-fill"></i></span>
          </div>
          <br/>
          <div class="modal-footer">
            <button type="submit" class="btn btn-danger">Envoyer</button>
          </div>
        </form>
      </div>
      <div v-if="isResponseLoaded" class="modal-body">
        <div class="row" style="margin-left: 10px; margin-right: 10px;">
          <AlertComponent :message="alertMessage" :success="alertSuccess"></AlertComponent>
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


