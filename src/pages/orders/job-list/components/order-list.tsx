import { useRouter } from 'next/router'
import { useContext, useState } from 'react'

// ** style components
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

// ** context
import { AuthContext } from '@src/context/AuthContext'

// ** hooks
import useModal from '@src/hooks/useModal'

// ** components
import ModalWithButtonName from '@src/pages/client/components/modals/modal-with-button-name'
import SimpleAlertModal from '@src/pages/client/components/modals/simple-alert-modal'

// ** apis
import { useGetOrderList } from '@src/queries/order/order.query'

// ** types
import { OrderListType } from '@src/types/orders/order-list'

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
  const router = useRouter()
  const { user } = useContext(AuthContext)
  const { openModal, closeModal } = useModal()

  const [selected, setSelected] = useState<OrderListType | null>(null)
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
        <Radio
          size='small'
          onChange={() => setSelected(row)}
          checked={row.id === selected?.id}
        />
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
        return (
          <Box width='100%' display='flex' justifyContent='space-between'>
            <Typography fontWeight={600}>{row.projectName}</Typography>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                '& svg': { mr: 3, color: 'warning.main' },
              }}
            >
              <Icon icon='mdi:alert-outline' fontSize={20} />
              <Typography sx={{ color: 'warning.main' }} fontSize={12}>
                No items
              </Typography>
            </Box>
          </Box>
        )
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
    if (!selected) return
    const isTeamMember = !selected.projectTeams?.find(
      team => team.userId === user?.userId,
    )
      ? false
      : true
    if (!selected.isItems) {
      openModal({
        type: 'no-items',
        children: (
          <ModalWithButtonName
            iconType='error-report'
            rightButtonName='Add item'
            message='There are no items in the order. Please add an item before creating a job.'
            onClick={() => {
              router.push({
                pathname: `/orders/order-list/detail/${selected.id}`,
                query: { menu: 'item' },
              })
              onClose()
            }}
            onClose={() => closeModal('no-items')}
          />
        ),
      })
    } else if (!isTeamMember) {
      openModal({
        type: 'not-a-team',
        children: (
          <SimpleAlertModal
            message='You can only create jobs for orders where you are part of the project team.'
            onClose={() => closeModal('not-a-team')}
          />
        ),
      })
    } else {
      onClose()
      router.push({
        pathname: '/orders/job-list/detail-view/',
        query: { orderId: selected.id },
      })
    }
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography variant='h5'>Select order</Typography>
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
          onCellClick={params => setSelected(params.row)}
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