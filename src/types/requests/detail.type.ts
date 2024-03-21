import { ClientRowType } from '@src/apis/client.api'
import { ContactPersonType } from '../schema/client-contact-person.schema'
import { RequestItemFormPayloadType } from './common.type'
import { ClientAddressType } from '../schema/client-address.schema'
import { RequestStatus } from '@src/types/common/status.type'

export type RequestDetailType = {
  id: number
  corporationId: string
  lsp: { id: string; name: string; email: string }
  contactPerson: ContactPersonType
  client: ClientRowType & { addresses?: ClientAddressType[] } //lpm에게만 오는 데이터
  status: RequestStatus
  items: Array<RequestItemFormPayloadType & { id: number }>
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
  canceledReason?: CancelReasonType | null
  linkedQuote?: LinkedInfoType
  linkedOrder?: LinkedInfoType
  showDescription?: boolean
}

export type LinkedInfoType = {
  id: number
  corporationId: number
}
export type CancelReasonType = {
  from: 'client' | 'lsp'
  reason: string | string[]
  message: string
  type?: string
}
