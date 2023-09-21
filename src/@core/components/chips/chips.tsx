import styled from 'styled-components'
import CustomChip from 'src/@core/components/mui/chip'
import { Chip } from '@mui/material'
import { StatusType } from '@src/apis/client.api'

import { QuoteStatusType } from '@src/types/common/quotes.type'
import {
  InvoicePayableStatusType,
  InvoiceReceivableStatusType,
} from '@src/types/invoice/common.type'
import { RoleType, UserType } from '@src/context/types'
import { RequestStatusType } from '@src/types/requests/common.type'
import {
  getOrderStatusColor,
  getReceivableStatusColor,
} from '@src/shared/helpers/colors.helper'
import { OrderStatusType } from '@src/types/common/orders.type'
import { JobStatusType } from '@src/types/jobs/jobs.type'

export function renderStatusChip(status: string) {
  const color =
    status === 'Fulfilled'
      ? 'success'
      : status === 'Ongoing'
      ? 'warning'
      : status === 'Paused'
      ? 'secondary'
      : ''
  if (color) {
    return <CustomChip label={status} skin='light' color={color} size='small' />
  } else {
    return (
      <CustomChip
        label={status}
        skin='light'
        sx={{
          background:
            'linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), #BEB033',
          color: '#BEB033',
        }}
        size='small'
      />
    )
  }
}

export const JobTypeChip = styled(Chip)<{ type: string }>`
  background: ${({ type }) =>
    type === 'Documents/Text'
      ? '#FF9E90'
      : type === 'Dubbing'
      ? '#FFF387'
      : type === 'Misc.'
      ? '#BFF0FF'
      : type === 'Interpretation'
      ? '#CBFFEC'
      : type === 'OTT/Subtitle'
      ? '#A9E0FF'
      : type === 'Webcomics'
      ? '#BEEFAE'
      : type === 'Webnovel'
      ? '#FFBFE9'
      : 'rgba(76, 78, 100, 0.26)'};

  color: #111111;
`

export const RoleChip = styled(Chip)<{ type: string }>`
  border: 1px solid black;
  ${({ type }) =>
    type === 'DTPer'
      ? `background: linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), #FF985E; border-color:#FF985E`
      : type === 'DTP QCer'
      ? `background: linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), #BC9459; border-color:#BC9459`
      : type === 'QCer'
      ? `background: linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), #6638A1; border-color:#6638A1`
      : type === 'Transcriber'
      ? `background: linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), #921010; border-color:#921010`
      : type === 'Translator'
      ? `background: linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), #9024C3; border-color:#9024C3`
      : type === 'Audio describer'
      ? `background: linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), #E0CA00; border-color:#E0CA00`
      : type === 'Audio description QCer'
      ? `background: linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), #D1C76B; border-color:#D1C76B`
      : type === 'Dubbing audio QCer'
      ? `background: linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), #A89F52; border-color:#A89F52`
      : type === 'Dubbing script QCer'
      ? `background: linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), #A98A1B; border-color:#A98A1B`
      : type === 'Dubbing script translator'
      ? `background: linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), #6F6934; border-color:#6F6934`
      : type === 'Dubbing voice artist'
      ? `background: linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), #37330F ; border-color:#37330F `
      : type === 'Interpreter'
      ? `background: linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), #80FCCF; border-color:#80FCCF`
      : type === 'Copywriter'
      ? `background: linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), #BFF0FF; border-color:#BFF0FF`
      : type === 'Editor'
      ? `background: linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), #67DBFF; border-color:#67DBFF`
      : type === 'Video editor'
      ? `background: linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), #CFDBDE; border-color:#CFDBDE`
      : type === 'SDH author'
      ? `background: linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), #8EB7DC; border-color:#8EB7DC`
      : type === 'SDH QCer'
      ? `background: linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), #2D83D2; border-color:#2D83D2`
      : type === 'Subtitle author'
      ? `background: linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), #3A5ACE; border-color:#3A5ACE`
      : type === 'Subtitle QCer'
      ? `background: linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), #213478; border-color:#213478`
      : type === 'Supp author'
      ? `background: linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), #1351EF; border-color:#1351EF`
      : type === 'Supp QCer'
      ? `background: linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), #085886; border-color:#085886`
      : type === 'Template author'
      ? `background: linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), #1ACEF5; border-color:#1ACEF5`
      : type === 'Template QCer'
      ? `background: linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), #15A0BE; border-color:#15A0BE`
      : type === 'Proofreader'
      ? `background: linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), #66D841; border-color:#66D841`
      : type === 'Webcomics QCer'
      ? `background: linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), #6DAA59; border-color:#6DAA59`
      : type === 'Webcomics translator'
      ? `background: linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), #357D1D; border-color:#357D1D`
      : type === 'Webnovel QCer'
      ? `background: linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), #F569C5; border-color:#F569C5`
      : type === 'Webnovel translator'
      ? `background: linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), #CD4BA0; border-color:#CD4BA0`
      : '#FFBFE9'};

  color: #111111;
`

export const ServiceTypeChip = styled(Chip)`
  background: linear-gradient(
      0deg,
      rgba(255, 255, 255, 0.88),
      rgba(255, 255, 255, 0.88)
    ),
    #666cff;
  border: 1px solid rgba(102, 108, 255, 0.5);
`

export function WorkStatusChip(status: string) {
  const color =
    status === 'Approved'
      ? '#64C623'
      : status === 'Assigned-waiting'
      ? '#6D788D'
      : status === 'Canceled'
      ? '#FF4D49'
      : status === 'Delivered'
      ? '#1A6BBA'
      : status === 'In progress'
      ? '#FDB528'
      : status === 'Invoice accepted'
      ? '#9B6CD8'
      : status === 'Invoice created'
      ? '#F572D8'
      : status === 'Overdue'
      ? '#FF4D49'
      : status === 'Paid'
      ? '#1B8332'
      : status === 'Requested'
      ? '#A81988'
      : status === 'Without invoice'
      ? '#75571C'
      : ''

  return (
    <CustomChip
      label={status === 'Overdue' ? `🔴 ${status}` : status}
      skin='light'
      sx={{
        background: `linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), ${color}`,
        color: color,
      }}
      size='small'
    />
  )
}
export const ProStatusChip = styled(Chip)<{ status: string }>`
  border: none;
  ${({ status }) =>
    status === 'Onboard'
      ? `background: linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), #72E128; color: #64C623;`
      : status === 'Off-board'
      ? `background: #929292; color :#ffffff;`
      : status === 'On-hold'
      ? `background: rgba(76, 78, 100, 0.05);
      border: 1px solid rgba(76, 78, 100, 0.38); color : rgba(76, 78, 100, 0.38);`
      : status === 'Do not contact'
      ? `background: linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), #FF4D49; color: #FF4D49;`
      : status === 'Netflix-onboard'
      ? 'linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), #666CFF; color:#666CFF;'
      : null};
`

export const ClientStatusChip =
  //
  styled(Chip)<{ status: StatusType }>`
    border: none;
    ${({ status }) =>
      status === 'New'
        ? `background: linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), #666CFF; color: #666CFF;`
        : status === 'Active'
        ? `background: linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), #64C623; color :#64C623;`
        : status === 'Inactive'
        ? `background: #EDEFF1; color : rgba(76, 78, 100, 0.38);`
        : status === 'Contacted'
        ? `background: linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), #DF9F23; color: #DF9F23;`
        : status === 'Blocked'
        ? 'background: #626471; color:#F7F7F9;'
        : null};
  `
export const CatInterfaceChip =
  //
  styled(Chip)<{ status: boolean }>`
    //
    border: none;
    ${({ status }) =>
      status
        ? `background: linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), #FA8773; color: #FA8773; font-weight: 600; `
        : ` background: rgba(76, 78, 100, 0.12); color: rgba(76, 78, 100, 0.6);`};
  `

export const ExtraNumberChip = styled(Chip)`
  background: linear-gradient(
      0deg,
      rgba(255, 255, 255, 0.88),
      rgba(255, 255, 255, 0.88)
    ),
    #6d788d;
  border: 1px solid rgba(76, 78, 100, 0.6);
  border-radius: 16px;
  color: #6d788d;
`

export const OrderStatusChip = styled(Chip)<{
  status: OrderStatusType
}>`
  // //
  border: none;
  background: linear-gradient(
      0deg,
      rgba(255, 255, 255, 0.88),
      rgba(255, 255, 255, 0.88)
    ),
    ${({ status }) => getOrderStatusColor(status, status)};
  color: ${({ status }) => getOrderStatusColor(status, status)};
`

export const QuoteStatusChip = styled(Chip)<{
  status: QuoteStatusType
}>`
  // //
  border: none;
  ${({ status }) =>
    status === 'New'
      ? `background: linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), #666CFF; color: #666CFF;`
      : status === 'In preparation'
      ? `background:linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), #F572D8; color :#F572D8;`
      : status === 'Internal Review'
      ? `background:linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), #20B6E5; color :#20B6E5;`
      : status === 'Client review' || status === 'Under review'
      ? `background:linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), #FDB528; color: #FDB528;`
      : status === 'Expired'
      ? 'background:linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), #FF4D49; color: #FF4D49;'
      : status === 'Rejected'
      ? 'background:linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), #FF4D49; color: #FF4D49;'
      : status === 'Accepted'
      ? 'background:linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), #64C623; color: #64C623;'
      : status === 'Changed into order'
      ? 'background:linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), #1A6BBA; color: #1A6BBA;'
      : status === 'Canceled'
      ? 'background:linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), #FF4D49; color: #FF4D49;'
      : status === 'Revision requested'
      ? 'background:linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), #A81988; color: #A81988;'
      : status === 'Under revision'
      ? 'background:linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), #BA971A; color: #BA971A;'
      : status === 'Revised'
      ? 'background:linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), #AD7028; color: #AD7028;'
      : status === 'Quote sent'
      ? 'background:linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), #2B6603; color: #2B6603;'
      : status === 'Without invoice'
      ? 'background:linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), #4C4E64; color: #4C4E64;'
      : null};
`

export const jobStatusLabelValueType = [
  {label: 'In preparation', value: 60000},
  {label: 'Requested', value: 60100},
  {label: 'Request accepted', value: 60200},
  {label: 'Request rejected', value: 60300},
  {label: 'Canceled', value: 60400},
  {label: 'Assigned', value: 60500},
  {label: 'In progress', value: 60700},
  {label: 'Partially delivered', value: 60800},
  {label: 'Delivered', value: 60900},
  {label: 'Overdue', value: 601000},
  {label: 'Approved', value: 601100},
  {label: 'Invoiced', value: 601200},
  {label: 'Without invoice', value: 601300},
  {label: 'Paid', value: 601400},
]

export function JobsStatusChip(status: JobStatusType) {
  const color =
    status === 'In preparation' || 60000
      ? '#F572D8'
      : status === 'Requested' || 60100
      ? '#A81988'
      : status === 'Request accepted' || 60200
      ? '#A81988'
      : status === 'Request rejected' || 60300
      ? '#A81988'
      : status === 'Canceled' || 60400
      ? '#FF4D49'
      : status === 'Assigned' || 60500
      ? '#FF4D49'
      : status === 'In progress' || 60700
      ? '#FF4D49'
      : status === 'Partially delivered' || 60800
      ? '#FF4D49'
      : status === 'Delivered' || 60900
      ? '#1A6BBA'
      : status === 'Overdue' || 601000
      ? '#FF4D49'
      : status === 'Approved' || 601100
      ? '#64C623'
      : status === 'Invoiced' || 601200
      ? '#FF4D49'
      : status === 'Without invoice' || 601300
      ? '#75571C'
      : status === 'Paid' || 601400
      ? '#1B8332'
      : ''
  const jobStatusValue = typeof status ==='string' ? status : jobStatusLabelValueType.find(list => list.value! === status)!.label

  return (

    <CustomChip
      label={status === 'Overdue' ? `🔴 ${jobStatusValue}` : jobStatusValue}
      skin='light'
      sx={{
        background: `linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), ${color}`,
        color: color,
      }}
      size='small'
    />
  )
}

export const AssignmentStatusChip = styled(Chip)<{ status: string }>`
  border: none;
  ${({ status }) =>
    status === 'Request accepted'
      ? `background: linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), #72E128; color: #64C623;`
      : status === 'Request rejected'
      ? `background: linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), #FF4D49; color: #FF4D49;`
      : status === 'Requested'
      ? `background: linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), #FDB528; color: #FDB528;`
      : status === 'Assigned'
      ? `background: linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), #666CFF; color: #666CFF;`
      : status === 'Canceled'
      ? `background: linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), #FF4D49; color: #FF4D49;`
      : null};
`

export function InvoicePayableChip(status: InvoicePayableStatusType) {
  const color =
    status === 'Invoice created'
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

  return (
    <CustomChip
      label={status === 'Overdue' ? `🔴 ${status}` : status}
      skin='light'
      sx={{
        background: `linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), ${color}`,
        color: color,
      }}
      size='small'
    />
  )
}

export function InvoiceReceivableChip(
  label: string,
  status: InvoiceReceivableStatusType,
) {
  const color = getReceivableStatusColor(status)

  return (
    <CustomChip
      label={
        status === 301000 || status === 301100 || status === 301200
          ? `🔴 ${label}`
          : label
      }
      skin='light'
      sx={{
        background: `linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), ${color}`,
        color: color,
      }}
      size='small'
    />
  )
}

export function MemberChip(role: RoleType) {
  const color = role === 'TAD' ? '#FF4D49' : role === 'LPM' ? '#666CFF' : ''
  return (
    <CustomChip
      label={role}
      skin='light'
      sx={{
        background: `linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), ${color}`,
        color: color,
      }}
      size='small'
    />
  )
}

export function PermissionChip(permission: UserType) {
  const color =
    permission === 'Master'
      ? '#666CFF80'
      : permission === 'Manager'
      ? '#26C6F980'
      : permission === 'General'
      ? '#72E12880'
      : ''
  return (
    <CustomChip
      label={permission}
      skin='light'
      sx={{
        background: '#fff',
        color: color,
        border: `1px solid ${color}`,
      }}
      size='small'
    />
  )
}

export function ClientRequestStatusChip(status: RequestStatusType) {
  const color =
    status === 'Request created'
      ? '#A81988'
      : status === 'In preparation'
      ? '#FDB528'
      : status === 'Changed into quote'
      ? '#64C623'
      : status === 'Changed into order'
      ? '#1A6BBA'
      : status === 'Canceled'
      ? '#FF4D49'
      : ''

  return (
    <CustomChip
      label={status}
      skin='light'
      sx={{
        background: `linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), ${color}`,
        color: color,
      }}
      size='small'
    />
  )
}
