import { defineStore } from 'pinia'
import { TASKS } from '../consts'
import { type Task } from '../views/todo/taskItem.vue'
import { type Tag } from '../views/todo/TaskGroup.vue'
import useTodo from '../hooks/useTodo'
const { getItem, setItem } = useTodo()

type Tasks = Task[] | null
export const useTasksStore = defineStore('tasks ', {
  state: () => {
    return {
      tasks: ref<Tasks>(getItem())
    }
  },
  getters: {
    getTasksByGroupTag: (state) => {
      return (tag: Tag) =>
        state.tasks?.filter((task) => task.groupTag === tag.id)
    },
    getTaskById: (state) => {
      return (id: Task['id']) =>
        state.tasks?.filter((task) => task.id === id)[0]
    }
  },
  actions: {
    addTask(task: Task) {
      this.tasks?.push(task)
      setItem(this.tasks)
      return this.tasks
    },
    // update & delete
    updateTask(task: Partial<Task>) {
      this.tasks = this.tasks?.map((originTask) => {
        if (originTask.id === task.id) {
          return {
            ...originTask,
            ...task
          }
        } else {
          return originTask
        }
      })!
      setItem(this.tasks)
      return this.tasks
    }
  }
})
