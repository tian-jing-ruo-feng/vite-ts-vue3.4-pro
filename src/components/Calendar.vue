<template>
	<div id="calendar" ref="calendarRef"></div>
</template>

<script setup lang="ts">
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
			visibleDays: [0, 1, 2, 3, 4, 5, 6]
		}
	)
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
