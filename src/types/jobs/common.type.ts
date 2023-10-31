export type JobStatusType =
  | 'In preparation'
  | 'Requested'
  | 'In progress'
  | 'Overdue'
  | 'Delivered'
  | 'Approved'
  | 'Invoice created'
  | 'Invoice accepted'
  | 'Paid'
  | 'Without invoice'
  | 'Canceled'

export type ProJobStatusType =
//ProJob status는 job의 assign 진행상태 및 job 자체의 status 변화 모두를 보여주므로, 60000 / 70000 코드가 혼용된다.
 | 60100 // Requested from LPM (Requested)
 | 60200 // In progress
 | 60300 // Job overdue (Overdue)
 | 60400 // In progress (Partially delivered)
 | 60500 // Delivered to LPM (Delevered)
 | 60600 // Approved
 | 60700 // Invoiced
 | 60800 // Paid
 | 60900 // Without invoice
 | 601000 // Canceled
 | 601100 // Payment canceled
 | 70000 // Requested from LPM (Requested)
 | 70100 // Awaiting approval (Request accepted)
 | 70200 // Declined (Request rejected)
 | 70300 // In progress (Assigned)
 | 70400 // Canceled
 | 70500 // Unassigned