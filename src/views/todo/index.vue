<template>
  <div class="todo">
    <h2 class="title">TODO LIST</h2>
    <div class="add-area" v-if="false">
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
    </div>
    <Editor
      :height="'150px'"
      :edit-content="editContent"
      @cancel="editContent = ''"
      @confirm="handleEditorConfirm"
    ></Editor>
    <el-divider> 分组 </el-divider>
    <task-group @select="handleTagSelected"></task-group>
    <!-- operation button intro -->
    <el-divider> 任务列表 </el-divider>
    <el-scrollbar :height="height">
      <Tasks
        :tasks="tasks"
        @edit="editTask"
        @remove="removeTask"
        @update="updateTask"
      ></Tasks>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid'
import dayjs from 'dayjs'
import { FormInstance, FormRules } from 'element-plus'
import Tasks, { type TasksArr } from './tasks.vue'
import { EditTaskType, type Task, type TaskUpdated } from './taskItem.vue'
import TaskGroup from '../../components/TaskGroup.vue'
import { type Tag } from '../../components/TaskGroup.vue'
import { DATE_FORMAT, TASKS, TASKS_DONE, TASKS_TODO } from '../../consts'
import useTodo from '../../hooks/useTodo'
import Editor, { ConfirmEventArgType } from './Editor.vue'
interface Form {
  task: string
}

const mainContent = inject<Ref<HTMLElement>>('mainContent')
const { getItem, setItem } = useTodo()

const showEdit = ref(false)
const eidtorRef = ref()
const tagSelected = ref<Tag>()
const tasks = ref<TasksArr>([])
const inputTask = ref<HTMLInputElement>()
const height = ref('60vh')
const formRef = ref<FormInstance>()
const editContent = ref('')
const currentEditId = ref('')
const currentEditTask = ref<Task | null>()
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
const editTask = (args: EditTaskType) => {
  const { html, id } = args
  currentEditId.value = id
  // record current edit task & index
  const taskIndex = findTaskIndexById(id)
  currentEditTask.value = tasks.value[taskIndex]
  // render task html in eidtor
  editContent.value = html
  mainContent?.value.scrollTo(0, 0)
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
// clear current task edited
const clearCurrentEditTask = () => {
  currentEditId.value = ''
  currentEditTask.value = null
}
const handleEditorConfirm = (args: ConfirmEventArgType) => {
  const { content, text, html } = args
  const allTasks = getItem()
  // edit a created task
  if (currentEditId.value) {
    allTasks.map((task) => {
      if (task.id === currentEditId.value) {
        task.name = text
        task.html = html
        task.updateTime = dayjs().format(DATE_FORMAT)
      }
      return task
    })
    clearCurrentEditTask()
  } else {
    // add a new task
    allTasks?.unshift({
      name: text,
      html: html,
      id: uuidv4(),
      state: TASKS_TODO,
      groupTag: tagSelected.value?.id || 'all',
      createTime: dayjs().format(DATE_FORMAT)
    })
  }
  tasks.value = allTasks!
  // save tasks in localStorage
  setItem(tasks.value)
  // filter taskList for current tag selected
  handleTagSelected(tagSelected.value!)
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
