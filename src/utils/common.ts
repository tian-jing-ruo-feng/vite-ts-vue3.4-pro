export const downloadFile = (
	fileData: any,
	fileType: string,
	fileName: string
) => {
	const link = document.createElement('a')

	// 创建一个blob对象 并规定为.xlsx类型
	const blob = new Blob([fileData], {
		type: fileType
	})
	// 使新创建的a标签不可见
	link.style.display = 'none'
	// blob对象在内存中的url
	link.href = URL.createObjectURL(blob)
	link.download = fileName
	document.body.appendChild(link)
	link.click()
	document.body.removeChild(link)
}
