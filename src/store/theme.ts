import { useToggle, useDark } from '@vueuse/core'
import { defineStore } from 'pinia'

type THEME_TYPE = 'light' | 'dark'

export const useTheme = defineStore('theme', () => {
	const THEME_LIGHT = 'light'
	const THEME_DARK = 'dark'

	const theme = ref<THEME_TYPE>(THEME_LIGHT)
	const isDarkTheme = computed(() => theme.value === THEME_DARK)

	const handleCurrentTheme = () => {
		const currentTheme = localStorage.getItem('theme')
		if (currentTheme) {
			theme.value = currentTheme as THEME_TYPE
		}
		setTimeout(() => {
			localStorage.setItem('theme', theme.value)
		}, 300)
	}

	handleCurrentTheme()
	const isDark = useDark({
		selector: 'html',
		attribute: 'class',
		initialValue: theme.value,
		valueDark: THEME_DARK,
		valueLight: THEME_LIGHT
	})

	const toggleDark = useToggle(isDark)

	const themeChange = (selected: string) => {
		localStorage.setItem('theme', selected)
		toggleDark(isDarkTheme.value)
	}

	return {
		THEME_LIGHT,
		THEME_DARK,
		theme,
		themeChange
	}
})
