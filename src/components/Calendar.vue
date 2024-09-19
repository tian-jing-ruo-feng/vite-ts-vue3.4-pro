<template>
	<div id="calendar" ref="calendarRef"></div>
</template>

<script setup lang="ts">
import {
	getHolidaysInRange,
	getLunarDate,
	getDayDetail,
	getLunarDatesInRange,
	getSolarTermsInRange,
	getSolarTerms
} from 'chinese-days'
import dayjs from 'dayjs'
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

interface SolarTerm {
	date: string
	term: string
	name: string
	index?: number
}

interface LunarDateDetail {
	/** 阳历日期 */
	date: string
	/** 农历年份 */
	lunarYear: number
	/** 农历月份 */
	lunarMon: number
	/** 农历日期 */
	lunarDay: number
	/** 是否闰月 */
	isLeap: boolean
	/** 年柱，天干地支表示的年份 */
	yearCyl: string
	/** 月柱，天干地支表示的月份 */
	monCyl: string
	/** 日柱，天干地支表示的日期 */
	dayCyl: string
	/** 生肖 */
	zodiac: string
	/** 农历年份的中文写法 */
	lunarYearCN: string
	/** 农历月份的中文写法 */
	lunarMonCN: string
	/** 农历日期的中文写法 */
	lunarDayCN: string
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
			showHolidays: true,
			allowHtmlInDisplay: true,
			views: {
				fullMonth: {
					maximumEventsPerDayDisplay: 0,
					showDayNamesHeaders: false
				}
			},
			events: {
				onEventUpdated(newEvent: any) {
					console.log(newEvent, 'onEventUpdated')
				},
				onSetDate(date: Date) {
					resetHolidays(date, null, calendarInstance)
				},
				onNextMonth(date: Date) {
					resetHolidays(date, date.getMonth(), calendarInstance)
				},
				onPreviousMonth(date: Date) {
					resetHolidays(date, date.getMonth(), calendarInstance)
				}
			}
		}
	)
	const curDisplayYear = calendarInstance.getCurrentDisplayDate().getFullYear()
	const getLunarDaysByYear = (year: number, month: number | null) => {
		let start = `${year}-01-01`
		let end = `${year}-12-31`
		if (month !== null) {
			const curDate = dayjs(`${year}-${month + 1}`)
			start = dayjs(curDate.subtract(1, 'month'))
				.startOf('month')
				.format('YYYY-MM-DD')
			end = dayjs(curDate.add(1, 'month')).endOf('month').format('YYYY-MM-DD')
		}
		const existedHolidays = calendarInstance.getHolidays()
		calendarInstance.removeHolidays(existedHolidays)
		// 二十四节气
		const termDates = getSolarTerms(start, end)
		const termsArr = termDates.map(item => item.date)
		const lunarDates = getLunarDatesInRange(start, end)
		// lunarMonCN: "冬月"
		// lunarDayCN: "二十"
		const lunarFestivals = getHolidaysInRange(start, end, false)
		return lunarDates.map((lunarDate: LunarDateDetail) => {
			const { date, lunarDayCN, lunarMonCN } = lunarDate
			let title = ''
			const dateArr = date.split('-')
			const curMonth = Number(dateArr[1])
			const day = Number(dateArr[2])
			title = lunarMonCN + lunarDayCN
			if (lunarFestivals.includes(date)) {
				const festivalDate = getDayDetail(date)
				title = `<p style="color: #e60000; font-weight: bold;">${
					festivalDate.name.split(',')[1]
				}</p>\n\n${title}`
			}
			if (termsArr.includes(date)) {
				const termDay = termDates.find(item => item.date === date)
				title = `${title}<br/>${termDay?.name}`
			}
			return {
				year,
				month: curMonth,
				day,
				title
			}
		})
	}

	const resetHolidays = (
		date: Date,
		month: number | null,
		calendarInstance: any
	) => {
		const existedHolidays = calendarInstance.getHolidays()
		calendarInstance.removeHolidays(
			existedHolidays.map((holiday: Holiday) => holiday.title)
		)
		const holidays = getLunarDaysByYear(date.getFullYear(), month)
		calendarInstance.addHolidays(holidays).refresh()
	}

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
		.addHolidays(getLunarDaysByYear(curDisplayYear, null))
		.refresh()
	// remove month-name
	document.querySelectorAll('.month-name').forEach(node => node.remove())
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
