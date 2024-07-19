import { createRouter, createWebHistory } from 'vue-router'
import { type RouteRecordRaw } from 'vue-router'

import Home from '../layout/Home.vue'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    children: [
      {
        path: 'todo',
        name: 'Todo',
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
