import { JobsListType } from '@src/types/jobs/get-jobs.type'

import { Button, Card, Grid, Tooltip, Typography } from '@mui/material'

import { Box } from '@mui/system'
import { DataGrid, GridColumns } from '@mui/x-data-grid'
import CardHeader from '@mui/material/CardHeader'
import { StyledNextLink } from '@src/@core/components/customLink'
import { useRouter } from 'next/router'
import {
  JobsStatusChip,
  ServiceTypeChip,
} from '@src/@core/components/chips/chips'
import { JobTypeChip } from '@src/@core/components/chips/chips'
import { FullDateTimezoneHelper } from '@src/shared/helpers/date.helper'
import { AuthContext } from '@src/context/AuthContext'
import { useContext } from 'react'
import { getCurrencyMark } from '@src/shared/helpers/price.helper'
import { TableTitleTypography } from '@src/@core/styles/typography'

type CellType = {
  row: JobsListType
}

type Props = {
  skip: number
  pageSize: number
  setSkip: (num: number) => void
  setPageSize: (num: number) => void
  list: {
    data: Array<JobsListType> | []
    totalCount: number
  }
  isLoading: boolean
}

export default function JobsList({
  skip,
  pageSize,
  setSkip,
  setPageSize,
  list,
  isLoading,
}: Props) {
  const { user } = useContext(AuthContext)
  const router = useRouter()

  const columns: GridColumns<JobsListType> = [
    {
      field: 'corporationId',
      flex: 0.2,
      minWidth: 140,
      headerName: 'No.',
      disableColumnMenu: true,
      renderHeader: () => <Box>No.</Box>,
      renderCell: ({ row }: CellType) => {
        return (
          <Tooltip title={row.corporationId}>
            <TableTitleTypography>{row.corporationId}</TableTitleTypography>
          </Tooltip>
        )
      },
    },
    {
      flex: 0.05,
      minWidth: 150,
      field: 'status',
      headerName: 'Status',
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => <Box>Status</Box>,
      renderCell: ({ row }: CellType) => {
        return JobsStatusChip(row.status)
      },
    },
    {
      flex: 0.1,
      minWidth: 210,
      field: 'name',
      headerName: 'Client / Email',
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => <Box>Client / Email</Box>,
      renderCell: ({ row }: CellType) => {
        return (
          <Box display='flex' flexDirection='column'>
            <Typography fontWeight='bold'>{row?.client?.name}</Typography>
            <Typography variant='body2'>{row?.client?.email}</Typography>
          </Box>
        )
      },
    },
    {
      flex: 0.1,
      minWidth: 180,
      field: 'jobName',
      headerName: 'Project name',
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => <Box>Project name</Box>,
      renderCell: ({ row }: CellType) => {
        return <Typography variant='body2'>{row?.jobName}</Typography>
      },
    },
    {
      flex: 0.1,
      minWidth: 180,
      field: 'category , serviceType',
      headerName: 'Category / Service type',
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => <Box>Category / Service type</Box>,
      renderCell: ({ row }: CellType) => {
        return (
          <Box display='flex' alignItems='center' gap='8px'>
            <JobTypeChip
              size='small'
              type={row?.category}
              label={row?.category}
            />
            <ServiceTypeChip size='small' label={row?.serviceType} />
          </Box>
        )
      },
    },
    {
      flex: 0.1,
      minWidth: 180,
      field: 'startedAt',
      headerName: 'Job start date',
      disableColumnMenu: true,
      renderHeader: () => <Box>Job start date</Box>,
      renderCell: ({ row }: CellType) => {
        return (
          <Tooltip
            title={FullDateTimezoneHelper(
              row?.startedAt,
              user?.timezone?.code!,
            )}
          >
            <div>
              {FullDateTimezoneHelper(row?.startedAt, user?.timezone?.code!)}
            </div>
          </Tooltip>
        )
      },
    },
    {
      flex: 0.1,
      minWidth: 180,
      field: 'dueAt',
      headerName: 'Job due date',
      disableColumnMenu: true,
      renderHeader: () => <Box>Job due date</Box>,
      renderCell: ({ row }: CellType) => {
        return (
          <Tooltip
            title={FullDateTimezoneHelper(row?.dueAt, user?.timezone?.code!)}
          >
            <div>
              {FullDateTimezoneHelper(row?.dueAt, user?.timezone?.code!)}
            </div>
          </Tooltip>
        )
      },
    },
    {
      flex: 0.1,
      minWidth: 180,
      field: 'totalPrice',
      headerName: 'Total price',
      // hideSortIcons: true,
      disableColumnMenu: true,
      // sortable: false,
      renderHeader: () => <Box>Total price</Box>,
      renderCell: ({ row }: CellType) => {
        return (
          <div>
            {getCurrencyMark(row.currency)}
            {Number(row.totalPrice).toLocaleString()}
          </div>
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
        <Typography variant='subtitle1'>There are no jobs</Typography>
      </Box>
    )
  }
  return (
    <Grid item xs={12}>
      <Card>
        <CardHeader
          title={
            <Box display='flex' justifyContent='space-between'>
              <Typography variant='h6'>Jobs ({list.totalCount})</Typography>{' '}
              <Button variant='contained'>
                <StyledNextLink href='/orders/jobs/add-new' color='white'>
                  Create new job
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
            rowCount={list.totalCount}
            loading={isLoading}
            onCellClick={params => {
              router.push(`/orders/job-list/${params.row.id}`)
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
