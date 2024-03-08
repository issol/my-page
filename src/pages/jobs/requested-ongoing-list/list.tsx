import { Box, Button, Card, Typography } from '@mui/material'
import { DataGrid, GridColumns, gridClasses } from '@mui/x-data-grid'
import NoList from '@src/pages/components/no-list'
import { ProJobListType } from '@src/types/jobs/jobs.type'
import { Dispatch, SetStateAction } from 'react'

import { useRouter } from 'next/router'
import { JobListFilterType } from '.'

type Props = {
  type: 'requested' | 'delivered'
  page: number
  setPage: Dispatch<SetStateAction<number>>
  rowsPerPage: number
  setRowsPerPage: Dispatch<SetStateAction<number>>
  list: ProJobListType[]
  listCount: number
  isLoading: boolean
  columns: GridColumns<ProJobListType>
  setFilters: Dispatch<SetStateAction<JobListFilterType>>
  onClickCreateInvoice?: () => void
}

const JobList = ({
  type,
  page,
  setPage,
  rowsPerPage,
  setRowsPerPage,
  list,
  listCount,
  isLoading,
  columns,
  setFilters,
  onClickCreateInvoice,
}: Props) => {
  const router = useRouter()

  return (
    <Card>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '24px',
        }}
      >
        <Typography variant='h6'>Jobs ({listCount ?? 0})</Typography>
        {type === 'delivered' && (
          <Button
            variant='contained'
            onClick={onClickCreateInvoice && onClickCreateInvoice}
          >
            Create new invoice
          </Button>
        )}
      </Box>

      <Box
        sx={{
          '& .MuiDataGrid-columnHeaderTitle': {
            textTransform: 'none',
          },
        }}
      >
        <DataGrid
          autoHeight
          getRowId={row => row?.jobId}
          components={{
            NoRowsOverlay: () => NoList('There are no jobs'),
            NoResultsOverlay: () => NoList('There are no jobs'),
          }}
          sx={{
            overflowX: 'scroll',
            cursor: 'pointer',

            [`& .${gridClasses.row}.overdue`]: {
              // background: 'rgba(255, 77, 73, .1)',
              background: '#FFE1E0',
            },
          }}
          columns={columns}
          rows={list ?? []}
          rowCount={listCount ?? 0}
          loading={isLoading}
          onCellClick={(params, event) => {
            event.stopPropagation(),
            [70000,70100,70200,70300,70400].includes(params.row.status as number)
              ? router.push(`/jobs/detail/${params.row.id}?assigned=false&tab=${type === 'requested' ? 'requested' : 'completed'}`)
              : router.push(`/jobs/detail/${params.row.jobId}?tab=${type === 'requested' ? 'requested' : 'completed'}`)
          }}
          rowsPerPageOptions={[10, 25, 50]}
          pagination
          page={page}
          pageSize={rowsPerPage}
          paginationMode='server'
          onPageChange={(newPage: number) => {
            setFilters!((prevState: JobListFilterType) => ({
              ...prevState,
              skip: newPage * rowsPerPage!,
            }))
            setPage!(newPage)
          }}
          onPageSizeChange={(newPageSize: number) => {
            setFilters!((prevState: JobListFilterType) => ({
              ...prevState,
              take: newPageSize,
            }))
            setRowsPerPage!(newPageSize)
          }}
          disableSelectionOnClick
          getRowClassName={params =>
            params.row.status === 60300 ? 'overdue' : 'normal'
          }
        />
      </Box>
    </Card>
  )
}

export default JobList
