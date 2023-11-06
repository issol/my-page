import { Box, Tooltip, Typography } from '@mui/material'
import { GridColumns } from '@mui/x-data-grid'
import {
  InvoiceProChip,
  InvoiceReceivableChip,
  proInvoiceStatusChip,
} from '@src/@core/components/chips/chips'
import { TableTitleTypography } from '@src/@core/styles/typography'
import { ClientUserType, UserDataType } from '@src/context/types'
import { FullDateTimezoneHelper } from '@src/shared/helpers/date.helper'
import { formatCurrency, getCurrencyMark } from '@src/shared/helpers/price.helper'
import { InvoiceProStatusType } from '@src/types/invoice/common.type'
import { InvoicePayableListType } from '@src/types/invoice/payable.type'

import { Loadable } from 'recoil'

type CellType = {
  row: InvoicePayableListType
}

export const getInvoiceProListColumns = (
  statusList: {
    value: number
    label: string
  }[],
  auth: Loadable<{
    user: UserDataType | null
    company: ClientUserType | null | undefined
    loading: boolean
  }>,
) => {
  const columns: GridColumns<InvoicePayableListType> = [
    {
      field: 'corporationId',
      minWidth: 160,
      flex: 0.128,
      headerName: 'No.',
      disableColumnMenu: true,
      renderHeader: () => (
        <Typography variant='subtitle1' fontWeight={500} fontSize={14}>
          No.
        </Typography>
      ),
      renderCell: ({ row }: CellType) => {
        return (
          <Tooltip title={row.corporationId}>
            <TableTitleTypography fontSize={14}>
              {row.corporationId}
            </TableTitleTypography>
          </Tooltip>
        )
      },
    },
    {
      field: 'Status',
      minWidth: 270,
      flex: 0.216,
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
            {proInvoiceStatusChip(row.invoiceStatus as InvoiceProStatusType, statusList)}
          </>
        )
      },
    },

    {
      field: 'invoicedAt',
      minWidth: 310,
      flex: 0.248,
      disableColumnMenu: true,
      renderHeader: () => (
        <Typography variant='subtitle1' fontWeight={500} fontSize={14}>
          Invoice date
        </Typography>
      ),
      renderCell: ({ row }: CellType) => {
        const date = FullDateTimezoneHelper(
          row.invoicedAt,
          auth.getValue().user?.timezone.code,
        )
        return (
          <Tooltip title={date}>
            <Typography variant='body1'>{date}</Typography>
          </Tooltip>
        )
      },
    },

    {
      field: 'paidAt',
      minWidth: 310,
      flex: 0.248,
      disableColumnMenu: true,
      renderHeader: () => (
        <Typography variant='subtitle1' fontWeight={500} fontSize={14}>
          Payment date
        </Typography>
      ),
      renderCell: ({ row }: CellType) => {
        const date = FullDateTimezoneHelper(
          row.paidAt,
          row.paidDateTimezone?.code,
        )
        return (
          <Tooltip title={date}>
            <Typography variant='body1'>{date}</Typography>
          </Tooltip>
        )
      },
    },
    {
      field: 'totalPrice',
      minWidth: 200,
      flex: 0.16,
      disableColumnMenu: true,
      renderHeader: () => (
        <Typography variant='subtitle1' fontWeight={500} fontSize={14}>
          Total price
        </Typography>
      ),
      renderCell: ({ row }: CellType) => {
        const price = `${formatCurrency(
          row.totalPrice,
          row.currency
        )}`

        return <Typography fontWeight={600}>{price}</Typography>
      },
    },
  ]

  return columns
}
