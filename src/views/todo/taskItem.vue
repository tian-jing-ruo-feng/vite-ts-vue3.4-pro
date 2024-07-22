<template>
  <li
    class="task-item"
    :class="{
      'task-todo': isTodo,
      'task-done': isDone,
      'task-archive': isArchive
    }"
  >
    <el-tooltip
      :visible="tooltipVisible"
      :show-arrow="false"
      trigger="hover"
      placement="top"
      effect="customized"
    >
      <template #content>
        <p class="tooltip-custom-cotent">
          {{ task.name }}
        </p>
      </template>

      <div
        class="task-name"
        ref="taskWrap"
        @mouseenter="handleMouseEnter"
        @mouseleave="handleMouseLeave"
      >
        <span ref="taskName">
          <span class="task-state">
            <el-switch
              v-model="taskState"
              inline-prompt
              active-text="Done"
              inactive-text="Todo"
              style="
                --el-switch-on-color: #13ce66;
                --el-switch-off-color: #e6a23c;
              "
              :active-value="TASKS_DONE"
              :inactive-value="TASKS_TODO"
              :active-action-icon="Finished"
              :inactive-action-icon="Timer"
              @change="
                $emit('changeTaskState', {
                  state: taskState,
                  id: task.id,
                  updateTime: dayjs().format(DATE_FORMAT)
                })
              "
            />
          </span>
          <span class="task-name-content">{{ task.name }}</span>
        </span>
        <p class="extro-info">
          <span class="create-time">创建于：{{ task.createTime }}</span>
          <span class="update-time" v-if="task.updateTime">
            更新于：{{ task.updateTime }}</span
          >
          <span class="consumed-time" v-if="task.updateTime">
            耗时：{{ dayjs(task.createTime).to(task.updateTime) }}</span
          >
        </p>
      </div>
    </el-tooltip>
    <div class="operation">
      <el-icon class="done">
        <ep-success-filled color="green"></ep-success-filled>
      </el-icon>
      <el-tooltip :visible="copied" effect="light" placement="top">
        <template #content>
          <span>Copied</span>
        </template>
        <el-button
          ref="buttonRef"
          @click="copy(task.name)"
          size="small"
          class="copy-text"
        >
          <el-icon><ep-copy-document /></el-icon>
        </el-button>
      </el-tooltip>
      <!-- archive 归档到某个分类（文件夹） -->
      <el-button size="small" plain>
        <el-icon>
          <fa-telegram color="#41b883"></fa-telegram>
        </el-icon>
      </el-button>
      <el-button size="small" tes @click="$emit('deleteTask', task.id)">
        <el-icon>
          <ep-delete color="red"></ep-delete>
        </el-icon>
      </el-button>
    </div>
  </li>
</template>

<script setup lang="ts">
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'
import dayjs from 'dayjs'
dayjs.locale('zh-cn')
dayjs.extend(relativeTime)
import { Finished, Timer } from '@element-plus/icons-vue'
import { DATE_FORMAT, TASKS_DONE, TASKS_TODO } from '../../consts'
import { useClipboard } from '@vueuse/core'

export type TaskState = 'done' | 'todo' | 'archive'
export interface Task {
  name: string
  id: string
  state?: TaskState
  createTime?: string
  updateTime?: string
}
export interface TaskUpdated {
  state: TaskState
  id: string
  updateTime: string
}

type Props = {
  task: Task
}

const props = withDefaults(defineProps<Props>(), {
  task: () => ({
    name: '任务',
    id: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
    state: 'todo',
    createTime: Date.now().toLocaleString()
  })
})

// vue3.3+ 具名元组法
const emit = defineEmits<{
  deleteTask: [id: string]
  changeTaskState: [updateTask: TaskUpdated]
}>()

const { copy, copied } = useClipboard()
const taskWrap = ref<HTMLElement>()
const taskName = ref<HTMLElement>()
const buttonRef = ref()
const popoverRef = ref()
const visible = ref(false)
const visibleComputed = ref(false)
const taskState = ref<TaskState>(TASKS_TODO)

const isTodo = computed(() => props.task?.state === 'todo')
const isDone = computed(() => props.task?.state === 'done')
const isArchive = computed(() => props.task?.state === 'archive')
const tooltipVisible = computed(() => visibleComputed.value && visible.value)

const handleMouseEnter = () => {
  if (visible.value) {
    visibleComputed.value = true
  } else {
    visibleComputed.value = false
  }
}
const handleMouseLeave = () => {
  if (visible.value) {
    visibleComputed.value = false
  } else {
    visibleComputed.value = false
  }
}

onBeforeMount(() => {
  taskState.value = props.task.state as TaskState
})
onMounted(() => {
  const wrapWidth = taskWrap.value?.offsetWidth as number
  const taskWidth = taskName.value?.offsetWidth as number
  if (taskWidth >= wrapWidth) {
    visible.value = true
  } else {
    visible.value = false
  }
})
</script>

<style>
.el-popper.is-customized {
  /* Set padding to ensure the height is 32px */
  padding: 6px 12px;
  background: linear-gradient(90deg, rgb(159, 229, 151), rgb(204, 229, 129));
}

.el-popper.is-customized .el-popper__arrow::before {
  background: linear-gradient(45deg, #b2e68d, #bce689);
  right: 0;
}
</style>
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
  }
  // &:hover {
  //   background: linear-gradient(90deg, #008000, #ffffff);
  //   color: #fff;
  // }

  .task-name {
    width: calc(100% - 200px);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    .task-state,
    .task-name-content {
      vertical-align: middle;
    }
    .task-state {
      margin-right: 10px;
    }

    .extro-info {
      margin-top: 10px;
      font-size: 12px;
      color: #a8abb2;

      .create-time,
      .update-time,
      .consumed-time {
        padding-right: 10px;

        &:last-of-type {
          padding-right: 0;
        }
      }
    }
  }

  .operation {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    width: 200px;
    vertical-align: middle;

    .el-button {
      margin-left: 0;
    }
    .done {
      vertical-align: middle;
      margin-right: 10px;
    }
  }
}
.task-todo {
  border-left: 4px solid $state-todo;
}
.task-done {
  border-left: 4px solid $state-done;
}
.task-archive {
  border-left: 4px solid $state-archive;
}
</style>
