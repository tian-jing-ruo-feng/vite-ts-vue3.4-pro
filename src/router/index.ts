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
      },
      {
        name: 'Draggable',
        path: 'draggable',
        component: () => import('../views/draggable/index.vue')
      },
      {
        name: 'Example',
        path: 'example',
        component: () => import('../views/example/List.vue')
      }
    ]
  },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: Home }
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
