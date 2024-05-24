import CustomChip from '@src/@core/components/mui/chip'
import { Chip } from '@mui/material'
import { StatusType } from '@src/apis/client.api'

import { RoleType, UserType } from '@src/context/types'

import {
  getOrderStatusColor,
  getProAppliedRolesStatusColor,
  getProInvoiceStatusColor,
  getProJobStatusColor,
  getReceivableStatusColor,
} from '@src/shared/helpers/colors.helper'

import { TestStatusColor } from '@src/shared/const/chipColors'
import { styled } from '@mui/system'
import { OverridableStringUnion } from '@mui/types'
import { ChipPropsColorOverrides } from '@mui/material/Chip/Chip'
import {
  AppliedRolesStatus,
  InvoicePayableStatus,
  InvoiceReceivableStatus,
  InvoiceReceivableStatusLabel,
  JobStatus,
  OrderLabel,
  OrderStatus,
  QuotesStatusLabel,
  RequestStatus,
  StatusItem,
} from '@src/types/common/status.type'

export function renderStatusChip(status: string) {
  const statusColors: Record<
    string,
    OverridableStringUnion<
      | 'default'
      | 'primary'
      | 'secondary'
      | 'error'
      | 'info'
      | 'success'
      | 'warning',
      ChipPropsColorOverrides
    >
  > = {
    Fulfilled: 'success',
    Ongoing: 'warning',
    Paused: 'secondary',
  }

  const color = statusColors[status]

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
  ${({ type }) => {
    const typeBackgrounds: Record<string, string> = {
      'Documents/Text': '#FF9E90',
      Dubbing: '#FFF387',
      'Misc.': '#BFF0FF',
      Interpretation: '#CBFFEC',
      'OTT/Subtitle': '#A9E0FF',
      Webcomics: '#BEEFAE',
      Webnovel: '#FFBFE9',
    }

    const background = typeBackgrounds[type] || 'rgba(76, 78, 100, 0.26)'

    return `
      background: ${background};
      color: #111111; // 글자색 설정
    `
  }}
`

export const RoleChip = styled(Chip)<{ type: string }>`
  border-width: 1px;
  border-style: solid;

  ${({ type }) => {
    const typeColors: Record<string, Record<string, string>> = {
      DTPer: { background: '#FF985E', borderColor: '#FF985E' },
      'DTP QCer': { background: '#BC9459', borderColor: '#BC9459' },
      QCer: { background: '#6638A1', borderColor: '#6638A1' },
      Transcriber: { background: '#921010', borderColor: '#921010' },
      Translator: { background: '#9024C3', borderColor: '#9024C3' },
      'Audio describer': { background: '#E0CA00', borderColor: '#E0CA00' },
      'Audio description QCer': {
        background: '#D1C76B',
        borderColor: '#D1C76B',
      },
      'Dubbing audio QCer': { background: '#A89F52', borderColor: '#A89F52' },
      'Dubbing script QCer': { background: '#A98A1B', borderColor: '#A98A1B' },
      'Dubbing script translator': {
        background: '#6F6934',
        borderColor: '#6F6934',
      },
      'Dubbing voice artist': { background: '#37330F', borderColor: '#37330F' },
      Interpreter: { background: '#80FCCF', borderColor: '#80FCCF' },
      Copywriter: { background: '#BFF0FF', borderColor: '#BFF0FF' },
      Editor: { background: '#67DBFF', borderColor: '#67DBFF' },
      'Video editor': { background: '#CFDBDE', borderColor: '#CFDBDE' },
      'SDH author': { background: '#8EB7DC', borderColor: '#8EB7DC' },
      'SDH QCer': { background: '#2D83D2', borderColor: '#2D83D2' },
      'Subtitle author': { background: '#3A5ACE', borderColor: '#3A5ACE' },
      'Subtitle QCer': { background: '#213478', borderColor: '#213478' },
      'Supp author': { background: '#1351EF', borderColor: '#1351EF' },
      'Supp QCer': { background: '#085886', borderColor: '#085886' },
      'Template author': { background: '#1ACEF5', borderColor: '#1ACEF5' },
      'Template QCer': { background: '#15A0BE', borderColor: '#15A0BE' },
      Proofreader: { background: '#66D841', borderColor: '#66D841' },
      'Webcomics QCer': { background: '#6DAA59', borderColor: '#6DAA59' },
      'Webcomics translator': { background: '#357D1D', borderColor: '#357D1D' },
      'Webnovel QCer': { background: '#F569C5', borderColor: '#F569C5' },
      'Webnovel translator': { background: '#CD4BA0', borderColor: '#CD4BA0' },
    }

    const { background, borderColor } = typeColors[type] || {
      background:
        'linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), #FFBFE9',
      borderColor: '#FFBFE9',
    }

    return `
      background: linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)) ${background};
      border-color: ${borderColor};
      color: #111111;
    `
  }}
`

export const ServiceTypeChip = styled(Chip)`
  background: linear-gradient(
      0deg,
      rgba(255, 255, 255, 0.88),
      rgba(255, 255, 255, 0.88)
    ),
    #666cff;
  border: 1px solid rgba(102, 108, 255, 0.5);
  font-size: 13px;
  font-weight: 500;
`

export function WorkStatusChip(status: string) {
  const statusColors: Record<string, string> = {
    Approved: '#64C623',
    'Assigned-waiting': '#6D788D',
    Canceled: '#FF4D49',
    Delivered: '#1A6BBA',
    'In progress': '#FDB528',
    'Invoice accepted': '#9B6CD8',
    'Invoice created': '#F572D8',
    Overdue: '#FF4D49',
    Paid: '#1B8332',
    Requested: '#A81988',
    'Without invoice': '#75571C',
  }

  const color = statusColors[status] || ''

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
  height: 24px;
  ${({ status }) => {
    const statusStyles: Record<string, Record<string, string>> = {
      Onboard: {
        background:
          'linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), #72E128',
        color: '#64C623',
      },
      'Off-board': {
        background: '#929292',
        color: '#ffffff',
      },
      'On-hold': {
        background: 'rgba(76, 78, 100, 0.05)',
        border: '1px solid rgba(76, 78, 100, 0.38)',
        color: 'rgba(76, 78, 100, 0.38)',
      },
      'Do not contact': {
        background:
          'linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), #FF4D49',
        color: '#FF4D49',
      },
      'Netflix-onboard': {
        background:
          'linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), #666CFF',
        color: '#666CFF',
      },
    }

    const { background, color, border } = statusStyles[status] || {}
    return `
      ${background ? `background: ${background};` : ''}
      ${color ? `color: ${color};` : ''}
      ${border ? `border: ${border};` : ''}
    `
  }}
`

export const ClientStatusChip = styled(Chip)<{ status: StatusType }>`
  border: none;

  ${({ status }) => {
    const statusStyles: Record<string, Record<string, string>> = {
      New: {
        background:
          'linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), #666CFF',
        color: '#666CFF',
      },
      Active: {
        background:
          'linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), #64C623',
        color: '#64C623',
      },
      Inactive: {
        background: '#EDEFF1',
        color: 'rgba(76, 78, 100, 0.38)',
      },
      Contacted: {
        background:
          'linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), #DF9F23',
        color: '#DF9F23',
      },
      Blocked: {
        background: '#626471',
        color: '#F7F7F9',
      },
    }

    const { background, color } = statusStyles[status] || {}
    return `
      ${background ? `background: ${background};` : ''}
      ${color ? `color: ${color};` : ''}
    `
  }}
`
export const CatInterfaceChip = styled(Chip)<{ status: boolean }>`
  border: none;

  ${({ status }) =>
    status
      ? `background: linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), #FA8773;
       color: #FA8773;
       font-weight: 600;`
      : `background: rgba(76, 78, 100, 0.12);
       color: rgba(76, 78, 100, 0.6);`}
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
  status: OrderStatus & OrderLabel
}>`
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
  status: QuotesStatusLabel
}>`
  border: none;

  ${({ status }) => {
    const statusColors = {
      New: '#666CFF',
      'In preparation': '#F572D8',
      'Internal review': '#20B6E5',
      'Client review': '#FDB528',
      'Under review': '#FDB528',
      Expired: '#FF4D49',
      Rejected: '#FF4D49',
      Accepted: '#64C623',
      'Changed into order': '#1A6BBA',
      Canceled: '#FF4D49',
      'Revision requested': '#A81988',
      'Under revision': '#BA971A',
      Revised: '#AD7028',
      'Quote sent': '#2B6603',
      'Without invoice': '#4C4E64',
    }

    const color = statusColors[status]
    return color
      ? `background: linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), ${color}; color: ${color};`
      : null
  }}
`

export function JobsStatusChip(status: JobStatus, statusList: StatusItem[]) {
  const statusColors: Record<JobStatus, string> = {
    60000: '#F572D8', // 'In preparation'
    60100: '#A81988', // 'Requested'
    60110: '#6D788D', // 'Awaiting prior job'
    60200: '#FDB528', // 'In progress'
    60250: '#D00606', // 'Redelivery requested'
    60300: '#FF4D49', // 'Overdue'
    60400: '#686A80', // 'Partially delivered'
    60500: '#1A6BBA', // 'Delivered'
    60600: '#64C623', // 'Approved'
    60700: '#9B6CD8', // 'Invoiced'
    60800: '#1B8332', // 'Paid'
    60900: '#75571C', // 'Without invoice'
    601000: '#FF4D49', // 'Canceled'
    601100: '#FFFFFF', // 'Payment canceled'
    70000: '#A81988', // 'Requested from LPM (Requested)'
    70100: '#6D788D', // 'Awaiting approval (Request accepted)'
    70200: '#6D788D', // 'Declined (Request rejected)'
    70300: '#6D788D', // 'In progress (Assigned)'
    70400: '#6D788D', // 'Canceled'
    70500: '#6D788D', // 'Unassigned'
    70600: '#6D788D', // 'Unassigned'
  }

  const statusLabel = statusList.find(list => list.value === status)?.label!
  return (
    <CustomChip
      label={status === 60300 ? `🔴 ${statusLabel}` : statusLabel} // Status가 Overdue일 경우 아이콘 붙이기
      skin='light'
      sx={{
        background: `linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), ${statusColors[status]}`,
        color: statusColors[status],
      }}
      size='small'
    />
  )
}

export function assignmentStatusChip(status: number, statusList: StatusItem[]) {
  const statusColors: Record<string, string> = {
    70000: '#FDB528', // REQUESTED
    70100: '#6AD721', // REQUEST_ACCEPTED
    70200: '#FF4D49', // REQUEST_REJECTED
    70300: '#666CFF', // ASSIGNED_IN_PROGRESS
    70400: '#FF4D49', // ASSIGNMENT_CANCELED
    70500: '#FF4D49', // REQUEST_CANCELED
    70600: '#8D8E9A', // NO_REPLY
  }

  const color = statusColors[status] || ''

  const statusLabel =
    statusList.find(list => list.value === status)?.label || ''

  return (
    <CustomChip
      label={statusLabel}
      skin='light'
      sx={{
        background: `linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), ${color}`,
        color: color,
      }}
      size='small'
    />
  )
}

export function RequestHistoryStatusChip(
  status: number,
  statusList: StatusItem[],
) {
  const statusColors: Record<string, string> = {
    70000: '#FDB528', // REQUESTED
    70100: '#6AD721', // REQUEST_ACCEPTED
    70200: '#FF4D49', // REQUEST_REJECTED
    70300: '#666CFF', // ASSIGNED_IN_PROGRESS
    70400: '#FF4D49', // ASSIGNMENT_CANCELED
    70500: '#FF4D49', // REQUEST_CANCELED
    70600: '#8D8E9A', // NO_REPLY
  }

  const color = statusColors[status] || ''

  return (
    <CustomChip
      label={
        status === 70100
          ? 'Accepted'
          : status === 70200
            ? 'Rejected'
            : status === 70600
              ? 'No reply'
              : '-'
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

// export const AssignmentStatusChip = styled(Chip)<{ status: number }>`
//   border: none;
//   ${({ status }) =>
//     status === 60200
//       ? `background: linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), #72E128; color: #64C623;`
//       : status === 60300
//       ? `background: linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), #FF4D49; color: #FF4D49;`
//       : status === 60100
//       ? `background: linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), #FDB528; color: #FDB528;`
//       : status === 60500
//       ? `background: linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), #666CFF; color: #666CFF;`
//       : status === 601600
//       ? `background: linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), #FF4D49; color: #FF4D49;`
//       : null};
// `

export function invoicePayableStatusChip(
  status: number,
  statusList: StatusItem[],
) {
  const statusColors: Record<string, string> = {
    40000: '#9B6CD8', // Invoiced
    40100: '#26C6F9', // Under revision
    40200: '#AD7028', // Revised
    40300: '#1B8332', // Paid
    40400: '#FF4D49', // null? (assuming this means some kind of error or exceptional state)
  }

  const color = statusColors[status] || ''

  const statusLabel =
    statusList.find(list => list.value === status)?.label || ''

  return (
    <CustomChip
      label={statusLabel}
      skin='light'
      sx={{
        background: `linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), ${color}`,
        color: color,
      }}
      size='small'
    />
  )
}

// export function InvoicePayableChip(status: InvoicePayableStatusType) {
//   const color =
//     status === 'Invoice created'
//       ? '#F572D8'
//       : status === 'Invoice accepted'
//       ? '#9B6CD8'
//       : status === 'Paid'
//       ? '#FF4D49'
//       : status === 'Overdue'
//       ? '#FF4D49'
//       : status === 'Canceled'
//       ? '#FF4D49'
//       : ''

//   return (
//     <CustomChip
//       label={status === 'Overdue' ? `🔴 ${status}` : status}
//       skin='light'
//       sx={{
//         background: `linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), ${color}`,
//         color: color,
//       }}
//       size='small'
//     />
//   )
// }

export function InvoiceReceivableChip(
  label: string,
  status: InvoiceReceivableStatusLabel & InvoiceReceivableStatus,
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

export function InvoiceProChip(label: string, status: InvoicePayableStatus) {
  const color = getProInvoiceStatusColor(status)

  return (
    <CustomChip
      label={label}
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
  const permissionColors: Record<UserType, string> = {
    Master: '#666CFF80',
    Manager: '#26C6F980',
    General: '#64C623',
  }

  const color = permissionColors[permission] || ''

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

export function ClientRequestStatusChip(status: RequestStatus, label: string) {
  const statusColors: Record<RequestStatus, string> = {
    50001: '#A81988', // Custom color for status 50001
    50002: '#FDB528', // Custom color for status 50002
    50003: '#64C623', // Custom color for status 50003
    50004: '#1A6BBA', // Custom color for status 50004
    50005: '#FF4D49', // Custom color for status 50005
  }

  const color = statusColors[status] || ''

  return (
    <CustomChip
      label={label}
      skin='light'
      sx={{
        background: `linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), ${color}`,
        color: color,
      }}
      size='small'
    />
  )
}

export function ProJobStatusChip(label: string, status: JobStatus) {
  const color = getProJobStatusColor(status)

  return (
    <CustomChip
      label={label}
      skin='light'
      sx={{
        background: `linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), ${color}`,
        color: color,
      }}
      size='small'
    />
  )
}

export function ProAppliedRolesStatusChip(
  label: string,
  status: AppliedRolesStatus,
) {
  const color = getProAppliedRolesStatusColor(status)

  return (
    <CustomChip
      label={label}
      skin='light'
      sx={{
        background: `linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), ${color}`,
        color: color,
      }}
      size='small'
    />
  )
}

interface TestStatusChipProps {
  label: string
  status: string
}

export const TestStatusChip = ({ label, status }: TestStatusChipProps) => {
  const color = TestStatusColor[status as keyof typeof TestStatusColor]
  return (
    <CustomChip
      label={label}
      skin='light'
      sx={{
        background: `linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), ${color}`,
        color: color,
      }}
      size='small'
    />
  )
}
