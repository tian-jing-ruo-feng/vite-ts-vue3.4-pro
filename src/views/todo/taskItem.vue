<template>
  <li class="task-item">
    {{ task.name }}
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
      <el-button size="small" round @click="$emit('deleteTask', task.id)">
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

  .operation {
    vertical-align: middle;

    .done {
      vertical-align: middle;
      margin-right: 10px;
    }
  }
}
</style>
