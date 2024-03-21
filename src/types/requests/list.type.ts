import { ContactPersonType } from '../schema/client-contact-person.schema'
import { RequestItemFormType } from './common.type'
import { RequestStatus } from '@src/types/common/status.type'

export type RequestListType = {
  id: number
  corporationId: string
  status: RequestStatus
  lsp: { id: string; name: string; email: string }
  client: { id: string; name: string; email: string } //lpm에게만 오는 데이터
  contactPerson: ContactPersonType
  requestedAt: string
  statusUpdatedAt: string | null
  items: RequestItemFormType[]
}
