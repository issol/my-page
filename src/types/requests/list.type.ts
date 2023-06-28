import { RequestItemFormType, RequestStatusType } from './common.type'

export type RequestListType = {
  id: number
  corporationId: string
  status: RequestStatusType
  lsp: { id: string; name: string; email: string }
  client: { id: string; name: string; email: string } //TODO: 홒 공유
  requestedAt: string
  statusUpdatedAt: string | null
  items: RequestItemFormType[]
}
