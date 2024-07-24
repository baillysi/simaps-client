import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import 'primeicons/primeicons.css'

import { createAuth0 } from '@auth0/auth0-vue';

const app = createApp(App)

app.use(router)

app.use(
  createAuth0({
    domain: "dev-adpzgmbjii3q1bxe.us.auth0.com",
    clientId: "DaMN3UO8HoV04Aw2NKHw7FWueXPAMSFQ",
    authorizationParams: {
      redirect_uri: window.location.origin
    }
  })
);

app.mount('#app')