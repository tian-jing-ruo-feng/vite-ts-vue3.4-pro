<template>
	<el-container class="h-screen flex flex-col">
		<el-header class="p-0">
			<!-- 顶部栏目 -->
			<!-- 根据路由配置 routes，生成菜单栏，使用 elementplus 的 el-menu 组件 -->

			<el-menu
				:default-active="activeIndex"
				class="el-menu-demo"
				mode="horizontal"
				router
			>
				<el-menu-item
					v-for="route in routes[0].children"
					:key="route.path"
					:index="route.path"
				>
					{{ route.name }}
				</el-menu-item>
			</el-menu>
		</el-header>
		<el-main class="flex-1 overflow-auto bg-gray-100">
			<router-view />
		</el-main>
	</el-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { routes } from '@/router'

const activeIndex = routes[0].children![0].path
</script>

<style scoped lang="scss"></style>
