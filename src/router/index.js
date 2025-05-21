import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/views/HomePage.vue'
import AboutPage from '@/views/AboutPage.vue'
import MapComponent from '@/views/MapComponent.vue'
import HikeComponent from '@/views/HikeComponent.vue'
import HikeMap from '@/views/HikeMap.vue'

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
      path: '/maps/:zone',
      name: 'HikeMap',
      component: HikeMap,
      props: true,
    },
    {
      path: '/hikes/:id',
      name: 'HikeComponent',
      component: HikeComponent,
      props: true,
    },
  ]
})

export default router