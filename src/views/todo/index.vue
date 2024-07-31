<template>
  <div class="todo">
    <h2 class="title">TODO LIST</h2>
    <el-button type="primary" @click="showEdit=true" v-if="!showEdit">添加任务</el-button>
    <Editor ref="eidtorRef" v-show="showEdit" :options="{ placeholder: '请输入内容'}"></Editor>
    <el-button-group v-if="showEdit">
      <el-button type="primary" @click="handleEditCancelConfirm('cancel')">取消</el-button>
      <el-button type="primary" @click="handleEditCancelConfirm('confirm')">确认</el-button>
    </el-button-group>
    <el-divider />
    <!-- <div class="add-area">
      <el-form
        :inline="true"
        :model="form"
        :rules="rules"
        hide-required-asterisk
        ref="formRef"
        class="demo-form-inline"
        @submit.prevent
      >
        <el-form-item label="添加任务：" prop="task">
          <el-input
            type="textarea"
            ref="inputTask"
            class="input-task"
            clearable
            v-model.trim="form.task"
            @keyup.enter="addTask"
          ></el-input>
          <el-button class="add-button" @click="addTask">
            <el-icon color="green"><ep-plus></ep-plus></el-icon>
          </el-button>
        </el-form-item>
      </el-form>
    </div> -->
    <task-group v-if="false" @select="handleTagSelected"></task-group>
    <!-- operation button intro -->
    <el-scrollbar :height="height">
      <Tasks v-if="false" :tasks="tasks" @remove="removeTask" @update="updateTask"></Tasks>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid'
import dayjs from 'dayjs'
import { FormInstance, FormRules } from 'element-plus'
import Tasks, { type TasksArr } from './tasks.vue'
import { type Task, type TaskUpdated } from './taskItem.vue'
import TaskGroup from '../../components/TaskGroup.vue'
import { type Tag } from '../../components/TaskGroup.vue'
import { DATE_FORMAT, TASKS, TASKS_DONE, TASKS_TODO } from '../../consts'
import useTodo from '../../hooks/useTodo'
import Editor, { type QuillEditorType} from './editor.vue'

interface Form {
  task: string
}

// let id = 0

const { getItem, setItem } = useTodo()

const showEdit = ref(false)
const eidtorRef = ref()
const tagSelected = ref<Tag>()
const tasks = ref<TasksArr>([])
const inputTask = ref<HTMLInputElement>()
const height = ref('60vh')
const formRef = ref<FormInstance>()
const form: Form = reactive({
  task: ''
})
const validateTask = (rule: any, value: string, callback: any) => {
  if (value === '') {
    callback(new Error('请输入内容！'))
  } else {
    callback()
  }
}
const rules = reactive<FormRules<typeof form>>({
  task: {
    required: true,
    validator: validateTask,
    trigger: 'change'
  }
})

const findTaskIndexById = (id: string) =>
  tasks.value.findIndex((task: Task) => task.id === id)


const addTask = () => {
  formRef.value?.validate((isValid) => {
    if (isValid) {
      const allTasks = getItem()

      allTasks?.unshift({
        name: form.task,
        id: uuidv4(),
        state: TASKS_TODO,
        groupTag: tagSelected.value?.id || 'all',
        createTime: dayjs().format(DATE_FORMAT)
      })
      tasks.value = allTasks!
      form.task = ''
      formRef.value?.resetFields()
      // save tasks in localStorage
      setItem(tasks.value)
      // filter taskList for current tag selected
      handleTagSelected(tagSelected.value!)
    }
  })
}
const removeTask = (id: string) => {
  const taskIndex = findTaskIndexById(id)
  tasks.value[taskIndex].isRemoved = true
  // save tasks in localStorage
  setItem(tasks.value)
}
const updateTask = (taskUpdated: TaskUpdated) => {
  const { id, state, updateTime } = taskUpdated
  const taskIndex = findTaskIndexById(id)
  const task = tasks.value[taskIndex]
  tasks.value[taskIndex] = { ...task, state, updateTime }
  // save tasks in localStorage
  setItem(tasks.value)
}
const handleTagSelected = (tag: Tag) => {
  tagSelected.value = tag
  if (tag.id === 'all') {
    tasks.value = getItem()
  } else {
    tasks.value = getItem().filter((task) => task.groupTag === tag.id)
  }
}
const handleEditCancelConfirm = (type: 'cancel' | 'confirm') => {
  if (type === 'cancel') {}
  if (type === 'confirm') {
    if (eidtorRef.value) {
      const quillEditorRef = eidtorRef.value.quillEditorRef as QuillEditorType
      const contents = quillEditorRef.getContents()
      const text = quillEditorRef.getText()
      console.log(contents, text)
    }
  }
  showEdit.value = false
}

onMounted(() => {
  tasks.value = getItem()
  inputTask.value?.focus()
})
</script>

<style scoped lang="scss">
.todo {
  display: flex;
  flex-direction: column;
  width: 50%;
  margin: 0 auto;
  .title {
    font-weight: bold;
    text-align: center;
    padding: 25px;
  }

  .add-area {
    .input-task,
    .add-button {
      display: inline-block;
    }
    .input-task {
      width: auto;
    }
  }
}
</style>
