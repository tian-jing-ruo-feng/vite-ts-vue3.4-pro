<template>
  <div class="editor"> 
    <QuillEditor ref="quillEditorRef" :options="options" style="height: 300px;"></QuillEditor>
  </div>
</template>

<script setup lang='ts'>
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import '@vueup/vue-quill/dist/vue-quill.bubble.css'
interface EditorOptions  {
  placeholder: string,
  theme?: string
}
interface Props {
  options: EditorOptions
}

const props = withDefaults(defineProps<Props>(), {
  options: () => ({
    placeholder: '请输入内容',
  })
})

export type QuillEditorType = InstanceType<typeof QuillEditor>
const quillEditorRef = ref<QuillEditorType>()
defineExpose({
  quillEditorRef,
})
</script>


<style lang='scss' scoped>
</style>