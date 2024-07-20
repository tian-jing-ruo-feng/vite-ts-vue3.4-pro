<template>
  <div class="tasks">
    <ul v-if="tasks?.length">
      <li
        class="task-group"
        v-for="state in Object.keys(TaskStates)"
        :key="state"
      >
        <el-divider content-position="left">{{ TaskStates[state as TaskState] }}</el-divider>
        <div v-if="getTasksByState(state as TaskState)">
          <task-item
            v-for="task in getTasksByState(state as TaskState)"
            :key="task.id"
            :task="task"
            @delete-task="handleDeleteTask"
            @change-task-state="handleChangeTaskState"
          ></task-item>
        </div>
        <div v-else>
          <el-empty :image-size="50" description=" " style="height:50px; padding: 0;" />
        </div>
      </li>
    </ul>
    <div v-else style="text-align: center">
      <el-empty :image-size="200" description="暂无任务" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { TASKS_ARCHIVE, TASKS_DONE, TASKS_TODO } from '../../consts';
import taskItem, { type Task, type TaskUpdated, type TaskState } from './taskItem.vue'
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

type ST = {
  [key in TaskState]: string
}
const TaskStates: ST = {
  [TASKS_TODO]: '计划任务',
  [TASKS_DONE]: '完成任务',
  [TASKS_ARCHIVE]: '归档任务'
}

const getTasksByState = (state: TaskState) => {
  return props.tasks.filter(task => task.state === state)
}

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
