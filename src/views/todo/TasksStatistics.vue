<template>
	<div class="tasks-statistics">
		<SearchForm @search="filterTasks"></SearchForm>
		<el-space fill wrap :fill-ratio="45" style="width: 100%" size="large">
			<el-card :body-style="{ width: '100%' }" shadow="hover">
				<template #header>任务状态</template>
				<div
					id="task-state"
					ref="taskStateRef"
					style="width: 100%; height: 350px"
				></div>
			</el-card>
			<el-card :body-style="{ width: '100%' }" shadow="hover">
				<template #header>任务统计</template>
				<div id="chart" ref="chartEle" style="width: 100%; height: 350px"></div>
			</el-card>
		</el-space>
	</div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts'
import { ECharts, EChartsOption } from 'echarts'
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import { useTasksStore } from '@/store/tasks'
import { useTaskGroupStore } from '@/store/taskGroup'
import SearchForm, { FormProps } from './SearchForm.vue'
import {
	TASK_GROUP_ALL_TAG,
	TASKS_ARCHIVE,
	TASKS_DONE,
	TASKS_TODO
} from '@/consts'
import { TasksArr } from './tasks.vue'

dayjs.extend(isBetween)

const taskStore = useTasksStore()
const taskGroupStore = useTaskGroupStore()
const { tasks } = storeToRefs(taskStore)
const { tags: taskGroups } = storeToRefs(taskGroupStore)

const timeFilterForm = ref<FormProps>()
const timeObj = {
	day: {
		label: '今日',
		duration: 1
	},
	weak: {
		label: '近一周',
		duration: 7
	},
	month: {
		label: '近一月',
		duration: 30
	}
}

const useTaskStatistics = () => {
	const maxValue = ref(0)
	const max = computed(() => {
		if (Array.isArray(options.series) && options.series?.length) {
			const maxRes = options.series.reduce(
				(prev, item) => prev + Math.max(...(item.data as number[])),
				0
			)
			return (Math.floor(maxRes / 5) + 1) * 5
		}
		return 5
	})
	const chartEle = ref<HTMLElement>()
	const chartInstance = shallowRef<ECharts>()

	const options: EChartsOption = reactive({
		title: {
			text: '',
			left: 'center'
		},
		tooltip: {
			trigger: 'axis'
		},
		legend: {
			show: true,
			right: '10%',
			top: 20
		},
		toolbox: {
			show: false,
			feature: {
				dataView: { show: true, readOnly: false },
				magicType: { show: true, type: ['line', 'bar'] },
				restore: { show: true },
				saveAsImage: { show: true }
			}
		},
		xAxis: [
			{
				type: 'category',
				data: []
			}
		],
		yAxis: [
			{
				name: '个',
				nameLocation: 'end',
				nameGap: 20,
				nameTextStyle: {
					align: 'right'
				},
				type: 'value',
				min: 0,
				max,
				minInterval: 1,
				splitNumber: 5
			}
		],
		series: [
			{
				name: 'Rainfall',
				type: 'bar',
				data: [
					2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3
				]
			},
			{
				name: 'Evaporation',
				type: 'bar',
				data: [
					2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3
				]
			}
		]
	})

	const getChartData = () => {
		const { duration } = timeObj[timeFilterForm.value!.createTime]
		const xAxis: string[] = []
		const series: any[] = []

		taskGroups.value.forEach(type => {
			if (type.id !== 'all') {
				series.push({
					name: type.name,
					type: 'bar',
					stack: 'one',
					data: []
				})
			} else {
				series.push({
					name: type.name,
					type: 'line',
					itemStyle: {
						color: '#fc8452'
					},
					data: []
				})
			}
		})

		// 展示数据
		for (let ind = 0; ind < duration; ind++) {
			xAxis.push(dayjs().subtract(ind, 'day').format('YYYY-MM-DD'))
		}
		xAxis.reverse()

		// 过滤数据
		const tasksOfTimePeriod = tasks.value?.filter(item => {
			if (item.isRemoved) return false
			const { createTime } = item
			let isContain = false
			if (duration === 1) {
				isContain = dayjs(createTime).isBetween(dayjs().startOf('day'), dayjs())
			} else {
				isContain = dayjs(createTime).isBetween(
					dayjs(),
					dayjs().subtract(duration, 'day')
				)
			}
			return isContain
		})

		// 获取对应日期 不同分类 的 任务数量统计
		xAxis.forEach(date => {
			const tasksFilterd = tasksOfTimePeriod?.filter(task =>
				dayjs(date).isSame(dayjs(task.createTime).format('YYYY-MM-DD'))
			)
			// 获取对应分类任务统计数据
			taskGroups.value.forEach(({ id }, ind) => {
				const isAll = id === TASK_GROUP_ALL_TAG
				let typeTasks: TasksArr | undefined = []
				if (!isAll) {
					typeTasks = tasksFilterd?.filter(task => task.groupTag === id)
				} else {
					typeTasks = tasksFilterd
				}
				const count = typeTasks ? typeTasks.length : 0
				series[ind].data.push(count)
				// 计算最大值
				maxValue.value = maxValue.value > count ? maxValue.value : count
			})
		})

		return {
			xAxis,
			series
		}
	}

	const initTaskStatisticsChart = () => {
		const { xAxis, series } = getChartData()
		options.xAxis = [{ type: 'category', data: xAxis }]
		options.series = series
		if (options?.title) {
			options.title = {
				text: `${timeObj[timeFilterForm.value!.createTime].label}任务统计`,
				left: 'center'
			}
		}
		const barChart = echarts.init(chartEle.value) as ECharts
		chartInstance.value = barChart
		barChart.setOption(options)
	}

	return {
		maxValue,
		max,
		options,
		chartEle,
		chartInstance,
		initTaskStatisticsChart,
		getChartData
	}
}

const {
	initTaskStatisticsChart,
	getChartData,
	chartEle,
	chartInstance,
	options
} = useTaskStatistics()

const filterTasks = (searchForm: FormProps) => {
	timeFilterForm.value = searchForm
	// 任务统计
	const { xAxis, series } = getChartData()
	options.xAxis = [
		{
			type: 'category',
			data: xAxis,
			axisLabel: { rotate: xAxis.length > 7 ? -45 : 0 }
		}
	]
	options.series = series
	if (options?.title) {
		options.title = {
			text: `${timeObj[timeFilterForm.value!.createTime].label}任务统计`,
			left: 'center'
		}
	}
	if (chartInstance.value) {
		chartInstance.value?.setOption(options)
	}

	// 任务状态统计
	drawTaskStateChart()
}

const resizeChart = () => {
	if (chartInstance.value) {
		chartInstance.value.resize()
	}
	if (taskStateChartInstance.value) {
		taskStateChartInstance.value.resize()
	}
}

const useTaskState = () => {
	const taskStateChartInstance = shallowRef<ECharts>()
	const max = ref(0)
	const taskStateChartOption: EChartsOption = reactive({
		title: [
			{
				text: '任务状态统计',
				left: 'center'
			}
		],
		legend: {
			show: true,
			right: '10%',
			top: 20
		},
		yAxis: [
			{
				name: '个',
				nameLocation: 'end',
				nameGap: 20,
				nameTextStyle: {
					align: 'right'
				},
				type: 'value',
				min: 0,
				max,
				minInterval: 1,
				splitNumber: 5
			}
		],
		xAxis: {
			type: 'category',
			data: ['计划任务', '完成任务', '归档任务']
		},
		tooltip: {},
		series: [
			{
				type: 'bar',
				data: [
					{
						value: 0,
						itemStyle: {
							color: '#67c23a'
						}
					},
					{
						value: 0,
						itemStyle: {
							color: '#008000'
						}
					},
					{
						value: 0,
						itemStyle: {
							color: '#41b883'
						}
					}
				]
			}
		]
	})

	const handleTaskStateChartOption = () => {
		// 过滤数据
		const { duration } = timeObj[timeFilterForm.value!.createTime]
		const tasksOfTimePeriod = tasks.value?.filter(item => {
			if (item.isRemoved) return false
			const { createTime } = item
			let isContain = false
			if (duration === 1) {
				isContain = dayjs(createTime).isBetween(dayjs().startOf('day'), dayjs())
			} else {
				isContain = dayjs(createTime).isBetween(
					dayjs(),
					dayjs().subtract(duration, 'day')
				)
			}
			return isContain
		})
		if (tasksOfTimePeriod?.length) {
			const { series } = toRefs(taskStateChartOption)
			if (Array.isArray(series?.value)) {
				const seriesData = series.value[0].data as {
					value: number
					itemStyle: { color: string }
				}[]
				;[TASKS_TODO, TASKS_DONE, TASKS_ARCHIVE].forEach((state, ind) => {
					seriesData[ind].value = tasksOfTimePeriod.filter(
						task => task.state === state
					)?.length
				})
				const maxRes = Math.max(...seriesData.map(item => item.value))
				max.value = (Math.floor(maxRes / 5) + 1) * 5
			}
		}
	}

	const taskStateRef = ref<HTMLElement>()
	const drawTaskStateChart = () => {
		handleTaskStateChartOption()
		if (taskStateChartInstance.value) {
			taskStateChartInstance.value.setOption(taskStateChartOption)
		} else {
			taskStateChartInstance.value = echarts.init(taskStateRef.value) as ECharts
			taskStateChartInstance.value.setOption(taskStateChartOption)
		}
	}

	return {
		drawTaskStateChart,
		taskStateRef,
		taskStateChartInstance
	}
}

const { drawTaskStateChart, taskStateRef, taskStateChartInstance } =
	useTaskState()

onMounted(async () => {
	await nextTick()
	initTaskStatisticsChart()
	drawTaskStateChart()

	window.addEventListener('resize', resizeChart)
})

onUnmounted(() => {
	window.removeEventListener('resize', resizeChart)
})
</script>

<style lang="scss" scoped></style>
