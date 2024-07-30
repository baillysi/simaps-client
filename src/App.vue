<script setup>

import VueCookieAcceptDecline from 'vue-cookie-accept-decline';
import 'vue-cookie-accept-decline/dist/vue-cookie-accept-decline.css';

import { RouterView } from 'vue-router'
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'

</script>

<template>
  <AppHeader />
  <RouterView />
  <AppFooter />

  <vue-cookie-accept-decline
    :debug="false"
    :disableDecline="true"
    :showPostponeButton="false"
    elementId="cookconsent"
    position="bottom-right"
    ref="cookconsent"
    transitionName="slideFromBottom"
    type="floating">
    
    <!-- Optional -->
    <template #postponeContent>&times;</template>

    <!-- Optional -->
    <template #message>
      Le bon fonctionnement de l'application peut nécessiter l'utilisation de cookies.
      <a href="/about">En savoir plus.</a>
    </template>

    <!-- Optional -->
    <template #declineContent>Je refuse!</template>

    <!-- Optional -->
    <template #acceptContent>J'accepte!</template>
  </vue-cookie-accept-decline>

</template>

<style>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
