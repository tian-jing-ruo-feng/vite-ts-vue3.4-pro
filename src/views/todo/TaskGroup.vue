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
        @click="handleClick(index, tag.checked)"
        @dblclick="handleDoubleClick(index, tag.checked)"
        @close="handleClose(index)"
      >
        <span class="tag-name" v-if="!tag.edited">{{ tag.name }}</span>
        <el-input
          v-else
          ref="taskEditedRef"
          v-model="tag.name"
          @keyup.enter="handleEditEnter(tag)"
          @blur="handleEditBlur(tag)"
        ></el-input>
        <el-popconfirm
          width="100"
          confirm-button-text="确认"
          cancel-button-text="取消"
          icon-color="#F56C6C"
          title="确认删除分组?"
          v-if="!!index && !tag.edited"
          :icon="InfoFilled"
          @confirm="handleClose(index)"
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
      @keyup.enter="handleInputConfirm"
      @blur="handleInputConfirm"
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
import useTaskGroups from '../../hooks/useTaskGroups'
import { Delete, InfoFilled } from '@element-plus/icons-vue'

export interface Tag {
  id: string
  name: string
  color: string
  checked: boolean
  edited?: boolean
  isDeleted?: boolean
}

const emit = defineEmits<{
  select: [tag: Tag]
  remove: [tag: Tag]
}>()

const { getItem, setItem } = useTaskGroups()
const timer = ref()
const taskEditedRef = ref<HTMLInputElement[] | null>()
const inputGroup = ref('')
const tags = ref<Tag[]>([])
const canEdit = ref(false)
const editVisible = ref(false)
const inputVisible = ref(false)
const InputRef = ref<InstanceType<typeof ElInput>>()

const initTaskGroup = async () => {
  const allTaskTag: Tag = {
    id: 'all',
    name: '全部',
    checked: true,
    edited: false,
    color: '',
    isDeleted: false
  }
  if (getItem().length) {
    tags.value = getItem().map((tag) => {
      tag.edited = false
      return tag
    })
  } else {
    tags.value = [allTaskTag]
  }
  setItem(tags.value)
  await nextTick()
  handleClick(0, false)
}
const handleClose = (tagIndex: number) => {
  // tags.value.splice(tagIndex, 1)
  // soft delete
  tags.value[tagIndex].isDeleted = true
  setItem(tags.value)
  handleClick(0, false)
}
const handleClick = (tagIndex: number, tagChecked: boolean) => {
  timer.value = setTimeout(() => {
    // tag unchecked
    if (!tagChecked) {
      // set all tag checked in false
      tags.value = tags.value.map((tag) => {
        tag.checked = false
        return tag
      })
      // set clicked tag checked in true
      tags.value[tagIndex].checked = true
      emit('select', tags.value[tagIndex])
    }
  }, 300)
}
const handleDoubleClick = (tagIndex: number, tagChecked: boolean) => {
  clearTimeout(timer.value)
  if (!tagIndex) {
    return
  }
  // tag unchecked
  if (!tagChecked) {
    // set all tag checked in false
    tags.value = tags.value.map((tag) => {
      tag.checked = false
      return tag
    })
    // set clicked tag checked in true
    tags.value[tagIndex].checked = true
    emit('select', tags.value[tagIndex])
  }
  tags.value[tagIndex].edited = true
  setItem(tags.value)
  nextTick(() => {
    if (taskEditedRef.value) {
      taskEditedRef.value[0]?.focus()
    }
  })
}
const handleEditEnter = (tag: Tag) => {
  tag.edited = false
  setItem(tags.value)
  emit('select', tag)
}
const handleEditBlur = (tag: Tag) => {
  tag.edited = false
  setItem(tags.value)
}
const showInput = () => {
  inputVisible.value = true
  nextTick(() => {
    InputRef.value!.input!.focus()
  })
}

const handleInputConfirm = () => {
  if (inputGroup.value) {
    tags.value.push({
      id: uuidv4(),
      name: inputGroup.value,
      color: getHexColor(),
      checked: false,
      edited: false
    })
  }
  setItem(tags.value)
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

onBeforeMount(() => {
  initTaskGroup()
})
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
