import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { DataGrid } from '@mui/x-data-grid/DataGrid'
import { getStandardPriceColumns } from '@src/shared/const/columns/standard-price'
import { StandardPriceListType } from '@src/types/common/standard-price'
import { Dispatch, SetStateAction } from 'react'

type Props = {
  list: StandardPriceListType[]
  listCount: number
  isLoading: boolean
  standardClientPriceListPage: number
  setStandardClientPriceListPage: Dispatch<SetStateAction<number>>
  standardClientPriceListPageSize: number
  setStandardClientPriceListPageSize: Dispatch<SetStateAction<number>>
}
const StandardPrices = ({
  list,
  listCount,
  isLoading,
  standardClientPriceListPage,
  setStandardClientPriceListPage,
  standardClientPriceListPageSize,
  setStandardClientPriceListPageSize,
}: Props) => {
  return (
    <Grid container xs={12} spacing={6}>
      <Grid item xs={12}>
        <Card sx={{ padding: '20px' }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Typography variant='h6'>Standard client prices ({0})</Typography>
            <Button variant='contained'>Add new price</Button>
          </Box>
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
                      <Typography variant='subtitle1'>
                        There are no Pros
                      </Typography>
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
                      <Typography variant='subtitle1'>
                        There are no Pros
                      </Typography>
                    </Box>
                  )
                },
              }}
              sx={{ overflowX: 'scroll' }}
              columns={getStandardPriceColumns()}
              loading={isLoading}
              rows={list ?? []}
              autoHeight
              disableSelectionOnClick
              paginationMode='server'
              pageSize={standardClientPriceListPageSize}
              rowsPerPageOptions={[5, 10, 25, 50]}
              page={standardClientPriceListPage}
              rowCount={listCount}
              // onPageChange={(newPage: number) => {
              //   setFilters((prevState: ProListFilterType) => ({
              //     ...prevState,
              //     skip: newPage * proListPageSize,
              //   }))
              //   setProListPage(newPage)
              // }}
              // onPageSizeChange={(newPageSize: number) => {
              //   setFilters((prevState: ProListFilterType) => ({
              //     ...prevState,
              //     take: newPageSize,
              //   }))
              //   setProListPageSize(newPageSize)
              // }}
            />
          </Box>
        </Card>
      </Grid>
    </Grid>
  )
}

export default StandardPrices
