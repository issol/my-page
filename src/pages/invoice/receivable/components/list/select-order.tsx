import { useRouter } from 'next/router'
import { ChangeEventHandler, useEffect, useState } from 'react'

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

// ** hooks
import useModal from '@src/hooks/useModal'

// ** components
import ModalWithButtonName from '@src/pages/client/components/modals/modal-with-button-name'
import SimpleAlertModal from '@src/pages/client/components/modals/simple-alert-modal'

// ** apis
import { useGetOrderList } from '@src/queries/order/order.query'

// ** types
import {
  OrderListFilterType,
  OrderListType,
} from '@src/types/orders/order-list'

const initialFilter: OrderListFilterType = {
  search: '',

  mine: '0',
  skip: 0,
  take: 10,
}

type OrderListCellType = {
  row: OrderListType
}

type Props = {
  onClose: () => void
  type?: 'order' | 'invoice'
}

export default function OrderList({ onClose, type = 'order' }: Props) {
  const router = useRouter()

  const { openModal, closeModal } = useModal()

  const [selected, setSelected] = useState<OrderListType | null>(null)
  const [skip, setSkip] = useState(0)
  const [filter, setFilter] = useState<OrderListFilterType>(initialFilter)
  const [activeFilter, setActiveFilter] =
    useState<OrderListFilterType>(initialFilter)

  const { data: orderList, isLoading } = useGetOrderList(activeFilter, type)

  const onChangeSearch = (event: any) => {
    setFilter({ ...filter, search: event.target.value as string })
  }

  function onSearch() {
    setActiveFilter({
      ...filter,
      skip: skip * activeFilter.take!,
      take: activeFilter.take,
    })
  }

  useEffect(() => {
    if (type !== 'invoice') {
      setActiveFilter({ ...activeFilter, hideCompleted: '1' })
    }
  }, [type])

  function onReset() {
    setFilter({ ...initialFilter })
    setActiveFilter({ ...initialFilter })
  }

  const columns: GridColumns<OrderListType> = [
    {
      minWidth: 70,
      field: 'action',
      headerName: '',
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => <Box></Box>,
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
            {row?.items?.length ? null : (
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
            )}
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
    if (!selected?.isEditable) {
      openModal({
        type: 'not-a-team',
        children: (
          <SimpleAlertModal
            message='You can only create invoices for orders where you are part of the project team. '
            onClose={() => closeModal('not-a-team')}
          />
        ),
      })
    } else {
      onClose()
      router.push({
        pathname: '/invoice/receivable/add-new',
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
          {/* <InputLabel>Search projects</InputLabel> */}
          <OutlinedInput
            // label='Search projects'
            placeholder='Search projects'
            value={filter.search}
            onChange={onChangeSearch}
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
          <Typography variant='body2'>See only my orders</Typography>
          <Switch
            checked={Boolean(Number(activeFilter.mine))}
            onChange={e =>
              setActiveFilter({
                ...activeFilter,
                mine: e.target.checked ? '1' : '0',
              })
            }
          />
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Box>
          <DataGrid
            autoHeight
            components={{
              NoRowsOverlay: () => NoList(),
              NoResultsOverlay: () => NoList(),
            }}
            sx={{
              '& .MuiDataGrid-columnHeaders': {
                borderRadius: '0px',
              },
            }}
            columns={columns}
            rows={orderList?.data ?? []}
            rowCount={orderList?.totalCount ?? 0}
            loading={isLoading}
            onCellClick={params => setSelected(params.row)}
            rowsPerPageOptions={[10, 25, 50]}
            pagination
            page={skip}
            pageSize={activeFilter.take}
            paginationMode='server'
            onPageChange={(newPage: number) => {
              setActiveFilter((prevState: OrderListFilterType) => ({
                ...prevState,
                skip: newPage * prevState.take!,
              }))
              setSkip(newPage)
            }}
            onPageSizeChange={(newPageSize: number) => {
              setActiveFilter((prevState: OrderListFilterType) => ({
                ...prevState,
                take: newPageSize,
              }))
            }}
            disableSelectionOnClick
          />
        </Box>
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