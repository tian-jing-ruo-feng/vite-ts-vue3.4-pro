<template>
	<div class="tasks-statistics">
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

dayjs.extend(isBetween)

const taskStore = useTasksStore()
const taskGroupStore = useTaskGroupStore()
const { tasks } = storeToRefs(taskStore)
const { tags: taskGroups } = storeToRefs(taskGroupStore)

const chartEle = ref<HTMLElement>()

const options: EChartsOption = reactive({
	title: {
		text: '近一周任务统计',
		left: 'center'
	},
	tooltip: {
		trigger: 'axis'
	},
	legend: {
		show: true,
		left: '10%',
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
	calculable: true,
	xAxis: [
		{
			type: 'category',
			data: []
		}
	],
	yAxis: [
		{
			type: 'value'
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
	const xAxis: string[] = []
	// const series: DataType[] = []
	const series: any[] = []

	taskGroups.value.forEach(type => {
		series.push({
			name: type.name,
			type: 'bar',
			data: []
		})
	})

	// 默认展示近一周数据
	for (let ind = 0; ind < 7; ind++) {
		xAxis.push(dayjs().subtract(ind, 'day').format('YYYY-MM-DD'))
	}
	xAxis.reverse()

	// 过滤近一周数据
	const weaklyTasks = tasks.value?.filter(item => {
		const { createTime } = item
		const isContain = dayjs(createTime).isBetween(
			dayjs(),
			dayjs().subtract(7, 'day')
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
			const typeTasks = tasksFilterd?.filter(task => task.groupTag === id)
			const count = typeTasks ? typeTasks.length : 0
			series[ind].data.push(count)
		})
	})

	return {
		xAxis,
		series
	}
}

onMounted(() => {
	const { xAxis, series } = getChartData()
	console.log(xAxis, series)
	options.xAxis = [{ type: 'category', data: xAxis }]
	options.series = series
	const barChart = echarts.init(chartEle.value) as ECharts
	barChart.setOption(options)
})
</script>

<style lang="scss" scoped></style>
