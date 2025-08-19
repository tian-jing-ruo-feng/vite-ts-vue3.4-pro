<template>
	<div class="task-group-container">
		<el-scrollbar class="tags-scrollbar" always>
			<div class="tags-wrapper">
				<div
					v-for="(tag, index) in tags"
					:key="`tag-${index}`"
					class="tag-wrapper"
				>
					<el-tag
						v-if="!tag.isDeleted"
						size="large"
						class="task-tag"
						:style="{ '--tag-color': tag.color }"
						:class="{
							'is-editing': tag.edited,
							'is-active': tag.checked,
							'is-default': !tag.checked
						}"
						:disable-transitions="false"
						@click="handleTagClick(tag)"
						@dblclick="handleDoubleClick(tag)"
					>
						<el-tooltip
							v-if="tag.name.length > 6"
							:content="tag.name"
							placement="top"
						>
							<span v-if="!tag.edited" class="tag-name">{{ tag.name }}</span>
						</el-tooltip>
						<span v-if="!tag.edited && tag.name.length <= 6" class="tag-name">{{
							tag.name
						}}</span>
						<el-input
							v-else
							ref="taskEditedRef"
							v-model="tag.name"
							@keyup.enter="handleEditTagChange(tag)"
							@blur="handleEditTagChange(tag)"
						></el-input>
						<el-popconfirm
							v-if="!!index && !tag.edited"
							width="100"
							confirm-button-text="确认"
							cancel-button-text="取消"
							icon-color="#F56C6C"
							title="确认删除分组?"
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
			</div>
		</el-scrollbar>
		<div class="action-buttons">
			<el-input
				v-if="inputVisible"
				ref="InputRef"
				v-model="inputGroup"
				class="add-tag-input"
				placeholder="输入分组名称"
				@keyup.enter="addTag"
				@blur="addTag"
			/>
			<el-button
				v-else
				type="primary"
				plain
				class="add-tag-button"
				@click="showInput"
			>
				<el-icon><Plus /></el-icon> 添加分组
			</el-button>
			<el-button
				type="primary"
				plain
				class="manage-button"
				@click="manageGroup"
			>
				<el-icon><Setting /></el-icon> 分组管理
			</el-button>
		</div>
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

<style lang="scss" scoped>
.task-group-container {
	display: flex;
	flex-direction: column;
	gap: 16px;
	margin-bottom: 16px;

	.tags-scrollbar {
		max-width: 100%;
		overflow-x: auto;
		padding-bottom: 4px;

		.tags-wrapper {
			display: flex;
			flex-wrap: wrap;
			gap: 10px;
			padding: 8px 12px;
			background-color: var(--el-fill-color-light);
			border-radius: var(--el-border-radius-base);
			box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
			transition: all 0.3s;

			&:hover {
				box-shadow: 0 2px 12px rgba(0, 0, 0, 0.12);
			}

			.tag-wrapper {
				position: relative;
				transition: transform 0.2s;

				&:hover {
					transform: scale(1.05);
				}
			}

			.task-tag {
				cursor: pointer;
				transition: all 0.3s;
				background-color: var(--tag-color);
				color: white;
				border: none;
				margin-right: 0;

				&:hover {
					transform: translateY(-2px);
					box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
				}

				&.is-editing {
					background-color: transparent;
					color: var(--el-text-color-regular);
					border: 1px solid var(--el-border-color);
				}

				&.is-active {
					border: 1px solid var(--el-color-primary);
					box-shadow: 0 0 0 2px rgba(var(--el-color-primary-rgb), 0.3);
				}

				&.is-default {
					opacity: 0.8;
				}

				.tag-name {
					max-width: 120px;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					display: inline-block;
					vertical-align: middle;
				}

				.del-button {
					margin-left: 8px;
					cursor: pointer;
					transition: color 0.2s;
					&:hover {
						color: var(--el-color-danger);
					}
				}
			}
		}
	}

	.action-buttons {
		display: flex;
		gap: 12px;
		align-items: center;

		.add-tag-input {
			width: 180px;
			transition: all 0.3s;

			&:focus {
				width: 220px;
			}
		}

		.add-tag-button,
		.manage-button {
			transition: all 0.3s;

			&:hover {
				transform: translateY(-2px);
			}
		}
	}
}
</style>
