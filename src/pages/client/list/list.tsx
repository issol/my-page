import { Card, Grid, Typography } from '@mui/material'

import { Box } from '@mui/system'
import { DataGrid, GridColumns } from '@mui/x-data-grid'
import CardHeader from '@mui/material/CardHeader'
import { ClientRowType } from '@src/apis/client.api'
import { ClientStatusChip } from '@src/@core/components/chips/chips'
import { getGmtTime } from '@src/shared/helpers/timezone.helper'

type ClientListCellType = {
  row: ClientRowType
}

type Props = {
  skip: number
  pageSize: number
  setSkip: (num: number) => void
  setPageSize: (num: number) => void
  list: {
    data: Array<ClientRowType> | []
    count: number
  }
  isLoading: boolean
}

// ** TODO : 임의로 채워넣은 데이터 실데이터로 채워넣기
export default function ClientList({
  skip,
  pageSize,
  setSkip,
  setPageSize,
  list,
  isLoading,
}: Props) {
  const columns: GridColumns<ClientRowType> = [
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
    },
    {
      flex: 0.1,
      minWidth: 210,
      field: 'name',
      headerName: 'Company name / Email',
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => <Box>Company name / Email</Box>,
      renderCell: ({ row }: ClientListCellType) => {
        return (
          <Box display='flex' flexDirection='column'>
            <Typography fontWeight='bold'>{row?.name}</Typography>
            <Typography variant='body2'>{row?.email}</Typography>
          </Box>
        )
      },
    },
    {
      flex: 0.05,
      minWidth: 180,
      field: 'status',
      headerName: 'Status',
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => <Box>Status</Box>,
      renderCell: ({ row }: ClientListCellType) => {
        return (
          <ClientStatusChip
            size='small'
            status={row?.status}
            label={row?.status}
          />
        )
      },
    },
    {
      flex: 0.1,
      minWidth: 180,
      field: 'timezone',
      headerName: 'Time zone',
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => <Box>Status</Box>,
      renderCell: ({ row }: ClientListCellType) => {
        return <div>{getGmtTime(row?.timezone?.code)}</div>
      },
    },
    {
      flex: 0.1,
      minWidth: 180,
      field: 'phone',
      headerName: 'Telephone',
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => <Box>Telephone</Box>,
      renderCell: ({ row }: ClientListCellType) => {
        return (
          <div>{row?.phone ? `+${row.timezone.phone}) ${row.phone}` : '-'}</div>
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
        <Typography variant='subtitle1'>There are no clients</Typography>
      </Box>
    )
  }

  return (
    <Grid item xs={12}>
      <Card>
        <CardHeader
          title={`Clients (${0})`}
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
            getRowId={row => row?.clientId}
            components={{
              NoRowsOverlay: () => NoList(),
              NoResultsOverlay: () => NoList(),
            }}
            sx={{ overflowX: 'scroll' }}
            columns={columns}
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
          />
        </Box>
      </Card>
    </Grid>
  )
}
