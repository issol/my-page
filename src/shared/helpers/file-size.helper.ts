export const byteToKB = (byte: number): string => {
  const kb = Math.round(byte / 1024)
  return `${kb} KB`
}

export const byteToMB = (byte: number): string => {
  const mb = Math.round(byte / (1024 * 1024))
  return `${mb} MB`
}

export const byteToGB = (byte: number): string => {
  const gb = Math.round(byte / (1024 * 1024 * 1024))
  return `${gb} GB`
}

export const formatFileSize = (byte: number): string => {
  if (byte === 0) return '0'
  if (byte < 1024) {
    return `${byte} B`
  } else if (byte < 1024 * 1024) {
    const kb = Math.round(byte / 1024)
    return `${kb} KB`
  } else if (byte < 1024 * 1024 * 1024) {
    const mb = Math.round(byte / (1024 * 1024))
    return `${mb} MB`
  } else {
    const gb = Math.round(byte / (1024 * 1024 * 1024))
    return `${gb} GB`
  }
}
