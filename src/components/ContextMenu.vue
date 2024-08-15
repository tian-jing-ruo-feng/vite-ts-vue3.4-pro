<!-- eslint-disable vue/no-v-html -->
<template>
	<ul class="context-menu">
		<li
			v-for="(
				{ contextName, disabled, template, callback, task }, ind
			) in menuContexts"
			:key="`menu-context-item-${ind}`"
			class="menu-item"
		>
			<el-button
				v-if="!template"
				:disabled="disabled"
				text
				plain
				@click="handleMenuItemClick(callback)"
			>
				{{ contextName }}</el-button
			>
			<component
				:is="template"
				v-else
				:priority="task!.priority"
				@priority-check="(priority: Priority) => handleMenuItemClick(() => callback(priority))"
			></component>
		</li>
	</ul>
</template>

<script setup lang="ts">
import { type Component } from 'vue'
import { Priority } from './PriorityList.vue'
import { Task } from '../store/tasks'

export interface MenuContextItem {
	// label, callback
	contextName: string
	callback: (...args: any) => void
	disabled?: boolean
	template?: string | Component
	classList?: string[] | string
	task?: Task
}
export type MenuContexts = MenuContextItem[]
type Props = {
	menuContexts: MenuContexts
}
withDefaults(defineProps<Props>(), {
	menuContexts: () => [
		{
			contextName: '菜单名称',
			callback: () => {
				console.log('菜单被点击了')
			}
		}
	]
})
const emit = defineEmits(['menu-click'])

const handleMenuItemClick = (callback: MenuContextItem['callback']) => {
	callback()
	emit('menu-click')
}
</script>

<style lang="scss" scoped>
.context-menu {
	padding: 0;
	margin: 0;
	display: flex;
	flex-direction: column;
	background: #fff;
	box-shadow: var(--el-box-shadow-light);
	border: 1px solid rgba($color: #303133, $alpha: 0.1);

	& > .menu-item {
		flex: 1;
		min-width: 100px;
		text-align: center;
		border-bottom: 1px solid rgba($color: #303133, $alpha: 0.1);
		&:last-of-type {
			border-bottom: none;
		}

		&:deep(.el-button) {
			width: 100%;
			border-radius: 0;
		}
	}
}
</style>
