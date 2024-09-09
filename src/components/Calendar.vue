<template>
	<div id="calendar" ref="calendarRef"></div>
</template>

<script setup lang="ts">
import { useTasksStore } from '@/store/tasks'

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
			views: {
				fullMonth: {
					maximumEventsPerDayDisplay: 0
				}
			},
			events: {
				onEventUpdated: (newEvent: any) => {
					console.log(newEvent, 'onEventUpdated')
				}
			}
		}
	)
	// Search Options allow you to customize how Calendar.js Search dialog will function. You can set them manually as follows:
	calendarInstance.setSearchOptions({
		matchCase: false
	})
	// add custom events
	// event json config can look up (https://calendar-js.com/documentation/event.html)
	const events = tasks.value?.map(event => {
		const { id, name, createTime, updateTime, expectEndTime, expectStartTime } =
			event
		return {
			id,
			title: name,
			from: expectStartTime,
			to: expectEndTime,
			description: name,
			created: createTime,
			type: 4
		}
	})
	// console.log(tasks.value)
	calendarInstance.addEvents(events)
})
</script>

<style>
.el-scrollbar__view {
	height: inherit;
}
</style>
<style scoped lang="scss">
#calendar {
	width: 98%;
	height: calc(100% - 20px);
	margin: auto;
}
</style>
