<template>
	<div class="group-priority">
		<el-badge
			:value="priority.value"
			:offset="[10, 10]"
			:color="priority.color"
			style="vertical-align: middle"
		>
			<el-icon :color="priority.color" size="18" class="priority-icon">
				<FaFlag></FaFlag>
			</el-icon>
		</el-badge>
	</div>
</template>

<script setup lang="ts">
import { Priority } from '../../components/PriorityList.vue'

type Props = {
	priority: Priority
}
defineProps<Props>()
</script>

<style lang="scss" scoped>
.priority-icon {
	vertical-align: text-top;
}
</style>
