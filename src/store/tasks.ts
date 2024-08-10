import { defineStore } from 'pinia'
import { TASK_GROUP_ALL_TAG, TASKS } from '../consts'
import { type Tag } from './taskGroup'
import useTodo from '../hooks/useTodo'

const { setItem, getItem } = useTodo()

type Tasks = Task[] | null
export type TaskState = 'done' | 'todo' | 'archive'
export interface Task {
	name: string
	html?: string
	id: string
	state?: TaskState
	isRemoved?: boolean
	groupTag?: Tag['id']
	createTime?: string
	updateTime?: string
	expectStartTime?: string
	expectEndTime?: string
}

export const useTasksStore = defineStore(TASKS, () => {
	// state
	const tasks = ref<Tasks>(getItem())

	// getters
	const tasksByGroupTag = computed(() => (tag: Tag) => {
		if (tag.id === TASK_GROUP_ALL_TAG) {
			return tasks.value
		}
		return tasks.value?.filter(task => task.groupTag === tag.id)
	})
	const tasksById = computed(
		() => (id: Task['id']) => tasks.value?.filter(task => task.id === id)[0]
	)

	// actions
	const addTask = (task: Task) => {
		tasks.value?.push(task)
		setItem(tasks.value)
		return tasks
	}
	const updateTask = (task: Partial<Task>) => {
		tasks.value = tasks.value?.map(originTask => {
			if (originTask.id === task.id) {
				return {
					...originTask,
					...task
				}
			}
			return originTask
		})!
		setItem(tasks.value)
		return tasks
	}

	return {
		tasks,
		tasksByGroupTag,
		tasksById,
		addTask,
		updateTask
	}
})
