<template>
	<div class="todo-container">
		<el-card shadow="hover" class="todo-header">
			<div class="header-content">
				<el-icon class="title-icon"><ep-notebook /></el-icon>
				<h2 class="title">
					待办事项清单
					<el-tooltip :content="areaLabel" placement="top">
						<el-button
							circle
							plain
							class="toggle-button"
							@click="isChart = !isChart"
						>
							<el-icon>
								<ep-data-analysis v-if="isChart" />
								<ep-tickets v-else />
							</el-icon>
						</el-button>
					</el-tooltip>
				</h2>
			</div>
		</el-card>

		<transition name="fade" mode="out-in">
			<el-card v-if="isChart" shadow="hover" class="todo-content">
				<el-divider
					><el-icon><ep-pie-chart /></el-icon> 任务统计</el-divider
				>
				<TaskStatistics />
			</el-card>
		</transition>

		<transition name="fade" mode="out-in">
			<el-card v-if="!isChart" shadow="hover" class="todo-content">
				<task-group @select="handleTagSelected" />
				<el-divider
					><el-icon><ep-list /></el-icon> 任务列表</el-divider
				>
				<Editor
					class="task-editor"
					:height="'150px'"
					:edit-content="editContent"
					@cancel="handleEditorCancel"
					@confirm="handleEditorConfirm"
				/>
				<SearchForm v-if="tasks?.length" @search="handleSearchTasks" />
				<el-scrollbar :height="height">
					<Tasks
						:tasks="tasksUnderTag!"
						@edit="editTask"
						@remove="removeTask"
						@update="updateTask"
						@to-top="topTask"
					/>
				</el-scrollbar>
			</el-card>
		</transition>
	</div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import { v4 as uuidv4 } from 'uuid'
import { FormInstance, FormRules } from 'element-plus'
import Tasks from './tasks.vue'
import TaskGroup from './TaskGroup.vue'
import { Tag } from '../../store/taskGroup'
import Editor, { ConfirmEventArgType } from './Editor.vue'
import { Task, useTasksStore } from '../../store/tasks'
import { EditTaskType, type TaskUpdated } from './taskItem.vue'
import useTodo from '../../hooks/useTodo'
import { DATE_FORMAT, TASKS_TODO } from '../../consts'
import SearchForm, { FormProps } from './SearchForm.vue'
import TaskStatistics from './TasksStatistics.vue'

interface Form {
	task: string
}

const { getItem } = useTodo()
const store = useTasksStore()
const { tasks, tasksByGroupTag, tasksById } = storeToRefs(store)
const { addTask: add, updateTask: update, toTop, searchTasks } = store
const mainContent = inject<Ref<HTMLElement>>('mainContent')
const height = ref('60vh')

// area toggle
const useArea = () => {
	const isChart = ref(false)
	const areaLabel = computed(() => (isChart.value ? '工作区' : '统计视图'))

	return {
		isChart,
		areaLabel
	}
}

// task group
const useTaskGroup = () => {
	const tagSelected = ref<Tag>({
		id: 'all',
		name: '全部',
		checked: true,
		edited: false,
		color: '',
		isDeleted: false
	})

	const handleTagSelected = (tag: Tag) => {
		tagSelected.value = tag
	}

	return {
		tagSelected,
		handleTagSelected
	}
}

// Editor
const useEditor = () => {
	const inputTask = ref<HTMLInputElement>()
	const editContent = ref('')
	const currentEditId = ref('')
	const currentEditTask = ref<Task | null>()

	// clear current task edited
	const clearCurrentEditTask = () => {
		currentEditId.value = ''
		currentEditTask.value = null
	}

	const handleEditorCancel = () => {
		editContent.value = ''
		clearCurrentEditTask()
	}

	const handleEditorConfirm = (args: ConfirmEventArgType) => {
		const { text, html } = args
		if (currentEditId.value) {
			// edit a task
			const editedTask = tasks.value?.find(
				task => task.id === currentEditId.value
			)!
			update({
				...editedTask,
				html,
				name: text,
				updateTime: dayjs().format(DATE_FORMAT)
			})
			clearCurrentEditTask()
		} else {
			// add a new task
			add({
				name: text,
				html,
				id: uuidv4(),
				state: TASKS_TODO,
				groupTag: tagSelected.value?.id || 'all',
				createTime: dayjs().format(DATE_FORMAT)
			})
		}
	}

	return {
		inputTask,
		editContent,
		currentEditId,
		currentEditTask,
		handleEditorCancel,
		handleEditorConfirm
	}
}

// task list
const useTask = () => {
	const formRef = ref<FormInstance>()
	const form: Form = reactive({
		task: ''
	})
	const tasksUnderTag = computed(() =>
		searchTasks(searchForm, tasksByGroupTag.value(tagSelected.value!)!)
	)

	const validateTask = (rule: any, value: string, callback: any) => {
		if (value === '') {
			callback(new Error('请输入内容！'))
		} else {
			callback()
		}
	}
	const rules = reactive<FormRules<typeof form>>({
		task: {
			required: true,
			validator: validateTask,
			trigger: 'change'
		}
	})

	const findTaskIndexById = (id: string) =>
		getItem().findIndex((task: Task) => task.id === id)
	const editTask = (args: EditTaskType) => {
		const { html, id } = args
		currentEditId.value = id
		// record current edit task & index
		const taskIndex = findTaskIndexById(id)
		currentEditTask.value = tasks.value![taskIndex]
		// render task html in eidtor
		editContent.value = html
		mainContent?.value.scrollTo(0, 0)
	}

	const addTask = () => {
		formRef.value?.validate(isValid => {
			if (isValid) {
				const task: Task = {
					name: form.task,
					id: uuidv4(),
					state: TASKS_TODO,
					groupTag: tagSelected.value?.id || 'all',
					createTime: dayjs().format(DATE_FORMAT)
				}
				add(task)
				form.task = ''
				formRef.value?.resetFields()
			}
		})
	}

	const removeTask = (id: string) => {
		const updateTask = {
			...tasksById.value(id),
			isRemoved: true
		}
		update(updateTask)
	}

	const updateTask = (taskUpdated: TaskUpdated) => {
		update(taskUpdated)
	}

	const topTask = (task: Task) => toTop(task)

	return {
		formRef,
		form,
		tasksUnderTag,
		rules,
		editTask,
		addTask,
		removeTask,
		updateTask,
		topTask
	}
}

// search task
const useSearchTasks = () => {
	const searchForm: FormProps = reactive({
		createTime: 'day'
	})
	const handleSearchTasks = (formBody: FormProps) => {
		searchForm.createTime = formBody.createTime
	}

	return {
		searchForm,
		handleSearchTasks
	}
}

const { isChart, areaLabel } = useArea()
const { tagSelected, handleTagSelected } = useTaskGroup()
const {
	inputTask,
	editContent,
	currentEditId,
	currentEditTask,
	handleEditorCancel,
	handleEditorConfirm
} = useEditor()
const {
	formRef,
	form,
	rules,
	tasksUnderTag,
	editTask,
	addTask,
	removeTask,
	updateTask,
	topTask
} = useTask()

const { searchForm, handleSearchTasks } = useSearchTasks()

onMounted(() => {
	tasks.value = getItem()
	inputTask.value?.focus()
})
</script>

<style scoped lang="scss">
.todo-container {
	width: 80%;
	max-width: 1200px;
	margin: 0 auto;
	padding: 20px 0;

	.todo-header {
		margin-bottom: 20px;
		border-radius: 8px;

		.header-content {
			display: flex;
			align-items: center;
			justify-content: center;
			gap: 15px;

			.title-icon {
				font-size: 32px;
				color: var(--el-color-primary);
			}

			.title {
				display: flex;
				align-items: center;
				gap: 15px;
				font-size: 24px;
				font-weight: 500;
				margin: 0;

				.toggle-button {
					transition: all 0.3s ease;
					&:hover {
						transform: scale(1.1);
					}
				}
			}
		}
	}

	.todo-content {
		border-radius: 8px;
		margin-bottom: 20px;
		transition: all 0.3s ease;

		.task-editor {
			margin: 20px 0;
		}

		.el-divider {
			margin: 25px 0;

			.el-icon {
				margin-right: 8px;
				color: var(--el-color-primary);
			}
		}
	}
}

.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}
</style>
