// ** mui
import { Typography } from '@mui/material'
import { Box } from '@mui/system'
import { DataGrid, GridSortDirection } from '@mui/x-data-grid'

// ** components
import { ExtraNumberChip } from '@src/@core/components/chips/chips'

// ** third party
import styled from 'styled-components'

// ** helpers
import { FullDateTimezoneHelper } from 'src/shared/helpers/date.helper'

// ** nextJS
import { useRouter } from 'next/router'
import {
  ClientRequestStatusChip,
  JobTypeChip,
  ServiceTypeChip,
} from '@src/@core/components/chips/chips'

// ** types
import { RequestListType } from '@src/types/requests/list.type'
import { RequestFilterType, SortType } from '@src/types/requests/filters.type'

// ** contexts
import { useContext } from 'react'
import { AuthContext } from '@src/context/AuthContext'

type CellType = {
  row: RequestListType
}

type Props = {
  skip: number
  pageSize: number
  setSkip: (num: number) => void
  setPageSize: (num: number) => void
  filter: RequestFilterType
  setFilter: (n: RequestFilterType) => void
  list: {
    data: RequestListType[]
    count: number
    totalCount: number
  }
  isLoading: boolean
  onRowClick: (id: number) => void
}

export default function List({
  skip,
  pageSize,
  setSkip,
  setPageSize,
  filter,
  setFilter,
  list,
  isLoading,
  onRowClick,
}: Props) {
  const { user } = useContext(AuthContext)

  const columns = [
    {
      flex: 0.28,
      field: 'corporationId',
      minWidth: 80,
      disableColumnMenu: true,
      renderHeader: () => <Box>No.</Box>,
      renderCell: ({ row }: CellType) => (
        <Title title={row.corporationId} sx={{ cursor: 'pointer' }}>
          {row.corporationId}
        </Title>
      ),
    },
    {
      flex: 0.15,
      minWidth: 120,
      field: 'status',
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => <Box>Status</Box>,
      renderCell: ({ row }: CellType) => ClientRequestStatusChip(row.status),
    },
    {
      flex: 0.15,
      minWidth: 180,
      field: 'email',
      headerName: 'LSP / Email',
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => <Box>LSP / Email</Box>,
      renderCell: ({ row }: CellType) => (
        <Box>
          <Typography fontWeight='bold'>{row.lsp.name}</Typography>
          <Typography variant='body2'>{row.lsp.email}</Typography>
        </Box>
      ),
    },
    {
      flex: 0.3,
      minWidth: 130,
      field: 'name',
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => <Box>Item name</Box>,
      renderCell: ({ row }: CellType) => {
        const itemName = row.items.length ? row.items[0].name : undefined
        return (
          <Box display='flex' alignItems='center' gap='8px'>
            <Typography>{itemName}</Typography>
            {row.items.length > 1 && (
              <ExtraNumberChip
                size='small'
                label={`+ ${row.items.length - 1}`}
              />
            )}
          </Box>
        )
      },
    },
    {
      flex: 0.23,
      minWidth: 120,
      field: 'category',
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => <Box>Category / Service type</Box>,
      renderCell: ({ row }: CellType) => {
        const category = row.items.length ? row.items[0]?.category : undefined
        const serviceTypes = row.items.length ? row.items[0]?.serviceType : []
        return (
          <Box display='flex' alignItems='center' gap='8px'>
            {category && (
              <JobTypeChip size='small' type={category} label={category} />
            )}
            {serviceTypes.length ? (
              <ServiceTypeChip size='small' label={serviceTypes[0]} />
            ) : null}
            {serviceTypes.length > 1 ? (
              <ExtraNumberChip
                size='small'
                label={`${serviceTypes.length - 1}`}
              />
            ) : null}
          </Box>
        )
      },
    },
    {
      flex: 0.23,
      minWidth: 120,
      field: 'requestedAt',
      disableColumnMenu: true,
      // sortable: false,
      renderHeader: () => <Box>Request date</Box>,
      renderCell: ({ row }: CellType) => (
        <Box sx={{ overflowX: 'scroll' }}>
          {FullDateTimezoneHelper(row.requestedAt, user?.timezone!)}
        </Box>
      ),
    },
    {
      flex: 0.23,
      minWidth: 120,
      field: 'desiredDueDate',
      disableColumnMenu: true,
      // sortable: false,
      renderHeader: () => <Box>Desired due date</Box>,
      renderCell: ({ row }: CellType) => {
        const dueDate = row.items.length
          ? row.items[0]?.desiredDueDate
          : undefined
        const timezone =
          (row.items.length && row.items[0]?.desiredDueTimezone?.code) || ''
        return (
          <Box sx={{ overflowX: 'scroll' }}>
            {!dueDate ? '-' : FullDateTimezoneHelper(dueDate, timezone)}
          </Box>
        )
      },
    },
  ]

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
          setFilter({ ...filter, sort: value.field, ordering: value.sort })
        }
      }}
      onRowClick={e => onRowClick(e.row.id)}
      sx={{ overflowX: 'scroll', cursor: 'pointer' }}
      rows={list.data}
      rowCount={list.count}
      loading={isLoading}
      rowsPerPageOptions={[10, 25, 50]}
      pagination
      page={skip}
      pageSize={pageSize}
      paginationMode='server'
      onPageChange={setSkip}
      onPageSizeChange={newPageSize => setPageSize(newPageSize)}
      columns={columns}
    />
  )
}

const Title = styled(Typography)`
  font-weight: 600;
  font-size: 1rem;
  color: rgba(76, 78, 100, 0.87);
`
