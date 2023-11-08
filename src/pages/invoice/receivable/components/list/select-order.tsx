import { useRouter } from 'next/router'
import { ChangeEvent, ChangeEventHandler, useEffect, useState } from 'react'

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
import {
  DataGrid,
  GRID_CHECKBOX_SELECTION_COL_DEF,
  GridCellCheckboxRenderer,
  GridColumnHeaderParams,
  GridColumns,
  GridHeaderCheckbox,
  GridSelectionModel,
  GridValidRowModel,
  GridValueGetterParams,
  selectedIdsLookupSelector,
} from '@mui/x-data-grid'

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
import CustomModal from '@src/@core/components/common-modal/custom-modal'
import AlertModal from '@src/@core/components/common-modal/alert-modal'
import { useMutation, useQueryClient } from 'react-query'
import { addOrderToInvoice } from '@src/apis/invoice/common.api'
import { CurrencyType } from '@src/types/common/standard-price'

const initialFilter: InvoiceOrderListFilterType = {
  search: '',

  mine: '0',
  skip: 0,
  take: 50,
}

export type FilterType = {
  revenueFrom?: { label: string; value: string }

  status?: Array<{ label: string; value: number }>
  client?: { label: string; value: number }

  search: string
}

const defaultValues: FilterType = {
  status: [],
  client: undefined,
  revenueFrom: undefined,
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
  from: 'create' | 'detail'
  invoiceId?: number
  invoiceClient?: number
  invoiceRevenueFrom?: string
  invoiceCurrency?: CurrencyType
}

export default function SelectOrder({
  onClose,
  type = 'order',
  statusList,
  clientList,
  from,
  invoiceId,
  invoiceClient,
  invoiceRevenueFrom,
  invoiceCurrency,
}: Props) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { openModal, closeModal } = useModal()

  // const [selected, setSelected] = useState<OrderListType | null>(null)
  const [skip, setSkip] = useState(0)
  const [page, setPage] = useState(50)

  const [checked, setChecked] = useState(false)

  const [selectionModel, setSelectionModel] = useState<GridSelectionModel>([])

  const [applyFilter, setApplyFilter] = useState(false)

  const addOrderToInvoiceMutation = useMutation(
    (ids: number[]) => addOrderToInvoice(invoiceId!, ids),
    {
      onSuccess: () => {
        closeModal('order-list')
        queryClient.invalidateQueries('invoiceReceivableDetail')
        queryClient.invalidateQueries('invoiceReceivablePrices')
        queryClient.invalidateQueries('invoiceReceivableClient')
        queryClient.invalidateQueries('invoiceReceivableTeam')
        queryClient.invalidateQueries('invoiceReceivableHistory')
      },
    },
  )

  const [filter, setFilter] = useState<InvoiceOrderListFilterType>(
    from === 'detail'
      ? {
          ...initialFilter,
          client: invoiceClient,
          revenueFrom: invoiceRevenueFrom,
          currency: invoiceCurrency,
        }
      : initialFilter,
  )
  // const [activeFilter, setActiveFilter] =
  //   useState<OrderListFilterType>(initialFilter)

  const { control, handleSubmit, trigger, reset, getValues } =
    useForm<FilterType>({
      defaultValues,
      mode: 'onSubmit',
    })

  const { data: orderList, isLoading } = useGetOrderList(filter, type)

  function onReset() {
    reset(defaultValues)
    setFilter({ ...initialFilter })
    setApplyFilter(false)
    // setActiveFilter({ ...initialFilter })
  }

  const handleSelectionModelChange = (selectionModel: GridSelectionModel) => {
    let model = selectionModel as GridSelectionModel
    if (orderList?.data.length) {
      if (from === 'create') {
        const selected: OrderListType[] = selectionModel
          .map(id => orderList.data.find(job => job.id === id))
          .filter(job => job !== undefined) as OrderListType[]

        const firstClientId = selected[0]?.client?.clientId
        const firstRevenueFrom = selected[0]?.revenueFrom
        const firstCurrency = selected[0]?.currency
        const hasDifferentClient = selected.some(
          order => order.client?.clientId !== firstClientId,
        )
        const hasDifferentRevenueFrom = selected.some(
          order => order.revenueFrom !== firstRevenueFrom,
        )
        const hasDifferentCurrency = selected.some(
          order => order.currency !== firstCurrency,
        )

        if (hasDifferentClient) {
          openModal({
            type: 'DifferentClientAlertModal',
            children: (
              <AlertModal
                title={`Please check the client of the selected order. You can't choose different clients in an invoice.`}
                onClick={() => closeModal('DifferentClientAlertModal')}
                vary='error'
                buttonText='Okay'
              />
            ),
          })
          model.pop()
          setSelectionModel(model)
        } else if (hasDifferentRevenueFrom) {
          openModal({
            type: 'DifferentRevenueAlertModal',
            children: (
              <AlertModal
                title={`Please check the revenue of the selected order. You can't choose different revenues in an invoice.`}
                onClick={() => closeModal('DifferentRevenueAlertModal')}
                vary='error'
                buttonText='Okay'
              />
            ),
          })
          model.pop()
          setSelectionModel(model)
        } else if (hasDifferentCurrency) {
          openModal({
            type: 'DifferentCurrencyAlertModal',
            children: (
              <AlertModal
                title={`Please check the currency of the selected order. You can't choose different currencies in an invoice.`}
                onClick={() => closeModal('DifferentCurrencyAlertModal')}
                vary='error'
                buttonText='Okay'
              />
            ),
          })
          model.pop()
          setSelectionModel(model)
        } else {
          setSelectionModel(selectionModel)
        }
      } else {
        setSelectionModel(selectionModel)
      }

      // console.log(selected)
      // const firstCurrency = selected[0]?.currency
      // const invalidSelections = selected.filter(
      //   job => job.currency !== firstCurrency,
      // )
    } else {
      return
    }
  }

  const columns: GridColumns<OrderListType> = [
    {
      ...GRID_CHECKBOX_SELECTION_COL_DEF,
      renderHeader: () => {
        return (
          <Checkbox
            checked={checked}
            indeterminate={
              selectionModel.length > 0 &&
              orderList?.data.length !== selectionModel.length
            }
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              console.log(event.target.checked)
              if (event.target.checked) {
                if (
                  !applyFilter ||
                  !getValues('client') ||
                  !getValues('revenueFrom')
                ) {
                  openModal({
                    type: 'NoFilterAlertModal',
                    children: (
                      <AlertModal
                        title='Please select the client and revenue from filters first'
                        onClick={() => closeModal('NoFilterAlertModal')}
                        vary='error'
                        buttonText='Okay'
                      />
                    ),
                  })
                  setSelectionModel([])
                } else {
                  setSelectionModel(
                    orderList?.data.map(order => order.id) ?? [],
                  )
                  setChecked(event.target.checked)
                }
              } else {
                setSelectionModel([])
                setChecked(event.target.checked)
              }
            }}
          ></Checkbox>
        )
      },
    },
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
          <Tooltip title={row.client.name}>
            <Typography variant='body1'>{row.client.name}</Typography>
          </Tooltip>
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
        return <Typography variant='body1'>{row.currency}</Typography>
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

  function onSubmit(from: 'create' | 'detail') {
    if (orderList) {
      const selected: OrderListType[] = selectionModel
        .map(id => orderList.data.find(job => job.id === id))
        .filter(job => job !== undefined) as OrderListType[]

      const hasEditable = selected.some(order => order.isEditable === true)
      console.log(hasEditable)

      if (from === 'detail') {
        addOrderToInvoiceMutation.mutate(selected.map(order => order.id))
      } else {
        if (!hasEditable) {
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
          closeModal('order-list')
          router.push({
            pathname: '/invoice/receivable/add-new',
            query: { orderId: selected.map(order => order.id) },
          })
        }
      }

      // if (!hasEditable) {
      //   openModal({
      //     type: 'not-a-team',
      //     children: (
      //       <SimpleAlertModal
      //         message='You can only create invoices for orders where you are part of the project team. '
      //         onClose={() => closeModal('not-a-team')}
      //       />
      //     ),
      //   })
      // } else {
      //   if (from === 'detail') {
      //     addOrderToInvoiceMutation.mutate(selected.map(order => order.id))
      //   } else {
      //     closeModal('order-list')
      //     router.push({
      //       pathname: '/invoice/receivable/add-new',
      //       query: { orderId: selected.map(order => order.id) },
      //     })
      //   }
      // }
    }
  }

  const filterSubmit = (data: FilterType) => {
    const { status, revenueFrom, client, search } = data

    const filter: InvoiceOrderListFilterType = {
      revenueFrom: from === 'detail' ? invoiceRevenueFrom : revenueFrom?.label,
      status: status?.map(value => value.value) ?? [],
      client: from === 'detail' ? invoiceClient : client?.value,
      currency: from === 'detail' ? invoiceCurrency : undefined,

      search: search,
      take: page,
      skip: skip * page,
    }

    setFilter(filter)
    setApplyFilter(true)
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
            <Typography variant='h5'>Select orders</Typography>
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
                  {from === 'detail' ? null : (
                    <Grid item xs={6} sm={6} md={6}>
                      <Controller
                        control={control}
                        name='client'
                        render={({ field: { onChange, value } }) => {
                          return (
                            <Autocomplete
                              onChange={(event, item) => {
                                onChange(item)
                              }}
                              value={value ?? null}
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
                  )}
                  {from === 'detail' ? null : (
                    <Grid item xs={6} sm={6} md={6}>
                      <Controller
                        control={control}
                        name='revenueFrom'
                        render={({ field: { onChange, value } }) => (
                          <Autocomplete
                            options={RevenueFrom.sort((a, b) =>
                              a.value > b.value
                                ? 1
                                : b.value > a.value
                                ? -1
                                : 0,
                            )}
                            value={value ?? null}
                            onChange={(e, v) => onChange(v)}
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
                  )}

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
                          options={
                            statusList
                              ? statusList.filter(
                                  item =>
                                    item.label === 'Partially delivered' ||
                                    item.label === 'Delivery completed' ||
                                    item.label === 'Redelivery requested' ||
                                    item.label === 'Delivery confirmed',
                                )
                              : []
                          }
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
                    <Controller
                      control={control}
                      name='search'
                      render={({ field: { onChange, value } }) => (
                        <FormControl fullWidth>
                          <OutlinedInput
                            placeholder='Search projects'
                            value={value ?? ''}
                            onChange={onChange}
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
                      )}
                    />
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
                    // autoHeight
                    components={{
                      NoRowsOverlay: () => NoList('There are no orders'),
                      NoResultsOverlay: () => NoList('There are no orders'),
                    }}
                    sx={{
                      overflowY: 'scroll',
                      height: '400px',
                      '& ::-webkit-scrollbar': {
                        display: 'none',
                      },
                      // '& ::-webkit-scrollbar-track': {
                      //   backgroundColor: '#f5f5f5',
                      // },
                      // '& ::-webkit-scrollbar-thumb': {
                      //   borderRadius: '10px',
                      //   boxShadow: 'inset 0 0 6px rgba(0,0,0,.3)',
                      //   backgroundColor: '#f5f5f5',
                      // },
                    }}
                    columns={columns}
                    rows={orderList?.data ?? []}
                    rowCount={orderList?.totalCount ?? 0}
                    loading={isLoading}
                    // onCellClick={params => setSelected(params.row)}
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
                    // disableSelectionOnClick
                    hideFooterSelectedRowCount
                    checkboxSelection
                    keepNonExistentRowsSelected
                    selectionModel={selectionModel}
                    onSelectionModelChange={(newSelectionModel, details) => {
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
                    onClick={() => onSubmit(from)}
                    // disabled={!selected}
                    disabled={selectionModel.length === 0}
                  >
                    {from === 'create' ? 'Create invoice' : 'Add to invoice'}
                    {/* Create invoice */}
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
