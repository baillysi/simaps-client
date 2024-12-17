<script setup>

import VueCookieAcceptDecline from 'vue-cookie-accept-decline';
import 'vue-cookie-accept-decline/dist/vue-cookie-accept-decline.css';

import { RouterView } from 'vue-router'
import AppHeader from './components/AppHeader.vue'

</script>

<template>
  <AppHeader />

  <router-view v-slot="{ Component }">
    <keep-alive>
      <component :is="Component" :key="$route.fullPath"></component>
    </keep-alive>
  </router-view>

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

* {
    outline: none;
}

#app {
  min-height: 100vh; /* This means "100% of the viewport height" */
  overflow-x: hidden; /* To prevent horizontal scroll bar */
  display: grid;
  grid-template-rows: [header] auto [content] 1fr [footer];
}

#cookconsent {
  color:#3C002E !important;
}

.cookie__floating__buttons__button--accept:hover {
  background-color:#FF803D !important;
  color:#fff !important;
}

.cookie__floating__buttons__button--accept {
  background-color:#fff !important;
  color: #FF803D !important;
}

</style>
