import { createRouter, createWebHistory } from 'vue-router'
import AllFilms from '../views/AllFilms.vue'
import Film from '../components/Film.vue'
import Actors from '../components/Actors.vue'
import Actor from '../components/Actor.vue'
import NotFound from '../views/NotFound.vue'

const routes = [
  {
    path: '/films/:id',
    name: 'Film',
    component: Film,
    props: true,
  }, 
  {
    path: '/films',
    name: 'AllFilms',
    component: AllFilms,
  },

  {
    path: '/',
    redirect: 'films',
  },
  {
    path: '/actors',
    name: Actors,
    component: Actors,
  },
  {
    path: '/actors/:id',
    name: Actor,
    component: Actor,
    props: true,
  },
  {
    path: '/:catchAll(.*)',
    name: 'NotFound',
    component: NotFound,
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
