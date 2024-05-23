export type FileType = {
  id?: number
  name: string
  size: number
  type?: string
  file?: string
  createdAt?: string
  downloadAvailable?: boolean
  isImported?: boolean
  isSelected?: boolean
  reviewRequested?: boolean
  uploadedBy?: string
}
