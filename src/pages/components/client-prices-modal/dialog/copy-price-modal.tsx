import { Box, Button, Checkbox, Grid, Radio, Typography } from '@mui/material'
import Dialog from '@mui/material/Dialog'

import DialogContent from '@mui/material/DialogContent'

import {
  CurrencyType,
  StandardPriceListType,
} from '@src/types/common/standard-price'
import useModal from '@src/hooks/useModal'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { DataGrid } from '@mui/x-data-grid'
import { useState } from 'react'

type Props = {
  list: { data: StandardPriceListType[]; count: number }
  open: boolean
  onClose: any
  type: string
  selectedPriceData?: StandardPriceListType

  //   onSubmit: (data: AddPriceType, modalType: string) => void

  onClickAction: (type: string) => void
}

type CellType = {
  row: StandardPriceListType
}
const CopyPriceModal = ({
  list,
  open,
  onClose,
  type,
  selectedPriceData,

  //   onSubmit,

  onClickAction,
}: Props) => {
  const { closeModal, openModal } = useModal()
  const [skip, setSkip] = useState(0)
  const [pageSize, setPageSize] = useState(5)
  const [selected, setSelected] = useState<StandardPriceListType | null>(null)

  const columns = [
    {
      flex: 0.2,
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
        <DataGrid
          autoHeight
          components={{
            NoRowsOverlay: () => noData(),
            NoResultsOverlay: () => noData(),
          }}
          rows={list.data}
          rowCount={list.count}
          rowsPerPageOptions={[5, 15, 30]}
          pagination
          page={skip}
          pageSize={pageSize}
          onPageChange={setSkip}
          onPageSizeChange={newPageSize => setPageSize(newPageSize)}
          columns={columns}
        />
      </DialogContent>
    </Dialog>
  )
}

export default CopyPriceModal
