import { TASKS } from '../consts'
import { type Task } from '../views/todo/taskItem.vue'

type Tasks = Task[] | null

const useTodo = () => {
  const getItem = () => {
    const tasks: Tasks = JSON.parse(localStorage.getItem(TASKS) as string)
    const isExisted = tasks?.length
    return isExisted ? tasks : []
  }

  const setItem = (tasks: Tasks) => {
    localStorage.setItem(TASKS, JSON.stringify(tasks))
  }

  return {
    getItem,
    setItem
  }
}

export default useTodo
