import { Button, Card, Grid, Typography } from '@mui/material'

import { Box } from '@mui/system'
import { DataGrid, GridColumns } from '@mui/x-data-grid'
import CardHeader from '@mui/material/CardHeader'
import { ClientRowType } from '@src/apis/client.api'
import { ClientStatusChip } from '@src/@core/components/chips/chips'
import { StyledNextLink } from '@src/@core/components/customLink'
import { useRouter } from 'next/router'
import {
  contryCodeAndPhoneNumberFormatter,
  splitContryCodeAndPhoneNumber,
} from '@src/shared/helpers/phone-number-helper'

type ClientListCellType = {
  row: ClientRowType
}

interface ClientListProps {
  skip: number
  pageSize: number
  setSkip: (num: number) => void
  setPageSize: (num: number) => void
  list: {
    data: Array<ClientRowType> | []
    count: number
    totalCount: number
  }
  isLoading: boolean
}

const ClientList = ({
  skip,
  pageSize,
  setSkip,
  setPageSize,
  list,
  isLoading,
}: ClientListProps) => {
  const router = useRouter()
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
      renderHeader: () => <Box>Time zone</Box>,
      renderCell: ({ row }: ClientListCellType) => {
        return <div>{row?.timezone?.label}</div>
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
          <div>
            {!row?.phone
              ? '-'
              : contryCodeAndPhoneNumberFormatter(
                  splitContryCodeAndPhoneNumber(row.phone),
                )}
          </div>
        )
      },
    },
  ]

  const NoList = () => {
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
          title={
            <Box display='flex' justifyContent='space-between'>
              <Typography variant='h6'>Clients ({list.totalCount})</Typography>{' '}
              <Button variant='contained'>
                <StyledNextLink href='/client/add-new' color='white'>
                  Add new client
                </StyledNextLink>
              </Button>
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
            getRowId={row => row?.clientId}
            components={{
              NoRowsOverlay: () => NoList(),
              NoResultsOverlay: () => NoList(),
            }}
            sx={{ overflowX: 'scroll', cursor: 'pointer' }}
            columns={columns}
            rows={list.data}
            rowCount={list.totalCount}
            loading={isLoading}
            onCellClick={params => {
              router.push(`/client/detail/${params.row.clientId}`)
            }}
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
    </Grid>
  )
}

export default ClientList
