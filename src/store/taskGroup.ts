import { defineStore } from 'pinia'
import useTaskGroups from '../hooks/useTaskGroups'

const { getItem, setItem } = useTaskGroups()

export interface Tag {
	id: string
	name: string
	color: string
	checked: boolean
	edited?: boolean
	isDeleted?: boolean
}
export const initTag: Tag = {
	id: 'all',
	name: '全部',
	checked: true,
	edited: false,
	color: '',
	isDeleted: false
}

const existedTags = getItem()
if (!existedTags.length) {
	setItem([initTag])
}
export const useTaskGroupStore = defineStore('taskGroup', () => {
	// state
	const tags = ref<Tag[]>(getItem())

	// getters

	// actions
	const add = (tag: Tag) => {
		tags.value.push(tag)
		setItem(tags.value)
		return tags
	}
	const update = (tag: Partial<Tag>) => {
		tags.value = tags.value.map(_tag => {
			if (_tag.id === tag.id) {
				return {
					..._tag,
					...tag
				}
			}
			return _tag
		})
		setItem(tags.value)
		return tags
	}
	const checkTag = (tag: Tag) => {
		tags.value = tags.value.map(_tag => {
			if (_tag.id === tag.id) {
				_tag.checked = true
			} else {
				_tag.checked = false
			}
			return _tag
		})
	}
	const remove = (tag: Tag) => {
		tags.value = tags.value.map(_tag => {
			if (_tag.id === tag.id) {
				return {
					..._tag,
					isDeleted: true
				}
			}
			return _tag
		})
		setItem(tags.value)
		return tag
	}

	return {
		tags,
		add,
		update,
		remove,
		checkTag
	}
})
