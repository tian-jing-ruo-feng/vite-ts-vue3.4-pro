<template>
	<div class="tasks">
		<el-collapse v-if="tasks?.length" v-model="activeNames">
			<el-collapse-item
				v-for="(state, stateInd) in Object.keys(TaskStates)"
				:key="state"
				class="task-collapse-item"
				:class="[`task-collapse-${state}`]"
				:title="TaskStates[state as TaskState]"
				:name="state"
			>
				<template #title>
					{{ TaskStates[state as TaskState] }}
					<span class="task-statistics">
						共（{{ getTasksNotDeleted(state as TaskState).length }}）项任务
					</span>
				</template>
				<div v-if="getTasksByState(state as TaskState)">
					<task-item
						v-for="(task, ind) in getTasksNotDeleted(state as TaskState)"
						ref="taskItemRef"
						:key="task.id"
						:task="task"
						@edit-task="handleEditTask"
						@delete-task="handleDeleteTask"
						@change-task-state="handleChangeTaskState"
						@contextmenu="handleContextMenu($event, task, ind, stateInd)"
					></task-item>
				</div>
				<div v-else>
					<el-empty
						:image-size="50"
						description=" "
						style="height: 50px; padding: 0"
					/>
				</div>
			</el-collapse-item>
		</el-collapse>

		<div v-else style="text-align: center">
			<el-empty :image-size="200" description="暂无任务" />
		</div>
		<!-- contextmenu -->
		<context-menu
			v-if="showContextMenu"
			ref="contextMenuRef"
			class="task-context-menu"
			:style="contextMenuStyle"
			:menu-contexts="menus"
			@menu-click="showContextMenu = false"
		></context-menu>
	</div>
</template>

<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'
import dayjs from 'dayjs'
import {
	DATE_FORMAT,
	TASKS_ARCHIVE,
	TASKS_DONE,
	TASKS_TODO
} from '../../consts'
import { Task } from '../../store/tasks'
import taskItem, {
	type TaskUpdated,
	type TaskState,
	EditTaskType
} from './taskItem.vue'
import ContextMenu, { MenuContexts } from '../../components/ContextMenu.vue'
import PriorityList, { Priority } from '../../components/PriorityList.vue'

export type TasksArr = Task[]
interface Props {
	tasks: TasksArr
}

const props = withDefaults(defineProps<Props>(), {
	tasks: () => [{ name: '任务', id: 'aaaa' }]
})

const emit = defineEmits<{
	edit: [EditTaskType]
	remove: [id: string]
	update: [updateTask: TaskUpdated]
	toTop: [task: Task]
}>()

type ST = {
	[key in TaskState]: string
}
const TaskStates: ST = {
	[TASKS_TODO]: '计划任务',
	[TASKS_DONE]: '完成任务',
	[TASKS_ARCHIVE]: '归档任务'
}
const activeNames = ref(TASKS_TODO)

const useContextMenu = () => {
	const showContextMenu = ref(false)
	const contextMenuRef = ref<HTMLElement>()
	const contextMenuStyle = ref({
		left: '0px',
		top: '0px'
	})
	const menus = ref<MenuContexts>([])

	const handleContextMenu = (
		e: MouseEvent,
		task: Task,
		ind: number,
		stateInd: number
	) => {
		e.preventDefault()
		showContextMenu.value = false
		const typeHeight = () => {
			let h = 0
			if (stateInd) {
				for (let index = 0; index < stateInd; index++) {
					h +=
						getTasksNotDeleted(Object.keys(TaskStates)[index] as TaskState)
							.length *
							130 +
						74
				}
			}
			return h
		}
		contextMenuStyle.value = {
			left: `${e.offsetX + 10}px`,
			top: `${e.offsetY + 20 + typeHeight() + ind * 130}px`
		}
		showContextMenu.value = true
		const { id, state } = task
		const isArchive = state === TASKS_ARCHIVE
		const isTodo = state === TASKS_TODO
		const updateTask = { id, updateTime: dayjs().format(DATE_FORMAT) }
		const topTitle = task.isTop ? '取消置顶' : '置顶'
		menus.value = [
			{
				contextName: '归档',
				disabled: isArchive || isTodo,
				callback: () =>
					emit('update', {
						state: TASKS_ARCHIVE,
						...updateTask
					})
			},
			{
				contextName: topTitle,
				disabled: !isTodo,
				callback: () => emit('toTop', { ...task, isTop: !task.isTop })
			},
			{
				contextName: '优先级',
				disabled: !isTodo,
				task,
				template: shallowRef(PriorityList),
				callback: (priority: Priority) => {
					if (priority.checked) {
						emit('update', {
							...updateTask,
							state: TASKS_TODO,
							priority
						})
					} else {
						emit('update', {
							...updateTask,
							state: TASKS_TODO,
							priority: undefined
						})
					}
				}
			},
			{
				contextName: '删除',
				disabled: !isTodo,
				callback: () => emit('remove', id)
			}
		]
	}

	onClickOutside(contextMenuRef, () => {
		showContextMenu.value = false
	})

	return {
		showContextMenu,
		contextMenuStyle,
		menus,
		contextMenuRef,
		handleContextMenu
	}
}
const {
	showContextMenu,
	contextMenuStyle,
	menus,
	contextMenuRef,
	handleContextMenu
} = useContextMenu()

const getTasksByState = (state: TaskState) => {
	return props.tasks.filter(task => task.state === state)
}

const getTasksNotDeleted = (state: TaskState) => {
	return getTasksByState(state).filter(task => !task.isRemoved)
}

const handleEditTask = (args: EditTaskType) => {
	emit('edit', args)
}
const handleDeleteTask = (taskId: string) => {
	emit('remove', taskId)
}
const handleChangeTaskState = (updateTask: TaskUpdated) => {
	emit('update', updateTask)
}
</script>

<style scoped lang="scss">
.tasks {
	position: relative;
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	height: 100%;
	margin-top: 20px;

	&:deep(.task-collapse-item) {
		// position: relative;
		.el-collapse-item__header {
			padding: 0 1%;
			font-size: 14px;
			font-weight: bold;

			.task-statistics {
				margin: -10px 0 0 10px;
				font-size: 12px;
				font-weight: normal;
				color: var(--el-color-info);
			}
		}

		&.task-collapse-todo .el-collapse-item__header {
			background: rgba($color: $state-todo, $alpha: 0.2);
		}
		&.task-collapse-done .el-collapse-item__header {
			background: rgba($color: $state-done, $alpha: 0.2);
		}
		&.task-collapse-archive .el-collapse-item__header {
			background: rgba($color: $state-archive, $alpha: 0.2);
		}
	}

	.task-context-menu {
		position: absolute;
	}
}
</style>
