<template>
  <div class="group-tag">
    <el-tag effect="plain">
      <el-icon size="16" class="tag-icon">
        <ep-collection-tag></ep-collection-tag>
      </el-icon>
      {{ tagName }}
    </el-tag>
  </div>
</template>

<script setup lang="ts">
interface Props {
  tagName: string
}
withDefaults(defineProps<Props>(), {
  tagName: '分组标签'
})
</script>

<style lang="scss" scoped>
.group-tag {
  // border: 1px solid red;
  // border-radius: 4px;
  .tag-icon {
    vertical-align: text-bottom;
  }
}
</style>
