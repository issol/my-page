import { Button, Card, Grid, Typography } from '@mui/material'

import { Box } from '@mui/system'
import { DataGrid } from '@mui/x-data-grid'
import CardHeader from '@mui/material/CardHeader'
// ** Data Import

import { Dispatch, SetStateAction } from 'react'

import {
  TestMaterialFilterPayloadType,
  TestMaterialListType,
} from 'src/types/certification-test/list'
import { materialColumns } from 'src/shared/const/certification-test'
import { NextRouter } from 'next/router'

type Props = {
  testMaterialListPage: number
  setTestMaterialListPage: Dispatch<SetStateAction<number>>
  testMaterialListPageSize: number
  setTestMaterialListPageSize: Dispatch<SetStateAction<number>>
  testMaterialList: { data: TestMaterialListType[]; count: number }
  setFilters: any
  router: NextRouter
}

export default function TestMaterialList({
  testMaterialListPage,
  setTestMaterialListPage,
  testMaterialListPageSize,
  setTestMaterialListPageSize,
  testMaterialList,
  setFilters,
  router,
}: Props) {
  return (
    <Grid item xs={12}>
      <Card>
        <Box
          sx={{
            padding: ' 1.25rem',
            paddingBottom: '1rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant='h6'>
            {`Test materials (${testMaterialList.count})`}
          </Typography>
          <Button
            variant='contained'
            size='medium'
            onClick={() => {
              router.push({
                pathname: '/certification-test/post',
                query: { edit: JSON.stringify(false) },
              })
            }}
          >
            Create new test
          </Button>
        </Box>

        <Box
          sx={{
            width: '100%',
            '& .MuiDataGrid-columnHeaderTitle': {
              textTransform: 'none',
            },
          }}
        >
          <DataGrid
            sx={{ cursor: 'pointer' }}
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
                      There are no test materials
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
                      There are no test materials
                    </Typography>
                  </Box>
                )
              },
            }}
            columns={materialColumns}
            rows={testMaterialList.data ?? []}
            paginationMode={'server'}
            autoHeight
            // disableSelectionOnClick
            pageSize={testMaterialListPageSize}
            rowsPerPageOptions={[10, 25, 50]}
            page={testMaterialListPage}
            rowCount={testMaterialList.count}
            onCellClick={params => {
              router.push(`/certification-test/detail/${params.row.id}`)
            }}
            onPageChange={(newPage: number) => {
              setFilters((prevState: TestMaterialFilterPayloadType) => ({
                ...prevState,
                skip: newPage * testMaterialListPageSize,
              }))
              setTestMaterialListPage(newPage)
            }}
            onPageSizeChange={(newPageSize: number) => {
              setFilters((prevState: TestMaterialFilterPayloadType) => ({
                ...prevState,
                take: newPageSize,
              }))
              setTestMaterialListPageSize(newPageSize)
            }}
          />
        </Box>
      </Card>
    </Grid>
  )
}
