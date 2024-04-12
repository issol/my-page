export const defaultUploadFileExtention = {
  accept: {
    'image/*': ['.png', '.jpg', '.jpeg'],
    'text/csv': ['.csv'],
    'application/pdf': ['.pdf'],
    'text/plain': ['.txt'],
    'application/vnd.ms-powerpoint': ['.ppt'],
    'application/msword': ['.doc'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [
      '.docx',
    ],
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [
      '.xlsx',
    ],
    'video/*': ['.avi', '.mp4', '.mkv', '.wmv', '.mov'],
    'image/vnd.adobe.photoshop': ['.psd', '.psb'],
  },
}

export const srtUploadFileExtension = {
  accept: {
    ...defaultUploadFileExtention.accept,
    'text/plain': [
      ...defaultUploadFileExtention.accept['text/plain'],
      '.0.89',
      '.vtt',
      '.srt',
      '.smi',
      '.sub',
      '.ass',
      '.ttml',
      '.eztxml',
      '.fcpxml',
    ],
    'application/rtf': ['.rtf'],
    'text/xml': ['.xml'],
    'application/json': ['.json'],
    'application/*': [
      '.stl',
      '.ezt',
      '.cap',
      '.scc',
      '.ooona',
      '.pac',
      '.fpc',
      '.std',
      '.sif',
      '.xif',
      '.itt',
      '.dfxp',
      '.imscr',
      '.ult',
    ],
    'application/zip': ['.zip'],
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [
      '.xlsx',
    ],
  },
}
