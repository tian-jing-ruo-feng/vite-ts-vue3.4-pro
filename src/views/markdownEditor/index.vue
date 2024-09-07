<template>
	<div class="markdown-editor">
		<MdEditor
			v-model="text"
			:theme="theme"
			:toolbars-exclude="toolbarsExclude"
			class="md-editor"
			@on-save="onSave"
			@on-upload-img="onUploadImg"
		/>
		<el-dialog v-model="dialogFormVisible" title="保存下载" width="500">
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
	</div>
</template>

<script setup lang="ts">
import { MdEditor, ToolbarNames } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'
import { ElMessageBox, ElSelect, FormInstance, FormRules } from 'element-plus'
import { Download } from '@element-plus/icons-vue'
import { useTheme } from '@/store/theme'
import { markdown } from './demo.md'
import { downloadFile } from '@/utils/common'

// theme config
const themeStore = useTheme()
const { theme } = storeToRefs(themeStore)

// editor content text
const text = ref(markdown)
const mdHtml = ref()
const toolbarsExclude = ref<ToolbarNames[]>(['github'])

// save and export
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

// event handlers
const onSave = (v: string, h: Promise<any>) => {
	console.log(v, 'v')
	h.then((html: string) => {
		console.log(html, 'html')
		mdHtml.value = html
	})
	dialogFormVisible.value = true
}

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

const onUploadImg = async (files: File[], callback: (x: any[]) => void) => {
	console.log(files)
	const reader = new FileReader()
	reader.onload = ev => {
		// console.log(ev, 'ev')
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
