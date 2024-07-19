<template>
  <div class="menu-list">
    <el-menu
      :default-active="active"
      class="el-menu-demo"
      mode="horizontal"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
      @select="handleSelect"
    >
      <el-menu-item
        v-for="(route, index) in curRoutes"
        :key="`router${index}`"
        :index="route.name"
      >
        <!-- <router-link :to="route.path">{{ route.name }}</router-link> -->
        {{ route.name }}
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { routes } from '../router/index'
import { useRouter } from 'vue-router'
const $router = useRouter()
const curRoutes = routes[0].children || []
const firstRoute = curRoutes[0]
const active = ref(firstRoute.name)
const handleSelect = (key: string, keyPath: string[]) => {
  active.value = key
  $router.push(active.value)
}
</script>

<style scoped></style>
