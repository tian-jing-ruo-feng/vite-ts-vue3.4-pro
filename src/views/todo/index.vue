<template>
  <div class="todo">
    <h2 class="title">TODO LIST</h2>
    <el-input
      ref="inputTask"
      class="input-task"
      v-model="task"
      @change="addTask"
    ></el-input>
    <el-button class="add-button" @click="addTask">
      <el-icon color="green"><ep-plus></ep-plus></el-icon>
    </el-button>
    <Tasks :tasks="tasks" @remove="removeTask"></Tasks>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import Tasks, { type TasksArr } from './tasks.vue'
let id = 0

const task = ref('')
const tasks = ref<TasksArr>([])
const inputTask = ref<HTMLInputElement>()

const addTask = () => {
  if (task.value) {
    tasks.value.push({
      name: task.value,
      id: id++
    })
    task.value = ''
  } else {
    ElMessage.warning('请输入内容！')
  }
}
const removeTask = (id: number) => {
  const taskIndex = tasks.value.findIndex((task) => task.id === id)
  tasks.value.splice(taskIndex, 1)
}

onMounted(() => {
  inputTask.value?.focus()
})
</script>

<style scoped lang="scss">
.todo {
  .title {
    font-weight: bold;
    text-align: center;
    padding: 25px;
  }

  .input-task,
  .add-button {
    display: inline-block;
  }
  .input-task {
    width: auto;
  }
}
</style>
