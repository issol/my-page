export type NotificationType = {
  id: number
  createdAt: string
  action:
    | 'created'
    | 'statusUpdated'
    | 'deleted'
    | 'assigned'
    | 'unassigned'
    | 'pastDeadline'
    | 'restored'
    | 'pastDueDate'
    | 'feedbackRegistered'
    | 'accepted'
    | 'msgRegistered'
    | 'edited'
    | 'rejected'
    | 'assignCanceled'
  type:
    | 'Quote'
    | 'Order'
    | 'Job'
    | 'Invoice-receivable'
    | 'Invoice-payable'
    | 'Request'
  connectedLink?: string
  isRead: boolean
  entityCorporationId: string
  userName: string
  after: {
    corporationId?: string
    status?: string
    id?: number
    firstName?: string
    lastName?: string
    middleName?: string
    version?: number
  } | null
  before: {
    corporationId?: string
    status?: string
    id?: number
    firstName?: string
    lastName?: string
    middleName?: string
    version?: number
  } | null
}
