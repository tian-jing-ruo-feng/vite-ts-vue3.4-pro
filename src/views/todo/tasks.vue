<template>
  <div class="tasks">
    <ul v-if="tasks?.length">
      <task-item
        v-for="task in tasks"
        :key="task.id"
        :task="task"
        @delete-task="handleDeleteTask"
        @change-task-state="handleChangeTaskState"
      ></task-item>
    </ul>
    <div v-else style="text-align: center">
      <el-empty :image-size="200" description="暂无任务" />
    </div>
  </div>
</template>

<script setup lang="ts">
import taskItem, { type Task, type TaskUpdated } from './taskItem.vue'
export type TasksArr = Task[]
interface Props {
  tasks: TasksArr
}

const props = withDefaults(defineProps<Props>(), {
  tasks: () => [{ name: '任务', id: 'aaaa' }]
})

const emit = defineEmits<{
  remove: [id: string]
  update: [updateTask: TaskUpdated]
}>()

const handleDeleteTask = (taskId: string) => {
  emit('remove', taskId)
}
const handleChangeTaskState = (updateTask: TaskUpdated) => {
  emit('update', updateTask)
}
</script>

<style scoped lang="scss">
.tasks {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  margin-top: 20px;
}
</style>
