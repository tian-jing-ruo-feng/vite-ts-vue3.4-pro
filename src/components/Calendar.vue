<template>
	<div id="calendar" ref="calendarRef"></div>
</template>

<script setup lang="ts">
import { getHolidaysInRange, getLunarDate, getDayDetail } from 'chinese-days'
import { useTasksStore } from '@/store/tasks'
// * use scss :export {} variables, the scss files must end with 'module.scss'
import stateStyles from '@/style/state.module.scss'

interface Holiday {
	year: number
	month: number
	day: number
	title: string
	onClick?: object
	onClickUrl?: string
	backgroundColor?: string
	textColor?: string
}

const { tasks } = toRefs(useTasksStore())

const calendarRef = ref<HTMLElement>()
nextTick(() => {
	const calendarInstance = new window.calendarJs(
		document.getElementById('calendar'),
		{
			manualEditingEnabled: true,
			// eslint-disable-next-line no-underscore-dangle
			...window.__TRANSLATION_OPTIONS,
			dayHeaderNames: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
			holidays: [],
			views: {
				fullMonth: {
					maximumEventsPerDayDisplay: 0
				}
			},
			events: {
				onEventUpdated(newEvent: any) {
					console.log(newEvent, 'onEventUpdated')
				},
				onSetDate(date: Date) {
					console.log('datePicker change', date)
				},
				onNextMonth(arg: any) {
					console.log(arg, 'onNextMonth')
				}
			}
		}
	)
	// console.log(
	// 	calendarInstance.getCurrentDisplayDate().getFullYear(),
	// 	'当前时间'
	// )
	const curDisplayYear = calendarInstance.getCurrentDisplayDate().getFullYear()
	const getHolidaysByYear = (year: number) => {
		const start = `${year}-01-01`
		const end = `${year}-12-31`
		return getHolidaysInRange(start, end, false)
			.map(date => getDayDetail(date))
			.map(item => {
				// console.log(item, 'holiday item')
				const dateArr = item.date.split('-')
				const month = Number(dateArr[1])
				const day = Number(dateArr[2])
				const title = item.name
				return {
					year,
					month,
					day,
					title,
					backgroundColor: '#f0f9eb',
					textColor: '#F56C6C'
				}
			})
	}

	// Search Options allow you to customize how Calendar.js Search dialog will function. You can set them manually as follows:
	calendarInstance.setSearchOptions({
		matchCase: false
	})
	// add custom events
	// event json config can look up (https://calendar-js.com/documentation/event.html)
	const events = tasks.value?.map(event => {
		const {
			id,
			name,
			createTime,
			updateTime,
			expectEndTime,
			expectStartTime,
			state
		} = event
		const eventState = (_state: string) =>
			_state.slice(0, 1).toUpperCase() + _state.slice(1)
		return {
			id,
			title: name,
			from: expectStartTime || createTime,
			to: expectEndTime || updateTime,
			description: name,
			created: createTime,
			type: 4,
			color: stateStyles[`state${eventState(state!)}`]
		}
	})
	calendarInstance
		.addEvents(events)
		.addHolidays(getHolidaysByYear(curDisplayYear))
})
</script>

<style>
.el-scrollbar__view {
	height: inherit;
}
</style>
<style scoped lang="scss">
#calendar {
	padding: 0;
	margin: 0;
	border: none;
	min-height: inherit;
}
</style>
