import { Box, Card, Typography } from '@mui/material'
import { DataGrid, GridColumns } from '@mui/x-data-grid'
import NoList from '@src/pages/components/no-list'
import { ProJobListType } from '@src/types/jobs/jobs.type'
import { Dispatch, SetStateAction } from 'react'
import { JobListFilterType } from '..'

type Props = {
  page: number
  setPage: Dispatch<SetStateAction<number>>
  rowsPerPage: number
  setRowsPerPage: Dispatch<SetStateAction<number>>
  list: ProJobListType[]
  listCount: number
  isLoading: boolean
  columns: GridColumns<ProJobListType>
  setFilters: Dispatch<SetStateAction<JobListFilterType>>
}

const JobList = ({
  page,
  setPage,
  rowsPerPage,
  setRowsPerPage,
  list,
  listCount,
  isLoading,
  columns,
  setFilters,
}: Props) => {
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
          // getRowId={row => row?.orderId}
          components={{
            NoRowsOverlay: () => NoList('There are no jobs'),
            NoResultsOverlay: () => NoList('There are no jobs'),
          }}
          sx={{
            overflowX: 'scroll',
            cursor: 'pointer',

            // [`& .${gridClasses.row}.disabled`]: {
            //   opacity: 0.5,
            //   cursor: 'not-allowed',
            // },
          }}
          columns={columns}
          rows={list ?? []}
          rowCount={listCount ?? 0}
          loading={isLoading}
          // onCellClick={params => {
          //   if (
          //     role.name === 'CLIENT' &&
          //     params.row.status === 'Under revision'
          //   )
          //     return

          //   handleRowClick(params.row)
          // }}
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
        />
      </Box>
    </Card>
  )
}

export default JobList
