import { ContactPersonType } from '../schema/client-contact-person.schema'
import { RequestItemFormType, RequestStatusType } from './common.type'

export type RequestDetailType = {
  id: number
  corporationId: number
  lsp: { id: string; name: string; email: string }
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
  canceledReason?: CancelReasonType
  linkedQuote?: LinkedInfoType
  linkedOrder?: LinkedInfoType
}

export type LinkedInfoType = {
  id: number
  corporationId: number
}
export type CancelReasonType = {
  from: 'client' | 'lsp'
  reason: string
  message: string
}
