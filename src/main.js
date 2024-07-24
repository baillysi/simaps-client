import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import 'primeicons/primeicons.css';

import { VueFire, VueFireAuth } from 'vuefire';
import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyBf9TOdLhh2oLzs15EdTsglsneSTFJJ_y8",
    authDomain: "kavaleapp.com",
    projectId: "simaps",
    storageBucket: "simaps.appspot.com",
    messagingSenderId: "352736694151",
    appId: "1:352736694151:web:cd8679cb1681bbb9284d22",
    measurementId: "G-94TYCHPZTB"
  };

const firebaseApp = initializeApp(firebaseConfig)

const app = createApp(App)

app.use(VueFire, {
    firebaseApp,
    modules: [
      // can be accessed in any component
      VueFireAuth(),
    ],
  })

app.use(router)
app.mount('#app')