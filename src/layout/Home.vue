<template>
	<div class="home">
		<el-container class="wrapper">
			<el-header class="header">
				<ul class="project-info">
					<li>项目: {{ name }}@{{ version }}</li>
					<li class="vue-version">Vue版本：Vue{{ VueVersion }}</li>
					<!-- dark/light  -->
					<li class="dark-light-theme">
						<el-switch
							v-model="theme"
							inline-prompt
							style="
								--el-switch-on-color: #2c2c2c;
								--el-switch-off-color: #e5eaf3;
							"
							:active-value="THEME_DARK"
							:inactive-value="THEME_LIGHT"
							:active-action-icon="Moon"
							:inactive-action-icon="Sunny"
							@change="themeChange"
						/>
					</li>
					<li class="doc">
						<router-link v-slot="{ navigate }" custom :to="{ path: '/readme' }">
							<div @click="navigate">
								<span class="doc-label">说明文档</span>
								<el-icon style="vertical-align: middle" color="#67C23A">
									<FaBook></FaBook>
								</el-icon>
							</div>
						</router-link>
					</li>
				</ul>
			</el-header>
			<el-main class="main">
				<el-card class="main-content-card">
					<Menu></Menu>
					<div ref="contentRef" class="content">
						<router-view></router-view>
					</div>
				</el-card>
			</el-main>
		</el-container>
	</div>
</template>

<script setup lang="ts">
import { Moon, Sunny } from '@element-plus/icons-vue'
import { useDark, useToggle } from '@vueuse/core'
import Menu from './Menu.vue'
import pkg from '../../package.json'

const { name, version, dependencies } = pkg
const { vue: VueVersion } = dependencies

const contentRef = ref<HTMLElement | null>(null)
provide('mainContent', contentRef)

// dark/light mode toggle
const useTheme = () => {
	type THEME_TYPE = 'light' | 'dark'
	const handleCurrentTheme = () => {
		const currentTheme = localStorage.getItem('theme')
		if (currentTheme) {
			theme.value = currentTheme as THEME_TYPE
		}
		setTimeout(() => {
			localStorage.setItem('theme', theme.value)
		}, 300)
	}
	const THEME_LIGHT = 'light'
	const THEME_DARK = 'dark'
	const theme = ref<THEME_TYPE>(THEME_LIGHT)
	handleCurrentTheme()
	const isDarkTheme = computed(() => theme.value === THEME_DARK)
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
}

const { THEME_LIGHT, THEME_DARK, theme, themeChange } = useTheme()
</script>

<style lang="scss" scoped>
.home {
	display: flex;
	.header {
		position: relative;
		.project-info {
			display: flex;
			line-height: var(--el-header-height);
			justify-content: center;
			& > li {
				font-size: 18px;
				font-weight: bold;
				padding-right: 10px;
			}

			.vue-version {
				color: #42b883;
			}

			.doc {
				position: absolute;
				right: 40px;
				cursor: pointer;
				.doc-label {
					font-size: 16px;
					margin-right: 10px;
				}
			}
		}
	}

	.main {
		flex: 1;
		display: flex;
		.main-content-card {
			flex: 1;
			.content {
				max-height: calc(100vh - 180px);
				padding: 20px;
				overflow-y: auto;
			}
		}
	}
}
.header {
	box-shadow: var(--el-box-shadow-light);

	.dark-light-theme {
		&:deep(.el-switch) {
			.el-icon {
				border-radius: 50%;
			}
			.el-switch__action {
				.el-icon {
					color: #000000;
					background-color: rgba($color: #000000, $alpha: 0.1);
				}
			}

			&.is-checked {
				.el-switch__action {
					background-color: rgba($color: #2c2c2c, $alpha: 1);
					.el-icon {
						color: rgba($color: #ffffff, $alpha: 1);
					}
				}
			}
		}
	}
}
</style>
