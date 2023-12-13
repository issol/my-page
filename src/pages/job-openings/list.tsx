import { Box } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import {
  JobOpeningListFilterType,
  JobOpeningListType,
} from '@src/types/pro/pro-job-openings'
import { Dispatch, SetStateAction } from 'react'
import NoList from '../components/no-list'

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
  return (
    <Box>
      {/* <DataGrid
        autoHeight
        rows={list}
        sx={{
          overflowX: 'scroll',
          '& .MuiDataGrid-row:hover': {
            backgroundColor: 'inherit',
          },
        }}
        components={{
          NoRowsOverlay: () => NoList('There is no job openings.'),
          NoResultsOverlay: () => NoList('There is no job openings.'),
        }}
        columns={getProCertificationTestListColumns(onClickApply)}
        pagination
        paginationMode='client'
        pageSize={rowsPerPage}
        rowsPerPageOptions={[10, 25, 50]}
        rowCount={listCount}
        onPageChange={(newPage: number) => {
          setFilters((prevState: ProCertificationTestFilterType) => ({
            ...prevState,
            skip: newPage * rowsPerPage,
          }))
          setPage(newPage)
        }}
        onPageSizeChange={(newPageSize: number) => {
          setFilters((prevState: ProCertificationTestFilterType) => ({
            ...prevState,
            take: newPageSize,
          }))
          setRowsPerPage(newPageSize)
        }}
        loading={isLoading}
        hideFooterSelectedRowCount
        disableSelectionOnClick
      /> */}
    </Box>
  )
}
