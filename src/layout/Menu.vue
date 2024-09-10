<template>
	<div class="menu-list">
		<el-menu
			router
			:default-active="active"
			class="el-menu-demo"
			mode="horizontal"
			background-color="#545c64"
			text-color="#fff"
			active-text-color="#ffd04b"
			@select="handleSelect"
		>
			<el-menu-item
				v-for="(route, index) in curRoutes"
				:key="`router${index}`"
				:index="route.path"
			>
				{{ route.name }}
			</el-menu-item>
		</el-menu>
	</div>
</template>

<script setup lang="ts">
import { routes } from '../router/index'

const userInfo = JSON.parse(localStorage.getItem('userInfo')!)
const userRole = userInfo!.role

const $router = useRouter()
const $route = useRoute()
const curRoutes = (routes[0].children || []).filter(route => {
	const auth = route?.meta?.auth as number[]
	return auth.includes(userRole)
})
const firstRoute = curRoutes[0]
const active = ref(firstRoute!.path)
$router.push(`/${active.value}`)
const handleSelect = (key: string, keyPath?: string[]) => {
	active.value = key
	$router.push(`/${active.value}`)
}
const handleLoad = () => {
	handleSelect($route.fullPath)
}

onMounted(() => {
	window.addEventListener('onunload', handleLoad)
})
onBeforeMount(() => {
	window.removeEventListener('onunload', handleLoad)
})
</script>

<style scoped></style>
