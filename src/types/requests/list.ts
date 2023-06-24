import { RequestItemFormType, RequestStatusType } from './common'

export type RequestListType = {
  id: number
  corporationId: string
  status: RequestStatusType
  lsp: { name: string; email: string }
  requestedAt: string
  items: RequestItemFormType[]
}
