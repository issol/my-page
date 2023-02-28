import { Card, Grid, Typography } from '@mui/material'

import { Box } from '@mui/system'
import { DataGrid } from '@mui/x-data-grid'
import CardHeader from '@mui/material/CardHeader'
// ** Data Import

import { Dispatch, SetStateAction } from 'react'

import { TestMaterialListType } from 'src/types/certification-test/list'
import { materialColumns } from 'src/shared/const/certification-test'

type Props = {
  testMaterialListPage: number
  setTestMaterialListPage: Dispatch<SetStateAction<number>>
  testMaterialListPageSize: number
  setTestMaterialListPageSize: Dispatch<SetStateAction<number>>
  testMaterialList: TestMaterialListType[]
}

export default function TestMaterialList({
  testMaterialListPage,
  setTestMaterialListPage,
  testMaterialListPageSize,
  setTestMaterialListPageSize,
  testMaterialList,
}: Props) {
  return (
    <Grid item xs={12}>
      <Card>
        <CardHeader
          title={`Pros (${testMaterialList.length})`}
          sx={{ pb: 4, '& .MuiCardHeader-title': { letterSpacing: '.15px' } }}
        ></CardHeader>
        <Box
          sx={{
            width: '100%',
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
            columns={materialColumns}
            rows={testMaterialList ?? []}
            autoHeight
            disableSelectionOnClick
            pageSize={testMaterialListPageSize}
            rowsPerPageOptions={[10, 25, 50]}
            page={testMaterialListPage}
            rowCount={testMaterialList.length}
            onPageChange={(newPage: number) => {
              setTestMaterialListPage(newPage)
            }}
            onPageSizeChange={(newPageSize: number) =>
              setTestMaterialListPageSize(newPageSize)
            }
          />
        </Box>
      </Card>
    </Grid>
  )
}
