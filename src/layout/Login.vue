<template>
	<div ref="userLoginRef" class="user-login">
		<el-dialog
			v-model="visible"
			class="login-dialog"
			fullscreen
			:append-to="userLoginRef"
			:modal="false"
			:modal-class="'login-model'"
			:show-close="false"
		>
			<ul class="dialog-content">
				<li class="bg"></li>
				<li class="left-bg"></li>
				<li class="right-form">
					<el-card shadow="never">
						<el-form
							class="user-form"
							:model="userForm"
							:rules="rules"
							:label-position="'top'"
							:hide-required-asterisk="true"
						>
							<el-form-item label="用户名称" prop="name">
								<el-input
									v-model="userForm.name"
									:suffix-icon="UserIcon"
								></el-input>
							</el-form-item>
							<el-form-item label="用户密码" prop="password">
								<el-input
									v-model="userForm.password"
									type="password"
									show-password
								></el-input>
							</el-form-item>
							<el-form-item>
								<div class="button-group">
									<el-button plain round @click="visible = false"
										>取 消</el-button
									>
									<el-button
										plain
										round
										type="primary"
										@click="handleConfirm"
										>{{ confirmText }}</el-button
									>
								</div>
							</el-form-item>
						</el-form>
					</el-card>
				</li>
			</ul>
		</el-dialog>
	</div>
</template>

<script setup lang="ts">
import { User as UserIcon } from '@element-plus/icons-vue'
import { FormRules } from 'element-plus'

export interface User {
	name: string
	password: string
}

const confirmText = defineModel<string>('confirmText')
const visible = defineModel<boolean>()
const emit = defineEmits<{
	login: [user: User]
}>()

const userLoginRef = ref<HTMLElement>()
const userForm = reactive<User>({
	name: 'admin',
	password: '123456'
})
const rules = reactive<FormRules<User>>({
	name: {
		required: true,
		message: '请输入用户名称',
		trigger: 'blur'
	},
	password: {
		required: true,
		message: '请输入用户名称',
		trigger: 'blur'
	}
})

const handleConfirm = () => {
	if (confirmText.value === '注 册') {
		ElNotification.success('注册成功')
		confirmText.value = '登 录'
	} else {
		emit('login', userForm)
	}
}
</script>

<style lang="scss">
.login-model {
	position: static !important;
	z-index: 0 !important;
	.login-dialog {
		padding: 0;
		.el-dialog__header {
			display: none;
		}
	}

	.el-input__wrapper {
		background-color: rgba($color: #000000, $alpha: 0.1);
	}

	.el-card__body {
		height: inherit;
		background-color: rgba($color: #b8d0f2, $alpha: 0.2);
	}
	.el-input__suffix {
		color: var(--el-color-primary);

		.el-input__password {
			color: inherit;
		}
	}
}
</style>
<style lang="scss" scoped>
.dialog-content {
	position: relative;
	display: flex;
	height: 100vh;
	background-image: linear-gradient(
		to right,
		#b8d0f2,
		#b0ddef,
		#bae7e5,
		#d1eedd,
		#ebf2dd
	);
	.left-bg,
	.right-form {
		flex: 1;
		height: inherit;
	}

	.left-bg {
		background: no-repeat center/100% url('/login.png');
	}

	.right-form {
		.el-card {
			position: relative;
			height: inherit;
			background-color: transparent;
			border: none;
			border-radius: 0;
		}
		.user-form {
			position: absolute;
			width: 35%;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			padding: 40px 40px 20px 40px;
			border-radius: 6px;
			background-color: rgba($color: #000000, $alpha: 0.1);
			box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.12);

			.button-group {
				display: flex;
				width: 100%;
				margin-top: 20px;
				text-align: right;

				.el-button {
					flex: 1;
					padding: 20px;
					box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.12);
					background-color: rgba($color: #b8d0f2, $alpha: 0.1);
				}
			}
		}
	}
}
</style>
