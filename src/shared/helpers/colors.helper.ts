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
import { ProAppliedRolesStatusType } from '@src/types/pro-certification-test/applied-roles'

export function getProInvoiceStatusColor(status: InvoiceProStatusType) {
  const color =
    status === 40000 //'Invoiced'
      ? '#9B6CD8'
      : status === 40100 //'Under revision'
      ? '#26C6F9'
      : status === 40300 //'Paid'
      ? '#1B8332'
      : status === 40200 //'Revised'
      ? '#AD7028'
      : ''

  return color
}

export function getPayableColor(status: InvoicePayableStatusType) {
  return status === 40000 //'Invoiced'
    ? '#9B6CD8'
    : status === 40100 //'Under revision'
    ? '#26C6F9'
    : status === 40300 //'Paid'
    ? '#1B8332'
    : status === 40200 //'Revised'
    ? '#AD7028'
    : status === 40400 //Overdue
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
    status === 60100 || status === 70000 //Requested from LPM, Requested
      ? '#A81988'
      : status === 70100 //Awaiting approval
      ? '#6D788D'
      : status === 60200 || status === 60400 || status === 70300 // In progress
      ? '#FDB528'
      : status === 60300 // Job overdue
      ? '#FFCFCF'
      : status === 60500 // Delivered to LPM
      ? '#1A6BBA'
      : status === 60600 // Approved
      ? '#64C623'
      : status === 60700 // Invoiced
      ? '#9B6CD8'
      : status === 60800 // Paid
      ? '#1B8332'
      : status === 60900 // Without invoice
      ? '#0D0D0D'
      : status === 70500 // Unassigned
      ? '#6D788D'
      : status === 601000 ||
        status === 601100 ||
        status === 70200 ||
        status === 70400 // Canceled, Payment canceled, Declined
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
      : status === 601000 //'Canceled'
      ? '#FF4D49'
      : status === 60200 //'In progress'
      ? '#FF4D49'
      : status === 60400 //'Partially delivered'
      ? '#FF4D49'
      : status === 60500 //'Delivered'
      ? '#1A6BBA'
      : status === 60300 //'Overdue'
      ? '#FF4D49'
      : status === 60600 //'Approved'
      ? '#64C623'
      : status === 60700 //'Invoiced'
      ? '#FF4D49'
      : status === 60900 //'Without invoice'
      ? '#75571C'
      : status === 60800 //'Paid'
      ? '#1B8332'
      : // TODO: 컬러 확정되면 업데이트 필요
      status === 601100 //'Payment canceled'
      ? '#1B8332'
      : ''
  return color
}

export function getProAppliedRolesStatusColor(
  status: ProAppliedRolesStatusType,
) {
  const color =
    status === 'Awaiting approval' ||
    status === 'Test assigned' ||
    status === 'Role assigned' ||
    status === 'Paused' ||
    status === 'Test in preparation'
      ? '#6D788D'
      : status === 'Rejected by TAD' ||
        status === 'Test declined' ||
        status === 'Role declined' ||
        status === 'Basic failed' ||
        status === 'Skill failed'
      ? '#FF4D49'
      : status === 'Basic test Ready' || status === 'Skill test Ready'
      ? '#8232C0'
      : status === 'Basic in progress'
      ? '#FDB528'
      : status === 'Basic submitted'
      ? '#00237D'
      : status === 'Basic passed' ||
        status === 'Contract required' ||
        status === 'Certified'
      ? '#64C623'
      : status === 'Skill in progress'
      ? '#D18A00'
      : status === 'Skill submitted'
      ? '#1A6BBA'
      : ''

  return color
}
