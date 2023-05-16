import { Icon } from '@iconify/react'
import {
  Button,
  Card,
  CardHeader,
  Dialog,
  DialogContent,
  Grid,
  InputAdornment,
  OutlinedInput,
  Radio,
  Typography,
} from '@mui/material'

import { Box } from '@mui/system'
import { DataGrid, GridColumns } from '@mui/x-data-grid'
import { useGetOrderList } from '@src/queries/order/order.query'
import {
  OrderListFilterType,
  OrderListType,
} from '@src/types/orders/order-list'
import { Dispatch, SetStateAction, useState } from 'react'

type OrderListCellType = {
  row: OrderListType
}

type Props = {
  onClose: () => void
  onCopy: (data: number | null) => void
}

export default function CopyOrdersList({ onClose, onCopy }: Props) {
  const [selected, setSelected] = useState<number | null>(null)
  const [search, setSearch] = useState('')
  const [activeSearch, setActiveSearch] = useState('')
  const [skip, setSkip] = useState(0)
  const [pageSize, setPageSize] = useState(10)

  const { data: orderList, isLoading } = useGetOrderList({
    search: activeSearch,
    take: pageSize,
    skip: skip * pageSize,
  })
  const columns: GridColumns<OrderListType> = [
    {
      flex: 0.01,
      minWidth: 60,
      field: 'radiobutton',
      headerName: '',
      sortable: false,
      renderHeader: () => <Radio size='small' sx={{ padding: 0 }} />,
      renderCell: ({ row }: OrderListCellType) => {
        return (
          <Radio
            sx={{ padding: 0 }}
            value={row.id}
            size='small'
            onClick={() => setSelected(row.id)}
            checked={!selected ? false : selected === row.id}
          />
        )
      },
    },
    {
      field: 'corporationId',
      flex: 0.05,
      minWidth: 120,
      headerName: 'No.',
      disableColumnMenu: true,
      renderHeader: () => (
        <Box
          sx={{
            display: 'flex',
            minWidth: 80,
            width: '100%',
            alignItems: 'center',
          }}
        >
          <Box>No.</Box>
        </Box>
      ),
      renderCell: ({ row }: OrderListCellType) => {
        return <Box>{row.corporationId}</Box>
      },
    },
    {
      flex: 0.1,
      minWidth: 290,
      field: 'projectName',
      headerName: 'Project name',
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => <Box>Project name</Box>,
      renderCell: ({ row }: OrderListCellType) => {
        return <Box>{row.projectName}</Box>
      },
    },
  ]

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
        <Typography variant='subtitle1'>There are no orders</Typography>
      </Box>
    )
  }

  return (
    <Dialog open={true} maxWidth='md'>
      <DialogContent>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <CardHeader title='Copy order' />
          </Grid>
          <Grid item xs={12}>
            <OutlinedInput
              value={search}
              onChange={e => setSearch(e.target.value)}
              fullWidth
              aria-describedby='icons-weight-helper-text'
              endAdornment={
                <InputAdornment position='end'>
                  <Icon fontSize={20} icon='material-symbols:search' />
                </InputAdornment>
              }
              inputProps={{
                'aria-label': 'weight',
              }}
            />
          </Grid>
          <Grid
            item
            xs={12}
            display='flex'
            justifyContent='flex-end'
            gap='15px'
          >
            <Button
              variant='outlined'
              size='medium'
              color='secondary'
              type='button'
              onClick={() => {
                setSearch('')
                setActiveSearch('')
              }}
            >
              Reset
            </Button>
            <Button
              variant='contained'
              size='medium'
              onClick={() => setActiveSearch(search)}
            >
              Search
            </Button>
          </Grid>
          <Grid item xs={12}>
            <DataGrid
              autoHeight
              components={{
                NoRowsOverlay: () => NoList(),
                NoResultsOverlay: () => NoList(),
              }}
              sx={{ overflowX: 'scroll', cursor: 'pointer' }}
              columns={columns}
              rows={orderList?.data ?? []}
              rowCount={orderList?.count ?? 0}
              loading={isLoading}
              // onCellClick={params => {
              //   handleRowClick(params.row)
              // }}
              rowsPerPageOptions={[10, 25, 50]}
              pagination
              page={skip}
              pageSize={pageSize}
              paginationMode='server'
              onPageChange={setSkip}
              disableSelectionOnClick
              onPageSizeChange={newPageSize => setPageSize(newPageSize)}
            />
          </Grid>

          <Grid item xs={12} display='flex' justifyContent='center' gap='15px'>
            <Button
              variant='outlined'
              size='medium'
              color='secondary'
              type='button'
              onClick={() => onClose()}
            >
              Cancel
            </Button>
            <Button
              variant='contained'
              size='medium'
              disabled={!selected}
              onClick={() => onCopy(selected)}
            >
              Copy
            </Button>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  )
}