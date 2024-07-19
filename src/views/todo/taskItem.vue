<template>
  <li class="task-item">
    {{ task.name }}
    <div class="operation">
      <ep-success-filled color="green"></ep-success-filled>
      <ep-delete color="red" @click="$emit('deleteTask', task.id)"></ep-delete>
    </div>
  </li>
</template>

<script setup lang="ts">
export interface Task {
  name: string
  id: number
}
type Props = {
  task: Task
}

const props = withDefaults(defineProps<Props>(), {
  task: () => ({
    name: '任务',
    id: 0
  })
})

defineEmits(['deleteTask'])
</script>

<style scoped lang="scss">
.task-item {
  display: flex;
  justify-content: space-between;
  padding: 10px 10px;
  margin-top: 10px;
  box-shadow: var(--el-box-shadow-light);
  vertical-align: middle;

  &:first-of-type {
    margin-top: 0;
    border-top: 2px solid green;
  }
}
</style>
