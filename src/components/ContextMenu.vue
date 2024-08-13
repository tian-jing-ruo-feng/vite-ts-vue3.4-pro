<template>
	<ul class="context-menu">
		<li
			v-for="(
				{ contextName, disabled, classList, callback }, ind
			) in menuContexts"
			:key="`menu-context-item-${ind}`"
			class="menu-item"
		>
			<el-button
				:disabled="disabled"
				text
				plain
				@click="handleMenuItemClick(callback)"
			>
				{{ contextName }}</el-button
			>
		</li>
	</ul>
</template>

<script setup lang="ts">
export interface MenuContextItem {
	// label, callback
	contextName: string
	callback: () => void
	disabled?: boolean
	classList?: string[] | string
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

const handleMenuItemClick = (callback: () => void) => {
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
