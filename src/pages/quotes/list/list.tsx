import { Button, Card, Grid, Typography } from '@mui/material'

import { Box } from '@mui/system'
import { DataGrid, GridColumns } from '@mui/x-data-grid'
import CardHeader from '@mui/material/CardHeader'
import {
  ClientStatusChip,
  ExtraNumberChip,
  JobTypeChip,
  QuoteStatusChip,
  ServiceTypeChip,
} from '@src/@core/components/chips/chips'
import { getGmtTime } from '@src/shared/helpers/timezone.helper'
import { StyledNextLink } from '@src/@core/components/customLink'
import { useRouter } from 'next/router'
import { QuotesListType } from '@src/types/common/quotes.type'
import { FullDateTimezoneHelper } from '@src/shared/helpers/date.helper'
import { useContext } from 'react'
import { AuthContext } from '@src/context/AuthContext'
import { formatCurrency } from '@src/shared/helpers/price.helper'

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
}

export default function QuotesList({
  skip,
  pageSize,
  setSkip,
  setPageSize,
  list,
  isLoading,
}: Props) {
  const router = useRouter()
  const { user } = useContext(AuthContext)
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
      renderHeader: () => <Box>Client name / Email</Box>,
      renderCell: ({ row }: QuotesListCellType) => {
        return (
          <Box display='flex' flexDirection='column'>
            <Typography fontWeight='bold'>{row?.client.name}</Typography>
            <Typography variant='body2'>{row?.client.email}</Typography>
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
            <JobTypeChip type={row.category} label={row.category} />

            <ServiceTypeChip label={row.serviceType[0]} />
            {row.serviceType.length > 1 ? (
              <ExtraNumberChip label={row.serviceType.slice(1).length} />
            ) : null}
          </Box>
        )
      },
    },

    {
      flex: 0.1,
      minWidth: 280,
      field: 'quoteDate',
      headerName: 'Quote date',
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => <Box>Quote date</Box>,
      renderCell: ({ row }: QuotesListCellType) => {
        return (
          <Box>{FullDateTimezoneHelper(row.quoteDate, user?.timezone!)}</Box>
        )
      },
    },

    {
      flex: 0.1,
      minWidth: 280,
      field: 'projectDueDate',
      headerName: 'Quote deadline',
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => <Box>Quote deadline</Box>,
      renderCell: ({ row }: QuotesListCellType) => {
        return (
          <Box>
            {FullDateTimezoneHelper(row.quoteDeadline, user?.timezone!)}
          </Box>
        )
      },
    },
    {
      flex: 0.1,
      minWidth: 280,
      field: 'quoteExpiry',
      headerName: 'Quote expiry date',
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => <Box>Quote expiry date</Box>,
      renderCell: ({ row }: QuotesListCellType) => {
        return (
          <Box>{FullDateTimezoneHelper(row.quoteExpiry, user?.timezone!)}</Box>
        )
      },
    },
    //
    // {
    //   flex: 0.1,
    //   minWidth: 140,
    //   field: 'totalPrice',
    //   headerName: 'Total price',
    //   hideSortIcons: true,
    //   disableColumnMenu: true,
    //   sortable: false,
    //   renderHeader: () => <Box>Total price</Box>,
    //   renderCell: ({ row }: QuotesListCellType) => {
    //     return <Box>{formatCurrency(row.totalPrice, row.currency)}</Box>

    //   },
    // },
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
    <Grid item xs={12}>
      <Card>
        <CardHeader
          title={
            <Box display='flex' justifyContent='space-between'>
              <Typography variant='h6'>Clients ({list.totalCount})</Typography>{' '}
              <Button variant='contained'>
                <StyledNextLink href='/quotes/add-new' color='white'>
                  Create new quote
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
            components={{
              NoRowsOverlay: () => NoList(),
              NoResultsOverlay: () => NoList(),
            }}
            sx={{ overflowX: 'scroll', cursor: 'pointer' }}
            columns={columns}
            rows={list.data}
            rowCount={list.totalCount ?? 0}
            loading={isLoading}
            // onCellClick={params => {
            //   router.push(`/client/detail/${params.row.clientId}`)
            // }}
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
