import { Card, Grid, Typography } from '@mui/material'

import { Box } from '@mui/system'
import { DataGrid, GridColumns } from '@mui/x-data-grid'
import CardHeader from '@mui/material/CardHeader'
// ** Data Import
import { Dispatch, SetStateAction } from 'react'

import { ProListFilterType, ProListType } from '@src/types/pro/list'

type Props = {
  proListPage: number
  setProListPage: Dispatch<SetStateAction<number>>
  proListPageSize: number
  setProListPageSize: Dispatch<SetStateAction<number>>
  proList: ProListType[]
  proListCount: number
  setFilters: Dispatch<SetStateAction<ProListFilterType>>
  columns: GridColumns<ProListType>
  isLoading: boolean
}

const ProList = ({
  proListPage,
  setProListPage,
  proListPageSize,
  setProListPageSize,
  proList,
  proListCount,
  setFilters,
  columns,
  isLoading,
}: Props) => {
  return (
    <Card>
      <CardHeader
        title={`Pros (${(proListCount || 0).toLocaleString()})`}
        sx={{ pb: 4, '& .MuiCardHeader-title': { letterSpacing: '.15px' } }}
      ></CardHeader>
      <Box
        sx={{
          '& .MuiDataGrid-columnHeaderTitle': {
            textTransform: 'none',
          },
        }}
      >
        <DataGrid
          components={{
            NoRowsOverlay: () => {
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
                  <Typography variant='subtitle1'>There are no Pros</Typography>
                </Box>
              )
            },
            NoResultsOverlay: () => {
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
                  <Typography variant='subtitle1'>There are no Pros</Typography>
                </Box>
              )
            },
          }}
          sx={{ overflowX: 'scroll' }}
          columns={columns}
          loading={isLoading}
          rows={proList ?? []}
          autoHeight
          disableSelectionOnClick
          paginationMode='server'
          pageSize={proListPageSize}
          rowsPerPageOptions={[5, 10, 25, 50]}
          page={proListPage}
          rowCount={proListCount}
          onPageChange={(newPage: number) => {
            setFilters((prevState: ProListFilterType) => ({
              ...prevState,
              skip: newPage * proListPageSize,
            }))
            setProListPage(newPage)
          }}
          onPageSizeChange={(newPageSize: number) => {
            setFilters((prevState: ProListFilterType) => ({
              ...prevState,
              take: newPageSize,
            }))
            setProListPageSize(newPageSize)
          }}
        />
      </Box>
    </Card>
  )
}
export default ProList
