import { createRouter, createWebHistory } from 'vue-router'
import { type RouteRecordRaw } from 'vue-router'

import Home from '../layout/Home.vue'

export const routes: RouteRecordRaw[] = [
  {
    name: 'Home',
    path: '/',
    component: Home,
    children: [
      {
        name: 'Todo',
        path: 'todo',
        component: () => import('../views/todo/index.vue')
      }
    ]
  }
]
const history = createWebHistory()

const router = createRouter({
  history,
  routes
})

export default router
