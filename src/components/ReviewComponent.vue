<script setup>

import axios from 'axios';
import { computed } from 'vue';

import { useAuthStore } from '@/stores/auth'
const authStore = useAuthStore()

const emit = defineEmits(['update'])

const props = defineProps({
  hikeReviews: Object,
  hikeName: String,
})

const sortedReviews = computed(() => {
  return props.hikeReviews.sort((a, b) => {
  if (a.created_at < b.created_at) {
    return 1;
  }
  if (a.created_at > b.created_at) {
    return -1;
  }
  return 0;
  })
})

const validatedReviews = computed (() => {
  return sortedReviews.value.filter(
        (review) => review.is_validated === true)
})

const standbyReviews = computed (() => {
  return sortedReviews.value.filter(
        (review) => review.is_validated === false)
})

async function submitReview(reviewId) {
  const payload = {
    is_validated: true,
  }

  const token = await authStore.auth.currentUser.getIdToken()
  const headers = { 
    Authorization: 'Bearer ' + token
  };

  await axios.put(import.meta.env.VITE_APP_ROOT_API + 'api/reviews/' + reviewId, payload, { headers })
      .then((res) => {
          console.log(res.status);
          emit('update');
      })
      .catch((error) => {
          console.log(error);
      })
}

async function deleteReview(reviewId) {
  const token = await authStore.auth.currentUser.getIdToken()
  const headers = { 
    Authorization: 'Bearer ' + token
  };

  await axios.delete(import.meta.env.VITE_APP_ROOT_API + 'api/reviews/' + reviewId, { headers })
      .then((res) => {
          console.log(res.status);
          emit('update');
      })
      .catch((error) => {
          console.log(error);
      });
}

</script>

<template>
  
<div class="modal fade" id="#review" tabindex="-1" aria-labelledby="#review" aria-hidden="false">
  <div class="modal-dialog modal-lg modal-dialog-scrollable">
    <div class="modal-content simaps-classic">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="#review">{{ props.hikeName }}</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body" >
        <div v-if="validatedReviews.length == 0">Aucun avis disponible pour le moment</div>
        <div v-for="review in validatedReviews" class="simaps-classic reviews">
          <div class="row">
            <div class="col-9">
              <span class="simaps-bold">{{ review.title }}</span> 
              <span class="badge bg-primary" style="margin-left: 5px !important;">Avis validé</span> 
              <button v-if="authStore.isLoggedIn" class="btn btn-light btn-sm" @click="deleteReview(review.id)" data-toggle="tooltip" title="supprimer l'avis">
                <i class="pi pi-trash" style="color:#9F0000;"></i>
              </button>
            </div>
            <div class="col-3 text-end">
              <small class="simaps-light">écrit le {{ review.created_at }}</small>
            </div>
          </div>
          <i v-for="rate in review.rate" class="pi pi-star-fill" style="font-size: 1rem; color:#3C002E;"></i> 
          <i v-for="rate in (5 - review.rate)" class="pi pi-star" style="font-size: 1rem; color:#3C002E;"></i>
          <br/>
          <br/>
          <span class="simaps-light">{{ review.note }}</span>
        </div>
        <div v-if="authStore.isLoggedIn" v-for="review in standbyReviews" class="simaps-classic reviews">
          <div class="row">
            <div class="col-9">
              <span class="simaps-bold">{{ review.title }}</span> 
              <button type="button" class="btn btn-dark btn-sm" @click="submitReview(review.id)" style="margin-left: 5px !important; color:">Avis en attente</button> 
              <button v-if="authStore.isLoggedIn" class="btn btn-light btn-sm" @click="deleteReview(review.id)" data-toggle="tooltip" title="supprimer l'avis">
                <i class="pi pi-trash" style="color:#9F0000;"></i>
              </button>
            </div>
            <div class="col-3 text-end">
              <small class="simaps-light">écrit le {{ review.created_at }}</small>
            </div>
          </div>
          <i v-for="rate in review.rate" class="pi pi-star-fill" style="font-size: 1rem; color:#3C002E;"></i> 
          <i v-for="rate in (5 - review.rate)" class="pi pi-star" style="font-size: 1rem; color:#3C002E;"></i>
          <br/>
          <br/>
          <span class="simaps-light">{{ review.note }}</span>
        </div>
      </div>
    </div>
  </div>
</div>

</template>

<style>

.reviews {
  border-bottom: #AFAAC0 solid 1px;
  padding-bottom: 10px;
  padding-top: 10px;
}

.reviews:first-of-type {
  border-bottom: #AFAAC0 solid 1px;
  padding-bottom: 10px;
  padding-top: 0px !important;
}

.reviews:last-of-type {
  border-bottom: none;
  padding-bottom: 0px !important;
}

</style>


