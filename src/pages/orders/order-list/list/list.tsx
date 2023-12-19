import { Button, Card, Grid, Typography } from '@mui/material'

import { Box } from '@mui/system'
import { DataGrid, GridColumns, gridClasses } from '@mui/x-data-grid'
import CardHeader from '@mui/material/CardHeader'
import {
  ExtraNumberChip,
  JobTypeChip,
  OrderStatusChip,
  ServiceTypeChip,
} from '@src/@core/components/chips/chips'

import { StyledNextLink } from '@src/@core/components/customLink'
import {
  OrderListFilterType,
  OrderListType,
} from '@src/types/orders/order-list'
import { convertTimeToTimezone } from '@src/shared/helpers/date.helper'
import { UserDataType, UserRoleType } from '@src/context/types'
import { formatCurrency } from '@src/shared/helpers/price.helper'
import { Dispatch, SetStateAction } from 'react'
import { useGetStatusList } from '@src/queries/common.query'

type OrderListCellType = {
  row: OrderListType
}

type Props = {
  page?: number
  rowsPerPage?: number
  setPageSize?: Dispatch<SetStateAction<number>>
  setRowsPerPage?: Dispatch<SetStateAction<number>>
  setFilters?: Dispatch<SetStateAction<OrderListFilterType>>
  handleRowClick: (row: OrderListType) => void
  user: UserDataType
  list: Array<OrderListType>
  listCount: number
  isLoading: boolean
  isCardHeader: boolean
  role: UserRoleType
}

export default function OrdersList({
  page,
  rowsPerPage,
  setRowsPerPage,
  setPageSize,
  list,
  listCount,
  isLoading,
  setFilters,
  handleRowClick,
  user,
  isCardHeader,
  role,
}: Props) {
  const { data: statusList } = useGetStatusList('Order')

  const columns: GridColumns<OrderListType> = [
    {
      field: 'corporationId',
      flex: 0.05,
      minWidth: 120,
      headerName: 'No.',
      disableColumnMenu: true,
      renderHeader: () => (
        <Box
          sx={{
            display: 'flex',
            minWidth: 80,
            width: '100%',
            alignItems: 'center',
          }}
        >
          <Box>No.</Box>
        </Box>
      ),
      renderCell: ({ row }: OrderListCellType) => {
        return <Box>{row.corporationId}</Box>
      },
    },
    {
      flex: 0.05,
      minWidth: 214,
      field: 'status',
      headerName: 'Status',
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => <Box>Status</Box>,
      renderCell: ({ row }: OrderListCellType) => {
        return (
          <OrderStatusChip
            size='small'
            status={row?.status}
            label={row?.status}
          />
        )
      },
    },
    {
      flex: 0.1,
      minWidth: 260,
      field: 'name',
      headerName: `${role.name === 'CLIENT' ? 'LSP' : 'Company name'} / Email`,
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => (
        <Box>{role.name === 'CLIENT' ? 'LSP' : 'Company name'} / Email</Box>
      ),
      renderCell: ({ row }: OrderListCellType) => {
        return (
          <Box display='flex' flexDirection='column'>
            <Typography fontWeight='bold'>
              {role.name === 'CLIENT' ? row?.lsp?.name : row?.client.name}
            </Typography>
            <Typography variant='body2'>
              {role.name === 'CLIENT' ? row?.lsp?.email : row?.client.email}
            </Typography>
          </Box>
        )
      },
    },

    {
      flex: 0.1,
      minWidth: 290,
      field: 'projectName',
      headerName: 'Project name',
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => <Box>Project name</Box>,
      renderCell: ({ row }: OrderListCellType) => {
        return <Box>{row.projectName}</Box>
      },
    },
    {
      flex: 0.1,
      minWidth: 420,
      field: 'category',
      headerName: 'Category / Service type',
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => <Box>Category / Service type</Box>,
      renderCell: ({ row }: OrderListCellType) => {
        return (
          <Box sx={{ display: 'flex', gap: '8px' }}>
            {row.category ? (
              <JobTypeChip
                type={row.category}
                label={row.category}
                size='small'
              />
            ) : (
              '-'
            )}

            {row.serviceType && row.serviceType.length > 0 ? (
              <ServiceTypeChip label={row.serviceType[0]} size='small' />
            ) : (
              '-'
            )}

            {row.serviceType && row.serviceType.length > 1 ? (
              <ExtraNumberChip
                label={`+${row.serviceType.slice(1).length}`}
                size='small'
              />
            ) : null}
          </Box>
        )
      },
    },

    {
      flex: 0.1,
      minWidth: 280,
      field: 'orderDate',
      headerName: 'Order date',
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => <Box>Order date</Box>,
      renderCell: ({ row }: OrderListCellType) => {
        return (
          <Box>{convertTimeToTimezone(row.orderedAt, user.timezone)}</Box>
        )
      },
    },

    {
      flex: 0.1,
      minWidth: 280,
      field: 'projectDueDate',
      headerName: 'Project due date',
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => <Box>Project due date</Box>,
      renderCell: ({ row }: OrderListCellType) => {
        return (
          <Box>
            {convertTimeToTimezone(row.projectDueAt, user.timezone)}
          </Box>
        )
      },
    },

    {
      flex: 0.1,
      minWidth: 140,
      field: 'totalPrice',
      headerName: 'Total price',
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => <Box>Total price</Box>,
      renderCell: ({ row }: OrderListCellType) => {
        return (
          <Box>
            {!row.currency
              ? row.subtotal
                ? row.subtotal
                : '-'
              : formatCurrency(Number(row.subtotal), row.currency)}
          </Box>
        )
      },
    },
  ]

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
        <Typography variant='subtitle1'>There are no orders</Typography>
      </Box>
    )
  }

  return (
    <Grid item xs={12}>
      {isCardHeader ? (
        <Card>
          <CardHeader
            title={
              <Box display='flex' justifyContent='space-between'>
                <Typography variant='h6'>Orders ({listCount ?? 0})</Typography>
                {role.name === 'CLIENT' ? null : (
                  <Button variant='contained'>
                    <StyledNextLink href='/orders/add-new' color='white'>
                      Create new order
                    </StyledNextLink>
                  </Button>
                )}
              </Box>
            }
            sx={{ pb: 4, '& .MuiCardHeader-title': { letterSpacing: '.15px' } }}
          ></CardHeader>
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
              // sx={{ overflowX: 'scroll', cursor: 'pointer' }}
              sx={{
                overflowX: 'scroll',
                cursor: 'pointer',
                [`& .${gridClasses.row}.disabled`]: {
                  opacity: 0.5,
                  cursor: 'not-allowed',
                  borderBottom: '1px solid rgba(76, 78, 100, 0.12)',
                  // backgroundColor: 'rgba(0, 0, 0, 0.1)',
                },
              }}
              columns={columns}
              rows={list ?? []}
              rowCount={listCount ?? 0}
              loading={isLoading}
              onCellClick={params => {
                if (
                  role.name === 'CLIENT' &&
                  params.row.status === 'Under revision'
                )
                  return
                handleRowClick(params.row)
              }}
              getRowClassName={params =>
                role.name === 'CLIENT' && params.row.status === 'Under revision'
                  ? 'disabled'
                  : 'normal'
              }
              isRowSelectable={params =>
                role.name === 'CLIENT' && params.row.status !== 'Under revision'
              }
              rowsPerPageOptions={[10, 25, 50]}
              pagination
              page={page}
              pageSize={rowsPerPage}
              paginationMode='server'
              onPageChange={(newPage: number) => {
                setFilters!((prevState: OrderListFilterType) => ({
                  ...prevState,
                  skip: newPage * rowsPerPage!,
                }))
                setPageSize!(newPage)
              }}
              onPageSizeChange={(newPageSize: number) => {
                setFilters!((prevState: OrderListFilterType) => ({
                  ...prevState,
                  take: newPageSize,
                }))
                setRowsPerPage!(newPageSize)
              }}
              disableSelectionOnClick
            />
          </Box>
        </Card>
      ) : (
        <Card sx={{ padding: '0 !important' }}>
          <Box
            sx={{
              '& .MuiDataGrid-columnHeaderTitle': {
                textTransform: 'none',
              },
            }}
          >
            <DataGrid
              autoHeight
              // getRowId={row => row?.orderId}
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
              rows={list ?? []}
              rowCount={listCount ?? 0}
              loading={isLoading}
              onCellClick={params => {
                if (
                  role.name === 'CLIENT' &&
                  params.row.status === 'Under revision'
                )
                  return

                handleRowClick(params.row)
              }}
              rowsPerPageOptions={[10, 25, 50]}
              pagination
              page={page}
              pageSize={rowsPerPage}
              hideFooterPagination
              hideFooter
              // paginationMode='server'
              onPageChange={(newPage: number) => {
                setFilters!((prevState: OrderListFilterType) => ({
                  ...prevState,
                  skip: newPage * rowsPerPage!,
                }))
                setPageSize!(newPage)
              }}
              onPageSizeChange={(newPageSize: number) => {
                setFilters!((prevState: OrderListFilterType) => ({
                  ...prevState,
                  take: newPageSize,
                }))
                setRowsPerPage!(newPageSize)
              }}
              disableSelectionOnClick
              getRowClassName={params =>
                role.name === 'CLIENT' && params.row.status === 'Under revision'
                  ? 'disabled'
                  : 'normal'
              }
              isRowSelectable={params =>
                role.name === 'CLIENT' && params.row.status !== 'Under revision'
              }
            />
          </Box>
        </Card>
      )}
    </Grid>
  )
}
