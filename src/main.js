import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import 'primeicons/primeicons.css';

import { initializeApp } from "firebase/app";
import { VueFire, VueFireAuth } from 'vuefire'


const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "kavaleapp.com",
    projectId: "simaps",
    storageBucket: "simaps.appspot.com",
    messagingSenderId: "352736694151",
    appId: "1:352736694151:web:cd8679cb1681bbb9284d22",
    measurementId: "G-94TYCHPZTB"
  };

const firebaseApp = initializeApp(firebaseConfig);

const app = createApp(App)

app.use(router)

app.use(VueFire, {
    firebaseApp: firebaseApp,
    modules: [
      VueFireAuth(),
    ],
  })

app.mount('#app')