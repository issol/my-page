import { useRouter } from 'next/router'

// ** style components
import { Box, Tooltip, Typography } from '@mui/material'
import { DataGrid, GridColumns, gridClasses } from '@mui/x-data-grid'
import { TableTitleTypography } from '@src/@core/styles/typography'
import {
  ExtraNumberChip,
  InvoiceReceivableChip,
  JobTypeChip,
  ServiceTypeChip,
} from '@src/@core/components/chips/chips'

// ** types
import { InvoiceReceivableListType } from '@src/types/invoice/receivable.type'

// ** helpers
import { FullDateTimezoneHelper } from '@src/shared/helpers/date.helper'
import { getCurrencyMark } from '@src/shared/helpers/price.helper'

// ** contexts
import { useContext } from 'react'
import { useRecoilValueLoadable } from 'recoil'
import { authState } from '@src/states/auth'
import { useGetStatusList } from '@src/queries/common.query'
import { UserRoleType } from '@src/context/types'

type CellType = {
  row: InvoiceReceivableListType
}

type Props = {
  skip: number
  pageSize: number
  setSkip: (num: number) => void
  setPageSize: (num: number) => void
  list: {
    data: Array<InvoiceReceivableListType> | []
    totalCount: number
    count: number
  }
  isLoading: boolean
  role: UserRoleType
}

export default function ReceivableList({
  skip,
  pageSize,
  setSkip,
  setPageSize,
  list,
  isLoading,
  role,
}: Props) {
  const router = useRouter()
  const auth = useRecoilValueLoadable(authState)
  const { data: statusList } = useGetStatusList('InvoiceReceivable')

  function NoList() {
    return (
      <Box
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Typography variant='subtitle1'>There are no invoices</Typography>
      </Box>
    )
  }

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
                {row.order?.serviceType.length > 1 ? (
                  <ExtraNumberChip
                    size='small'
                    label={row.order?.serviceType.slice(1).length}
                  />
                ) : null}
                <ServiceTypeChip
                  size='small'
                  label={row.order.serviceType[0]}
                />
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
        )} ${row.totalPrice.toLocaleString('ko-KR')}`
        const date = FullDateTimezoneHelper(
          row.salesCheckedAt,
          row?.salesCheckedDateTimezone?.code,
        )
        return (
          <Tooltip
            title={
              <Box>
                <Typography color='#ffffff'>
                  Revenue from : {row.order?.revenueFrom ?? '-'}
                </Typography>
                <Typography color='#ffffff'>
                  Sales category : {row.salesCategory ?? '-'}
                </Typography>
                <Typography color='#ffffff'>
                  Sales recognition date : {date}
                </Typography>
              </Box>
            }
          >
            <Typography fontWeight={600}>보류</Typography>
          </Tooltip>
        )
      },
    },
  ]

  return (
    <Box
      sx={{
        '& .MuiDataGrid-columnHeaderTitle': {
          textTransform: 'none',
        },
      }}
    >
      <DataGrid
        autoHeight
        components={{
          NoRowsOverlay: () => NoList(),
          NoResultsOverlay: () => NoList(),
        }}
        sx={{
          overflowX: 'scroll',
          cursor: 'pointer',
          [`& .${gridClasses.row}.disabled`]: {
            opacity: 0.5,
            cursor: 'not-allowed',
          },
        }}
        columns={columns}
        rows={list.data}
        rowCount={list.totalCount ?? 0}
        loading={isLoading}
        onCellClick={params =>
          router.push(`/invoice/receivable/detail/${params.id}`)
        }
        rowsPerPageOptions={[10, 25, 50]}
        pagination
        page={skip}
        pageSize={pageSize}
        paginationMode='server'
        onPageChange={setSkip}
        disableSelectionOnClick
        onPageSizeChange={newPageSize => setPageSize(newPageSize)}
        getRowClassName={params =>
          role.name === 'CLIENT' && params.row.invoiceStatus === 30500
            ? 'disabled'
            : 'normal'
        }
        isRowSelectable={params =>
          role.name === 'CLIENT' && params.row.invoiceStatus !== 30500
        }
      />
    </Box>
  )
}
