<template>
	<div class="readme-doc">
		<VueComponent></VueComponent>
	</div>
</template>

<script setup lang="ts">
import { VueComponent, attributes, html, toc } from '../../../README.md'

// console.log(attributes)
// console.log(toc)
</script>

<style scoped lang="scss">
.readme-doc {
	width: 65vw;
	padding: 20px;
	margin: 0 auto;
	padding-bottom: 50px;
	box-shadow: var(--el-box-shadow-light) inset;

	&:deep(>) {
		p > img {
			width: 100%;
		}
		h1,
		h2,
		h3,
		h4,
		h5 {
			padding: 4px 0 8px;
			margin-bottom: 10px;
			font-weight: bold;
			border-bottom: 1px solid var(--el-color-info-light-8);
		}
		h1 {
			font-size: 32px;
		}
		h2 {
			font-size: 24px;
		}
		h3 {
			font-size: 18px;
		}
		h4,
		h5 {
			font-size: 16px;
		}

		pre {
			margin: 10px;
			padding: 10px;
			background-color: var(--el-color-info-light-7);
		}

		ul {
			background-color: var(--el-color-info-light-7);
			padding: 10px;

			& > li > ul {
				padding: 8px 12px;
			}

			li {
				padding: 4px;
			}
		}
	}
}
</style>
