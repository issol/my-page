// ** mui
import { Button, Card, Grid, Tooltip, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { DataGrid, GridRowParams } from '@mui/x-data-grid'
import CardHeader from '@mui/material/CardHeader'

// ** custom component
import { StyledNextLink } from 'src/@core/components/customLink'

// ** helpers
import { convertTimeToTimezone } from 'src/shared/helpers/date.helper'
import {
  JobTypeChip,
  renderStatusChip,
  RoleChip,
} from 'src/@core/components/chips/chips'

// ** nextJS
import { useRouter } from 'next/router'

// ** types
import { JobPostingDataType } from 'src/apis/jobPosting.api'
import { timezoneSelector } from '@src/states/permission'
import { useRecoilValueLoadable } from 'recoil'

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

  const timezone = useRecoilValueLoadable(timezoneSelector)

  function moveToDetail(row: GridRowParams) {
    router.push(`/jobPosting/detail/${row.id}`)
  }

  const columns = [
    {
      flex: 0.0567,
      field: 'id',
      minWidth: 100,
      headerName: 'No.',
      renderHeader: () => (
        <Typography variant='subtitle1' fontWeight={500} fontSize={14}>
          No.
        </Typography>
      ),
      renderCell: ({ row }: CellType) => row.corporationId,
    },
    {
      flex: 0.102,
      minWidth: 180,
      field: 'status',
      headerName: 'Status',
      renderHeader: () => (
        <Typography variant='subtitle1' fontWeight={500} fontSize={14}>
          Status
        </Typography>
      ),
      renderCell: ({ row }: CellType) => {
        return renderStatusChip(row.status)
      },
    },
    {
      flex: 0.187,
      minWidth: 330,
      field: 'jobType',
      headerName: 'Job Type / Role',
      renderHeader: () => (
        <Typography variant='subtitle1' fontWeight={500} fontSize={14}>
          Job Type / Role
        </Typography>
      ),
      renderCell: ({ row }: CellType) => {
        return (
          <Tooltip placement='bottom' title={`${row.jobType} / ${row.role}`}>
            <Box className='scroll_bar' sx={{ display: 'flex', gap: '8px' }}>
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
      flex: 0.136,
      minWidth: 240,
      field: 'Language pair',
      headerName: 'Language pair',
      renderHeader: () => (
        <Typography variant='subtitle1' fontWeight={500} fontSize={14}>
          Language pair
        </Typography>
      ),
      renderCell: ({ row }: CellType) => (
        <Tooltip
          placement='bottom'
          title={`${row.sourceLanguage?.toUpperCase()} → ${row.targetLanguage?.toUpperCase()}`}
        >
          <Typography sx={{ fontWeight: 'bold' }} variant='body1'>
            {row.sourceLanguage?.toUpperCase()} →{' '}
            {row.targetLanguage?.toUpperCase()}
          </Typography>
        </Tooltip>
      ),
    },
    {
      flex: 0.1076,
      minWidth: 190,
      field: 'yearsOfExperience',
      headerName: 'Years of experience',
      renderHeader: () => (
        <Typography variant='subtitle1' fontWeight={500} fontSize={14}>
          Years of experience
        </Typography>
      ),
      renderCell: ({ row }: CellType) => (
        <Box className='scroll_bar'>{row.yearsOfExperience}</Box>
      ),
    },
    {
      flex: 0.102,
      minWidth: 180,
      field: 'writer',
      headerName: 'TAD',
      renderHeader: () => (
        <Typography variant='subtitle1' fontWeight={500} fontSize={14}>
          TAD
        </Typography>
      ),
      renderCell: ({ row }: CellType) => <Box>{row.editorName}</Box>,
    },
    {
      flex: 0.0708,
      minWidth: 125,
      field: 'openings',
      headerName: 'Openings',
      renderHeader: () => (
        <Typography variant='subtitle1' fontWeight={500} fontSize={14}>
          Openings
        </Typography>
      ),
      renderCell: ({ row }: CellType) => (
        <Box className='scroll_bar'>{row.openings}</Box>
      ),
    },
    {
      flex: 0.1586,
      minWidth: 280,
      field: 'dueDate',
      headerName: 'Due date',
      renderHeader: () => (
        <Typography variant='subtitle1' fontWeight={500} fontSize={14}>
          Due date
        </Typography>
      ),
      renderCell: ({ row }: CellType) => (
        <>
          {!row.dueAt ? (
            '-'
          ) : (
            <Tooltip
              placement='bottom'
              title={`${convertTimeToTimezone(
                row.dueAt,
                row.deadlineTimezone,
                timezone.getValue(),
              )}`}
            >
              <Typography variant='body1'>
                <>
                  {convertTimeToTimezone(
                    row.dueAt,
                    row.deadlineTimezone,
                    timezone.getValue(),
                  )}
                </>
              </Typography>
            </Tooltip>
          )}
        </>
      ),
    },

    {
      flex: 0.0793,
      minWidth: 140,
      field: 'view',
      headerName: 'View',
      renderHeader: () => (
        <Typography variant='subtitle1' fontWeight={500} fontSize={14}>
          View
        </Typography>
      ),
      renderCell: ({ row }: CellType) => (
        <Box className='scroll_bar'>{row.view}</Box>
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
              overflowX: 'scroll',
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
