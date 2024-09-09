<template>
	<div class="markdown-editor">
		<MdEditor
			v-model="text"
			show-toolbar-name
			:theme="theme"
			:toolbars="toolbars"
			class="md-editor"
			@on-save="onSave"
			@on-upload-img="onUploadImg"
		>
			<template #defToolbars>
				<NormalToolbar title="导入" @on-click="importFile">
					<template #trigger>
						<UploadFilled />
						<div class="md-editor-toolbar-item-name">导入</div>
					</template>
				</NormalToolbar>
			</template>
		</MdEditor>
		<!-- 保存下载 -->
		<el-dialog v-model="dialogFormVisible" title="保存下载" width="400">
			<el-form
				ref="saveFormRef"
				class="save-form"
				:model="form"
				:rules="formRules"
				hide-required-asterisk
			>
				<el-form-item label="文件名称" prop="fileName">
					<el-input
						v-model="form.fileName"
						clearable
						placeholder="请输入文件名称"
					></el-input>
				</el-form-item>
				<el-form-item label="文件类型" prop="fileType">
					<el-select
						v-model="form.fileType"
						placeholder="请选择文件类型"
						value-key="mimeType"
					>
						<el-option
							v-for="item in fileTypes"
							:key="item.value.mimeType"
							:value="item.value"
							:label="item.label"
						/>
					</el-select>
				</el-form-item>
				<div class="file-name">
					文件名称：{{ form.fileName }}{{ form.fileType.ext }}
				</div>
			</el-form>
			<template #footer>
				<div class="dialog-footer">
					<el-button @click="dialogFormVisible = false">取消</el-button>
					<el-button type="primary" @click="exportFile"> 确认 </el-button>
				</div>
			</template>
		</el-dialog>
		<!-- 导入文件: .html / .md -->
		<el-dialog v-model="importDialogVisible" title="导入文件">
			<el-upload
				class="upload-demo"
				drag
				action=""
				accept=".html,.md"
				:before-upload="beforeImportFile"
				:http-request="handleImportFile"
			>
				<el-icon class="el-icon--upload"><upload-filled /></el-icon>
				<div class="el-upload__text">拖拽文件到这里 <em>点击导入</em></div>
				<template #tip>
					<div class="el-upload__tip">请上传 html 或 markdonw 文件</div>
				</template>
			</el-upload>
		</el-dialog>
	</div>
</template>

<script setup lang="ts">
import { MdEditor, ToolbarNames, NormalToolbar, Insert } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'
import { ElSelect, FormInstance, FormRules } from 'element-plus'
import { UploadFilled } from '@element-plus/icons-vue'
import { useTheme } from '@/store/theme'
import { markdown } from './demo.md'
import { downloadFile } from '@/utils/common'

// theme config
const themeStore = useTheme()
const { theme } = storeToRefs(themeStore)

// editor content text
const text = ref(markdown)
const mdHtml = ref()
const toolbars = ref<ToolbarNames[]>([
	'bold',
	'underline',
	'italic',
	'-',
	'title',
	'strikeThrough',
	'sub',
	'sup',
	'quote',
	'unorderedList',
	'orderedList',
	'task',
	'-',
	'codeRow',
	'code',
	'link',
	'image',
	'table',
	'mermaid',
	'katex',
	'-',
	'revoke',
	'next',
	'save',
	0,
	'=',
	'pageFullscreen',
	'fullscreen',
	'preview',
	'previewOnly',
	'htmlPreview',
	'catalog'
])

// save and export
const useSaveDialog = () => {
	const dialogFormVisible = ref(false)
	const saveFormRef = ref<FormInstance>()
	const form = reactive({
		fileType: {
			ext: '.md',
			mimeType: 'text/x-markdown'
		},
		fileName: '我的文件'
	})
	const formRules = reactive<FormRules<typeof form>>({
		fileName: {
			required: true,
			message: '请输入文件名称',
			trigger: 'blur'
		},
		fileType: {
			required: true,
			message: '请选择文件类型',
			trigger: 'blur'
		}
	})
	const fileTypes = [
		{
			label: 'markdown',
			value: {
				ext: '.md',
				mimeType: 'text/x-markdown'
			}
		},
		{
			label: 'html',
			value: {
				ext: '.html',
				mimeType: '.html'
			}
		}
	]
	const exportFile = () => {
		saveFormRef.value?.validate(validate => {
			if (validate) {
				// 表单校验成功
				// 导出文件
				downloadFile(
					form.fileType.ext === '.md' ? text.value : mdHtml.value,
					form.fileType.mimeType,
					form.fileName + form.fileType.ext
				)
			}
		})
	}

	return {
		dialogFormVisible,
		saveFormRef,
		form,
		formRules,
		fileTypes,
		exportFile
	}
}

// import file
const useImportFileDialog = () => {
	const importDialogVisible = ref(false)

	const beforeImportFile = (file: File) => {
		const reader = new FileReader()
		reader.onload = ev => {
			const result = ev.target?.result
			text.value = result as string
		}
		if (file) {
			reader.readAsText(file)
		}
	}
	const handleImportFile = () => {
		importDialogVisible.value = false
	}
	return {
		importDialogVisible,
		beforeImportFile,
		handleImportFile
	}
}

const {
	dialogFormVisible,
	saveFormRef,
	form,
	formRules,
	fileTypes,
	exportFile
} = useSaveDialog()
const { importDialogVisible, beforeImportFile, handleImportFile } =
	useImportFileDialog()

// event handlers
const importFile = () => {
	importDialogVisible.value = true
}

const onSave = (v: string, h: Promise<any>) => {
	h.then((html: string) => {
		mdHtml.value = html
	})
	dialogFormVisible.value = true
}

const onUploadImg = async (files: File[], callback: (x: any[]) => void) => {
	const reader = new FileReader()
	reader.onload = ev => {
		const imgFile = ev.target?.result
		callback([imgFile])
	}
	const url = reader.readAsDataURL(files[0])
}
</script>

<style lang="scss">
.file-name {
	color: var(--el-color-success);
	font-weight: bold;
}
</style>
<style scoped lang="scss">
.md-editor {
	height: 100%;
}
</style>
