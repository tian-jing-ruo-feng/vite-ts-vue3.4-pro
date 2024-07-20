<template>
  <div class="todo">
    <h2 class="title">TODO LIST</h2>
    <div class="add-area">
      <el-form
        :inline="true"
        :model="form"
        :rules="rules"
        hide-required-asterisk
        ref="formRef"
        class="demo-form-inline"
      >
        <el-form-item label="添加任务：" prop="task">
          <el-input
            ref="inputTask"
            class="input-task"
            clearable
            v-model.trim="form.task"
            @change="addTask"
          ></el-input>
          <el-button class="add-button" @click="addTask">
            <el-icon color="green"><ep-plus></ep-plus></el-icon>
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- operation button intro -->
    <el-scrollbar :height="height">
      <Tasks :tasks="tasks" @remove="removeTask"></Tasks>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { FormInstance, FormRules } from 'element-plus'
import Tasks, { type TasksArr } from './tasks.vue'
import { type Task } from './taskItem.vue'
import { TASKS } from '../../consts'
import useTodo from '../../hooks/useTodo'
interface Form {
  task: string
}

let id = 0

const { getItem, setItem } = useTodo()

const tasks = ref<TasksArr>([])
const inputTask = ref<HTMLInputElement>()
const height = ref(400)
const formRef = ref<FormInstance>()
const form: Form = reactive({
  task: ''
})
const validateTask = (rule: any, value: string, callback: any) => {
  if (value === '') {
    callback(new Error('请输入内容！'))
    setTimeout(() => {
      formRef.value?.resetFields()
    }, 3000)
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

const addTask = () => {
  formRef.value?.validate((isValid) => {
    if (isValid) {
      tasks.value.unshift({
        name: form.task,
        id: id++
      })
      form.task = ''
      // save tasks in localStorage
      setItem(tasks.value)
    }
  })
}
const removeTask = (id: number) => {
  const taskIndex = tasks.value.findIndex((task: Task) => task.id === id)
  tasks.value.splice(taskIndex, 1)
  // save tasks in localStorage
  localStorage.setItem(TASKS, JSON.stringify(tasks.value))
}

onMounted(() => {
  // const existTasks = localStorage.getItem('tasks')
  // existTasks && (tasks.value = JSON.parse(existTasks as string))
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
