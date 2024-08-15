<template>
	<div class="todo">
		<h2 class="title">TODO LIST</h2>
		<task-group @select="handleTagSelected"></task-group>
		<div v-if="false" class="add-area">
			<el-form
				ref="formRef"
				:inline="true"
				:model="form"
				:rules="rules"
				hide-required-asterisk
				class="demo-form-inline"
				@submit.prevent
			>
				<el-form-item label="添加任务：" prop="task">
					<el-input
						ref="inputTask"
						v-model.trim="form.task"
						type="textarea"
						class="input-task"
						clearable
						@keyup.enter="addTask"
					></el-input>
					<el-button class="add-button" @click="addTask">
						<el-icon color="green"><ep-plus></ep-plus></el-icon>
					</el-button>
				</el-form-item>
			</el-form>
		</div>
		<Editor
			:height="'150px'"
			:edit-content="editContent"
			@cancel="handleEditorCancel"
			@confirm="handleEditorConfirm"
		></Editor>
		<!-- operation button intro -->
		<el-divider> 任务列表 </el-divider>
		<el-scrollbar :height="height">
			<Tasks
				:tasks="tasksUnderTag!"
				@edit="editTask"
				@remove="removeTask"
				@update="updateTask"
				@to-top="topTask"
			></Tasks>
		</el-scrollbar>
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
import { EditTaskType, type Task, type TaskUpdated } from './taskItem.vue'
import useTodo from '../../hooks/useTodo'
import { useTasksStore } from '../../store/tasks'
import { DATE_FORMAT, TASKS_TODO } from '../../consts'

interface Form {
	task: string
}

const { getItem } = useTodo()
const store = useTasksStore()
const { tasks, tasksByGroupTag, tasksById } = storeToRefs(store)
const { addTask: add, updateTask: update, toTop } = store
const mainContent = inject<Ref<HTMLElement>>('mainContent')
const height = ref('60vh')

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
		tasksByGroupTag.value(tagSelected.value!)
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

onMounted(() => {
	tasks.value = getItem()
	inputTask.value?.focus()
})
</script>

<style scoped lang="scss">
.todo {
	display: flex;
	flex-direction: column;
	width: 75%;
	margin: 0 auto;
	.title {
		font-weight: bold;
		text-align: center;
		padding: 25px;
	}

	.add-area {
		.input-task,
		.add-button {
			display: inline-block;
		}
		.input-task {
			width: auto;
		}
	}
}
</style>
