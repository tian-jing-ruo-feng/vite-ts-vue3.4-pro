<template>
	<div class="tasks-statistics">
		<SearchForm @search="filterTasks"></SearchForm>
		<div id="chart" ref="chartEle" style="width: 100%; height: 500px"></div>
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
import { TASK_GROUP_ALL_TAG } from '@/consts'
import { TasksArr } from './tasks.vue'

dayjs.extend(isBetween)

const taskStore = useTasksStore()
const taskGroupStore = useTaskGroupStore()
const { tasks } = storeToRefs(taskStore)
const { tags: taskGroups } = storeToRefs(taskGroupStore)

const chartEle = ref<HTMLElement>()
// const chartInstance = ref<ECharts>()
const chartInstance = shallowRef<ECharts>()
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
let maxValue = ref(0)
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
			max: maxValue.value + 5 - (maxValue.value % 5),
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
			// markPoint: {
			// 	data: [
			// 		{ type: 'max', name: 'Max' },
			// 		{ type: 'min', name: 'Min' }
			// 	]
			// },
			// markLine: {
			// 	data: [{ type: 'average', name: 'Avg' }]
			// }
		},
		{
			name: 'Evaporation',
			type: 'bar',
			data: [
				2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3
			]
			// markPoint: {
			// 	data: [
			// 		{ name: 'Max', value: 182.2, xAxis: 7, yAxis: 183 },
			// 		{ name: 'Min', value: 2.3, xAxis: 11, yAxis: 3 }
			// 	]
			// },
			// markLine: {
			// 	data: [{ type: 'average', name: 'Avg' }]
			// }
		}
	]
})

const getChartData = () => {
	// type DataType = {
	// 	name: string
	// 	type: string
	// 	data: number[]
	// }
	const duration = timeObj[timeFilterForm.value!.createTime].duration
	const xAxis: string[] = []
	// const series: DataType[] = []
	const series: any[] = []

	taskGroups.value.forEach(type => {
		series.push({
			name: type.name,
			type: 'bar',
			stack: 'one',
			data: []
		})
	})

	// 展示数据
	for (let ind = 0; ind < duration; ind++) {
		xAxis.push(dayjs().subtract(ind, 'day').format('YYYY-MM-DD'))
	}
	xAxis.reverse()

	// 过滤数据
	const weaklyTasks = tasks.value?.filter(item => {
		const { createTime } = item
		const isContain = dayjs(createTime).isBetween(
			dayjs(),
			dayjs().subtract(duration, 'day')
		)
		return isContain
	})

	// 获取对应日期 不同分类 的 任务数量统计
	xAxis.forEach(date => {
		const tasksFilterd = weaklyTasks?.filter(task =>
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

const filterTasks = (searchForm: FormProps) => {
	timeFilterForm.value = searchForm
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
			text: timeObj[timeFilterForm.value!.createTime].label + '任务统计',
			left: 'center'
		}
	}
	if (chartInstance.value) {
		chartInstance.value?.setOption(options)
	}
}

const initChart = () => {
	const { xAxis, series } = getChartData()
	options.xAxis = [{ type: 'category', data: xAxis }]
	options.series = series
	if (options?.title) {
		options.title = {
			text: timeObj[timeFilterForm.value!.createTime].label + '任务统计',
			left: 'center'
		}
	}
	const barChart = echarts.init(chartEle.value) as ECharts
	chartInstance.value = barChart
	barChart.setOption(options)
}

const resizeChart = () => {
	if (chartInstance.value) {
		chartInstance.value.resize()
	}
}
onMounted(async () => {
	await nextTick()
	initChart()

	window.addEventListener('resize', resizeChart)
})

onUnmounted(() => {
	window.removeEventListener('resize', resizeChart)
})
</script>

<style lang="scss" scoped></style>
