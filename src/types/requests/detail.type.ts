import { ContactPersonType } from '../schema/client-contact-person.schema'
import { RequestItemFormType, RequestStatusType } from './common.type'

export type RequestDetailType = {
  id: number
  corporationId: string
  lsp: { id: number; name: string; email: string }
  contactPerson: ContactPersonType
  status: RequestStatusType
  items: Array<RequestItemFormType & { id: number }>
  sampleFiles?: Array<{
    id?: number
    filePath: string
    fileName: string
    fileExtension: string
    fileSize: number
  }>
  requestedAt: string
  statusUpdatedAt: string | null
  notes?: string
}
