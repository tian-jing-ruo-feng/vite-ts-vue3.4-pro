<template>
	<div class="example">
		<el-breadcrumb separator="/" class="custom-bread">
			<el-breadcrumb-item>{{ parentName }}</el-breadcrumb-item>
			<el-breadcrumb-item
				:key="nextPath"
				ref="nextPathRef"
				:to="{ path: nextPath }"
			>
				<el-dropdown @command="handleItemClick">
					<span class="el-dropdown-link">
						{{ childPath }}
						<el-icon class="el-icon--right">
							<ArrowDown />
						</el-icon>
					</span>
					<template #dropdown>
						<el-dropdown-menu>
							<el-dropdown-item
								v-for="{ path, name } in children"
								:key="path"
								:command="path"
								>{{ name }}</el-dropdown-item
							>
						</el-dropdown-menu>
					</template>
				</el-dropdown>
			</el-breadcrumb-item>
		</el-breadcrumb>
		<router-view></router-view>
	</div>
</template>

<script setup lang="ts">
import { RouteRecordRaw } from 'vue-router'
import { ArrowDown } from '@element-plus/icons-vue'
import { ElBreadcrumbItem } from 'element-plus'
import { routes } from '../../router'

const exampleRoute: RouteRecordRaw = routes[0].children!.filter(
	route => route.path === 'example'
)[0]
const { name: parentName, path: ParentPath, children } = exampleRoute
const childPath = ref(children![0].path)
const nextPathRef = ref<InstanceType<typeof ElBreadcrumbItem>>()
const nextPath = computed(() => `/${ParentPath}/${childPath.value}`)

const handleItemClick = (command: string) => {
	childPath.value = command
	nextTick(() => {
		const refs = nextPathRef.value!.$refs as { link: HTMLElement }
		const { link } = refs
		link.click()
	})
}

onMounted(() => {
	handleItemClick(childPath.value)
})
</script>

<style scoped>
.el-dropdown-link {
	cursor: pointer;
	font-weight: bold;
	color: var(--el-color-primary);
	display: flex;
	align-items: center;
}
</style>
<style scoped lang="scss">
.example {
	.custom-bread {
		margin-bottom: 24px;
	}
}
</style>
