import { createRouter, createWebHistory } from 'vue-router'
import Hosts from '../components/Hosts.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/hosts',
      name: 'Hosts',
      component: Hosts,
    },
  ]
})

export default router
