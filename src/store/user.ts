export type Role = 0 | 1

export interface User {
	name: string
	password: string
	role: Role
}

export const useUser = defineStore('user', () => {
	const user = reactive<User>({
		name: 'guest',
		password: '',
		role: 0
	})

	const getUserInfo = (): Partial<User> => {
		const userInfo = localStorage.getItem('userInfo')
		if (userInfo) {
			const parseUser = JSON.parse(userInfo) as Partial<User>
			user.name = parseUser.name ?? ''
			user.password = parseUser.password ?? ''
			user.role = parseUser.role ?? 0
			return parseUser
		}
		const guest = {
			name: '游客',
			role: 0
		} as Omit<User, 'password'>
		user.name = guest.name
		user.role = guest.role
		return guest
	}

	const setUserInfoInLocal = (userInfo: Partial<User>) => {
		localStorage.setItem('userInfo', JSON.stringify(userInfo))
	}

	const clear = () => localStorage.removeItem('userInfo')

	return {
		user,
		clear,
		getUserInfo,
		setUserInfoInLocal
	}
})
