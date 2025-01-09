<script setup>

import { computed } from 'vue'

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

</script>

<template>
  
<div class="modal fade" id="#review" tabindex="-1" aria-labelledby="#review" aria-hidden="false">
  <div class="modal-dialog modal-lg modal-dialog-scrollable">
    <div class="modal-content simaps-classic">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="#review">{{ props.hikeName }}</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <div v-for="review in sortedReviews" class="simaps-classic reviews">
          <div class="row">
            <div class="col-8">
              <span class="simaps-bold">{{ review.title }}</span>
            </div>
            <div class="col-4 text-end">
              <small class="simaps-light">écrit le {{ review.created_at }}</small>
            </div>
          </div>
          <i v-for="rate in review.rate" class="pi pi-star-fill" style="font-size: 1rem; color:#3C002E;"></i> 
          <i v-for="rate in (4 - review.rate)" class="pi pi-star" style="font-size: 1rem; color:#3C002E;"></i>
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


