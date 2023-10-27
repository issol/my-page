import { Card, Typography } from '@mui/material'

import { Box } from '@mui/system'
import {
  DataGrid,
  GridColumns,
  GridRowParams,
  GridSortDirection,
  gridClasses,
} from '@mui/x-data-grid'
import {
  ExtraNumberChip,
  JobTypeChip,
  QuoteStatusChip,
  ServiceTypeChip,
} from '@src/@core/components/chips/chips'
import { useRouter } from 'next/router'
import { QuotesListType } from '@src/types/common/quotes.type'
import { FullDateTimezoneHelper } from '@src/shared/helpers/date.helper'
import { useContext, useState } from 'react'
import { useRecoilValueLoadable } from 'recoil'
import { authState } from '@src/states/auth'
import { formatCurrency } from '@src/shared/helpers/price.helper'
import { QuotesFilterType, SortType } from '@src/types/quotes/quote'
import { UserRoleType } from '@src/context/types'

type QuotesListCellType = {
  row: QuotesListType
}

type Props = {
  skip: number
  pageSize: number
  setSkip: (num: number) => void
  setPageSize: (num: number) => void
  list: {
    data: Array<QuotesListType> | []
    totalCount: number
  }
  isLoading: boolean
  filter: QuotesFilterType
  setFilter: (filter: QuotesFilterType) => void
  role: UserRoleType
  type: 'list' | 'calendar'
}

export default function QuotesList({
  skip,
  pageSize,
  setSkip,
  setPageSize,
  list,
  isLoading,
  filter,
  setFilter,
  role,
  type,
}: Props) {
  const router = useRouter()
  const auth = useRecoilValueLoadable(authState)

  const columns: GridColumns<QuotesListType> = [
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
      renderCell: ({ row }: QuotesListCellType) => {
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
      renderCell: ({ row }: QuotesListCellType) => {
        return (
          <QuoteStatusChip
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
      headerName: 'Company name / Email',
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => (
        <Box>{role.name === 'CLIENT' ? 'LSP' : 'Client name'} / Email</Box>
      ),
      renderCell: ({ row }: QuotesListCellType) => {
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
      renderCell: ({ row }: QuotesListCellType) => {
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
      renderCell: ({ row }: QuotesListCellType) => {
        return (
          <Box sx={{ display: 'flex', gap: '8px' }}>
            {!row.category ? (
              '-'
            ) : (
              <JobTypeChip
                type={row.category}
                label={row.category}
                size='small'
              />
            )}
            {!row.serviceType || !row.serviceType?.length ? null : (
              <ServiceTypeChip size='small' label={row.serviceType[0]} />
            )}

            {row.serviceType?.length > 1 ? (
              <ExtraNumberChip
                size='small'
                label={row.serviceType.slice(1).length}
              />
            ) : null}
          </Box>
        )
      },
    },

    {
      flex: 0.1,
      minWidth: 280,
      field: 'quoteRegisteredDate',
      headerName: 'Quote date',
      disableColumnMenu: true,
      renderHeader: () => <Box>Quote date</Box>,
      renderCell: ({ row }: QuotesListCellType) => {
        return (
          <Box>
            {FullDateTimezoneHelper(
              row.quoteDate,
              auth.getValue().user?.timezone!,
            )}
          </Box>
        )
      },
    },

    {
      flex: 0.1,
      minWidth: 280,
      field: 'quoteDeadline',
      headerName: 'Quote deadline',
      disableColumnMenu: true,
      renderHeader: () => <Box>Quote deadline</Box>,
      renderCell: ({ row }: QuotesListCellType) => {
        return (
          <Box>
            {FullDateTimezoneHelper(
              row.quoteDeadline,
              auth.getValue().user?.timezone!,
            )}
          </Box>
        )
      },
    },
    {
      flex: 0.1,
      minWidth: 280,
      field: 'expiryDate',
      headerName: 'Quote expiry date',
      disableColumnMenu: true,
      renderHeader: () => <Box>Quote expiry date</Box>,
      renderCell: ({ row }: QuotesListCellType) => {
        return (
          <Box>
            {FullDateTimezoneHelper(
              row.quoteExpiry,
              auth.getValue().user?.timezone!,
            )}
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
      renderCell: ({ row }: QuotesListCellType) => {
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
        <Typography variant='subtitle1'>There are no quotes</Typography>
      </Box>
    )
  }

  return (
    <>
      {type === 'calendar' ? (
        <Card>
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
              sortingMode='server'
              onSortModelChange={e => {
                if (e.length) {
                  const value = e[0] as {
                    field: SortType
                    sort: GridSortDirection
                  }
                  setFilter({
                    ...filter,
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
              rows={list.data}
              rowCount={list.totalCount ?? 0}
              hideFooter={type === 'calendar'}
              hideFooterPagination={type === 'calendar'}
              loading={isLoading}
              onCellClick={params => {
                if (
                  role.name === 'CLIENT' &&
                  params.row.status === 'Under revision'
                )
                  return
                router.push(`/quotes/detail/${params.row.id}`)
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
              page={skip}
              pageSize={pageSize}
              paginationMode='server'
              onPageChange={setSkip}
              disableSelectionOnClick
              onPageSizeChange={newPageSize => setPageSize(newPageSize)}
            />
          </Box>
        </Card>
      ) : (
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
            sortingMode='server'
            onSortModelChange={e => {
              if (e.length) {
                const value = e[0] as {
                  field: SortType
                  sort: GridSortDirection
                }
                setFilter({
                  ...filter,
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
            rows={list.data}
            rowCount={list.totalCount ?? 0}
            loading={isLoading}
            onCellClick={params => {
              if (
                role.name === 'CLIENT' &&
                params.row.status === 'Under revision'
              )
                return
              router.push(`/quotes/detail/${params.row.id}`)
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
            page={skip}
            pageSize={pageSize}
            paginationMode='server'
            onPageChange={setSkip}
            disableSelectionOnClick
            onPageSizeChange={newPageSize => setPageSize(newPageSize)}
          />
        </Box>
      )}
    </>
  )
}
