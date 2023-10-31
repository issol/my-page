export const RecruitingStatus = [
  {
    value: 'Ongoing',
    label: 'Ongoing',
  },
  {
    value: 'Paused',
    label: 'Paused',
  },
  {
    value: 'Fulfilled',
    label: 'Fulfilled',
  },
]
export const JobPostingStatus = [
  {
    value: 'Not started',
    label: 'Not started',
  },
  {
    value: 'Ongoing',
    label: 'Ongoing',
  },
  {
    value: 'Paused',
    label: 'Paused',
  },
  {
    value: 'Fulfilled',
    label: 'Fulfilled',
  },
]

export const TestStatus = [
  {
    label: 'Awaiting assignment',
    value: 'Awaiting assignment',
  },
  { label: 'Test assigned', value: 'Test assigned' },
  {
    label: 'Basic in progress',
    value: 'Basic in progress',
  },
  {
    label: 'Basic submitted',
    value: 'Basic submitted',
  },
  {
    label: 'Basic failed',
    value: 'Basic failed',
  },
  {
    label: 'Basic passed',
    value: 'Basic passed',
  },
  {
    label: 'Skill in progress',
    value: 'Skill in progress',
  },
  {
    label: 'Skill submitted',
    value: 'Skill submitted',
  },
  {
    label: 'Reviewing',
    value: 'Reviewing',
  },
  {
    label: 'Review canceled',
    value: 'Review canceled',
  },

  {
    label: 'Review completed',
    value: 'Review completed',
  },
  {
    label: 'Skill failed',
    value: 'Skill failed',
  },
  {
    label: 'Paused',
    value: 'Paused',
  },
  {
    label: 'Rejected',
    value: 'Rejected',
  },
]

export const ProStatus = [
  {
    value: 'Onboard',
    label: 'Onboard',
  },
  {
    value: 'Netflix Onboard',
    label: 'Netflix Onboard',
  },
  {
    value: 'Off-board',
    label: 'Off-board',
  },
  {
    value: 'On-hold Do not assign',
    label: 'On-hold Do not assign',
  },
  {
    value: 'Do not Contact',
    label: 'Do not Contact',
  },
]

export const WorkStatus = [
  {
    value: 'Approved',
    label: 'Approved',
  },
  {
    value: 'Assigned-waiting',
    label: 'Assigned-waiting',
  },
  {
    value: 'Canceled',
    label: 'Canceled',
  },
  {
    value: 'Delivered',
    label: 'Delivered',
  },
  {
    value: 'In progress',
    label: 'In progress',
  },
  {
    value: 'Invoice accepted',
    label: 'Invoice accepted',
  },
  {
    value: 'Invoice created',
    label: 'Invoice created',
  },
  {
    value: 'Overdue',
    label: 'Overdue',
  },
  {
    value: 'Paid',
    label: 'Paid',
  },
  {
    value: 'Requested',
    label: 'Requested',
  },
  {
    value: 'Without invoice',
    label: 'Without invoice',
  },
]

export const ClientStatus = [
  {
    label: 'New',
    value: 'New',
  },
  {
    label: 'Active',
    value: 'Active',
  },
  {
    label: 'Inactive',
    value: 'Inactive',
  },
  {
    label: 'Contacted',
    value: 'Contacted',
  },
  {
    label: 'Blocked',
    value: 'Blocked',
  },
]

export const QuotesStatus = [
  {
    value: 'New',
    label: 'New',
  },
  {
    value: 'In preparation',
    label: 'In preparation',
  },
  {
    value: 'Internal review',
    label: 'Internal review',
  },
  {
    value: 'Client review',
    label: 'Client review',
  },
  {
    value: 'Expired',
    label: 'Expired',
  },
  {
    value: 'Rejected',
    label: 'Rejected',
  },
  {
    value: 'Accepted',
    label: 'Accepted',
  },
  {
    value: 'Changed into order',
    label: 'Changed into order',
  },
  {
    value: 'Canceled',
    label: 'Canceled',
  },
]

// export const JobStatus = [
//   { value: 60000, label: "In preparation" },
//   { value: 60100, label: "Requested" },
//   { value: 60200, label: "Request accepted" },
//   { value: 60300, label: "Request rejected" },
//   { value: 60400, label: "Canceled" },
//   { value: 60500, label: "Assigned" },
//   { value: 60700, label: "In progress" },
//   { value: 60800, label: "Partially delivered" },
//   { value: 60900, label: "Delivered" },
//   { value: 601000, label: "Overdue" },
//   { value: 601100, label: "Approved" },
//   { value: 601200, label: "Invoiced" },
//   { value: 601300, label: "Without invoice" },
//   { value: 601400, label: "Paid" },
//   { value: 601500, label: "Payment canceled" },
// ]

export const AssignmentStatus = [
  {
    value: 'Requested',
    label: 'Requested',
  },
  {
    value: 'Request accepted',
    label: 'Request accepted',
  },
  {
    value: 'Request rejected',
    label: 'Request rejected',
  },
  {
    value: 'Assigned',
    label: 'Assigned',
  },
  {
    value: 'Canceled',
    label: 'Canceled',
  },
]

export const InvoicePayableStatus = [
  {
    value: 'Invoice created',
    label: 'Invoice created',
  },
  {
    value: 'Invoice accepted',
    label: 'Invoice accepted',
  },
  {
    value: 'Paid',
    label: 'Paid',
  },
  {
    value: 'Overdue',
    label: 'Overdue',
  },
  {
    value: 'Canceled',
    label: 'Canceled',
  },
]

export const InvoicePayableCalendarStatus = [
  {
    value: 'Invoice created',
    label: 'Invoice created',
    color: '#F572D8',
  },
  {
    value: 'Invoice accepted',
    label: 'Invoice accepted',
    color: '#9B6CD8',
  },
  {
    value: 'Paid',
    label: 'Paid',
    color: '#FF4D49',
  },
  {
    value: 'Overdue',
    label: 'Overdue',
    color: '#FF4D49',
  },
  {
    value: 'Canceled',
    label: 'Canceled',
    color: '#FF4D49',
  },
]

export const ClientRequestCalendarStatus = [
  {
    value: 'Request created',
    label: 'Request created',
    color: '#A81988',
  },
  {
    value: 'In preparation',
    label: 'In preparation',
    color: '#FDB528',
  },
  {
    value: 'Changed into quote',
    label: 'Changed into quote',
    color: '#64C623',
  },
  {
    value: 'Changed into order',
    label: 'Changed into order',
    color: '#1A6BBA',
  },
  {
    value: 'Canceled',
    label: 'Canceled',
    color: '#FF4D49',
  },
]

export const ClientQuoteStatus = [
  {
    value: 'New',
    label: 'New',
  },
  {
    value: 'Under review',
    label: 'Under review',
  },
  {
    value: 'Revision requested',
    label: 'Revision requested',
  },
  {
    value: 'Under revision',
    label: 'Under revision',
  },
  {
    value: 'Revised',
    label: 'Revised',
  },
  {
    value: 'Accepted',
    label: 'Accepted',
  },
  {
    value: 'Changed into order',
    label: 'Changed into order',
  },
  {
    value: 'Expired',
    label: 'Expired',
  },
  {
    value: 'Rejected',
    label: 'Rejected',
  },
  {
    value: 'Canceled',
    label: 'Canceled',
  },
]

export const ClientQuoteCalendarStatus = [
  {
    value: 'New',
    label: 'New',
    color: '#666CFF',
  },
  {
    value: 'Under review',
    label: 'Under review',
    color: '#FDB528',
  },
  {
    value: 'Revision requested',
    label: 'Revision requested',
    color: '#A81988',
  },
  {
    value: 'Under revision',
    label: 'Under revision',
    color: '#26C6F9',
  },
  {
    value: 'Revised',
    label: 'Revised',
    color: '#AD7028',
  },
  {
    value: 'Accepted',
    label: 'Accepted',
    color: '#64C623',
  },
  {
    value: 'Changed into order',
    label: 'Changed into order',
    color: '#1A6BBA',
  },
  {
    value: 'Expired',
    label: 'Expired',
    color: '#FF4D49',
  },
  {
    value: 'Rejected',
    label: 'Rejected',
    color: '#FF4D49',
  },
  {
    value: 'Canceled',
    label: 'Canceled',
    color: '#FF4D49',
  },
]
