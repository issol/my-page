// ** mui
import { Typography } from '@mui/material'
import { Box } from '@mui/system'
import { DataGrid, GridColumns, GridSortDirection } from '@mui/x-data-grid'

// ** components
import { ExtraNumberChip } from '@src/@core/components/chips/chips'

// ** third party
import { styled } from '@mui/system'

// ** helpers

// ** nextJS

import {
  ClientRequestStatusChip,
  JobTypeChip,
  ServiceTypeChip,
} from '@src/@core/components/chips/chips'

// ** types
import { RequestListType } from '@src/types/requests/list.type'
import { RequestFilterType, SortType } from '@src/types/requests/filters.type'

// ** contexts

import { useRecoilValueLoadable } from 'recoil'
import { authState } from '@src/states/auth'
import { Dispatch, SetStateAction } from 'react'
import { UserRoleType } from '@src/context/types'
import { FilterType } from '..'
import { saveUserFilters } from '@src/shared/filter-storage'

type CellType = {
  row: RequestListType
}

type Props = {
  page: number
  pageSize: number
  setPage: (num: number) => void
  setPageSize: (num: number) => void

  setFilters: Dispatch<SetStateAction<RequestFilterType | null>>
  list: {
    data: RequestListType[]
    count: number
    totalCount: number
  }
  isLoading: boolean
  onRowClick: (id: number) => void
  role: UserRoleType
  columns: GridColumns<RequestListType>
  type: 'list' | 'calendar'
  defaultFilter: FilterType
}

export default function List({
  page,
  pageSize,
  setPage,
  setPageSize,

  setFilters,
  list,
  isLoading,
  onRowClick,
  role,
  columns,
  type,
  defaultFilter,
}: Props) {
  function noData() {
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
        <Typography variant='subtitle1'>There are no requests</Typography>
      </Box>
    )
  }

  return (
    <DataGrid
      autoHeight
      components={{
        NoRowsOverlay: () => noData(),
        NoResultsOverlay: () => noData(),
      }}
      sortingMode='server'
      onSortModelChange={e => {
        if (e.length) {
          const value = e[0] as { field: SortType; sort: GridSortDirection }
          setFilters((prevState: RequestFilterType | null) => ({
            ...prevState!,
            sort: value.field,
            ordering: value.sort,
          }))
          saveUserFilters('clientRequestListFilter', {
            ...defaultFilter,
            sort: value.field,
            ordering: value.sort,
          })
        }
      }}
      onRowClick={e => onRowClick(e.row.id)}
      sx={{ overflowX: 'scroll', cursor: 'pointer' }}
      rows={list.data}
      rowCount={list.totalCount}
      loading={isLoading}
      rowsPerPageOptions={[10, 25, 50]}
      hideFooterSelectedRowCount
      pagination
      hideFooter={type === 'calendar'}
      page={page}
      pageSize={pageSize}
      paginationMode='server'
      onPageChange={(newPage: number) => {
        setFilters((prevState: RequestFilterType | null) => ({
          ...prevState!,
          skip: newPage * pageSize!,
        }))
        setPage!(newPage)
      }}
      onPageSizeChange={(newPageSize: number) => {
        setFilters((prevState: RequestFilterType | null) => ({
          ...prevState!,
          take: newPageSize,
        }))
        setPageSize!(newPageSize)
      }}
      columns={columns}
    />
  )
}

const Title = styled(Typography)`
  font-weight: 600;
  font-size: 1rem;
  color: rgba(76, 78, 100, 0.87);
`
