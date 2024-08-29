<template>
	<div id="readme-catalog" class="readme-doc">
		<!-- <ul class="readme-catalog">
			<li
				v-for="({ text, level, active }, ind) in catalog"
				:key="ind"
				:class="{ ['level-active']: active || false, [`level-${level}`]: true }"
				@click="clickCatalog(ind, level)"
			>
				{{ text }}
			</li>
		</ul> -->
		<div class="readme-catalog">
			<MdCatalog
				:editor-id="markdownPreviewId"
				:theme="theme"
				:scroll-element="scrollElement"
				:is-scroll-element-in-shadow="true"
				@click="catalogClick"
				@active="catalogActive"
			/>
		</div>
		<MdPreview
			v-model="markdown"
			class="markdown-preview"
			preview-theme="dark-light-theme"
			:editor-id="markdownPreviewId"
			:theme="theme"
			:mdHeadingId="mdHeadingId"
			:on-get-catalog="getCatalog"
		/>
	</div>
</template>

<script setup lang="ts">
import { HeadList, MdPreview, MdCatalog } from 'md-editor-v3'
import { TocItem } from 'md-editor-v3/lib/types/MdCatalog/MdCatalog'
import { markdown } from '../../../README.md'
import 'md-editor-v3/lib/preview.css'
import { useTheme } from '@/store/theme'

const themeStore = useTheme()
const { theme } = storeToRefs(themeStore)
const markdownPreviewId = 'custom-preview-markdown'
const scrollElement = document.getElementById('content') as HTMLElement

const catalog = ref<HeadList[]>()

// 构造标题ID的生成方式
const mdHeadingId = (text: string, level: number, index: number) => {
	return `heading-${level}-${text}`
}

const getCatalog = (list: HeadList[]) => {
	catalog.value = list
}

const catalogClick = ({ e, t }: { e: PointerEvent; t: TocItem }) => {
	console.log(t)
}
const catalogActive = (params: any) => {
	console.log(params, 'active')
}

const clickCatalog = (ind: number, level: number) => {
	// if (level !== 1) {
	catalog.value![ind].active = true
	catalog.value = catalog.value!.map((item, catalogIndex) => {
		if (catalogIndex !== ind) {
			item.active = false
		} else {
			item.active = true
			// 跳转至指定元素
			if (level === 1 && ind === 0) {
				// 跳转顶部
				document.getElementById(`readme-catalog`)?.scrollIntoView(true)
			} else {
				document
					.getElementById(`heading-${item.level}-${item.text}`)
					?.scrollIntoView(true)
			}
		}
		return item
	})
}
</script>

<style scoped lang="scss">
.readme-doc {
	width: 65vw;
	padding: 20px;
	margin: 0 auto;
	// padding-bottom: 50px;
	background: var(--el-bg-color-overlay);

	.readme-catalog {
		position: fixed;
		top: 200px;
		left: 10vw;
		width: 300px;
		z-index: 2;
		// background: var(--el-bg-color-overlay);
	}

	.markdown-preview {
		margin-left: 220px;
	}
}

$levels: 1, 2, 3, 4, 5, 6;
@each $level in $levels {
	.level-#{$level} {
		padding: 5px 5px 5px ($level - 1) * 20px;
		cursor: pointer;
	}
}

.level-active {
	position: relative;
	color: #42b883;
	font-weight: bold;
	&::before {
		content: '';
		display: inline-block;
		position: absolute;
		left: -20px;
		top: 0;
		width: 4px;
		height: 100%;
		background-color: #42b883;
	}
}
</style>
