<template>
	<el-container class="profile">
		<el-row :gutter="20">
			<el-col :span="6" class="left-info">
				<el-avatar size="large" :src="circleUrl" />
				<h2 class="user-name">{{ user.name }}</h2>
				<h2 class="user-role">{{ RoleMap[user.role] }}</h2>
			</el-col>
			<el-col :span="18" class="right-info">
				<el-row :gutter="20">
					<el-col :span="24">
						<el-card shadow="never">
							<template #header></template>
						</el-card>
					</el-col>
				</el-row>
				<el-row :gutter="20">
					<el-col :span="12">
						<el-card shadow="never"></el-card>
					</el-col>
					<el-col :span="12">
						<el-card shadow="never"></el-card>
					</el-col>
				</el-row>
				<el-row :gutter="20">
					<el-col :span="12">
						<el-card shadow="never"></el-card>
					</el-col>
					<el-col :span="12">
						<el-card shadow="never"></el-card>
					</el-col>
				</el-row>
			</el-col>
		</el-row>
	</el-container>
</template>

<script setup lang="ts">
import { useUser, RoleMap } from '@/store/user'

const userStore = useUser()
const { user } = userStore

const circleUrl =
	'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
</script>

<style scoped lang="scss">
.profile {
	position: relative;
	width: 80%;
	margin: 0 auto;
	&::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		// background: no-repeat center/100% url(/coffee.png);
		opacity: 0.1;
	}
	.el-row {
		width: 100%;

		.left-info {
			text-align: right;
			& > * {
				margin-bottom: 10px;
			}
			.user-name,
			.user-role {
				font-size: 20px;
				font-weight: bold;
			}
		}

		.right-info {
			& > .el-row {
				display: flex;
				margin-bottom: 40px;
				& > .el-col > .el-card {
					flex: 1;
					min-height: 180px;
					// background: rgba($color: #000000, $alpha: 0.4);
				}
			}
		}
	}
}
</style>
