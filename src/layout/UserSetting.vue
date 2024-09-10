<template>
	<div class="user-login">
		<el-dropdown class="dropdown" @command="handleCommand">
			<span class="el-dropdown-link"
				><el-avatar>{{ user.name }}</el-avatar></span
			>
			<template #dropdown>
				<el-dropdown-menu>
					<div v-for="{ command, visible, label } in commands" :key="command">
						<el-dropdown-item v-if="visible" :command="command">{{
							label
						}}</el-dropdown-item>
					</div>
				</el-dropdown-menu>
			</template>
		</el-dropdown>
	</div>
</template>

<script setup lang="ts">
import { useUser } from '@/store/user'

const userStore = useUser()
const { getUserInfo, setUserInfoInLocal } = userStore
const { user } = storeToRefs(userStore)

type Command = {
	command: number
	label: string
	visible: boolean
}

const emit = defineEmits<{
	command: [command: number]
}>()

const commands = ref<Command[]>([
	{
		label: '登 录',
		command: 0,
		visible: user.value.role === 0
	},
	{
		label: '登 出',
		command: 1,
		visible: user.value.role !== 0
	},
	{
		label: '注 册',
		command: 2,
		visible: user.value.role === 0
	},
	{
		label: '个人中心',
		command: 3,
		visible: user.value.role !== 0
	}
])

const handleCommand = (command: Command['command']) => {
	// console.log(command)
	emit('command', command)
}
onMounted(() => {
	setUserInfoInLocal(getUserInfo())
})
</script>

<style scoped lang="scss">
.user-login {
	.dropdown {
		vertical-align: middle;
	}
}
</style>
