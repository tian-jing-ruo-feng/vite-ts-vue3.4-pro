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
		// save2Local(localStorage.getItem(TASKS) as string)
	}

	const save2Local = (content: BlobPart) => {
		const fileName = 'tasks.json'
		const link = document.createElement('a')
		// 创建一个blob对象 并规定为.json类型
		const blob = new Blob([content], {
			type: 'application/json'
		})
		// 使新创建的a标签不可见
		link.style.display = 'none'
		link.download = fileName
		link.href = URL.createObjectURL(blob)
		document.body.appendChild(link)
		// 浏览器会自动执行对于文件流的下载
		link.click()
		URL.revokeObjectURL(link.href)
		document.body.removeChild(link)
	}

	return {
		getItem,
		setItem,
		save2Local
	}
}

export default useTodo
