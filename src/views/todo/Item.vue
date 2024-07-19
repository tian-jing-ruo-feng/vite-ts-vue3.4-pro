<template>
  <div class="item">
    <el-input v-model="task"></el-input>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const task = ref('')
</script>

<style scoped></style>
