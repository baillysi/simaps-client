import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/views/HomePage.vue'
import AboutPage from '@/views/AboutPage.vue'
import MapsPage from '@/views/MapsPage.vue'
import MapDetails from '@/components/MapDetails.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomePage,
    },
    {
      path: '/about',
      name: 'About',
      component: AboutPage,
    },
    {
      path: '/maps',
      name: 'Maps',
      component: MapsPage,
    },
    {
      path: '/maps/:zone',
      name: 'MapDetails',
      component: MapDetails,
      props: true,
    },
  ]
})

export default router