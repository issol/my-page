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
import { getQuoteListColumns } from '@src/shared/const/columns/quote-list'

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
              columns={getQuoteListColumns(role, auth)}
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
            columns={getQuoteListColumns(role, auth)}
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
