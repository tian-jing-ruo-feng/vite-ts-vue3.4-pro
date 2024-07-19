<template>
  <draggable
    class="dragArea"
    tag="ul"
    :list="tasks"
    :group="{ name: 'g1' }"
    item-key="name"
  >
    <template #item="{ element }">
      <li>
        <p>{{ element.name }}</p>
        <nested-draggable :tasks="element.tasks" />
      </li>
    </template>
  </draggable>
</template>
<script setup lang="ts">
import draggable from 'vuedraggable'
defineProps({
  tasks: {
    type: Array,
    required: true
  }
})

defineOptions({
  name: 'nested-draggable'
})

</script>
<style scoped lang="scss">
.dragArea {
  min-height: 50px;
  outline: 1px dashed;
}
</style>