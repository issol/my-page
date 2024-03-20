export type JobStatusType =
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

export type ProJobStatusType =
  //ProJob status는 job의 assign 진행상태 및 job 자체의 status 변화 모두를 보여주므로, 60000 / 70000 코드가 혼용된다.
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
