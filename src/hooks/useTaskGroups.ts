import { TASK_GROUPS } from '../consts'
import { type Tag as Group } from '../components/TaskGroup.vue'

type TaskGroups = Group[] | []
const useTaskGroups = () => {
  const taskGroups: TaskGroups = JSON.parse(
    localStorage.getItem(TASK_GROUPS) as string
  )
  const isExisted = taskGroups?.length
  const getItem = () => (isExisted ? taskGroups : [])
  const setItem = (taskGroups: TaskGroups) =>
    localStorage.setItem(TASK_GROUPS, JSON.stringify(taskGroups))

  return {
    getItem,
    setItem
  }
}

export default useTaskGroups
