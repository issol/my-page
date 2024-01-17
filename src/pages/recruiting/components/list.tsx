// ** mui
import { Button, Card, Chip, Grid, Tooltip, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { DataGrid, GridRowParams } from '@mui/x-data-grid'
import CardHeader from '@mui/material/CardHeader'

// ** custom component
import { StyledNextLink } from 'src/@core/components/customLink'

// ** third party
import styled from '@emotion/styled'

// ** helpers
import {
  FullDateHelper,
  convertTimeToTimezone,
} from 'src/shared/helpers/date.helper'
import {
  JobTypeChip,
  renderStatusChip,
  RoleChip,
} from 'src/@core/components/chips/chips'

// ** nextJS
import { useRouter } from 'next/router'

// ** types
import { RecruitingDataType } from 'src/apis/recruiting.api'
import { useRecoilValueLoadable } from 'recoil'
import { timezoneSelector } from '@src/states/permission'

type CellType = {
  row: RecruitingDataType
}

type Props = {
  skip: number
  pageSize: number
  setSkip: (num: number) => void
  setPageSize: (num: number) => void
  list: {
    data: Array<RecruitingDataType> | []
    totalCount: number
  }
  isLoading: boolean
}

export default function RecruitingList({
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
    router.push(`/recruiting/detail/${row.id}`)
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
      flex: 0.15,
      minWidth: 180,
      field: 'client',
      headerName: 'Client',
      renderHeader: () => <Box>Client</Box>,
      renderCell: ({ row }: CellType) => (
        <Tooltip placement='bottom' title={row.client}>
          <Typography sx={{ fontWeight: 'bold' }} variant='body2'>
            {row.client}
          </Typography>
        </Tooltip>
      ),
    },
    {
      flex: 0.4,
      minWidth: 130,
      field: 'jobType',
      headerName: 'Job Type / Role',
      renderHeader: () => <Box>Job Type / Role</Box>,
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
      flex: 0.23,
      minWidth: 120,
      field: 'Language pair',
      headerName: 'Language pair',
      renderHeader: () => <Box>Language pair</Box>,
      renderCell: ({ row }: CellType) => (
        <Tooltip
          placement='bottom'
          title={`${row.sourceLanguage?.toUpperCase()} → ${row.targetLanguage?.toUpperCase()}`}
        >
          <Typography sx={{ fontWeight: 'bold' }} variant='body2'>
            {row.sourceLanguage?.toUpperCase()} →{' '}
            {row.targetLanguage?.toUpperCase()}
          </Typography>
        </Tooltip>
      ),
    },
    {
      flex: 0.23,
      minWidth: 120,
      field: 'writer',
      headerName: 'Written by',
      renderHeader: () => <Box>Written by</Box>,
      renderCell: ({ row }: CellType) => (
        <Box className='scroll_bar'>{row.writer}</Box>
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
              title={`${convertTimeToTimezone(
                row.dueDate,
                row.dueDateTimezone,
                timezone.getValue(),
              )}`}
            >
              <Typography className='scroll_bar' variant='body2'>
                <>
                  {convertTimeToTimezone(
                    row.dueDate,
                    row.dueDateTimezone,
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
      flex: 0.15,
      minWidth: 40,
      field: 'openings',
      headerName: 'Openings',
      renderHeader: () => <Box>Openings</Box>,
      renderCell: ({ row }: CellType) => (
        <Box className='scroll_bar'>{row.openings ?? '-'}</Box>
      ),
    },
    {
      flex: 0.23,
      minWidth: 120,
      field: 'jobStatus',
      headerName: 'Job posting',
      renderHeader: () => <Box>Job posting</Box>,
      renderCell: ({ row }: CellType) => (
        <>{!row.jobStatus ? '-' : renderStatusChip(row.jobStatus)}</>
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
          There are no recruiting lists
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
                Recruiting list ({list?.totalCount | 0})
              </Typography>{' '}
              <Button variant='contained'>
                <StyledNextLink href='/recruiting/post' color='white'>
                  Add recruiting info
                </StyledNextLink>
              </Button>
            </Box>
          }
        />
        <Box
          sx={{
            '& .hide': {
              position: 'relative',
              filter: 'grayscale(100%)',
              '&:hover': {
                background: 'rgba(76, 78, 100, 0.12)',
              },
              '&::after': {
                position: 'absolute',
                width: '100%',
                height: '100%',
                content: "''",
                background: 'rgba(76, 78, 100, 0.12)',
                mixBlendMode: 'revert',
                filter: 'grayscale(100%)',
              },
            },
          }}
        >
          <DataGrid
            autoHeight
            components={{
              NoRowsOverlay: () => noData(),
              NoResultsOverlay: () => noData(),
            }}
            getRowClassName={params => {
              return params.row.isHide ? 'hide' : ''
            }}
            onRowClick={e => moveToDetail(e)}
            rows={list.data}
            rowCount={list.totalCount}
            loading={isLoading}
            rowsPerPageOptions={[10, 25, 50]}
            pagination
            page={skip}
            pageSize={pageSize}
            paginationMode='server'
            onPageChange={setSkip}
            onPageSizeChange={newPageSize => setPageSize(newPageSize)}
            columns={columns}
            sortModel={[
              {
                field: 'id',
                sort: 'desc',
              },
            ]}
          />
        </Box>
      </Card>
    </Grid>
  )
}
