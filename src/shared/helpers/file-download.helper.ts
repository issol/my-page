// ** 서버에 저장된 것이 아닌 state에 저장되어 있는 file을 다운로드 함.
export function downloadStateFile(file: File): void {
  console.log('file', file)
  const url = URL.createObjectURL(file)
  const link = document.createElement('a')
  link.href = url
  link.download = file.name
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
