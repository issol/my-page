import { Box, Button, Radio, Typography } from '@mui/material'
import Dialog from '@mui/material/Dialog'

import DialogContent from '@mui/material/DialogContent'

import { StandardPriceListType } from '@src/types/common/standard-price'

import { DataGrid } from '@mui/x-data-grid'
import { useState } from 'react'

type Props = {
  list: { data: StandardPriceListType[] | []; count: number }
  open: boolean
  onClose: any
  onSubmit: (data: StandardPriceListType) => void
}

type CellType = {
  row: StandardPriceListType
}
const CopyPriceModal = ({ list, open, onClose, onSubmit }: Props) => {
  const [pageSize, setPageSize] = useState(5)
  const [selected, setSelected] = useState<StandardPriceListType | null>(null)

  function onCopy() {
    if (selected) {
      onSubmit(selected)
      onClose()
    }
  }

  const columns = [
    {
      flex: 0.03,
      minWidth: 60,
      field: 'radiobutton',
      headerName: '',
      sortable: false,
      renderHeader: () => <Radio size='small' sx={{ padding: 0 }} />,
      renderCell: ({ row }: CellType) => {
        return (
          <Radio
            sx={{ padding: 0 }}
            value={row.id}
            size='small'
            onClick={() => setSelected(row)}
            checked={selected?.id === row.id}
          />
        )
      },
    },
    {
      flex: 0.15,
      field: 'priceName',
      minWidth: 40,
      headerName: 'No.',
      renderHeader: () => <Box>Price name</Box>,
      renderCell: ({ row }: CellType) => (
        <Typography>{row.priceName}</Typography>
      ),
    },
  ]

  function noData() {
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
        <Typography variant='subtitle1'>There are no client prices</Typography>
      </Box>
    )
  }

  return (
    <Dialog
      open={open}
      keepMounted
      fullWidth
      onClose={() => {
        onClose()
      }}
      aria-labelledby='alert-dialog-slide-title'
      aria-describedby='alert-dialog-slide-description'
      maxWidth='md'
    >
      <DialogContent
        sx={{
          padding: '50px',
          position: 'relative',
        }}
      >
        <Typography variant='h6' mb='30px'>
          Copy price
        </Typography>
        <DataGrid
          autoHeight
          components={{
            NoRowsOverlay: () => noData(),
            NoResultsOverlay: () => noData(),
          }}
          onRowClick={row => setSelected(row.row)}
          rows={list?.data || []}
          columns={columns}
          pageSize={pageSize}
          rowsPerPageOptions={[5, 15, 30]}
          onPageSizeChange={newPageSize => setPageSize(newPageSize)}
        />
        <Box display='flex' gap='10px' justifyContent='center' mt='24px'>
          <Button variant='outlined' color='secondary' onClick={onClose}>
            Cancel
          </Button>
          <Button variant='contained' onClick={onCopy} disabled={!selected}>
            Copy
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  )
}

export default CopyPriceModal
