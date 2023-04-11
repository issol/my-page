export function downloadBase64File(
  base64Data: string,
  mime: string,
  fileName: string,
) {
  const strArr = mime.split('/')
  const fileType = strArr.slice(1).join('/')

  const linkSource = `data:${mime};base64,${base64Data}`
  const downloadLink = document.createElement('a')
  const fileNameWithExtension = `${fileName}.${fileType}`
  downloadLink.href = linkSource
  downloadLink.download = fileNameWithExtension
  downloadLink.click()
}
