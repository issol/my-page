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
    case 'mkv':
    case 'flv':
    case 'wmv':
    case 'webm':
    case 'mpeg':
    case 'mpg':
    case 'm4v':
    case '3gp':
    case 'ts':
    case 'vob':
    case 'ogv':
      return 'video'
    default:
      return 'default'
  }
}
