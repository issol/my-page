import { useRouter } from 'next/router'
import { ChangeEventHandler, useEffect, useState } from 'react'

// ** style components
import { Icon } from '@iconify/react'
import {
  Autocomplete,
  Box,
  Button,
  Card,
  Checkbox,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Radio,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import { DataGrid, GridColumns, GridSelectionModel } from '@mui/x-data-grid'

// ** hooks
import useModal from '@src/hooks/useModal'

// ** components
import ModalWithButtonName from '@src/pages/client/components/modals/modal-with-button-name'
import SimpleAlertModal from '@src/pages/client/components/modals/simple-alert-modal'

// ** apis
import { useGetOrderList } from '@src/queries/order/order.query'

// ** types
import {
  InvoiceOrderListFilterType,
  OrderListFilterType,
  OrderListType,
} from '@src/types/orders/order-list'
import { Controller, useForm } from 'react-hook-form'
import { RevenueFrom } from '@src/shared/const/revenue-from'
import NoList from '@src/pages/components/no-list'

const initialFilter: InvoiceOrderListFilterType = {
  search: '',

  mine: '0',
  skip: 0,
  take: 50,
}

export type FilterType = {
  revenueFrom?: string

  status?: Array<{ label: string; value: number }>
  client?: number

  search: string
}

const defaultValues: FilterType = {
  status: [],

  search: '',
}

type OrderListCellType = {
  row: OrderListType
}

type Props = {
  onClose: () => void
  type?: 'order' | 'invoice'
  statusList?: {
    value: number
    label: string
  }[]
  clientList?: {
    label: string
    value: number
  }[]
}

export default function SelectOrder({
  onClose,
  type = 'order',
  statusList,
  clientList,
}: Props) {
  const router = useRouter()

  const { openModal, closeModal } = useModal()

  const [selected, setSelected] = useState<OrderListType | null>(null)
  const [skip, setSkip] = useState(0)
  const [page, setPage] = useState(50)
  const [filter, setFilter] =
    useState<InvoiceOrderListFilterType>(initialFilter)
  // const [activeFilter, setActiveFilter] =
  //   useState<OrderListFilterType>(initialFilter)

  const { control, handleSubmit, trigger, reset } = useForm<FilterType>({
    defaultValues,
    mode: 'onSubmit',
  })

  const { data: orderList, isLoading } = useGetOrderList(filter, type)

  function onReset() {
    reset(defaultValues)
    setFilter({ ...initialFilter })
    // setActiveFilter({ ...initialFilter })
  }

  const handleSelectionModelChange = (selectionModel: GridSelectionModel) => {
    if (orderList) {
      const selected: OrderListType[] = selectionModel
        .map(id => orderList.data.find(job => job.id === id))
        .filter(job => job !== undefined) as OrderListType[]

      console.log(selected)

      // console.log(selected)
      // const firstCurrency = selected[0]?.currency
      // const invalidSelections = selected.filter(
      //   job => job.currency !== firstCurrency,
      // )
    }
  }

  const columns: GridColumns<OrderListType> = [
    {
      field: 'corporationId',
      flex: 0.1201,
      minWidth: 110,
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
      flex: 0.2293,
      minWidth: 210,

      field: 'projectName',
      headerName: 'Project name',
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => <Box>Project name</Box>,
      renderCell: ({ row }: OrderListCellType) => {
        return (
          <Tooltip title={row.projectName}>
            <Typography
              variant='body1'
              fontWeight={600}
              sx={{
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                wordBreak: 'break-all',
              }}
            >
              {row.projectName}
            </Typography>
          </Tooltip>
        )
      },
    },
    {
      flex: 0.1638,
      minWidth: 150,

      field: 'client',
      headerName: 'Client',
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => <Box>Client</Box>,
      renderCell: ({ row }: OrderListCellType) => {
        return (
          <Typography variant='body1' fontWeight={600}>
            {row.client.name}
          </Typography>
        )
      },
    },
    {
      flex: 0.131,
      minWidth: 120,

      field: 'currency',
      headerName: 'Currency',
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => <Box>Currency</Box>,
      renderCell: ({ row }: OrderListCellType) => {
        return (
          <Typography variant='body1' fontWeight={600}>
            {row.currency}
          </Typography>
        )
      },
    },
    {
      flex: 0.1528,
      minWidth: 140,

      field: 'revenueFrom',
      headerName: 'Revenue from',
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => <Box>Revenue from</Box>,
      renderCell: ({ row }: OrderListCellType) => {
        return <Typography variant='body1'>{row.revenueFrom}</Typography>
      },
    },
    {
      flex: 0.1166,
      minWidth: 100,

      field: 'condition',
      headerName: '',
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => <Box></Box>,
      renderCell: ({ row }: OrderListCellType) => {
        return (
          <Box width='100%' display='flex' justifyContent='space-between'>
            {row?.items?.length ? (
              row.status !== 'Delivery completed' &&
              row.status !== 'Delivery confirmed' ? (
                <Typography fontSize={12} variant='caption'>
                  Uncompleted
                </Typography>
              ) : null
            ) : (
              <Typography fontSize={12} variant='caption'>
                No items
              </Typography>
            )}
          </Box>
        )
      },
    },
  ]

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

  const filterSubmit = (data: FilterType) => {
    const { status, revenueFrom, client, search } = data

    const filter: InvoiceOrderListFilterType = {
      revenueFrom: revenueFrom,
      status: status?.map(value => value.value) ?? [],
      client: client,

      search: search,
      take: page,
      skip: skip * page,
    }

    setFilter(filter)
  }

  return (
    <Box
      sx={{
        maxWidth: '1036px',
        width: '100%',
        background: '#ffffff',
        boxShadow: '0px 0px 20px rgba(76, 78, 100, 0.4)',
        borderRadius: '10px',
      }}
    >
      <Box
        sx={{
          padding: '50px 60px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Typography variant='h5'>Select order</Typography>
          </Grid>
          <Grid item xs={12}>
            <form onSubmit={handleSubmit(filterSubmit)}>
              <Box
                sx={{
                  width: '100%',

                  padding: '20px',
                  marginBottom: '24px',
                  border: '1px solid rgba(76, 78, 100, 0.22)',
                  borderRadius: '10px',
                }}
              >
                <Grid container spacing={6} rowSpacing={4}>
                  <Grid item xs={6} sm={6} md={6}>
                    <Controller
                      control={control}
                      name='client'
                      render={({ field: { onChange, value } }) => {
                        return (
                          <Autocomplete
                            onChange={(event, item) => {
                              onChange(item?.value)
                            }}
                            value={clientList?.find(
                              item => item.value === value,
                            )}
                            options={clientList ?? []}
                            id='client'
                            getOptionLabel={option => option.label}
                            renderInput={params => (
                              <TextField {...params} label='Client' />
                            )}
                          />
                        )
                      }}
                    />
                  </Grid>
                  <Grid item xs={6} sm={6} md={6}>
                    <Controller
                      control={control}
                      name='revenueFrom'
                      render={({ field: { onChange, value } }) => (
                        <Autocomplete
                          options={RevenueFrom}
                          value={RevenueFrom.find(item => item.value === value)}
                          onChange={(e, v) => onChange(v?.label)}
                          getOptionLabel={option => option.label}
                          renderInput={params => (
                            <TextField
                              {...params}
                              label='Revenue from'
                              // placeholder='Revenue from'
                            />
                          )}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={6} sm={6} md={6}>
                    <Controller
                      control={control}
                      name='status'
                      render={({ field: { onChange, value } }) => (
                        <Autocomplete
                          multiple
                          fullWidth
                          onChange={(event, item) => {
                            onChange(item)
                          }}
                          value={value}
                          isOptionEqualToValue={(option, newValue) => {
                            return option.value === newValue.value
                          }}
                          disableCloseOnSelect
                          limitTags={1}
                          options={statusList ?? []}
                          id='status'
                          getOptionLabel={option => option.label}
                          renderInput={params => (
                            <TextField {...params} label='Status' />
                          )}
                          renderOption={(props, option, { selected }) => (
                            <li {...props}>
                              <Checkbox checked={selected} sx={{ mr: 2 }} />
                              {option.label}
                            </li>
                          )}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl fullWidth>
                      {/* <InputLabel>Search projects</InputLabel> */}
                      <OutlinedInput
                        // label='Search projects'
                        placeholder='Search projects'
                        value={filter.search}
                        // onChange={onChangeSearch}
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
                      <Button variant='contained' size='medium' type='submit'>
                        Search
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Box>

              {/* <Grid item xs={12}>
            <Divider />
          </Grid> */}
              {/* <Grid item xs={12}>
            <Box
              display='flex'
              alignItems='center'
              justifyContent='flex-end'
              gap='4px'
            >
              <Typography variant='body2'>See only my orders</Typography>
              <Switch
                checked={Boolean(Number(filter.mine))}
                onChange={e =>
                  setFilter({
                    ...filter,
                    mine: e.target.checked ? '1' : '0',
                  })
                }
              />
            </Box>
          </Grid> */}
              <Grid item xs={12}>
                <Box
                  sx={{
                    border: '1px solid rgba(76, 78, 100, 0.22)',
                    borderRadius: '10px',
                    marginBottom: '24px',
                  }}
                >
                  <DataGrid
                    autoHeight
                    components={{
                      NoRowsOverlay: () => NoList('There are no orders'),
                      NoResultsOverlay: () => NoList('There are no orders'),
                    }}
                    columns={columns}
                    rows={orderList?.data ?? []}
                    rowCount={orderList?.totalCount ?? 0}
                    loading={isLoading}
                    onCellClick={params => setSelected(params.row)}
                    rowsPerPageOptions={[10, 25, 50]}
                    pagination
                    page={skip}
                    pageSize={page}
                    paginationMode='server'
                    onPageChange={(newPage: number) => {
                      setFilter((prevState: InvoiceOrderListFilterType) => ({
                        ...prevState,
                        skip: newPage * page!,
                      }))
                      setSkip(newPage)
                    }}
                    onPageSizeChange={(newPageSize: number) => {
                      setFilter((prevState: InvoiceOrderListFilterType) => ({
                        ...prevState,
                        take: newPageSize,
                      }))
                      setPage(newPageSize)
                    }}
                    disableSelectionOnClick
                    checkboxSelection
                    keepNonExistentRowsSelected
                    onSelectionModelChange={newSelectionModel => {
                      handleSelectionModelChange(newSelectionModel)
                    }}
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
            </form>
          </Grid>
        </Grid>
      </Box>
    </Box>
  )
}
