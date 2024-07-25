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

// const googleUser = ref('')

// native vuefire watcher to check whether user logged or not
onAuthStateChanged(auth, (user) => {
  if (user) {
    isLoggedIn.value = true
  } 
  else {
    isLoggedIn.value = false
  }
});

async function showAuth() {
  let myModal = Modal.getOrCreateInstance(document.getElementById('#auth'));
  myModal.show();
}

async function showLogout() {
  let myModal = Modal.getOrCreateInstance(document.getElementById('#logout'));
  myModal.show();
}

async function hideAuth() {
  let myModal = Modal.getOrCreateInstance(document.getElementById('#auth'));
  myModal.hide();
}

async function hideLogout() {
  let myModal = Modal.getOrCreateInstance(document.getElementById('#logout'));
  myModal.hide();
}

getRedirectResult(auth) 

  .then((result) => {
    isAuthLoading.value = false 
    // This gives you a Google Access Token. You can use it to access Google APIs.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;

    // The signed-in user info.
    // googleUser.value = result.user;
    console.log('Successfully logged in !')

  })
  .catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.email;
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);
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
  <AuthComponent :isLoggedIn="isLoggedIn" :currentUser="auth.currentUser" @exit="hideAuth()"></AuthComponent>

  <!-- Logout -->
  <LogoutComponent @exit="hideLogout()"></LogoutComponent>


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


