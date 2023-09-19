import { ContactPersonType } from '../schema/client-contact-person.schema'
import { RequestItemFormType, RequestStatusType } from './common.type'

export type RequestListType = {
  id: number
  corporationId: string
  status: RequestStatusType
  lsp: { id: string; name: string; email: string }
  client: { id: string; name: string; email: string } //lpm에게만 오는 데이터
  contactPerson: ContactPersonType
  requestedAt: string
  statusUpdatedAt: string | null
  items: RequestItemFormType[]
}
