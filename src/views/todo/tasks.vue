<template>
  <div class="tasks">
    <el-collapse v-if="tasks?.length" v-model="activeNames">
      <el-collapse-item
        class="task-collapse-item"
        v-for="state in Object.keys(TaskStates)"
        :key="state"
        :class="[`task-collapse-${state}`]"
        :title="TaskStates[state as TaskState]"
        :name="state"
      >
        <template #title>
          {{ TaskStates[state as TaskState] }}
          <span class="task-statistics">
            共（{{ getTasksNotDeleted(state as TaskState).length }}）项任务
          </span>
        </template>
        <div v-if="getTasksByState(state as TaskState)">
          <task-item
            v-for="task in getTasksNotDeleted(state as TaskState)"
            :key="task.id"
            :task="task"
            @delete-task="handleDeleteTask"
            @change-task-state="handleChangeTaskState"
          ></task-item>
        </div>
        <div v-else>
          <el-empty
            :image-size="50"
            description=" "
            style="height: 50px; padding: 0"
          />
        </div>
      </el-collapse-item>
    </el-collapse>

    <div v-else style="text-align: center">
      <el-empty :image-size="200" description="暂无任务" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { TASKS_ARCHIVE, TASKS_DONE, TASKS_TODO } from '../../consts'
import taskItem, {
  type Task,
  type TaskUpdated,
  type TaskState
} from './taskItem.vue'
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
const activeNames = ref(TASKS_TODO)

const getTasksByState = (state: TaskState) => {
  return props.tasks.filter((task) => task.state === state)
}

const getTasksNotDeleted = (state: TaskState) => {
  return getTasksByState(state).filter((task) => !task.isRemoved)
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

  &:deep(.task-collapse-item) {
    .el-collapse-item__header {
      padding: 0 1%;
      font-size: 14px;
      font-weight: bold;

      .task-statistics {
        margin: -10px 0 0 10px;
        font-size: 12px;
        font-weight: normal;
        color: var(--el-color-info);
      }
    }

    &.task-collapse-todo .el-collapse-item__header {
      background: rgba($color: $state-todo, $alpha: 0.2);
    }
    &.task-collapse-done .el-collapse-item__header {
      background: rgba($color: $state-done, $alpha: 0.2);
    }
    &.task-collapse-archive .el-collapse-item__header {
      background: rgba($color: $state-archive, $alpha: 0.2);
    }
  }
}
</style>
