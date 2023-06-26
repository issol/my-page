import { RequestItemFormType, RequestStatusType } from './common.type'

export type RequestListType = {
  id: number
  corporationId: string
  status: RequestStatusType
  lsp: { name: string; email: string }
  requestedAt: string
  statusUpdatedAt: string | null
  items: RequestItemFormType[]
}
