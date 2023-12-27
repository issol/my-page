// TODO : 서버로부터 오브젝트로 상태값 상태라벨 모두 받아야함
import { statusType } from '@src/types/common/status.type'
import { InvoiceReceivableStatusType } from '@src/types/invoice/common.type'

export const OrderChipLabel: Record<number, string> = {
  10000: 'New',
  10100: 'In preparation',
  10200: 'Internal review',
  10300: 'Order sent',
  10400: 'In progress',
  10500: 'Under revision',
  10600: 'Partially delivered',
  10700: 'Delivery completed',
  10800: 'Redelivery requested',
  10900: 'Delivery confirmed',
  101000: 'Invoiced',
  101100: 'Paid',
  101200: 'Canceled',
  10950: 'Without invoice',
}

// TODO : 서버로부터 오브젝트로 상태값 상태라벨 모두 받아야함
export const JobStatusList: statusType[] = [
  { label: 'In preparation', value: 60000 },
  { label: 'Requested', value: 60100 },
  { label: 'In progress', value: 60200 },
  { label: 'Overdue', value: 60300 },
  { label: 'Partially delivered', value: 60400 },
  { label: 'Delivered', value: 60500 },
  { label: 'Approved', value: 60600 },
  { label: 'Invoiced', value: 60700 },
  { label: 'Paid', value: 60800 },
  { label: 'Without invoice', value: 60900 },
  { label: 'Canceled', value: 601000 },
  { label: 'Payment canceled', value: 601100 },
]

// TODO : 서버로부터 오브젝트로 상태값 상태라벨 모두 받아야함
export const InvoiceStatusList: statusType[] = [
  { label: 'Invoiced', value: 40000 },
  { label: 'Under revision', value: 40100 },
  { label: 'Revised', value: 40200 },
  { label: 'Paid', value: 40300 },
  { label: '-', value: 40400 },
]

export const InvoiceReceivable: Record<InvoiceReceivableStatusType, string> = {
  30000: 'New',
  30100: 'In preparation',
  30200: 'Internal review',
  30300: 'Invoice sent',
  30400: 'Client review',
  30500: 'Under revision',
  30600: 'Revised',
  30700: 'Invoice confirmed',
  30800: 'Tax invoice issued',
  30900: 'Paid',
  301000: 'Overdue',
  301100: 'Overdue (Reminder sent)',
  301200: 'Canceled',
}
