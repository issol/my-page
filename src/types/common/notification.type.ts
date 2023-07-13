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
  userName: string
  after: {
    corporationId: string
    id: number
  } | null
  before: {
    corporationId: string
    id: number
  } | null
}
