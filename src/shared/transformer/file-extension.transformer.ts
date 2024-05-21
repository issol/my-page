export const extractFileExtension = (fileName: string) => {
  const fileExtension = fileName
    ? fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase()
    : 'default'

  switch (fileExtension) {
    case 'doc':
    case 'docx':
      return 'doc'
    case 'xls':
    case 'xlsx':
    case 'csv':
      return 'excel'
    case 'pdf':
      return 'pdf'
    case 'ppt':
    case 'pptx':
      return 'ppt'
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'gif':
      return 'img'
    case 'mp4':
    case 'mov':
    case 'avi':
      return 'video'
    default:
      return 'default'
  }
}
