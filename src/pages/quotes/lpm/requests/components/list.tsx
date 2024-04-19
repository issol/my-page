// ** mui
import { Typography } from '@mui/material'
import { Box } from '@mui/system'
import { DataGrid, GridSortDirection } from '@mui/x-data-grid'

// ** third party
import { styled } from '@mui/system'

// ** types
import { RequestListType } from '@src/types/requests/list.type'
import { RequestFilterType, SortType } from '@src/types/requests/filters.type'

// ** contexts
import { Dispatch, SetStateAction, useContext } from 'react'
import { useRecoilValueLoadable } from 'recoil'
import { authState } from '@src/states/auth'
import { UserRoleType } from '@src/context/types'
import { FilterKey, saveUserFilters } from '@src/shared/filter-storage'
import { timezoneSelector } from '@src/states/permission'
import { getRequestListColumns } from '@src/shared/const/columns/requests'
import { FilterType } from '..'

type CellType = {
  row: RequestListType
}

type Props = {
  page: number
  pageSize: number
  setPage: (num: number) => void
  setPageSize: (num: number) => void
  defaultFilter: FilterType
  filters: RequestFilterType
  setFilters: Dispatch<SetStateAction<RequestFilterType | null>>
  list: {
    data: RequestListType[]
    count: number
    totalCount: number
  }
  isLoading: boolean
  onRowClick: (id: number) => void
  role: UserRoleType

  type: 'list' | 'calendar'
  statusList: {
    value: number
    label: string
  }[]
}

export default function List({
  page,
  pageSize,
  setPage,
  setPageSize,
  defaultFilter,
  filters,
  setFilters,
  list,
  isLoading,
  onRowClick,
  role,

  type,
  statusList,
}: Props) {
  const auth = useRecoilValueLoadable(authState)
  const timezone = useRecoilValueLoadable(timezoneSelector)
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
          saveUserFilters(FilterKey.LPM_REQUEST_LIST, {
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
      pagination
      page={page}
      hideFooter={type === 'calendar'}
      hideFooterSelectedRowCount
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
      columns={getRequestListColumns(
        statusList!,
        role!,
        auth,
        timezone.getValue(),
      )}
    />
  )
}

const Title = styled(Typography)`
  font-weight: 600;
  font-size: 1rem;
  color: rgba(76, 78, 100, 0.87);
`
