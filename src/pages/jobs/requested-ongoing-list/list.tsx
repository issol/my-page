import { Box, Button, Card, Typography } from '@mui/material'
import { DataGrid, gridClasses, GridColumns } from '@mui/x-data-grid'
import { NoList } from '@src/pages/components/no-list'
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
        display='flex'
        justifyContent='space-between'
        alignItems='center'
        padding='20px'
      >
        <Typography variant='h6'>
          Jobs ({listCount && listCount > 0 ? listCount : 0})
        </Typography>
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
              background: '#FFE1E0',
            },
          }}
          columns={columns}
          rows={list ?? []}
          rowCount={listCount ?? 0}
          loading={isLoading}
          onCellClick={(params, event) => {
            event.stopPropagation()

            if (params.field === 'status') return

            const isChangeRouter = [70000, 70100, 70200, 70300, 70400].includes(
              params.row.status as number,
            )

            const paramsObj = {
              tab: type === 'requested' ? 'requested' : 'completed',
              hasNext: params.row.autoNextJob || false,
              isNextJob: params.row.isPreviousAndNextJob || false,
            }

            const searchParams = new URLSearchParams(paramsObj)

            isChangeRouter
              ? router.push(
                  `/jobs/detail/${params.row.id}?assigned=false&${searchParams.toString()}`,
                )
              : router.push(
                  `/jobs/detail/${params.row.jobId}?${searchParams.toString()}`,
                )
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
