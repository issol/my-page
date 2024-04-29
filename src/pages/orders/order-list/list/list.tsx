import { Button, Card, Grid, Typography, Switch } from '@mui/material'

import { Box } from '@mui/system'
import {
  DataGrid,
  GridColumns,
  GridSortDirection,
  gridClasses,
} from '@mui/x-data-grid'
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
import { timezoneSelector } from '@src/states/permission'
import { useRecoilValueLoadable } from 'recoil'
import { FilterType } from '..'
import { FilterKey, saveUserFilters } from '@src/shared/filter-storage'

type OrderListCellType = {
  row: OrderListType
}

type Props = {
  page?: number
  rowsPerPage?: number
  setPageSize?: Dispatch<SetStateAction<number>>
  setRowsPerPage?: Dispatch<SetStateAction<number>>
  setFilters?: Dispatch<SetStateAction<OrderListFilterType | null>>
  handleRowClick: (row: OrderListType) => void
  user: UserDataType
  list: Array<OrderListType>
  listCount: number
  isLoading: boolean
  isCardHeader: boolean
  role: UserRoleType
  defaultFilter?: FilterType
  seeMyOrders: boolean
  handleSeeMyOrders: (event: React.ChangeEvent<HTMLInputElement>) => void
  hideCompletedOrders: boolean
  handleHideCompletedOrders: (event: React.ChangeEvent<HTMLInputElement>) => void
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
  defaultFilter,
  seeMyOrders,
  handleSeeMyOrders,
  hideCompletedOrders,
  handleHideCompletedOrders,
}: Props) {
  const timezone = useRecoilValueLoadable(timezoneSelector)

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
            minWidth: 120,
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
      minWidth: 240,
      field: 'name',
      headerName: `${role.name === 'CLIENT' ? 'LSP' : 'Client'}`,
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => (
        <Box>{role.name === 'CLIENT' ? 'LSP' : 'Client'}</Box>
      ),
      renderCell: ({ row }: OrderListCellType) => {
        return (
          <Typography
            variant='body2'
            fontWeight={400}
            sx={{ color: '#4C4E64' }}
          >
            {role.name === 'CLIENT' ? row?.lsp?.name : row?.client.name}
          </Typography>
        )
      },
    },
    {
      flex: 0.1,
      minWidth: 240,
      field: 'email',
      headerName: 'Email',
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => (
        <Box>Email</Box>
      ),
      renderCell: ({ row }: OrderListCellType) => {
        return (
          <Typography
            variant='body2'
            fontWeight={400}
            sx={{ color: '#4C4E64' }}
          >
            {role.name === 'CLIENT' ? row?.lsp?.email : row?.client.email}
          </Typography>
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
        return (
          <Typography
            variant='body2'
            fontWeight={400}
            sx={{ color: '#4C4E64' }}
          >
            {row.projectName}
          </Typography>
        )
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
          <Typography
            variant='body2'
            fontWeight={400}
            sx={{ color: '#4C4E64' }}
          >
            {convertTimeToTimezone(
              row.orderedAt,
              user.timezone,
              timezone.getValue(),
            )}
          </Typography>
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
          <Typography
            variant='body2'
            fontWeight={400}
            sx={{ color: '#4C4E64' }}
          >
            {convertTimeToTimezone(
              row.projectDueAt,
              user.timezone,
              timezone.getValue(),
            )}
          </Typography>
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
          <Typography
            variant='body2'
            fontWeight={400}
            sx={{ color: '#4C4E64' }}
          >
            {!row.currency
              ? row.subtotal
                ? row.subtotal
                : '-'
              : formatCurrency(Number(row.subtotal), row.currency)}
          </Typography  >
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
        <Card
          sx={{
            borderRadius: '0 0 16px 16px',
            
          }}
        >
          <CardHeader
            title={
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: '24px',
                }}
              >                
                {role.name === 'CLIENT' ? null : (
                  <Button variant='contained'>
                    <StyledNextLink href='/orders/add-new' color='white'>
                      Create new order
                    </StyledNextLink>
                  </Button>
                )}
                <Box sx={{ display: 'flex', }}>
                  <Box sx={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                    <Typography>See only my orders</Typography>
                    <Switch checked={seeMyOrders} onChange={handleSeeMyOrders} />
                  </Box>
                  <Box sx={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                    <Typography>Hide completed orders</Typography>
                    <Switch
                      checked={hideCompletedOrders}
                      onChange={handleHideCompletedOrders}
                    />
                  </Box>
                </Box>
              </Box>
            }
            sx={{ pb: 4, '& .MuiCardHeader-title': { letterSpacing: '.15px' }, paddingTop: '16px', }}
          ></CardHeader>
          <Box
            sx={{
              width: '100%',
              height: 'calc(97vh - 391px)',
              '& .MuiDataGrid-columnHeaderTitle': {
                textTransform: 'none',
              },
            }}
          >
            <DataGrid
              components={{
                NoRowsOverlay: () => NoList(),
                NoResultsOverlay: () => NoList(),
              }}
              sortingMode='server'
              onSortModelChange={e => {
                if (e.length) {
                  const value = e[0] as {
                    field:
                      | 'corporationId'
                      | 'projectDueDate'
                      | 'orderDate'
                      | 'totalPrice'
                    sort: GridSortDirection
                  }
                  setFilters &&
                    setFilters((prevState: OrderListFilterType | null) => ({
                      ...prevState!,
                      sort: value.field,
                      ordering: value.sort,
                    }))
                  defaultFilter &&
                    saveUserFilters(FilterKey.ORDER_LIST, {
                      ...defaultFilter,
                      sort: value.field,
                      ordering: value.sort,
                    })
                }
              }}
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
              rowHeight={40}
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
                setFilters!((prevState: OrderListFilterType | null) => ({
                  ...prevState!,
                  skip: newPage * rowsPerPage!,
                }))
                setPageSize!(newPage)
              }}
              onPageSizeChange={(newPageSize: number) => {
                setFilters!((prevState: OrderListFilterType | null) => ({
                  ...prevState!,
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
              width: '100%',
              height: 'calc(97vh - 391px)',
              '& .MuiDataGrid-columnHeaderTitle': {
                textTransform: 'none',
              },
            }}
          >
            <DataGrid
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
              rowHeight={40}
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
                setFilters!((prevState: OrderListFilterType | null) => ({
                  ...prevState!,
                  skip: newPage * rowsPerPage!,
                }))
                setPageSize!(newPage)
              }}
              onPageSizeChange={(newPageSize: number) => {
                setFilters!((prevState: OrderListFilterType | null) => ({
                  ...prevState!,
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
