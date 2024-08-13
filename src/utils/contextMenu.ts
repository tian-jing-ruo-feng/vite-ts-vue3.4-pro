export interface MenuContextItem {
	// label, callback
	contextName: string
	callback: () => void
}
export type menuContexts = MenuContextItem[]

export const menus: menuContexts = [
	{
		contextName: '归档',
		callback: () => {}
	},
	{
		contextName: '删除',
		callback: () => {}
	}
]
