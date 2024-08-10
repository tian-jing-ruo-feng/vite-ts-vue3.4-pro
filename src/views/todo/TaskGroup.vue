<template>
	<div class="task-group">
		<div v-for="(tag, index) in tags" :key="`tag-${index}`" class="tag-wrapper">
			<el-tag
				size="large"
				class="task-tag"
				v-if="!tag.isDeleted"
				:style="{ '--tag-color': tag.color }"
				:class="{ 'is-editing': tag.edited }"
				:disable-transitions="false"
				:checked="tag.checked"
				:effect="tag.checked ? 'dark' : 'light'"
				@click="handleTagClick(tag)"
				@dblclick="handleDoubleClick(tag)"
				@close="removeTag(tag)"
			>
				<span class="tag-name" v-if="!tag.edited">{{ tag.name }}</span>
				<el-input
					v-else
					ref="taskEditedRef"
					v-model="tag.name"
					@keyup.enter="handleEditTagChange(tag)"
					@blur="handleEditTagChange(tag)"
				></el-input>
				<el-popconfirm
					width="100"
					confirm-button-text="确认"
					cancel-button-text="取消"
					icon-color="#F56C6C"
					title="确认删除分组?"
					v-if="!!index && !tag.edited"
					:icon="InfoFilled"
					@confirm="removeTag(tag)"
				>
					<template #reference>
						<el-icon class="del-button">
							<Delete></Delete>
						</el-icon>
					</template>
				</el-popconfirm>
			</el-tag>
		</div>
		<el-input
			v-if="inputVisible"
			ref="InputRef"
			v-model="inputGroup"
			class="w-20"
			@keyup.enter="addTag"
			@blur="addTag"
		/>
		<el-button v-else type="primary" @click="showInput"> + 添加分组 </el-button>
		<el-button plain type="primary" @click="manageGroup">
			<el-icon style="margin-right: 8px">
				<FaCog></FaCog>
			</el-icon>
			分组管理
		</el-button>
	</div>
</template>

<script setup lang="ts">
import { ElInput } from 'element-plus'
import { v4 as uuidv4 } from 'uuid'
import { Delete, InfoFilled } from '@element-plus/icons-vue'
import { useTaskGroupStore, type Tag } from '../../store/taskGroup'
const store = useTaskGroupStore()
const { add, update, remove, checkTag } = store
const { tags } = storeToRefs(store)

const emit = defineEmits<{
	select: [tag: Tag]
	remove: [tag: Tag]
}>()

const timer = ref()
const taskEditedRef = ref<HTMLInputElement[] | null>()
const inputGroup = ref('')
const canEdit = ref(false)
const inputVisible = ref(false)
const InputRef = ref<InstanceType<typeof ElInput>>()

const removeTag = (tag: Tag) => {
	remove(tag)
	checkTag(tags.value[0])
	handleTagClick()
}

const handleTagClick = (tag?: Tag) => {
	timer.value = setTimeout(() => {
		tag = tag ?? tags.value[0]
		if (!tag?.checked) {
			checkTag(tag)
		}
		emit('select', tag)
	}, 300)
}

const handleDoubleClick = (tag: Tag) => {
	clearTimeout(timer.value)

	tags.value.forEach(_tag => {
		if (_tag.id === tag.id) {
			update({ ..._tag, checked: true, edited: true })
		} else {
			update({ ..._tag, checked: false, edited: false })
		}
	})

	nextTick(() => {
		if (taskEditedRef.value) {
			taskEditedRef.value[0]?.focus()
		}
	})
}

const handleEditTagChange = (tag: Tag) => {
	update({
		...tag,
		edited: false
	})
	handleTagClick(tag)
	emit('select', tag)
}

const showInput = () => {
	inputVisible.value = true
	nextTick(() => {
		InputRef.value!.input!.focus()
	})
}

const addTag = () => {
	if (inputGroup.value) {
		const tag = {
			id: uuidv4(),
			name: inputGroup.value,
			color: getHexColor(),
			checked: false,
			edited: false,
			isDeleted: false
		}
		add(tag)
		handleTagClick(tag)
	}
	inputVisible.value = false
	inputGroup.value = ''
}

const manageGroup = () => {
	canEdit.value = !canEdit.value
}
// 调色盘 color palette
const getHexColor = () => {
	// #ffaabb
	const HexValues = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'a', 'b', 'c', 'd', 'e', 'f']
	// [0 -1)
	const randomHex = () => HexValues[Math.floor(Math.random() * 17)]
	let HexColor = '#'
	for (let i = 0; i < 6; i++) {
		HexColor += randomHex()
	}

	return HexColor
}
</script>

<style scoped lang="scss">
.task-group {
	display: flex;
	padding: 10px 4px;
	border: 1px solid #d4d7de;

	.tag-wrapper {
		&:first-of-type {
			.tag-name {
				margin-right: 0;
			}
		}
	}
	.task-tag {
		margin-right: 10px;
		&:hover {
			cursor: pointer;
			user-select: none;
		}
		&.is-editing {
			border: none;
			padding: 0;
		}
		.tag-name {
			margin-right: 10px;
		}
		.del-button {
			vertical-align: text-top;
		}
	}
	.w-20 {
		width: 100px;
	}
}
</style>
