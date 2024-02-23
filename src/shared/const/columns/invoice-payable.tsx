import { Box, Tooltip, Typography } from '@mui/material'
import { GridColumns } from '@mui/x-data-grid'
import { invoicePayableStatusChip } from '@src/@core/components/chips/chips'
import { ClientUserType, UserDataType } from '@src/context/types'
import { convertTimeToTimezone } from '@src/shared/helpers/date.helper'
import { formatCurrency } from '@src/shared/helpers/price.helper'
import { InvoiceProStatusType } from '@src/types/invoice/common.type'
import { InvoicePayableListType } from '@src/types/invoice/payable.type'
import { Loadable } from 'recoil'

type CellType = {
  row: InvoicePayableListType
}

export const getInvoicePayableListColumns = (
  statusList: {
    label: string
    value: number
  }[],
  auth: Loadable<{
    user: UserDataType | null
    company: ClientUserType | null | undefined
    loading: boolean
  }>,
  timezone: Loadable<
    {
      offset: number
      offsetFormatted: string
      timezone: string
      timezoneCode: string
    }[]
  >,
  type: 'list' | 'calendar',
) => {
  const columns: GridColumns<InvoicePayableListType> = [
    {
      field: 'corporationId',
      minWidth: 130,
      flex: 0.0807,
      headerName: 'No.',
      disableColumnMenu: true,
      renderHeader: () => (
        <Typography variant='subtitle1' fontWeight={500} fontSize={14}>
          No.
        </Typography>
      ),
      renderCell: ({ row }: CellType) => {
        return <>{row.corporationId}</>
      },
    },
    {
      field: 'Status',
      minWidth: 240,
      flex: 0.1491,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => (
        <Typography variant='subtitle1' fontWeight={500} fontSize={14}>
          Status
        </Typography>
      ),
      renderCell: ({ row }: CellType) => {
        return (
          <>
            {/* {InvoicePayableChip(row.invoiceStatus as InvoicePayableStatusType)} */}
            {/* TODO: invoiceStatus 넘버로 오는지 확인 필요 */}
            {invoicePayableStatusChip(
              row.invoiceStatus as InvoiceProStatusType,
              statusList,
            )}
          </>
        )
      },
    },
    {
      field: 'Pro / Email',
      minWidth: 260,
      flex: 0.1615,
      hide: type === 'calendar',
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => (
        <Typography variant='subtitle1' fontWeight={500} fontSize={14}>
          Pro / Email
        </Typography>
      ),
      renderCell: ({ row }: CellType) => {
        return (
          <Box>
            <Typography fontWeight={600}>{row.pro?.name}</Typography>
            <Typography variant='body2'>{row.pro?.email}</Typography>
          </Box>
        )
      },
    },
    {
      field: 'invoicedAt',
      minWidth: 280,
      flex: 0.1739,
      disableColumnMenu: true,
      renderHeader: () => (
        <Typography variant='subtitle1' fontWeight={500} fontSize={14}>
          Invoice date
        </Typography>
      ),
      renderCell: ({ row }: CellType) => {
        if (auth.state === 'hasValue' && auth.getValue().user) {
          const date = convertTimeToTimezone(
            row.invoicedAt,
            auth.getValue().user?.timezone,
            timezone.getValue(),
          )
          return (
            <Tooltip title={date}>
              <Typography variant='body2'>{date}</Typography>
            </Tooltip>
          )
        }
      },
    },
    {
      field: 'payDueAt',
      minWidth: 280,
      flex: 0.1739,
      hide: type === 'calendar',
      disableColumnMenu: true,
      renderHeader: () => (
        <Typography variant='subtitle1' fontWeight={500} fontSize={14}>
          Payment due
        </Typography>
      ),
      renderCell: ({ row }: CellType) => {
        const date = convertTimeToTimezone(
          row.payDueAt,
          auth.getValue().user?.timezone,
          timezone.getValue(),
        )
        return (
          <Tooltip title={date}>
            <Typography variant='body2'>{date}</Typography>
          </Tooltip>
        )
      },
    },
    {
      field: 'paidAt',
      minWidth: 280,
      flex: 0.1739,
      disableColumnMenu: true,
      renderHeader: () => (
        <Typography variant='subtitle1' fontWeight={500} fontSize={14}>
          Payment date
        </Typography>
      ),
      renderCell: ({ row }: CellType) => {
        const date = convertTimeToTimezone(
          row.paidAt,
          auth.getValue().user?.timezone,
          timezone.getValue(),
        )
        return (
          <Tooltip title={date}>
            <Typography variant='body2'>{date}</Typography>
          </Tooltip>
        )
      },
    },
    {
      field: 'totalPrice',
      minWidth: 140,
      flex: 0.087,
      disableColumnMenu: true,
      renderHeader: () => (
        <Typography variant='subtitle1' fontWeight={500} fontSize={14}>
          Total price
        </Typography>
      ),
      renderCell: ({ row }: CellType) => {
        const price = `${formatCurrency(row.totalPrice, row.currency)}`
        return (
          <Tooltip title={price}>
            <Typography fontWeight={600}>{price}</Typography>
          </Tooltip>
        )
      },
    },
  ]

  return columns
}
