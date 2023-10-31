import { Box, Tooltip, Typography } from '@mui/material'
import { GridColumns } from '@mui/x-data-grid'
import {
  ExtraNumberChip,
  InvoiceReceivableChip,
  JobTypeChip,
  ServiceTypeChip,
} from '@src/@core/components/chips/chips'
import { TableTitleTypography } from '@src/@core/styles/typography'
import { ClientUserType, UserDataType, UserRoleType } from '@src/context/types'
import { FullDateTimezoneHelper } from '@src/shared/helpers/date.helper'
import { getCurrencyMark } from '@src/shared/helpers/price.helper'
import { InvoiceReceivableListType } from '@src/types/invoice/receivable.type'
import { Loadable } from 'recoil'

type CellType = {
  row: InvoiceReceivableListType
}

export const getInvoiceReceivableListColumns = (
  statusList: {
    value: number
    label: string
  }[],
  role: UserRoleType,
  auth: Loadable<{
    user: UserDataType | null
    company: ClientUserType | null | undefined
    loading: boolean
  }>,
) => {
  const columns: GridColumns<InvoiceReceivableListType> = [
    {
      field: 'corporationId',
      minWidth: 130,
      headerName: 'No.',
      disableColumnMenu: true,
      renderHeader: () => <Box>No.</Box>,
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
      minWidth: 240,
      disableColumnMenu: true,
      sortable: false,
      renderCell: ({ row }: CellType) => {
        const label = statusList?.find(
          i => i.value === row.invoiceStatus,
        )?.label
        if (label) return <>{InvoiceReceivableChip(label, row.invoiceStatus)}</>
      },
    },
    {
      field: 'Client / Email',
      minWidth: 260,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => (
        <Box>{role.name === 'CLIENT' ? 'LSP / Email' : 'Client / Email'}</Box>
      ),
      renderCell: ({ row }: CellType) => {
        return (
          <Box>
            <Typography fontWeight={600}>
              {row.order?.client?.name ?? '-'}
            </Typography>
            <Typography variant='body2'>
              {row.order?.client?.email ?? '-'}
            </Typography>
          </Box>
        )
      },
    },
    {
      field: 'Project name',
      minWidth: 290,
      disableColumnMenu: true,
      sortable: false,
      renderCell: ({ row }: CellType) => {
        return (
          <Tooltip title={row.order?.projectName}>
            <TableTitleTypography fontSize={14}>
              {row.order?.projectName ?? '-'}
            </TableTitleTypography>
          </Tooltip>
        )
      },
    },
    {
      field: 'Category / Service type',
      minWidth: 420,
      disableColumnMenu: true,
      sortable: false,
      renderCell: ({ row }: CellType) => {
        return (
          <Box sx={{ display: 'flex', gap: '8px' }}>
            {row.order?.category ? (
              <JobTypeChip
                size='small'
                type={row.order.category}
                label={row.order.category}
              />
            ) : (
              '-'
            )}

            {row.order?.serviceType?.length ? (
              <>
                <ServiceTypeChip
                  size='small'
                  label={row.order.serviceType[0]}
                />
                {row.order?.serviceType.length > 1 ? (
                  <ExtraNumberChip
                    size='small'
                    label={`+${row.order?.serviceType.slice(1).length}`}
                  />
                ) : null}
              </>
            ) : (
              '-'
            )}
          </Box>
        )
      },
    },
    {
      field: 'invoicedAt',
      minWidth: 280,
      disableColumnMenu: true,
      renderHeader: () => <Box>Invoice date</Box>,
      renderCell: ({ row }: CellType) => {
        if (auth.state === 'hasValue' && auth.getValue().user) {
          const date = FullDateTimezoneHelper(
            row.invoicedAt,
            auth.getValue().user?.timezone?.code,
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
      disableColumnMenu: true,
      renderHeader: () => <Box>Payment due</Box>,
      renderCell: ({ row }: CellType) => {
        const date = FullDateTimezoneHelper(
          row.payDueAt,
          row.payDueTimezone?.code,
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
      disableColumnMenu: true,
      hide: role.name === 'CLIENT',
      renderHeader: () => <Box>Payment date</Box>,
      renderCell: ({ row }: CellType) => {
        const date = FullDateTimezoneHelper(
          row.paidAt,
          row.paidDateTimezone?.code,
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
      minWidth: 130,
      disableColumnMenu: true,
      renderHeader: () => <Box>Total price</Box>,
      renderCell: ({ row }: CellType) => {
        const price = `${getCurrencyMark(
          row.currency,
        )} ${row.totalPrice?.toLocaleString('ko-KR')}`
        const date = FullDateTimezoneHelper(
          row.salesCheckedAt,
          row?.salesCheckedDateTimezone?.code,
        )
        return (
          <Tooltip
            title={
              <Box>
                <Typography color='#ffffff' fontSize={11}>
                  Revenue from : {row.order?.revenueFrom ?? '-'}
                </Typography>
                <Typography color='#ffffff' fontSize={11}>
                  Sales category : {row.salesCategory ?? '-'}
                </Typography>
                <Typography color='#ffffff' fontSize={11}>
                  Sales recognition date : {date}
                </Typography>
              </Box>
            }
          >
            <Typography fontWeight={600}>{price}</Typography>
          </Tooltip>
        )
      },
    },
  ]

  return columns
}
