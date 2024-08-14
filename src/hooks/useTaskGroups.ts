import { TASK_GROUPS } from '../consts'
import { Tag as Group } from '../store/taskGroup'

type TaskGroups = Group[] | []

const useTaskGroups = () => {
	const getItem = () => {
		const taskGroups: TaskGroups = JSON.parse(
			localStorage.getItem(TASK_GROUPS) as string
		)
		const isExisted = taskGroups?.length
		return isExisted ? taskGroups : []
	}
	const setItem = (taskGroups: TaskGroups) =>
		localStorage.setItem(TASK_GROUPS, JSON.stringify(taskGroups))

	return {
		getItem,
		setItem
	}
}

export default useTaskGroups
