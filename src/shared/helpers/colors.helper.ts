import { OrderStatusType } from '@src/types/common/orders.type'
import {
  QuoteStatusType,
  QuotesStatusType,
} from '@src/types/common/quotes.type'
import { InvoiceReceivableStatusType } from '@src/types/invoice/common.type'

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

export function getOrderStatusColor(status: OrderStatusType) {
  const color =
    status === 10000
      ? '#666CFF'
      : status === 10100
      ? '#F572D8'
      : status === 10200
      ? '#D8AF1D'
      : status === 10300
      ? '#B06646'
      : status === 10400
      ? '#FDB528'
      : status === 10500
      ? '#26C6F9'
      : status === 10600
      ? '#BA971A'
      : status === 10700
      ? '#1A6BBA'
      : status === 10800
      ? '#A81988'
      : status === 10900
      ? '#64C623'
      : status === 101000
      ? '#9B6CD8'
      : status === 101100
      ? '#1B8332'
      : status === 101200
      ? '#FF4D49'
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
