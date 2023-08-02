import { Box, Card, CardHeader, Typography } from '@mui/material'
import { DataGrid, GridColumns } from '@mui/x-data-grid'
import { InvoiceVersionHistoryType } from '@src/types/invoice/receivable.type'

import { Dispatch, SetStateAction } from 'react'

type Props = {
  list: Array<InvoiceVersionHistoryType>
  listCount: number
  columns: GridColumns<InvoiceVersionHistoryType>
  pageSize: number
  setPageSize: Dispatch<SetStateAction<number>>
  onClickRow: (history: InvoiceVersionHistoryType) => void
}

const InvoiceVersionHistory = ({
  list,
  listCount,
  columns,
  pageSize,
  setPageSize,
  onClickRow,
}: Props) => {
  function NoList() {
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
        <Typography variant='subtitle1'>There is no version history</Typography>
      </Box>
    )
  }
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
          components={{
            NoRowsOverlay: () => NoList(),
            NoResultsOverlay: () => NoList(),
          }}
          sx={{ overflowX: 'scroll', cursor: 'pointer' }}
          columns={columns}
          pageSize={pageSize}
          onPageSizeChange={setPageSize}
          rowsPerPageOptions={[5, 15, 30]}
          rowCount={listCount ?? 0}
          rows={list ?? []}
          onCellClick={params => {
            onClickRow(params.row)
          }}
          disableSelectionOnClick
        />
      </Box>
    </Card>
  )
}

export default InvoiceVersionHistory
