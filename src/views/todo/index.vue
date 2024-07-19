<template>
  <div class="todo">
    <h2 class="title">TODO LIST</h2>
    <div class="add-area">
      <el-input
        ref="inputTask"
        class="input-task"
        v-model="task"
        @change="addTask"
      ></el-input>
      <el-button class="add-button" @click="addTask">
        <el-icon color="green"><ep-plus></ep-plus></el-icon>
      </el-button>
    </div>
    <!-- operation button intro -->
     
    <el-scrollbar :height="height">
    <Tasks :tasks="tasks" @remove="removeTask"></Tasks>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import Tasks, { type TasksArr } from './tasks.vue'
let id = 0

const task = ref('')
const tasks = ref<TasksArr>([])
const inputTask = ref<HTMLInputElement>()
const height = ref(400)

const addTask = () => {
  if (task.value) {
    tasks.value.unshift({
      name: task.value,
      id: id++
    })
    task.value = ''
    // save tasks in localStorage
    localStorage.setItem('tasks', JSON.stringify(tasks.value))
  } else {
    ElMessage.warning('请输入内容！')
  }
}
const removeTask = (id: number) => {
  const taskIndex = tasks.value.findIndex((task) => task.id === id)
  tasks.value.splice(taskIndex, 1)
  // save tasks in localStorage
  localStorage.setItem('tasks', JSON.stringify(tasks.value))
}

onMounted(() => {
  const existTasks = localStorage.getItem('tasks')
  tasks.value = JSON.parse(existTasks as string)
  inputTask.value?.focus()
})
</script>

<style scoped lang="scss">
.todo {
  display: flex;
  flex-direction: column;
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
