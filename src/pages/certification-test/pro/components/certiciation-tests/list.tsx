import { Box } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { NoList } from '@src/pages/components/no-list'
import { getProCertificationTestListColumns } from '@src/shared/const/columns/pro-certification-tests'
import {
  ProCertificationTestFilterType,
  ProCertificationTestListType,
} from '@src/types/pro/pro-certification-test'
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
  onClickApply: (row: ProCertificationTestListType) => void
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
  onClickApply,
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
        components={{
          NoRowsOverlay: () => NoList('There is no certification test.'),
          NoResultsOverlay: () => NoList('There is no certification test.'),
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
      />
    </Box>
  )
}

export default CertificationTestList
