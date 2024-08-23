import { defineStore } from 'pinia'
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import { TASK_GROUP_ALL_TAG, TASKS } from '../consts'
import { type Tag } from './taskGroup'
import useTodo from '../hooks/useTodo'
import { Priority } from '../components/PriorityList.vue'
import { FormProps } from '@/views/todo/SearchForm.vue'

dayjs.extend(isBetween)

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
	priority?: Priority
	isTop?: boolean // 是否置顶
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
	const toTop = (task: Task) => {
		if (tasks.value?.length) {
			const taskIndex = tasks.value.findIndex(_task => _task.id === task.id)
			if (task.isTop) {
				// clear all task isTop prop
				tasks.value = tasks.value.map(item => {
					delete item.isTop
					return item
				})
				tasks.value.splice(taskIndex!, 1)
				tasks.value.unshift(task)
			} else {
				delete task.isTop
				tasks.value[taskIndex] = task
			}
		}
		setItem(tasks.value)
		return tasks
	}
	const searchTasks = (form: FormProps, resolveTasks: Tasks) => {
		const format = 'YYYY-MM-DD'
		const { createTime = 'day' } = form
		// filter task item createTime conform to timeRange
		const conformToTimeRange = (task: Task) => {
			const taskCreateTime = dayjs(task.createTime).format(format)
			if (createTime === 'day') {
				return dayjs().isSame(taskCreateTime, 'day')
			}
			if (createTime === 'weak') {
				return dayjs(taskCreateTime).isBetween(
					dayjs(),
					dayjs().subtract(7, 'day')
				)
			}
			if (createTime === 'month') {
				return dayjs(taskCreateTime).isBetween(
					dayjs(),
					dayjs().subtract(30, 'day')
				)
			}
		}
		return resolveTasks!.filter(task => conformToTimeRange(task))
	}

	return {
		tasks,
		tasksByGroupTag,
		tasksById,
		addTask,
		updateTask,
		toTop,
		searchTasks
	}
})
