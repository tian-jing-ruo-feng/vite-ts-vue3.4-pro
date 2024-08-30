import {
	createRouter,
	createWebHistory,
	createWebHashHistory,
	type RouteRecordRaw
} from 'vue-router'
import { name } from '../../package.json'

import Home from '../layout/Home.vue'

export const routes: RouteRecordRaw[] = [
	{
		name: 'Home',
		path: '/',
		component: Home,
		children: [
			{
				name: '待办',
				path: 'todo',
				component: () => import('../views/todo/index.vue')
			},
			{
				name: '拖拽',
				path: 'draggable',
				component: () => import('../views/draggable/index.vue')
			},
			{
				name: '测试案例',
				path: 'example',
				component: () => import('../views/example/index.vue'),
				children: [
					{
						name: 'List',
						path: 'list',
						component: () => import('../views/example/List.vue')
					},
					{
						name: 'ES6',
						path: 'es6',
						component: () => import('../views/example/ES6.vue')
					}
				]
			},
			{
				name: '日程',
				path: 'Calendar',
				component: () => import('../components/Calendar.vue')
			},
			{
				name: '文档',
				path: 'readme',
				component: () => import('../views/readme/index.vue')
			}
		]
	},
	{ path: '/:pathMatch(.*)*', name: 'NotFound', component: Home }
]
const history = createWebHashHistory(import.meta.env.BASE_URL)

const router = createRouter({
	history,
	routes
})

router.beforeEach((to, from) => {
	document.title = `${to.name as string}-${name}`
})

export default router
