<template>
  <div class="task-group">
    <el-tag
      size="large"
      class="task-tag"
      v-for="(tag, index) in tags"
      :key="`tag-${index}`"
      :style="{ '--tag-color': tag.color }"
      :closable="!!index"
      :disable-transitions="false"
      :checked="tag.checked"
      :effect="tag.checked ? 'dark' : 'light'"
      @click="handleClick(index, tag.checked)"
      @close="handleClose(index)"
    >
      {{ tag.name }}
    </el-tag>
    <el-input
      v-if="inputVisible"
      ref="InputRef"
      v-model="inputGroup"
      class="w-20"
      @keyup.enter="handleInputConfirm"
      @blur="handleInputConfirm"
    />
    <el-button v-else type="primary" @click="showInput"> + 添加分组 </el-button>
  </div>
</template>

<script setup lang="ts">
import { ElInput } from 'element-plus'
import { v4 as uuidv4 } from 'uuid'
import useTaskGroups from '../hooks/useTaskGroups'

export interface Tag {
  id: string
  name: string
  color: string
  checked: boolean
}

const emit = defineEmits<{
  select: [tag: Tag]
  remove: [tag: Tag]
}>()

const { getItem, setItem } = useTaskGroups()
const inputGroup = ref('')
const tags = ref<Tag[]>([])
const inputVisible = ref(false)
const InputRef = ref<InstanceType<typeof ElInput>>()

const initTaskGroup = () => {
  const allTaskTag: Tag = {
    id: 'all',
    name: '全部',
    checked: true,
    color: ''
  }
  if (getItem().length) {
    tags.value = getItem()
  } else {
    tags.value = [allTaskTag]
  }
  setItem(tags.value)
  handleClick(0, false)
}
const handleClose = (tagIndex: number) => {
  emit('remove', tags.value[tagIndex])
  tags.value.splice(tagIndex, 1)
  setItem(tags.value)
}
const handleClick = (tagIndex: number, tagChecked: boolean) => {
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
      checked: false
    })
  }
  setItem(tags.value)
  inputVisible.value = false
  inputGroup.value = ''
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
  gap: 8px;
  row-gap: 8px;
  column-gap: 8px;
  border: 1px solid #d4d7de;

  .task-tag {
    &:hover {
      cursor: pointer;
      user-select: none;
    }
  }
  .w-20 {
    width: 100px;
  }
}
</style>
