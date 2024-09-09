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
						<UserLogin class="user"></UserLogin>
					</li>
				</ul>
			</el-header>
			<el-main class="main">
				<el-card class="main-content-card">
					<Menu class="main-content-menu"></Menu>
					<div id="content" ref="contentRef" class="content">
						<el-scrollbar>
							<el-backtop
								bottom="100"
								right="100"
								target=".el-scrollbar .el-scrollbar__wrap"
								:visibility-height="100"
							>
							</el-backtop>
							<router-view></router-view>
						</el-scrollbar>
					</div>
				</el-card>
			</el-main>
		</el-container>
	</div>
</template>

<script setup lang="ts">
import { Moon, Sunny } from '@element-plus/icons-vue'
import Menu from './Menu.vue'
import pkg from '../../package.json'
import { useTheme } from '@/store/theme'
import UserLogin from './UserLogin.vue'

const { name, version, dependencies } = pkg
const { vue: VueVersion } = dependencies

const contentRef = ref<HTMLElement | null>(null)
provide('mainContent', contentRef)

const themeStore = useTheme()
const { theme } = storeToRefs(themeStore)
const { THEME_LIGHT, THEME_DARK, themeChange } = themeStore
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
				display: flex;
				position: absolute;
				right: 40px;
				cursor: pointer;
				.doc-label {
					font-size: 16px;
					margin-right: 10px;
				}

				.user {
					margin-left: 20px;
				}
			}
		}
	}

	.main {
		flex: 1;
		overflow: hidden;
		// display: flex;
		.main-content-card {
			// flex: 1;
			.main-content-menu {
				margin-bottom: 20px;
				// position: sticky;
				// top: 20px;
				// z-index: 1;
			}
			.content {
				height: calc(100vh - 240px);
				max-height: calc(100vh - 240px);
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
