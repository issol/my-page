// ** mui
import { Button, Card, Grid, Tooltip, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { DataGrid, GridRowParams } from '@mui/x-data-grid'
import CardHeader from '@mui/material/CardHeader'

// ** custom component
import { StyledNextLink } from 'src/@core/components/customLink'

// ** helpers
import { FullDateTimezoneHelper } from 'src/shared/helpers/date.helper'
import {
  JobTypeChip,
  renderStatusChip,
  RoleChip,
} from 'src/@core/components/chips/chips'

// ** nextJS
import { useRouter } from 'next/router'

// ** types
import { JobPostingDataType } from 'src/apis/jobPosting.api'

type CellType = {
  row: JobPostingDataType
}

type Props = {
  skip: number
  pageSize: number
  setSkip: (num: number) => void
  setPageSize: (num: number) => void
  list: {
    data: Array<JobPostingDataType> | []
    totalCount: number
  }
  isLoading: boolean
}

export default function JobPostingList({
  skip,
  pageSize,
  setSkip,
  setPageSize,
  list,
  isLoading,
}: Props) {
  const router = useRouter()

  function moveToDetail(row: GridRowParams) {
    router.push(`/jobPosting/detail/${row.id}`)
  }

  const columns = [
    {
      flex: 0.15,
      field: 'id',
      minWidth: 40,
      headerName: 'No.',
      renderHeader: () => <Box>No.</Box>,
      renderCell: ({ row }: CellType) => row.id,
    },
    {
      flex: 0.15,
      minWidth: 120,
      field: 'status',
      headerName: 'Status',
      renderHeader: () => <Box>Status</Box>,
      renderCell: ({ row }: CellType) => {
        return renderStatusChip(row.status)
      },
    },
    {
      flex: 0.5,
      minWidth: 130,
      field: 'jobType',
      headerName: 'Job Type / Role',
      renderHeader: () => <Box>Job Type / Role</Box>,
      renderCell: ({ row }: CellType) => {
        return (
          <Tooltip placement='bottom' title={`${row.jobType} / ${row.role}`}>
            <Box sx={{ display: 'flex', gap: '8px', overflow: 'scroll' }}>
              <JobTypeChip
                type={row.jobType}
                label={row.jobType}
                size='small'
              />
              <RoleChip label={row.role} type={row.role} size='small' />
            </Box>
          </Tooltip>
        )
      },
    },
    {
      flex: 0.23,
      minWidth: 120,
      field: 'Language pair',
      headerName: 'Language pair',
      renderHeader: () => <Box>Language pair</Box>,
      renderCell: ({ row }: CellType) => (
        <Tooltip
          placement='bottom'
          title={`${row.targetLanguage?.toUpperCase()} → ${row.sourceLanguage?.toUpperCase()}`}
        >
          <Typography sx={{ fontWeight: 'bold' }} variant='body2'>
            {row.targetLanguage?.toUpperCase()} →{' '}
            {row.sourceLanguage?.toUpperCase()}
          </Typography>
        </Tooltip>
      ),
    },
    {
      flex: 0.23,
      minWidth: 120,
      field: 'yearsOfExperience',
      headerName: 'Years of experience',
      renderHeader: () => <Box>Years of experience</Box>,
      renderCell: ({ row }: CellType) => (
        <Box sx={{ overflowX: 'scroll' }}>{row.yearsOfExperience}</Box>
      ),
    },
    {
      flex: 0.23,
      minWidth: 120,
      field: 'writer',
      headerName: 'TAD',
      renderHeader: () => <Box>TAD</Box>,
      renderCell: ({ row }: CellType) => (
        <Box sx={{ overflowX: 'scroll' }}>{row.writer}</Box>
      ),
    },
    {
      flex: 0.23,
      minWidth: 120,
      field: 'dueDate',
      headerName: 'Due date',
      renderHeader: () => <Box>Due date</Box>,
      renderCell: ({ row }: CellType) => (
        <>
          {!row.dueDate ? (
            '-'
          ) : (
            <Tooltip
              placement='bottom'
              title={`${FullDateTimezoneHelper(
                row.dueDate,
                row.dueDateTimezone,
              )}`}
            >
              <Typography sx={{ overflow: 'scroll' }} variant='body2'>
                <>{FullDateTimezoneHelper(row.dueDate, row.dueDateTimezone)}</>
              </Typography>
            </Tooltip>
          )}
        </>
      ),
    },
    {
      flex: 0.1,
      minWidth: 40,
      field: 'openings',
      headerName: 'Openings',
      renderHeader: () => <Box>Openings</Box>,
      renderCell: ({ row }: CellType) => (
        <Box sx={{ overflowX: 'scroll' }}>{row.openings}</Box>
      ),
    },
    {
      flex: 0.1,
      minWidth: 120,
      field: 'view',
      headerName: 'View',
      renderHeader: () => <Box>View</Box>,
      renderCell: ({ row }: CellType) => (
        <Box sx={{ overflowX: 'scroll' }}>{row.view}</Box>
      ),
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
        <Typography variant='subtitle1'>
          There are no job posting lists
        </Typography>
      </Box>
    )
  }

  return (
    <Grid item xs={12}>
      <Card>
        <CardHeader
          title={
            <Box display='flex' justifyContent='space-between'>
              <Typography variant='h6'>
                Job posting ({list?.totalCount | 0})
              </Typography>{' '}
              <Button variant='contained'>
                <StyledNextLink href='/jobPosting/post' color='white'>
                  Create job posting
                </StyledNextLink>
              </Button>
            </Box>
          }
        />
        <Box>
          <DataGrid
            autoHeight
            components={{
              NoRowsOverlay: () => noData(),
              NoResultsOverlay: () => noData(),
            }}
            sx={{
              '& .MuiDataGrid-row:hover': {
                // backgroundColor: 'inherit',
                cursor: 'pointer',
              },
            }}
            onRowClick={e => moveToDetail(e)}
            rows={list.data}
            rowCount={list.totalCount || 0}
            hideFooterSelectedRowCount
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
        </Box>
      </Card>
    </Grid>
  )
}
