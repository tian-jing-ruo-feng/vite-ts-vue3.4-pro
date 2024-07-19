import { createRouter, createWebHistory } from 'vue-router'
import { type RouteRecordRaw } from 'vue-router'
import { name } from '../../package.json'

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

router.beforeEach((to, from) => {
  document.title = (to.name as string) + '-' + name
})

export default router
