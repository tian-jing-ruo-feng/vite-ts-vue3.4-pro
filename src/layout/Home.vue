<template>
	<div class="home">
		<el-container class="wrapper">
			<el-header class="header">
				<ul class="project-info">
					<li>项目: {{ name }}@{{ version }}</li>
					<li class="vue-version">Vue版本：Vue{{ VueVersion }}</li>
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
import Menu from './Menu.vue'
import pkg from '../../package.json'

const { name, version, dependencies } = pkg
const { vue: VueVersion } = dependencies

const contentRef = ref<HTMLElement | null>(null)
provide('mainContent', contentRef)
</script>

<style lang="scss" scoped>
.home {
	display: flex;
	.header {
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
}
</style>
