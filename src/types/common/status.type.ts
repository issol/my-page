export type StatusItem = {
  label: string
  value: number
}

/** ✅ Job Status **/
export type JobStatusLabel =
  | 'In preparation' // 60000
  | 'Requested from LPM' // 60100
  | 'Awaiting prior job' // 60110
  | 'In progress' // 60200
  | 'Redelivery requested' // 60250
  | 'Job overdue' // 60300
  | 'Partially delivered' // 60400
  | 'Delivered to LPM' // 60500
  | 'Approved' // 60600
  | 'Invoiced' // 60700
  | 'Paid' // 60800
  | 'Without invoice' // 60900
  | 'Canceled' // 601000, 70400
  | 'Payment canceled' // 601100
  | 'Requested from LPM (Requested)' // 70000
  | 'Awaiting approval (Request accepted)' // 70100
  | 'Declined (Request rejected)' // 70200
  | 'In progress (Assigned)' // 70300
  | 'Unassigned' // 70500
  | 'Unassigned' // 70600

//NOTE : ProJob status는 job의 assign 진행상태 및 job 자체의 status 변화 모두를 보여주므로, 60000 / 70000 코드가 혼용된다.
export type JobStatus =
  | 60000 //'In preparation'
  | 60100 // "Requested from LPM"
  | 60110 // "Awaiting prior job"
  | 60200 // "In progress"
  | 60250 // "Redelivery requested"
  | 60300 // "Job overdue"
  | 60400 // "Partially delivered"
  | 60500 // "Delivered to LPM"
  | 60600 // "Approved"
  | 60700 // "Invoiced"
  | 60800 // "Paid"
  | 60900 // "Without invoice"
  | 601000 // "Canceled"
  | 601100 // "Payment canceled"
  | 70000 // Requested from LPM (Requested)
  | 70100 // Awaiting approval (Request accepted)
  | 70200 // Declined (Request rejected)
  | 70300 // In progress (Assigned)
  | 70400 // Canceled
  | 70500 // Unassigned
  | 70600 // Unassigned

/** ✅ Invoice Status **/

export type InvoicePayableStatus =
  | 40000 //'Invoice created'
  | 40100 //'Invoice accepted'
  | 40200 //'Paid'
  | 40300 //'Overdue'
  | 40400 //'Canceled'

export type InvoiceReceivableStatusLabel =
  | 'New'
  | 'In preparation'
  | 'Internal review'
  | 'Invoice sent'
  | 'Client review'
  | 'Under revision'
  | 'Revised'
  | 'Invoice confirmed'
  | 'Tax invoice issued'
  | 'Paid'
  | 'Overdue'
  | 'Overdue (Reminder sent)'
  | 'Canceled'

export type InvoiceReceivableStatus =
  | 30000 //'New'
  | 30100 //'In preparation'
  | 30200 //'Internal review'
  | 30300 //'Invoice sent'
  | 30400 //'Client review'
  | 30500 //'Under revision'
  | 30600 //'Revised'
  | 30700 //'Invoice confirmed'
  | 30800 //'Tax invoice issued'
  | 30900 //'Paid'
  | 301000 //'Overdue'
  | 301100 //'Overdue (Reminder sent)'
  | 301200 //'Canceled'

/* ✅ Order Status */

export type OrderStatus =
  | 10000 // 'New'
  | 10100 // 'In preparation'
  | 10200 // 'Internal review'
  | 10300 // 'Order sent'
  | 10400 // 'In progress'
  | 10500 // 'Under revision'
  | 10600 // 'Partially delivered'
  | 10700 // 'Delivery completed'
  | 10800 // 'Redelivery requested'
  | 10900 // 'Delivery confirmed'
  | 101000 // 'Invoiced'
  | 101100 // 'Paid'
  | 101200 // 'Canceled'
  | 10950 // 'Without invoice'

export type OrderLabel =
  | 'New' // 10000
  | 'In preparation' // 10100
  | 'Internal review' // 10200
  | 'Order sent' // 10300
  | 'In progress' // 10400
  | 'Under revision' // 10500
  | 'Partially delivered' // 10600
  | 'Delivery completed' // 10700
  | 'Redelivery requested' // 10800
  | 'Delivery confirmed' // 10900
  | 'Invoiced' // 101000
  | 'Paid' // 101100
  | 'Canceled' // 101200
  | 'Without invoice' // 10950

/* ✅ Quote Status */

export type QuotesStatus =
  | 20000
  | 20100
  | 20200
  | 20300
  | 20400
  | 20500
  | 20600
  | 20700
  | 20800
  | 20900
  | 201000
  | 201100
  | 201200

export type QuotesStatusLabel =
  | 'New'
  | 'In preparation'
  | 'Internal review'
  | 'Client review'
  | 'Quote sent'
  | 'Expired'
  | 'Rejected'
  | 'Accepted'
  | 'Changed into order'
  | 'Canceled'
  | 'Under review'
  | 'Revision requested'
  | 'Under revision'
  | 'Revised'

/* ✅ AppliedRoles Status */

export type AppliedRolesStatus =
  | 'Awaiting approval'
  | 'Test assigned'
  | 'Role assigned'
  | 'Rejected by TAD'
  | 'Test declined'
  | 'Role declined'
  | 'Basic test Ready'
  | 'Skill test Ready'
  | 'Paused'
  | 'Basic in progress'
  | 'Basic submitted'
  | 'Basic failed'
  | 'Basic passed'
  | 'Skill in progress'
  | 'Skill submitted'
  | 'Skill failed'
  | 'Contract required'
  | 'Certified'
  | 'Test in preparation'

/* ✅ Request Status */

export type RequestStatus = 50001 | 50002 | 50003 | 50004 | 50005
export type RequestStatusLabel =
  | 'Request created'
  | 'In preparation'
  | 'Changed into quote'
  | 'Changed into order'
  | 'Canceled'
