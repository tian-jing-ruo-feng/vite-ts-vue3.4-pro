<template>
	<div id="readme-catalog" class="readme-doc">
		<div class="readme-catalog">
			<MdCatalog
				:editor-id="markdownPreviewId"
				:theme="theme"
				:scroll-element="scrollElement"
				:is-scroll-element-in-shadow="false"
				@click="catalogClick"
			/>
		</div>
		<MdPreview
			v-model="markdownContent"
			class="markdown-preview"
			preview-theme="dark-light-theme"
			:editor-id="markdownPreviewId"
			:theme="theme"
		/>
	</div>
</template>

<script setup lang="ts">
import { MdPreview, MdCatalog } from 'md-editor-v3'
import { TocItem } from 'md-editor-v3/lib/types/MdCatalog/MdCatalog'
import { markdown } from '../../../README.md'
import 'md-editor-v3/lib/preview.css'
import { useTheme } from '@/store/theme'

const markdownContent = ref<string>()

if (process.env.NODE_ENV === 'production') {
	markdownContent.value = markdown.replaceAll('./public', '.')
} else {
	markdownContent.value = markdown
}

const themeStore = useTheme()
const { theme } = storeToRefs(themeStore)
const markdownPreviewId = 'custom-preview-markdown'
const scrollElement = document.getElementById('content') as HTMLElement

const catalogClick = (e: MouseEvent, tocItem: TocItem) => {
	e.preventDefault()
	e.stopPropagation()
	// 点击滚动到指定元素
	nextTick(() => {
		const el = document.getElementById(`${tocItem.text}`) as HTMLElement
		if (el) {
			scrollElement.scrollTo({
				top: el.offsetTop,
				behavior: 'smooth'
			})
		}
	})
}
</script>

<style scoped lang="scss">
.readme-doc {
	width: 65vw;
	padding: 20px;
	margin: 0 auto;
	background: var(--el-bg-color-overlay);

	.readme-catalog {
		position: fixed;
		top: 200px;
		left: 10vw;
		width: 300px;
		z-index: 2;
	}

	.markdown-preview {
		margin-left: 220px;
	}
}
</style>
