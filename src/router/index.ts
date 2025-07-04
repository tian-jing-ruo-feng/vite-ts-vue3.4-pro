import {
	createRouter,
	createWebHashHistory,
	type RouteRecordRaw
} from 'vue-router'
import { name } from '../../package.json'

import Home from '../layout/Home.vue'
import Main from '../layout/Main.vue'

/**
 * meta: { auth: number }
 * auth: [0, 1] | 1
 * 0: 游客
 * 1: 用户登录
 */
export const routes: RouteRecordRaw[] = [
	{
		name: 'Home',
		path: '/',
		// component: Home,
		component: Main,
		children: [
			{
				name: '待办',
				path: 'todo',
				component: () => import('../views/todo/index.vue'),
				meta: {
					auth: [0, 1]
				}
			},
			{
				name: '拖拽',
				path: 'draggable',
				component: () => import('../views/draggable/index.vue'),
				meta: {
					auth: [1]
				}
			},
			{
				name: '测试案例',
				path: 'example',
				component: () => import('../views/example/index.vue'),
				meta: {
					auth: [1]
				},
				children: [
					{
						name: 'List',
						path: 'list',
						component: () => import('../views/example/List.vue'),
						meta: {
							auth: [1]
						}
					},
					{
						name: 'ES6',
						path: 'es6',
						component: () => import('../views/example/ES6.vue'),
						meta: {
							auth: [1]
						}
					}
				]
			},
			{
				name: '日程',
				path: 'Calendar',
				component: () => import('../components/Calendar.vue'),
				meta: {
					auth: [0, 1]
				}
			},
			{
				name: 'markdonw编辑器',
				path: 'markdonw-editor',
				component: () => import('../views/markdownEditor/index.vue'),
				meta: {
					auth: [0, 1]
				}
			},
			{
				name: '文档',
				path: 'readme',
				component: () => import('../views/readme/index.vue'),
				meta: {
					auth: [0, 1]
				}
			},
			{
				name: '个人中心',
				path: 'profile',
				component: () => import('../layout/Profile.vue'),
				meta: {
					auth: [1]
				}
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
	// TODO 后台 routes 判断截取
	// 判断是否为游客，
	// 游客不能访问auth 为 1
	document.title = `${to.name as string}-${name}`
})

export default router
