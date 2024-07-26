<script setup>

import { ref, onMounted } from 'vue';

import { Modal } from 'bootstrap';

import AuthComponent from './AuthComponent.vue';
import LogoutComponent from './LogoutComponent.vue';

// user session
import { useFirebaseAuth} from 'vuefire';
import { onAuthStateChanged, GoogleAuthProvider, getRedirectResult } from 'firebase/auth';

const auth = useFirebaseAuth()
const isLoggedIn = ref(false)
const isAuthLoading = ref(false)

// native vuefire watcher to check whether user logged or not
onAuthStateChanged(auth, (user) => {
  isAuthLoading.value = false
  if (user) {
    isLoggedIn.value = true
    console.log('Logged in !')
  } 
  else {
    isLoggedIn.value = false
    console.log('Logged out!');
  }
});

async function showAuth() {
  let myModal = Modal.getOrCreateInstance(document.getElementById('#auth'));
  myModal.show();
}

// hideAuth never used due to Redirect methods

async function showLogout() {
  let myModal = Modal.getOrCreateInstance(document.getElementById('#logout'));
  myModal.show();
}

async function hideLogout() {
  let myModal = Modal.getOrCreateInstance(document.getElementById('#logout'));
  myModal.hide();
}

// In most cases, getRedirectResult is not needed. onAuthStateChanged is sufficient for successful flows
// but a developer may want to get the results (OAuth credentials, additional user info, etc)
// or recover from certain errors (email already exists, linking is required, etc) 
// or show error message to the user (account disabled, etc). They can call this API to get that information.
// GetRedirectResult

getRedirectResult(auth)
  .then((result) => {
    const credential = GithubAuthProvider.credentialFromResult(result);
    if (credential) {
      // This gives you a GitHub Access Token. You can use it to access the GitHub API.
      const token = credential.accessToken;
      // ...
    }

    // The signed-in user info.
    const user = result.user;
  }).catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    alert(error.message)
    // The email of the user's account used.
    const email = error.email;
    // The AuthCredential type that was used.
    const credential = GithubAuthProvider.credentialFromError(error);
    // ...
  });

onMounted(async () => {
  isAuthLoading.value = true
})

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
    
  <div id="header">
    <nav class="navbar navbar-expand-md navbar-light">
      <div class="container-fluid">
        <a class="navbar-brand">Kavalé</a>
        <ul class="navbar-nav me-auto"> 
          <li class="nav-item">
            <router-link class="nav-link" to="/">Accueil</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/maps">Cartes</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/about">À propos</router-link>
          </li>
        </ul>
        <form class="form-inline">
          <button class="btn btn-outline-secondary" style="margin-right: 5px;" type="button" @click="showAuth()">Mon compte</button>
          <button class="btn btn-danger" style="margin-left: 5px;" type="button" @click="showLogout()" data-toggle="tooltip" title="Se déconnecter" :disabled="!isLoggedIn">
            <i class="pi pi-sign-out" style="color:white;"></i>
          </button>
        </form>
      </div>
    </nav>
    <hr>
  </div>

  <!-- Auth -->
  <AuthComponent :isLoggedIn="isLoggedIn" :currentUser="auth.currentUser"></AuthComponent>

  <!-- Logout -->
  <LogoutComponent @close="hideLogout()"></LogoutComponent>


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

  .navbar-brand {
    color: #226D68 !important;
    font-weight: bold;
    font-size: 35px !important;
    margin-bottom: 8px;
    padding-right: 30px;
  }

  #header {
    margin-top:30px;
    padding-left: 40px;
    padding-right: 40px;
  }

  .nav-link {
    color: #18534F !important;
  }
  

</style>


