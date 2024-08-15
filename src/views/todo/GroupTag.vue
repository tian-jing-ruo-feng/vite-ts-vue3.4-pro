<template>
	<div class="group-tag">
		<el-tag effect="plain">
			<el-icon size="16" class="tag-icon">
				<ep-collection-tag></ep-collection-tag>
			</el-icon>
			<span class="name" :class="{ 'is-deleted': tag!.isDeleted }">
				{{ tag!.name }}
			</span>
		</el-tag>
	</div>
</template>

<script setup lang="ts">
import { Tag } from '../../store/taskGroup'

interface Props {
	tag: Partial<Tag> | null
}
withDefaults(defineProps<Props>(), {
	tag: () => {
		return {
			name: '分组标签',
			isDeleted: false
		}
	}
})
</script>

<style lang="scss" scoped>
.group-tag {
	// border: 1px solid red;
	// border-radius: 4px;
	.tag-icon {
		vertical-align: text-bottom;
	}

	.is-deleted {
		text-decoration: line-through;
		color: #c0c4cc;
	}
}
</style>
