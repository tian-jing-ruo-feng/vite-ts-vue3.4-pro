<template>
	<el-config-provider :locale="locale">
		<RouterView></RouterView>
	</el-config-provider>
</template>

<script setup lang="ts">
import { zhCn, en } from 'element-plus/es/locales.mjs'
import { useUser } from './store/user'

const { getUserInfo } = useUser()

const language = ref('zh-cn')
const locale = computed(() => (language.value === 'zh-cn' ? zhCn : en))

// 中英文切换
const toggle = () => {
	language.value = language.value === 'zh-cn' ? 'en' : 'zh-cn'
}

onMounted(() => {
	getUserInfo()
})
</script>

<style scoped></style>
