import { ClientRowType } from '@src/apis/client.api'
import { ContactPersonType } from '../schema/client-contact-person.schema'
import {
  RequestItemFormPayloadType,
  RequestItemFormType,
  RequestStatusType,
} from './common.type'
import { ClientAddressType } from '../schema/client-address.schema'

export type RequestDetailType = {
  id: number
  corporationId: number
  lsp: { id: string; name: string; email: string }
  contactPerson: ContactPersonType
  client: ClientRowType & { addresses?: ClientAddressType[] } //lpm에게만 오는 데이터
  status: RequestStatusType
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
  canceledReason?: CancelReasonType
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
