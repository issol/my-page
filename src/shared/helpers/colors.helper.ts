import {
  AppliedRolesStatus,
  InvoicePayableStatus,
  InvoiceReceivableStatus,
  InvoiceReceivableStatusLabel,
  JobStatus,
  OrderLabel,
  OrderStatus,
  QuotesStatus,
} from '@src/types/common/status.type'

export const getProInvoiceStatusColor = (status: InvoicePayableStatus) => {
  const statusColors: Record<InvoicePayableStatus, string> = {
    40000: '#9B6CD8', // 'Invoiced'
    40100: '#26C6F9', // 'Under revision'
    40200: '#AD7028', // 'Revised'
    40300: '#1B8332', // 'Paid'
    40400: '#FF4D49',
  }

  return statusColors[status] || ''
}

export const getPayableColor = (status: InvoicePayableStatus) => {
  const statusColors: Record<InvoicePayableStatus, string> = {
    40000: '#9B6CD8', // 'Invoiced'
    40100: '#26C6F9', // 'Under revision'
    40200: '#AD7028', // 'Revised'
    40300: '#1B8332', // 'Paid'
    40400: '#FF4D49', // 'Overdue'
  }

  return statusColors[status] || ''
}

export const getReceivableStatusColor = (
  status: InvoiceReceivableStatusLabel & InvoiceReceivableStatus,
) => {
  const statusColors: Record<
    InvoiceReceivableStatusLabel & InvoiceReceivableStatus,
    string
  > = {
    30000: '#666CFF',
    New: '#666CFF',
    30100: '#F572D8',
    'In preparation': '#F572D8',
    30200: '#D8AF1D',
    'Internal review': '#D8AF1D',
    30300: '#547ED1',
    'Invoice sent': '#547ED1',
    30400: '#FDB528',
    'Client review': '#FDB528',
    30500: '#26C6F9',
    'Under revision': '#26C6F9',
    30600: '#AD7028',
    Revised: '#AD7028',
    30700: '#64C623',
    'Invoice confirmed': '#64C623',
    30800: '#323A42',
    'Tax invoice issued': '#323A42',
    30900: '#267838',
    Paid: '#267838',
    301000: '#FF4D49',
    Overdue: '#FF4D49',
    301100: '#FF4D49',
    'Overdue (Reminder sent)': '#FF4D49',
    301200: '#FF4D49',
    Canceled: '#FF4D49',
  }

  return statusColors[status] || ''
}

export const getOrderStatusColor = (
  status: OrderStatus & OrderLabel,
  code?: OrderStatus & OrderLabel,
) => {
  if (code === 'New') return '#666CFF'

  const statusColors: Record<OrderStatus & OrderLabel, string> = {
    New: '#666CFF',
    10000: '#666CFF',
    'In preparation': '#F572D8',
    10100: '#F572D8',
    'Internal review': '#D8AF1D',
    10200: '#D8AF1D',
    'Order sent': '#B06646',
    10300: '#B06646',
    'In progress': '#FDB528',
    10400: '#FDB528',
    'Under revision': '#26C6F9',
    10500: '#26C6F9',
    'Partially delivered': '#686A80',
    10600: '#686A80',
    'Delivery completed': '#1A6BBA',
    10700: '#1A6BBA',
    'Redelivery requested': '#A81988',
    10800: '#A81988',
    'Delivery confirmed': '#64C623',
    10900: '#64C623',
    Invoiced: '#9B6CD8',
    101000: '#9B6CD8',
    Paid: '#1B8332',
    101100: '#1B8332',
    Canceled: '#FF4D49',
    101200: '#FF4D49',
    'Without invoice': '#4C4E64',
    10950: '#4C4E64',
  }

  return statusColors[status] || ''
}

export const getQuoteStatusColor = (status: QuotesStatus) => {
  const statusColors: Record<QuotesStatus, string> = {
    20000: '#666CFF',
    20100: '#F572D8',
    20200: '#20B6E5',
    20300: '#2B6603',
    20400: '#FDB528',
    20500: '#A81988',
    20600: '#26C6F9',
    20700: '#AD7028',
    20800: '#64C623',
    20900: '#1A6BBA',
    201000: '#FF4D49',
    201100: '#FF4D49',
    201200: '#FF4D49',
  }
  return statusColors[status] || ''
}

export const getProJobStatusColor = (status: JobStatus) => {
  const statusToColor: Record<JobStatus, string> = {
    60000: '#F572D8', // 'In preparation'
    60100: '#A81988', // 'Requested from LPM'
    70000: '#A81988', // 'Requested'
    70100: '#6D788D', // 'Awaiting approval'
    60200: '#FDB528', // 'In progress'
    60400: '#FDB528', // Also 'In progress'
    70300: '#FDB528', // Also 'In progress'
    60300: '#FFCFCF', // 'Job overdue'
    60500: '#1A6BBA', // 'Delivered to LPM'
    60600: '#64C623', // 'Approved'
    60700: '#9B6CD8', // 'Invoiced'
    60800: '#1B8332', // 'Paid'
    60900: '#0D0D0D', // 'Without invoice'
    70500: '#6D788D', // 'Unassigned'
    601000: '#FF4D49', // 'Canceled'
    601100: '#FF4D49', // 'Payment canceled'
    70200: '#FF4D49', // 'Declined'
    70400: '#FF4D49', // Also 'Canceled'
    60250: '#D00606', // 'Redelivery requested'
    60110: '#6D788D', // 'Awaiting prior job'
  }

  return statusToColor[status] || ''
}

export const getProAppliedRolesStatusColor = (status: AppliedRolesStatus) => {
  const statusColors: Record<AppliedRolesStatus, string> = {
    'Awaiting approval': '#6D788D',
    'Test assigned': '#6D788D',
    'Role assigned': '#6D788D',
    Paused: '#6D788D',
    'Test in preparation': '#6D788D',
    'Rejected by TAD': '#FF4D49',
    'Test declined': '#FF4D49',
    'Role declined': '#FF4D49',
    'Basic failed': '#FF4D49',
    'Skill failed': '#FF4D49',
    'Basic test Ready': '#8232C0',
    'Skill test Ready': '#8232C0',
    'Basic in progress': '#FDB528',
    'Basic submitted': '#00237D',
    'Basic passed': '#64C623',
    'Contract required': '#64C623',
    Certified: '#64C623',
    'Skill in progress': '#D18A00',
    'Skill submitted': '#1A6BBA',
  }

  return statusColors[status] || ''
}
