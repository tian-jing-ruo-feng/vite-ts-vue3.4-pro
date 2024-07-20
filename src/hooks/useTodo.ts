import { TASKS } from '../consts'

interface Task {
  name: string
  id: number
}
type Tasks = Task[] | null

const useTodo = () => {
  const tasks: Tasks = JSON.parse(localStorage.getItem(TASKS) as string)
  const isExisted = tasks?.length

  const getItem = () => {
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
