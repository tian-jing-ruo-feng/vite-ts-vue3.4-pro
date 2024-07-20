<template>
  <li class="task-item">
    <el-tooltip
      :visible="tooltipVisible"
      trigger="hover"
      placement="top"
      effect="customized"
    >
      <template #content>
        <p class="tooltip-custom-cotent">
          {{ task.name }}
        </p>
      </template>

      <p
        class="task-name"
        ref="taskWrap"
        @mouseenter="handleMouseEnter"
        @mouseleave="handleMouseLeave"
      >
        <span ref="taskName">
          {{ task.name }}
        </span>
      </p>
    </el-tooltip>
    <div class="operation">
      <el-icon class="done">
        <ep-success-filled color="green"></ep-success-filled>
      </el-icon>
      <!-- archive 归档到某个分类（文件夹） -->
      <el-button size="small" plain>
        <el-icon>
          <ep-collection color="#409EFF"></ep-collection>
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

const taskWrap = ref<HTMLElement>()
const taskName = ref<HTMLElement>()
const visible = ref(false)
const visibleComputed = ref(false)
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
    border-top: 2px solid green;
  }
  &:hover {
    background: linear-gradient(90deg, #008000, #ffffff);
    color: #fff;
  }

  .task-name {
    width: 80%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .operation {
    vertical-align: middle;

    .done {
      vertical-align: middle;
      margin-right: 10px;
    }
  }
}
</style>
