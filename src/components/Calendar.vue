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
			...window.__TRANSLATION_OPTIONS,
			views: {
				fullMonth: {
					maximumEventsPerDayDisplay: 0
				}
			},
			visibleDays: [0, 1, 2, 3, 4]
		}
	)
})
</script>

<style scoped lang="scss"></style>
