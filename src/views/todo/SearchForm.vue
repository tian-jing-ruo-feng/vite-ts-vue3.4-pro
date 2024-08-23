<template>
	<div class="search-form">
		<el-form ref="form" :inline="true" :model="formInline">
			<el-form-item prop="createTime" label="时间：">
				<el-select
					v-model="formInline.createTime"
					placeholder="按时间筛选"
					style="width: 240px"
				>
					<el-option
						v-for="item in timeOptions"
						:key="item.value"
						:label="item.label"
						:value="item.value"
					/>
				</el-select>
			</el-form-item>
			<!-- 查询/清空 -->
			<el-form-item>
				<el-button @click="reset">重置</el-button>
				<el-button type="primary" @click="search">查询</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script setup lang="ts">
import { FormInstance } from 'element-plus'

export interface TimeItem {
	label: string
	value: 'day' | 'weak' | 'month'
}

export interface FormProps {
	createTime: TimeItem['value']
}

const emits = defineEmits<{
	search: [searchForm: FormProps]
}>()

const FormRef = ref<FormInstance>()

const timeOptions: TimeItem[] = [
	{
		label: '今日',
		value: 'day'
	},
	{
		label: '近一周',
		value: 'weak'
	},
	{
		label: '近一月',
		value: 'month'
	}
]

const formInline: FormProps = reactive({
	createTime: 'day'
})

const reset = () => {
	formInline.createTime = 'day'
	// FormRef.value?.resetFields()
	emits('search', formInline)
}
const search = () => {
	emits('search', formInline)
}

onMounted(() => {
	emits('search', formInline)
})
</script>

<style lang="scss" scoped></style>
