<template>
  <div class="editor">
    <!-- <el-button type="primary" style="margin-bottom: 10px" @click="edit"
      >添加任务</el-button
    > -->
    <div class="editor-wrapper" v-show="true">
      <QuillEditor
        :style="{ height: height }"
        ref="QuillEditorRef"
        :options="options"
        v-model:content="content"
        @text-change="handleTextChange"
      ></QuillEditor>
    </div>
    <el-button-group class="button-group" v-show="isEdit">
      <el-button @click="handleEdit('cancel')">取 消</el-button>
      <el-button type="primary" @click="handleEdit('confirm')">确 认</el-button>
    </el-button-group>
  </div>
</template>

<script setup lang="ts">
import Quill from 'quill'
import type { QuillOptions } from 'quill'
import hljs from 'highlight.js'
import { Delta, QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import 'highlight.js/styles/monokai-sublime.css'

type QuillEditorType = InstanceType<typeof QuillEditor>
type ContentPropType = string | Delta | undefined | null
type Sources = 'api' | 'user' | 'silent'
type ArgumentsTextChange = {
  delta: Delta
  oldContents: Delta
  source: Sources
}
type EditType = 'cancel' | 'confirm'
type Props = {
  height: string
  editContent: ContentPropType
}
export type ConfirmEventArgType = {
  content: ContentPropType
  text: string
  html: string
}
const props = withDefaults(defineProps<Props>(), {
  height: '250px',
  editContent: ''
})
const emits = defineEmits<{
  confirm: [ConfirmEventArgType]
  cancel: []
}>()

const QuillEditorRef = ref<QuillEditorType>()
const fontList = ['SimSun', 'SimHei', 'Microsoft-YaHei', 'KaiTi', 'FangSong']
// add custom font style in whitelist
Quill.import('parchment').Attributor.prototype.whitelist = fontList
// add code syntax modules
const options = ref<QuillOptions>({
  theme: 'snow',
  placeholder: '请在这里输入',
  modules: {
    syntax: {
      highlight: (text: string) => {
        return hljs.highlightAuto(text, hljs.listLanguages()).value
      }
    },
    toolbar: {
      container: [
        // [{ 'header': 1 }, { 'header': 2 }], // 标题 —— 独立平铺
        [{ header: [1, 2, 3, 4, 5, 6, false] }], // 标题 —— 下拉选择
        [{ font: fontList }], //字体
        [{ size: ['small', false, 'large', 'huge'] }], // 字体大小
        [{ color: [] }, { background: [] }], // 字体颜色、字体背景颜色
        ['bold', 'italic', 'underline', 'strike'], // 加粗 斜体 下划线 删除线
        ['clean'], // 清除文本格式
        [{ list: 'ordered' }, { list: 'bullet' }], // 有序、无序列表
        ['blockquote', 'code-block'], // 引用  代码块
        // 链接按钮需选中文字后点击
        ['link', 'image', 'video'], // 链接、图片、视频
        [{ align: [] }], // 对齐方式// text direction
        [{ indent: '-1' }, { indent: '+1' }], // 缩进
        [{ script: 'sub' }, { script: 'super' }] // 下标/上标
      ]
    }
  }
})
const isEdit = ref(false)
const content = ref<ContentPropType>()
const html = ref('')
const text = ref('')

// show mouse hover tip
const addQuillToolBarTitle = () => {
  interface Config {
    [key: string]: string
  }
  const titleConfig: Config = {
    'ql-bold': '加粗',
    'ql-color': '颜色',
    'ql-font': '字体',
    'ql-code': '插入代码',
    'ql-italic': '斜体',
    'ql-link': '添加链接',
    'ql-background': '背景颜色',
    'ql-size': '字体大小',
    'ql-strike': '删除线',
    'ql-script': '上标/下标',
    'ql-underline': '下划线',
    'ql-blockquote': '引用',
    'ql-header': '标题',
    'ql-indent': '缩进',
    'ql-list': '列表',
    'ql-align': '文本对齐',
    'ql-direction': '文本方向',
    'ql-code-block': '代码块',
    'ql-formula': '公式',
    'ql-image': '图片',
    'ql-video': '视频',
    'ql-clean': '清除字体样式'
  }
  const toolBar = document.querySelector('.ql-toolbar')
  if (!toolBar) return
  const aButtons = toolBar.querySelectorAll('button')
  const aSelects = toolBar.querySelectorAll('select')
  aButtons.forEach((button: HTMLButtonElement) => {
    if (button.className === 'ql-script') {
      button.value === 'sub' ? (button.title = '下标') : (button.title = '上标')
    } else if (button.className === 'ql-indent') {
      button.value === '+1'
        ? (button.title = '向右缩进')
        : (button.title = '向左缩进')
    } else {
      button.title = titleConfig[button.classList[0]]
    }
  })

  aSelects.forEach((select: HTMLSelectElement) => {
    select.parentElement!.title = titleConfig[select.classList[0]]
  })
}
nextTick(() => {
  addQuillToolBarTitle()
})
const edit = () => {
  isEdit.value = true

  // QuillEditorRef.value?.focus()
}
const handleEdit = (type: EditType) => {
  if (type === 'confirm') {
    content.value = QuillEditorRef.value?.getContents()
    text.value = QuillEditorRef.value?.getText() as string
    html.value = QuillEditorRef.value?.getHTML() as string
    emits('confirm', {
      content: content.value,
      text: text.value,
      html: html.value
    })
  } else {
    emits('cancel')
  }
  // clear editor content
  QuillEditorRef.value?.setContents('')
  // hidden editor
  isEdit.value = false
}

const handleTextChange = (/** {
  delta,
  oldContents,
  source
}: ArgumentsTextChange */) => {
  // console.log(delta, oldContents, source)
  const text = QuillEditorRef.value?.getText()
  if (text?.trim()) {
    // show button group for confirm or cancel
    !isEdit.value && (isEdit.value = true)
  } else {
    isEdit.value = false
  }
}

const init = async () => {
  content.value = props.editContent
  QuillEditorRef.value?.pasteHTML(content.value as string)
  await nextTick()
  // set foucs position at end of current content
  QuillEditorRef.value
    ?.getQuill()
    .setSelection(
      props.editContent?.length as number,
      props.editContent?.length as number
    )
}

watch(
  () => props.editContent,
  () => {
    nextTick(() => {
      init()
    })
  },
  {
    immediate: true
  }
)
onMounted(() => {
  init()
})
</script>

<style lang="scss" scoped>
.editor {
  .button-group {
    margin-top: 10px;
    float: right;
    &::after {
      clear: both;
    }
  }
}
</style>
<style>
.ql-snow .ql-tooltip[data-mode='link']::before {
  content: '请输入链接地址:';
}

.ql-snow .ql-tooltip.ql-editing a.ql-action::after {
  border-right: 0px;
  content: '保存';
  padding-right: 0px;
}

.ql-snow .ql-tooltip[data-mode='video']::before {
  content: '请输入视频地址:';
}

.ql-snow .ql-picker.ql-size .ql-picker-label::before,
.ql-snow .ql-picker.ql-size .ql-picker-item::before {
  content: '14px';
}

.ql-snow .ql-picker.ql-size .ql-picker-label[data-value='small']::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value='small']::before {
  content: '10px';
}

.ql-snow .ql-picker.ql-size .ql-picker-label[data-value='large']::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value='large']::before {
  content: '18px';
}

.ql-snow .ql-picker.ql-size .ql-picker-label[data-value='huge']::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value='huge']::before {
  content: '32px';
}

.ql-snow .ql-picker.ql-header .ql-picker-label::before,
.ql-snow .ql-picker.ql-header .ql-picker-item::before {
  content: '文本';
}

.ql-snow .ql-picker.ql-header .ql-picker-label[data-value='1']::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value='1']::before {
  content: '标题1';
}

.ql-snow .ql-picker.ql-header .ql-picker-label[data-value='2']::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value='2']::before {
  content: '标题2';
}

.ql-snow .ql-picker.ql-header .ql-picker-label[data-value='3']::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value='3']::before {
  content: '标题3';
}

.ql-snow .ql-picker.ql-header .ql-picker-label[data-value='4']::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value='4']::before {
  content: '标题4';
}

.ql-snow .ql-picker.ql-header .ql-picker-label[data-value='5']::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value='5']::before {
  content: '标题5';
}

.ql-snow .ql-picker.ql-header .ql-picker-label[data-value='6']::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value='6']::before {
  content: '标题6';
}

.ql-snow .ql-picker.ql-font .ql-picker-label[data-value='SimSun']::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value='SimSun']::before {
  content: '宋体';
}

.ql-font-SimSun {
  font-family: 'SimSun';
}

.ql-snow .ql-picker.ql-font .ql-picker-label[data-value='SimHei']::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value='SimHei']::before {
  content: '黑体';
}

.ql-font-SimHei {
  font-family: 'SimHei';
}

.ql-snow
  .ql-picker.ql-font
  .ql-picker-label[data-value='Microsoft-YaHei']::before,
.ql-snow
  .ql-picker.ql-font
  .ql-picker-item[data-value='Microsoft-YaHei']::before {
  content: '微软雅黑';
}

.ql-font-Microsoft-YaHei {
  font-family: 'Microsoft YaHei';
}

.ql-snow .ql-picker.ql-font .ql-picker-label[data-value='KaiTi']::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value='KaiTi']::before {
  content: '楷体';
}

.ql-font-KaiTi {
  font-family: 'KaiTi';
}

.ql-snow .ql-picker.ql-font .ql-picker-label[data-value='FangSong']::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value='FangSong']::before {
  content: '仿宋';
}

.ql-font-FangSong {
  font-family: 'FangSong';
}
.ql-toolbar {
  background: var(--el-bg-color-page);
}
</style>
