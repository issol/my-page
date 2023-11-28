import { Box, Button, Card, CardHeader, Typography } from '@mui/material'
import { DataGrid, GridColumns } from '@mui/x-data-grid'
import NoList from '@src/pages/components/no-list'
import { VersionHistoryType } from '@src/types/common/quotes.type'

import { Dispatch, SetStateAction } from 'react'

type Props = {
  list: Array<VersionHistoryType>
  listCount: number
  columns: GridColumns<VersionHistoryType>
  pageSize: number
  setPageSize: Dispatch<SetStateAction<number>>
  onClickRow: (history: VersionHistoryType) => void
}

const VersionHistory = ({
  list,
  listCount,
  columns,
  pageSize,
  setPageSize,

  onClickRow,
}: Props) => {
  return (
    <Card>
      <CardHeader
        title={
          <Box display='flex' justifyContent='space-between'>
            <Typography variant='h6'>
              Version history ({listCount ?? 0})
            </Typography>
          </Box>
        }
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
          autoHeight
          getRowId={row => row.id}
          components={{
            NoRowsOverlay: () => NoList('There is no version history'),
            NoResultsOverlay: () => NoList('There is no version history'),
          }}
          sx={{
            overflowX: 'scroll',
            '& .MuiDataGrid-row': { cursor: 'pointer' },
          }}
          columns={columns}
          rows={list ?? []}
          onCellClick={params => {
            onClickRow(params.row)
          }}
          rowsPerPageOptions={[10, 25, 50]}
          pageSize={pageSize}
          onPageSizeChange={setPageSize}
          disableSelectionOnClick
        />
      </Box>
    </Card>
  )
}

export default VersionHistory
