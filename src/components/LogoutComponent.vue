<script setup>

import { useFirebaseAuth } from 'vuefire'
import { signOut } from 'firebase/auth'

const emit = defineEmits(['exit'])

const auth = useFirebaseAuth()

async function signout() {
  signOut(auth).then((data) => {
      console.log('Successfully logged out!');
      emit('exit')
    })
    .catch(error => {
      console.log(error.code)
      alert(error.message);
    });
}

</script>

<template>

<div class="modal fade" id="#signout" tabindex="-1" aria-labelledby="#signout" aria-hidden="true">
  <div class="modal-dialog modal-confirm">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="#signout">Êtes-vous certain ?</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <p>Voulez-vous vraiment fermer votre session ?</p>
      </div>
      <div class="modal-footer">
        <button class="btn btn-danger" @click="signout()">Se déconnecter</button>
      </div>
    </div>
  </div>
</div>

</template>


<style>
</style>



