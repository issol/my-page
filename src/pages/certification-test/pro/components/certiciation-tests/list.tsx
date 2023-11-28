import { Box } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { getProCertificationTestListColumns } from '@src/shared/const/columns/pro-certification-tests'
import {
  ProCertificationTestFilterType,
  ProCertificationTestListType,
} from '@src/types/pro-certification-test/certification-test'
import { Dispatch, SetStateAction } from 'react'

type Props = {
  list: Array<ProCertificationTestListType>
  listCount: number
  isLoading: boolean
  page: number
  setPage: Dispatch<SetStateAction<number>>
  rowsPerPage: number
  setRowsPerPage: Dispatch<SetStateAction<number>>
  setFilters: Dispatch<SetStateAction<ProCertificationTestFilterType>>
}

const CertificationTestList = ({
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
      <DataGrid
        autoHeight
        rows={list}
        sx={{
          overflowX: 'scroll',
          '& .MuiDataGrid-row:hover': {
            backgroundColor: 'inherit',
          },
        }}
        columns={getProCertificationTestListColumns()}
        pagination
        paginationMode='client'
        pageSize={rowsPerPage}
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
      />
    </Box>
  )
}

export default CertificationTestList
