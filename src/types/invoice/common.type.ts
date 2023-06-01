export type InvoicePayableStatusType =
  | 'Invoice created'
  | 'Invoice accepted'
  | 'Paid'
  | 'Overdue'
  | 'Canceled'

export type InvoiceReceivableStatusType =
  | 'In preparation'
  | 'Checking in progress'
  | 'Accepted by client'
  | 'Tax invoice issued'
  | 'Paid'
  | 'Overdue'
  | 'Overdue (Reminder sent)'
  | 'Canceled'
