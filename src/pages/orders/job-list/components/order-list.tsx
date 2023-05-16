import { Icon } from '@iconify/react'
import {
  Box,
  Button,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Radio,
  Switch,
  Typography,
} from '@mui/material'
import { DataGrid, GridColumns } from '@mui/x-data-grid'
import useModal from '@src/hooks/useModal'
import ConfirmModal from '@src/pages/client/components/modals/info-confirm-modal'
import SimpleAlertModal from '@src/pages/client/components/modals/simple-alert-modal'
import { useGetOrderList } from '@src/queries/order/order.query'
import { OrderListType } from '@src/types/orders/order-list'
import { useState } from 'react'

type FilterType = {
  search?: string
  ordersWithoutJobs?: boolean
  skip: number
  take: number
}
const initialFilter = {
  search: '',
  ordersWithoutJobs: false,
  skip: 0,
  take: 10,
}

type OrderListCellType = {
  row: OrderListType
}

type Props = {
  onClose: () => void
}
export default function OrderList({ onClose }: Props) {
  const { openModal, closeModal } = useModal()

  const [selected, setSelected] = useState<number | null>(null)
  const [skip, setSkip] = useState(0)
  const [filter, setFilter] = useState<FilterType>(initialFilter)
  const [activeFilter, setActiveFilter] = useState<FilterType>(initialFilter)

  const { data: orderList, isLoading } = useGetOrderList(activeFilter)

  function onSearch() {
    setActiveFilter({
      ...filter,
      skip: skip * activeFilter.take,
      take: activeFilter.take,
    })
  }

  function onReset() {
    setFilter({ ...initialFilter })
    setActiveFilter({ ...initialFilter })
  }

  const columns: GridColumns<OrderListType> = [
    {
      field: '',
      flex: 0.01,
      minWidth: 80,
      headerName: '',
      disableColumnMenu: true,
      sortable: false,
      renderCell: ({ row }: OrderListCellType) => (
        <Radio size='small' onChange={() => setSelected(row.id)} />
      ),
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

  function onSubmit() {
    //order에 items가 없을 때

    //team이 아닐 때
    openModal({
      type: 'not-a-team',
      children: (
        <SimpleAlertModal
          message='You can only create jobs for orders where you are part of the project team.'
          onClose={() => closeModal('not-a-team')}
        />
      ),
    })
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography variant='h6'>Select order</Typography>
      </Grid>
      <Grid item xs={12}>
        <FormControl fullWidth>
          <InputLabel>Search projects</InputLabel>
          <OutlinedInput
            label='Search projects'
            value={filter.search}
            onChange={e => setFilter({ ...filter, search: e.target.value })}
            endAdornment={
              <InputAdornment position='end'>
                <IconButton edge='end'>
                  <Icon icon='mdi:magnify' />
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        <Box display='flex' justifyContent='flex-end' gap='15px'>
          <Button
            variant='outlined'
            size='medium'
            color='secondary'
            type='button'
            onClick={onReset}
          >
            Reset
          </Button>
          <Button variant='contained' size='medium' onClick={onSearch}>
            Search
          </Button>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={12}>
        <Box
          display='flex'
          alignItems='center'
          justifyContent='flex-end'
          gap='4px'
        >
          <Typography>See only my jobs</Typography>
          <Switch
            checked={activeFilter.ordersWithoutJobs}
            onChange={e =>
              setActiveFilter({
                ...activeFilter,
                ordersWithoutJobs: e.target.checked,
              })
            }
          />
        </Box>
      </Grid>
      <Grid item xs={12}>
        <DataGrid
          autoHeight
          components={{
            NoRowsOverlay: () => NoList(),
            NoResultsOverlay: () => NoList(),
          }}
          columns={columns}
          rows={orderList?.data ?? []}
          rowCount={orderList?.count ?? 0}
          loading={isLoading}
          onCellClick={params => setSelected(params.row.id)}
          rowsPerPageOptions={[10, 25, 50]}
          pagination
          page={skip}
          pageSize={activeFilter.take}
          paginationMode='server'
          onPageChange={setSkip}
          onPageSizeChange={newPageSize =>
            setActiveFilter({ ...activeFilter, take: newPageSize })
          }
          disableSelectionOnClick
        />
      </Grid>
      <Grid item xs={12}>
        <Box display='flex' justifyContent='center' gap='15px'>
          <Button
            variant='outlined'
            size='medium'
            color='secondary'
            type='button'
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant='contained'
            size='medium'
            onClick={onSubmit}
            disabled={!selected}
          >
            Select
          </Button>
        </Box>
      </Grid>
    </Grid>
  )
}
