// ** mui
import {
  Button,
  Dialog,
  Grid,
  IconButton,
  Radio,
  Tooltip,
  Typography,
} from '@mui/material'
import { Box } from '@mui/system'
import { DataGrid } from '@mui/x-data-grid'
import CardHeader from '@mui/material/CardHeader'

// ** helpers
import { FullDateTimezoneHelper } from 'src/shared/helpers/date.helper'
import {
  JobTypeChip,
  renderStatusChip,
  RoleChip,
} from 'src/@core/components/chips/chips'

// ** types
import { JobPostingDataType } from 'src/apis/jobPosting.api'
import { useState } from 'react'
import { Icon } from '@iconify/react'

type CellType = {
  row: JobPostingDataType
}

type Props = {
  open: boolean
  handleClose: () => void
  addLink: (link: string) => void
  skip: number
  pageSize: number
  setSkip: (num: number) => void
  setPageSize: (num: number) => void
  list: {
    data: Array<JobPostingDataType> | []
    count: number
  }
  isLoading: boolean
}

export default function JobPostingListModal({
  open,
  handleClose,
  addLink,
  skip,
  pageSize,
  setSkip,
  setPageSize,
  list,
  isLoading,
}: Props) {
  const [selected, setSelected] = useState('')
  const columns = [
    {
      flex: 0.2,
      minWidth: 60,
      field: 'radiobutton',
      headerName: '',
      sortable: false,
      renderHeader: () => <Radio size='small' sx={{ padding: 0 }} />,
      renderCell: ({ row }: CellType) => {
        return (
          <Radio
            sx={{ padding: 0 }}
            value={row.jobPostLink}
            size='small'
            onClick={() => setSelected(row.jobPostLink)}
            checked={selected === row.jobPostLink}
          />
        )
      },
    },
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
      flex: 0.23,
      minWidth: 120,
      field: 'dueDate',
      headerName: 'Due date',
      renderHeader: () => <Box>Due date</Box>,
      renderCell: ({ row }: CellType) => (
        <Tooltip
          placement='bottom'
          title={`${FullDateTimezoneHelper(row.dueDate, row.dueDateTimezone)}`}
        >
          <Typography sx={{ overflow: 'scroll' }} variant='body2'>
            <>{FullDateTimezoneHelper(row.dueDate, row.dueDateTimezone)}</>
          </Typography>
        </Tooltip>
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
    <Dialog open={open} maxWidth='lg' fullWidth={true}>
      <Box display='flex' justifyContent='right' padding='20px 10px 0'>
        <IconButton onClick={handleClose}>
          <Icon icon='mdi:close' />
        </IconButton>
      </Box>
      <Grid item xs={12} sx={{ padding: '20px 50px 60px' }}>
        <Box
          sx={{
            border: '1px solid rgba(76, 78, 100, 0.12)',
            borderRadius: '10px',
          }}
        >
          <CardHeader
            title={
              <Box display='flex' justifyContent='space-between'>
                <Typography variant='h6'>
                  Job posting list ({list?.count | 0})
                </Typography>
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
              // onRowClick={e => moveToDetail(e)}
              rows={list.data}
              rowCount={list.count}
              loading={isLoading}
              rowsPerPageOptions={[5, 15, 30]}
              pagination
              page={skip}
              pageSize={pageSize}
              paginationMode='server'
              onPageChange={setSkip}
              onPageSizeChange={newPageSize => setPageSize(newPageSize)}
              columns={columns}
            />
          </Box>
        </Box>
        <Box display='flex' justifyContent='center' gap='12px' mt='24px'>
          <Button variant='outlined' color='secondary' onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant='contained'
            color='primary'
            onClick={() => {
              addLink(selected)
              handleClose()
            }}
          >
            Select
          </Button>
        </Box>
      </Grid>
    </Dialog>
  )
}
