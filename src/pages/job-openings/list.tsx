import { Box, Card, CardHeader, Typography } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import {
  JobOpeningListFilterType,
  JobOpeningListType,
} from '@src/types/pro/pro-job-openings'
import { Dispatch, SetStateAction } from 'react'
import NoList from '../components/no-list'
import { getJobOpeningsColumn } from '@src/shared/const/columns/job-openings'
import { useRouter } from 'next/router'

type Props = {
  list: Array<JobOpeningListType>
  listCount: number
  isLoading: boolean
  page: number
  setPage: Dispatch<SetStateAction<number>>
  rowsPerPage: number
  setRowsPerPage: Dispatch<SetStateAction<number>>
  setFilters: Dispatch<SetStateAction<JobOpeningListFilterType>>
}

const List = ({
  list,
  listCount,
  isLoading,
  page,
  setPage,
  rowsPerPage,
  setRowsPerPage,
  setFilters,
}: Props) => {
  const router = useRouter()
  return (
    <Card>
      <CardHeader
        title={
          <Box display='flex' justifyContent='space-between'>
            <Typography variant='h6'>
              Job openings ({listCount ?? 0})
            </Typography>
          </Box>
        }
        sx={{ pb: 4, '& .MuiCardHeader-title': { letterSpacing: '.15px' } }}
      ></CardHeader>
      <Box>
        <DataGrid
          autoHeight
          rows={list}
          sx={{
            overflowX: 'scroll',
            '& .MuiDataGrid-row:hover': {
              cursor: 'pointer',
            },
          }}
          components={{
            NoRowsOverlay: () => NoList('There is no job openings.'),
            NoResultsOverlay: () => NoList('There is no job openings.'),
          }}
          columns={getJobOpeningsColumn()}
          pagination
          paginationMode='client'
          pageSize={rowsPerPage}
          rowsPerPageOptions={[10, 25, 50]}
          onRowClick={(params: any) => {
            router.push(`/job-openings/detail/${params.row.id}`)
          }}
          rowCount={listCount}
          onPageChange={(newPage: number) => {
            setFilters((prevState: JobOpeningListFilterType) => ({
              ...prevState,
              skip: newPage * rowsPerPage,
            }))
            setPage(newPage)
          }}
          onPageSizeChange={(newPageSize: number) => {
            setFilters((prevState: JobOpeningListFilterType) => ({
              ...prevState,
              take: newPageSize,
            }))
            setRowsPerPage(newPageSize)
          }}
          loading={isLoading}
          hideFooterSelectedRowCount
          disableSelectionOnClick
        />
      </Box>
    </Card>
  )
}

export default List
