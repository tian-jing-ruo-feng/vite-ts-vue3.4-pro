<template>
	<div class="priority-list">
		<el-popover placement="right" :teleported="false" trigger="click">
			<template #reference>
				<el-button text :disabled="disabled">优先级</el-button>
			</template>
			<ul class="priority-options">
				<li
					v-for="({ color, value, checked }, ind) in priorityList"
					:key="value"
					class="priority-item"
					@click="handlePriorityItemClick({ color, value, checked }, ind)"
				>
					<el-icon
						:color="color"
						class="priority-icon"
						style="vertical-align: middle"
					>
						<FaFlag></FaFlag>
					</el-icon>
					<span class="label"> 优先级 {{ value }} </span>
					<el-icon v-if="checked" class="check-icon" color="#95d475">
						<FaCheckCircleO></FaCheckCircleO>
					</el-icon>
				</li>
			</ul>
		</el-popover>
	</div>
</template>

<script setup lang="ts">
export interface Priority {
	checked: boolean
	color: string
	value: number
}
type Props = {
	priority?: Priority
	disabled?: boolean
}

defineOptions({
	name: 'PriorityList'
})

const props = defineProps<Props>()
const emits = defineEmits<{
	'priority-check': [priority: Priority]
}>()

const priorityPalette = [
	'#E63415',
	'#FF6600',
	'#FFDE0A',
	'#1EC79D',
	'#14CCCC',
	'#4167F0',
	'#6222C9'
]
// { checked: false, color: '#E63415', value: 1 },
const list = priorityPalette.map((color, ind) => {
	return { color, checked: false, value: ind + 1 }
})
const priorityList = ref(list)

const handlePriorityItemClick = (priority: Priority, ind: number) => {
	priorityList.value = priorityList.value.map((_p, pindex) => {
		_p.checked = pindex === ind ? !_p.checked : false
		return _p
	})
	emits('priority-check', { ...priority, checked: !priority.checked })
}

const init = () => {
	if (props.priority) {
		priorityList.value = priorityList.value.map(_p => {
			if (_p.value === props.priority!.value) {
				return props.priority
			}
			return _p
		}) as typeof list
	}
}
onMounted(() => {
	init()
})
</script>

<style scoped lang="scss">
.priority-list {
	&:deep(.el-popover.el-popper) {
		padding: 0;
	}
	.priority-options {
		padding: 0;
		margin: 0;
		.priority-item {
			position: relative;
			padding: 4px 6px;
			text-align: left;
			border-bottom: 1px solid rgba($color: #303133, $alpha: 0.1);
			cursor: pointer;
			&:last-of-type {
				border-bottom: none;
			}

			.priority-icon {
				vertical-align: middle;
			}

			.check-icon {
				position: absolute;
				top: 50%;
				right: 10px;
				transform: translateY(-50%);
				vertical-align: middle;
			}
		}
	}
}
</style>
