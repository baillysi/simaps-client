<script setup>
import { ref } from 'vue'

import AlertComponent from './AlertComponent.vue';

import { useFirebaseAuth } from 'vuefire'
import { GoogleAuthProvider, signInWithRedirect, getRedirectResult, signInAnonymously } from 'firebase/auth'

const emit = defineEmits(['exit', 'close'])
const props = defineProps({
  isLoggedIn: Boolean,
  currentUser: Object,
})

const isAuthLoading = ref(false)

const auth = useFirebaseAuth()
const provider = new GoogleAuthProvider();

const googleUser = ref('')

async function signInWithGoogle() {
  isAuthLoading.value = true
  await signInWithRedirect(auth, provider)
}

async function signInAsGuest() {
  isAuthLoading.value = true
  signInAnonymously(auth)
    .then(() => {
      // Signed in..
      isAuthLoading.value = false
      console.log('Successfully logged in as guest !')
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      // ...
    });
}

getRedirectResult(auth) 

  .then((result) => {
    // This gives you a Google Access Token. You can use it to access Google APIs.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;

    // The signed-in user info.
    googleUser.value = result.user;
    isAuthLoading.value = false
    console.log('Successfully logged in !')

  }).catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.email;
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);
    // ...
  });

</script>

<template>

<div v-if="isAuthLoading" class="overlay">
  <div class="overlay__wrapper">
    <div class="overlay__spinner">
      <div class="spinner-grow" style="width: 3rem; height: 3rem; color:#226d68" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
  </div>
</div>

<div class="modal fade" data-bs-backdrop="static" id="#auth" tabindex="-1" aria-labelledby="#auth" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="#auth">Mon compte</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>

      <div v-if="!isLoggedIn" class="modal-body" style="text-align:center;">

        <button class="gsi-material-button" @click="signInWithGoogle()">
          <div class="gsi-material-button-state"></div>
          <div class="gsi-material-button-content-wrapper">
            <div class="gsi-material-button-icon">
              <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" xmlns:xlink="http://www.w3.org/1999/xlink" style="display: block;">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                <path fill="none" d="M0 0h48v48H0z"></path>
              </svg>
            </div>
            <span class="gsi-material-button-contents">Se connecter avec Google</span>
            <span style="display: none;">Se connecter avec Google</span>
          </div>
        </button>

        <br/>
        <br/>

        <div>
          Continuer en tant qu'invité 
          <button class="btn btn-success btn-sm" style="margin-left: 5px;" type="button" @click="signInAsGuest()">
            <i class="pi pi-sign-in" style="color:white;"></i>
          </button>
          <br/>
          <small id="guesthelp" class="form-text text-muted">Certaines fonctionnalités avancées ne seront pas disponibles.</small>
        </div>

      </div>

      <div v-if="isLoggedIn" class="modal-body" style="text-align:center;">
        <div class="row" style="margin-left: 10px; margin-right: 10px;">
          <AlertComponent :message="'Vous êtes correctement identifié !'"></AlertComponent>
        </div>
        <div v-if="currentUser.isAnonymous">Utilisateur : Invité </div>
        <div v-if="!currentUser.isAnonymous">Utilisateur : {{ googleUser.displayName }} </div>
        <div v-if="!currentUser.isAnonymous">Email : {{ googleUser.email }} </div>
      </div>

    </div>
  </div>
</div>

</template>


<style>
.overlay {
  position: fixed;
  z-index: 9999;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: white;
  opacity: 0.5;
}
.overlay__wrapper {
  width: 100%;
  height: 100%;
  position: relative;
}
.overlay__spinner {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.gsi-material-button {
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  background-color: WHITE;
  background-image: none;
  border: 1px solid #747775;
  -webkit-border-radius: 20px;
  border-radius: 20px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  color: #1f1f1f;
  cursor: pointer;
  font-family: 'Roboto', arial, sans-serif;
  font-size: 14px;
  height: 40px;
  letter-spacing: 0.25px;
  outline: none;
  overflow: hidden;
  padding: 0 12px;
  position: relative;
  text-align: center;
  -webkit-transition: background-color .218s, border-color .218s, box-shadow .218s;
  transition: background-color .218s, border-color .218s, box-shadow .218s;
  vertical-align: middle;
  white-space: nowrap;
  width: auto;
  max-width: 400px;
  min-width: min-content;
}
.gsi-material-button .gsi-material-button-icon {
  height: 20px;
  margin-right: 12px;
  min-width: 20px;
  width: 20px;
}
.gsi-material-button .gsi-material-button-content-wrapper {
  -webkit-align-items: center;
  align-items: center;
  display: flex;
  -webkit-flex-direction: row;
  flex-direction: row;
  -webkit-flex-wrap: nowrap;
  flex-wrap: nowrap;
  height: 100%;
  justify-content: space-between;
  position: relative;
  width: 100%;
}
.gsi-material-button .gsi-material-button-contents {
  -webkit-flex-grow: 1;
  flex-grow: 1;
  font-family: 'Roboto', arial, sans-serif;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  vertical-align: top;
}
.gsi-material-button .gsi-material-button-state {
  -webkit-transition: opacity .218s;
  transition: opacity .218s;
  bottom: 0;
  left: 0;
  opacity: 0;
  position: absolute;
  right: 0;
  top: 0;
}
.gsi-material-button:disabled {
  cursor: default;
  background-color: #ffffff61;
  border-color: #1f1f1f1f;
}
.gsi-material-button:disabled .gsi-material-button-contents {
  opacity: 38%;
}
.gsi-material-button:disabled .gsi-material-button-icon {
  opacity: 38%;
}
.gsi-material-button:not(:disabled):active .gsi-material-button-state, 
.gsi-material-button:not(:disabled):focus .gsi-material-button-state {
  background-color: #303030;
  opacity: 12%;
}
.gsi-material-button:not(:disabled):hover {
  -webkit-box-shadow: 0 1px 2px 0 rgba(60, 64, 67, .30), 0 1px 3px 1px rgba(60, 64, 67, .15);
  box-shadow: 0 1px 2px 0 rgba(60, 64, 67, .30), 0 1px 3px 1px rgba(60, 64, 67, .15);
}
.gsi-material-button:not(:disabled):hover .gsi-material-button-state {
  background-color: #303030;
  opacity: 8%;
}
</style>