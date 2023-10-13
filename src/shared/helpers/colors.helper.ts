import { OrderStatusType } from '@src/types/common/orders.type'
import {
  QuoteStatusType,
  QuotesStatusType,
} from '@src/types/common/quotes.type'
import { statusType } from '@src/types/common/status.type'
import {
  InvoicePayableStatusType,
  InvoiceProStatusType,
  InvoiceReceivableStatusType,
} from '@src/types/invoice/common.type'
import { ProJobStatusType } from '@src/types/jobs/common.type'
import { JobStatusType } from '@src/types/jobs/jobs.type'

export function getProInvoiceStatusColor(status: InvoiceProStatusType) {
  const color =
    status === 'Invoiced'
      ? '#9B6CD8'
      : status === 'Under revision'
      ? '#26C6F9'
      : status === 'Paid'
      ? '#1B8332'
      : status === 'Revised'
      ? '#AD7028'
      : ''

  return color
}

export function getPayableColor(status: InvoicePayableStatusType) {
  return status === 'Invoice created'
    ? '#F572D8'
    : status === 'Invoice accepted'
    ? '#9B6CD8'
    : status === 'Paid'
    ? '#FF4D49'
    : status === 'Overdue'
    ? '#FF4D49'
    : status === 'Canceled'
    ? '#FF4D49'
    : ''
}

export function getReceivableStatusColor(status: InvoiceReceivableStatusType) {
  const color =
    status === 30000
      ? '#666CFF'
      : status === 30100
      ? '#F572D8'
      : status === 30200
      ? '#D8AF1D'
      : status === 30300
      ? '#547ED1'
      : status === 30400
      ? '#FDB528'
      : status === 30500
      ? '#26C6F9'
      : status === 30600
      ? '#AD7028'
      : status === 30700
      ? '#64C623'
      : status === 30800
      ? '#323A42'
      : status === 30900
      ? '#267838'
      : status === 301000 || status === 301100 || status === 301200
      ? '#FF4D49'
      : ''
  return color
}

export function getOrderStatusColor(
  status: OrderStatusType,
  code?: OrderStatusType,
) {
  const color =
    code === 'New' || status === 10000
      ? '#666CFF'
      : status === 10100 || status === 'In preparation'
      ? '#F572D8'
      : status === 10200 || status === 'Internal review'
      ? '#D8AF1D'
      : status === 10300 || status === 'Order sent'
      ? '#B06646'
      : status === 10400 || status === 'In progress'
      ? '#FDB528'
      : status === 10500 || status === 'Under revision'
      ? '#26C6F9'
      : status === 10600 || status === 'Partially delivered'
      ? '#686A80'
      : status === 10700 || status === 'Delivery completed'
      ? '#1A6BBA'
      : status === 10800 || status === 'Redelivery requested'
      ? '#A81988'
      : status === 10900 || status === 'Delivery confirmed'
      ? '#64C623'
      : status === 101000 || status === 'Invoiced'
      ? '#9B6CD8'
      : status === 101100 || status === 'Paid'
      ? '#1B8332'
      : status === 101200 || status === 'Canceled'
      ? '#FF4D49'
      : status === 10950 || status === 'Without invoice'
      ? '#4C4E64'
      : ''
  return color
}

export function getQuoteStatusColor(status: QuotesStatusType) {
  const color =
    status === 20000
      ? '#666CFF'
      : status === 20100
      ? '#F572D8'
      : status === 20200
      ? '#20B6E5'
      : status === 20300
      ? '#2B6603'
      : status === 20400
      ? '#FDB528'
      : status === 20500
      ? '#A81988'
      : status === 20600
      ? '#26C6F9'
      : status === 20700
      ? '#AD7028'
      : status === 20800
      ? '#64C623'
      : status === 20900
      ? '#1A6BBA'
      : status === 201000
      ? '#FF4D49'
      : status === 201100
      ? '#FF4D49'
      : status === 201200
      ? '#FF4D49'
      : ''
  return color
}

export function getProJobStatusColor(status: ProJobStatusType) {
  const color =
    status === 60100
      ? '#A81988'
      : status === 60200
      ? '#6D788D'
      : status === 60500 || status === 60700 || status === 60800
      ? '#FDB528'
      : status === 60900
      ? '#1A6BBA'
      : status === 601100
      ? '#64C623'
      : status === 601200
      ? '#9B6CD8'
      : status === 601400
      ? '#1B8332'
      : status === 601300
      ? '#D8AF1D'
      : status === 60600
      ? '#6D788D'
      : status === 60400 || status === 60300 || status === 601000
      ? '#FF4D49'
      : null

  return color
}
export function getJobStatusColor(status: JobStatusType) {
  const color =
    status === 60000 //'In preparation'
      ? '#F572D8'
      : status === 60100 //'Requested'
      ? '#A81988'
      : status === 60200 //'Request accepted'
      ? '#A81988'
      : status === 60300 //'Request rejected'
      ? '#A81988'
      : status === 60400 //'Canceled'
      ? '#FF4D49'
      : status === 60500 //'Assigned'
      ? '#FF4D49'
      : status === 60700 //'In progress'
      ? '#FF4D49'
      : status === 60800 //'Partially delivered'
      ? '#FF4D49'
      : status === 60900 //'Delivered'
      ? '#1A6BBA'
      : status === 601000 //'Overdue'
      ? '#FF4D49'
      : status === 601100 //'Approved'
      ? '#64C623'
      : status === 601200 //'Invoiced'
      ? '#FF4D49'
      : status === 601300 //'Without invoice'
      ? '#75571C'
      : status === 601400 //'Paid'
      ? '#1B8332'
      : ''
  return color
}
