<template>
  <div class="row">
    <div class="col-8">
      <h3>Nested draggable</h3>
      <draggable :tasks="list" />
    </div>
  </div>
</template>

<script setup lang='ts'>
import Draggable from './Draggable.vue';
const list = [
  {
    name: "task 1",
    tasks: [
      {
        name: "task 2",
        tasks: []
      }
    ]
  },
  {
    name: "task 3",
    tasks: [
      {
        name: "task 4",
        tasks: []
      }
    ]
  },
  {
    name: "task 5",
    tasks: []
  }
]
</script>

<style lang='scss' scoped>
</style>