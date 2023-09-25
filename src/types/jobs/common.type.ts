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
  | 60000
  | 60100 //Requested from LPM
  | 60200 //Awaiting approval
  | 60300 //Declined
  | 60400 //Canceled
  | 60500 //In progress
  | 60600 //Unassigned
  | 60700 // In progress
  | 60800 // In progress
  | 60900 // Delivered to LPM
  | 601000 //Job overdue
  | 601100 //Approved
  | 601200 //Invoiced
  | 601300 //Without invoice
  | 601400 //Paid
