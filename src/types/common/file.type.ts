export type FileType = {
  id?: number
  name: string
  size: number
  type?: string
  file?: string
  path?: string
  extension?: string
  createdAt?: string
  savedAt?: string
  downloadAvailable?: boolean
  isImported?: boolean
  isSelected?: boolean
  alreadyInReviewRequest?: boolean
  uploadedBy?: string
  uniqueId?: string
  jobFileId?: number
  savedType?: 'UPLOAD' | 'IMPORT'
}
