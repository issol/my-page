import { yupResolver } from '@hookform/resolvers/yup'
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  styled,
} from '@mui/material'

import Dialog from '@mui/material/Dialog'

import DialogContent from '@mui/material/DialogContent'

import Icon from 'src/@core/components/icon'

import useModal from '@src/hooks/useModal'

import {
  PriceUnitListType,
  SetPriceUnit,
  SetPriceUnitPair,
  StandardPriceListType,
} from '@src/types/common/standard-price'
import { setPriceUnitSchema } from '@src/types/schema/price-unit.schema'
import {
  Controller,
  FieldArrayWithId,
  useFieldArray,
  useForm,
} from 'react-hook-form'

import { PriceUnitType } from '@src/apis/price-units.api'
import { SyntheticEvent, useEffect, useState } from 'react'
import _ from 'lodash'

import PriceActionModal from '../modal/price-action-modal'

import {
  QueryObserverResult,
  RefetchOptions,
  RefetchQueryFilters,
  useMutation,
  useQueryClient,
} from 'react-query'
import toast from 'react-hot-toast'
import {
  patchPriceUnitPair,
  setPriceUnitPair,
} from '@src/apis/company-price.api'

type Props = {
  onClose: any
  currency: string
  priceUnit: PriceUnitType[]
  price: StandardPriceListType
  priceUnitPair: PriceUnitListType[]
  refetch: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined,
  ) => Promise<
    QueryObserverResult<
      {
        data: StandardPriceListType[]
        count: number
      },
      unknown
    >
  >
}

const SetPriceUnitModal = ({
  onClose,
  currency,
  priceUnit,
  price,
  priceUnitPair,
  refetch,
}: Props) => {
  const { closeModal, openModal } = useModal()
  const queryClient = useQueryClient()

  const [priceUnits, setPriceUnits] = useState<PriceUnitType[]>([])

  const [baseUnitPrice, setBaseUnitPrice] = useState<
    { id: number; price: number }[]
  >([])
  const [priceUnitOptions, setPriceUnitOptions] =
    useState<PriceUnitType[]>(priceUnit)
  const [selectedPriceUnits, setSelectedPriceUnits] = useState<PriceUnitType[]>(
    [],
  )

  const handleChange = (event: SyntheticEvent, newValue: PriceUnitType[]) => {
    setPriceUnits(newValue)
  }

  const {
    control,
    handleSubmit,
    reset,
    watch,
    trigger,
    setValue,
    setError,
    getValues,
    formState: { errors, dirtyFields },
  } = useForm<SetPriceUnit>({
    // defaultValues,
    mode: 'onChange',
    resolver: yupResolver(setPriceUnitSchema),
  })

  const {
    fields: pairFields,
    append,
    remove,
    update,
  } = useFieldArray({
    control,
    name: 'pair',
  })

  const calculateRoundedRatio = (total: number, value: number) => {
    const ratio = (value / total) * 100
    const roundedRatio = ratio.toFixed(5)
    return Number(roundedRatio)
  }

  const setPriceUnitMutation = useMutation(
    (value: { data: SetPriceUnitPair[]; type: string }) =>
      value.type === 'Save'
        ? setPriceUnitPair(value.data)
        : patchPriceUnitPair(value.data),
    {
      onSuccess: data => {
        refetch()
        queryClient.invalidateQueries('standard-client-prices')

        toast.success(`Success`, {
          position: 'bottom-left',
        })
      },
      onError: error => {
        toast.error('Something went wrong. Please try again.', {
          position: 'bottom-left',
        })
      },
    },
  )

  const onClickAction = (type: string, data?: SetPriceUnitPair[]) => {
    console.log(type)
    if (type === 'Discard') {
      closeModal('setPriceUnitModal')
    } else if (type === 'Save' || type === 'EditSave') {
      closeModal('setPriceUnitModal')
      setPriceUnitMutation.mutate({ data: data!, type: type })
    } else if (type === 'Cancel') {
    }
  }

  const onSubmit = (data: SetPriceUnit) => {
    const res: SetPriceUnitPair[] = data.pair.map(value => ({
      priceId: price.id,
      priceUnitId: value.unitId!,
      quantity:
        typeof value.quantity === 'string' && value.quantity === '-'
          ? null
          : typeof value.quantity === 'string' && value.quantity !== '-'
          ? value.quantity
          : typeof value.quantity === 'number'
          ? value.quantity.toString()
          : null,
      price:
        typeof value.price === 'string' && value.price === '-'
          ? null
          : typeof value.price === 'string' && value.price !== '-'
          ? value.price
          : typeof value.price === 'number'
          ? value.price.toString()
          : null,
      weighting:
        typeof value.weighting === 'string' && value.weighting === '-'
          ? null
          : typeof value.weighting === 'string' && value.weighting !== '-'
          ? value.weighting
          : typeof value.weighting === 'number'
          ? value.weighting.toString()
          : null,
    }))

    console.log(res)

    openModal({
      type: 'saveSetPriceUnitModal',
      children: (
        <PriceActionModal
          onClose={() => closeModal('saveSetPriceUnitModal')}
          onClickAction={() =>
            onClickAction(priceUnitPair.length ? 'EditSave' : 'Save', res)
          }
          type='Save'
        />
      ),
    })
  }

  const removePair = (item: FieldArrayWithId<SetPriceUnit, 'pair', 'id'>) => {
    const idx = pairFields.map(item => item.unitId).indexOf(item.unitId)
    idx !== -1 && remove(idx)

    let arr = priceUnitOptions

    priceUnit
      .filter(value => value.id === item.unitId)
      .map(value => {
        arr.push(value)
      })

    arr = _.sortBy(arr, ['title'])

    setPriceUnitOptions(arr)
  }

  const onClickAddPriceUnit = () => {
    setSelectedPriceUnits(priceUnits)

    priceUnits.map(value => {
      append({
        unitId: value.id,
        quantity: value.unit === 'Percent' ? '-' : 1,
        price: (1.0).toFixed(1),
        weighting: value.weighting ?? '-',
        title: value.title,
        isBase: value.parentPriceUnitId === null,
        parentPriceUnitId: value.parentPriceUnitId,
        subPriceUnits: value.subPriceUnits,
        unit: value.unit,
      })
      if (value.parentPriceUnitId === null) {
        setBaseUnitPrice([{ id: value.id, price: 1.0 }])
      }

      if (value.subPriceUnits) {
        value.subPriceUnits.map(value => {
          append({
            unitId: value.id,
            quantity: value.unit === 'Percent' ? '-' : 1,
            price: (1.0 * value.weighting) / 100,
            weighting: value.weighting ?? '-',
            title: value.title,
            isBase: value.parentPriceUnitId === null,
            parentPriceUnitId: value.parentPriceUnitId,
            unit: value.unit,
          })
        })
      }
    })

    const removeUnitsId = priceUnits.map(value => value.id)
    const newArr = priceUnitOptions.filter(
      obj => !removeUnitsId.includes(obj.id),
    )
    setPriceUnitOptions(newArr)
    setPriceUnits([])
  }

  const onChangePair = (
    idx: number,
    type: 'quantity' | 'price' | 'weighting',
    value: any,
  ) => {
    const filtered = pairFields.filter(f => f.unitId! === idx)[0]
    const index = pairFields.findIndex(f => f.unitId! === idx)
    let newVal = { ...filtered, [type]: value }

    update(index, newVal)
    trigger('pair')
  }

  useEffect(() => {
    setPriceUnitOptions(priceUnit)
  }, [priceUnit])

  useEffect(() => {
    priceUnitPair.map(value => {
      append({
        unitId: value.id,
        quantity: value.quantity ?? '-',
        price: value.price,
        weighting: value.weighting ?? '-',
        title: value.title,
        isBase: value.parentPriceUnitId === null,
        parentPriceUnitId: value.parentPriceUnitId,
        unit: value.unit,
      })
    })

    const removeUnitsId = priceUnitPair.map(value => value.priceUnitId)
    const newArr = priceUnitOptions.filter(
      obj => !removeUnitsId.includes(obj.id),
    )
    setPriceUnitOptions(newArr)
  }, [priceUnitPair])

  useEffect(() => {
    console.log(errors)
  }, [errors])

  return (
    <Dialog
      open={true}
      keepMounted
      fullWidth
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
        <Typography variant='h5' sx={{ mb: '30px' }}>
          Set price unit
        </Typography>
        <Box
          sx={{
            display: 'flex',
            gap: '20px',
            alignItems: 'center',
            mb: '30px',
          }}
        >
          <Autocomplete
            multiple
            fullWidth
            onChange={handleChange}
            value={priceUnits}
            isOptionEqualToValue={(option, newValue) => {
              return option.title === newValue.title
            }}
            disableCloseOnSelect
            limitTags={2}
            options={priceUnitOptions}
            id='priceUnit'
            getOptionLabel={option => option.title}
            renderInput={params => <TextField {...params} label='Price unit' />}
            renderOption={(props, option, { selected }) => (
              <li {...props}>
                <Checkbox checked={selected} sx={{ mr: 2 }} />
                {option.title}
              </li>
            )}
          />
          <Button
            variant='contained'
            size='medium'
            sx={{ height: '42px' }}
            onClick={onClickAddPriceUnit}
          >
            Add
          </Button>
        </Box>
        <Divider />

        <form onSubmit={handleSubmit(onSubmit)} style={{ marginTop: '30px' }}>
          <Box
            sx={{ minHeight: '350px', maxHeight: '900px', overflow: 'scroll' }}
          >
            {pairFields.length ? (
              pairFields?.map((data, idx) => {
                return (
                  <Box key={data.id} sx={{ pl: data.isBase ? 0 : '50px' }}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        mb: 4,
                        alignItems: 'center',
                      }}
                    >
                      <Typography
                        variant='body1'
                        sx={{
                          fontWeight: 600,
                          display: 'flex',
                          gap: '5px',
                          alignItems: 'center',
                        }}
                      >
                        <Box>
                          {!data.isBase ? (
                            <img
                              src='/images/icons/price-icons/sub-price-arrow.svg'
                              alt=''
                            />
                          ) : null}
                        </Box>
                        {idx + 1}.&nbsp;{data.title}
                      </Typography>

                      <IconButton
                        onClick={() => removePair(data)}
                        sx={{ padding: 1 }}
                      >
                        <Icon icon='mdi:delete-outline'></Icon>
                      </IconButton>
                    </Box>
                    <Grid container xs={12} spacing={3}>
                      <Grid item xs={4}>
                        <FormControl sx={{ mb: 4 }} fullWidth>
                          <Controller
                            name={`pair.${idx}.quantity`}
                            control={control}
                            render={({
                              field: { onChange, value, onBlur },
                            }) => (
                              <Input
                                // type='number'
                                id='icons-start-adornment'
                                label='Quantity*'
                                disabled={data.unit === 'Percent'}
                                value={value || ''}
                                error={
                                  errors.pair?.length
                                    ? !!errors.pair[idx]?.quantity
                                    : false
                                }
                                onChange={e => {
                                  const { value } = e.target
                                  if (value === '') {
                                    onChange(null)
                                  } else {
                                    const filteredValue = value
                                      .replace(
                                        /[^0-9!@#$%^&*()_+{}\[\]:;.,\-\\/]/g,
                                        '',
                                      )
                                      .slice(0, 10)
                                    e.target.value = filteredValue
                                    onChange(e.target.value)
                                  }
                                }}
                                // onBlur={e => {
                                //   onChangePair(idx, 'quantity', e.target.value)
                                // }}
                                onBlur={e => {
                                  const { value } = e.target
                                  if (value === '') {
                                    onChangePair(idx, 'quantity', null)
                                  } else {
                                    const filteredValue = value
                                      .replace(
                                        /[^0-9!@#$%^&*()_+{}\[\]:;.,\-\\/]/g,
                                        '',
                                      )
                                      .slice(0, 10)
                                    e.target.value = filteredValue
                                    onChangePair(
                                      idx,
                                      'quantity',
                                      e.target.value,
                                    )
                                  }
                                }}
                              />
                            )}
                          />
                          {errors.pair?.length
                            ? errors.pair[idx]?.quantity && (
                                <FormHelperText sx={{ color: 'error.main' }}>
                                  {errors?.pair[idx]?.quantity?.message}
                                </FormHelperText>
                              )
                            : ''}
                        </FormControl>
                      </Grid>
                      <Grid item xs={4}>
                        <FormControl sx={{ mb: 4 }} fullWidth>
                          <Controller
                            name={`pair.${idx}.price`}
                            control={control}
                            render={({
                              field: { onChange, value, onBlur },
                            }) => (
                              <Input
                                id='icons-start-adornment'
                                label='Price*'
                                value={value || ''}
                                error={
                                  errors.pair?.length
                                    ? !!errors.pair[idx]?.price
                                    : false
                                }
                                onChange={e => {
                                  const { value } = e.target
                                  if (value === '') {
                                    onChange(null)
                                  } else {
                                    const filteredValue = value
                                      .replace(
                                        /[^0-9!@#$%^&*()_+{}\[\]:;.,\-\\/]/g,
                                        '',
                                      )
                                      .slice(0, 10)
                                    if (data.isBase) {
                                      const res = data.subPriceUnits?.map(
                                        value => value.id,
                                      )
                                      const subUnitIds = res?.map(value => {
                                        return {
                                          index: pairFields.findIndex(
                                            data => data.unitId === value,
                                          ),
                                          weighting: pairFields.find(
                                            data => data.unitId === value,
                                          )?.weighting,
                                        }
                                      })

                                      subUnitIds?.map(value => {
                                        setValue(
                                          `pair.${value.index}.price`,
                                          value.weighting === null ||
                                            value.weighting === '-'
                                            ? Number(e.target.value) / 100
                                            : Number(
                                                (
                                                  (Number(e.target.value) *
                                                    Number(value.weighting)) /
                                                  100
                                                )
                                                  .toString()
                                                  .slice(0, 10),
                                              ),
                                        )
                                        trigger(`pair.${value.index}.price`)
                                      })

                                      setBaseUnitPrice(prevState => {
                                        const existingId = prevState.map(
                                          value => value.id,
                                        )
                                        if (
                                          !existingId.includes(data.unitId!)
                                        ) {
                                          return [
                                            ...prevState,
                                            {
                                              id: data.unitId!,
                                              price: Number(e.target.value),
                                            },
                                          ]
                                        } else {
                                          return [
                                            {
                                              id: data.unitId!,
                                              price: Number(e.target.value),
                                            },
                                          ]
                                        }
                                      })
                                    } else {
                                      const price = baseUnitPrice.find(
                                        value =>
                                          value.id === data.parentPriceUnitId,
                                      )?.price

                                      if (!isNaN(Number(e.target.value))) {
                                        setValue(
                                          `pair.${idx}.weighting`,
                                          calculateRoundedRatio(
                                            price!,
                                            Number(e.target.value),
                                          ),
                                        )

                                        trigger(`pair.${idx}.weighting`)
                                      }
                                    }
                                    e.target.value = filteredValue

                                    onChange(e.target.value)
                                  }
                                }}
                                onBlur={e => {
                                  const { value } = e.target
                                  if (value === '') {
                                    onChangePair(idx, 'price', null)
                                  } else {
                                    const filteredValue = value
                                      .replace(
                                        /[^0-9!@#$%^&*()_+{}\[\]:;.,\-\\/]/g,
                                        '',
                                      )
                                      .slice(0, 10)
                                    e.target.value = filteredValue
                                    onChangePair(idx, 'price', e.target.value)
                                  }
                                }}
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position='start'>
                                      {currency === 'USD'
                                        ? '($ USD)'
                                        : currency === 'KRW'
                                        ? '(₩ KRW)'
                                        : currency === 'JPY'
                                        ? '(¥ JPY)'
                                        : currency === 'SGD'
                                        ? '($ SGD)'
                                        : '-'}
                                    </InputAdornment>
                                  ),
                                }}
                              />
                            )}
                          />
                          {errors.pair?.length
                            ? errors.pair[idx]?.price && (
                                <FormHelperText sx={{ color: 'error.main' }}>
                                  {errors?.pair[idx]?.price?.message}
                                </FormHelperText>
                              )
                            : ''}
                        </FormControl>
                      </Grid>
                      <Grid item xs={4}>
                        <FormControl sx={{ mb: 4 }} fullWidth>
                          <Controller
                            name={`pair.${idx}.weighting`}
                            control={control}
                            render={({
                              field: { onChange, value, onBlur },
                            }) => (
                              <Input
                                id='icons-start-adornment'
                                label='Weighting(%)*'
                                value={value || ''}
                                disabled={data.isBase}
                                onChange={e => {
                                  const { value } = e.target
                                  if (value === '') {
                                    onChange(null)
                                  } else {
                                    const filteredValue = value
                                      .replace(
                                        /[^0-9!@#$%^&*()_+{}\[\]:;.,\-\\/]/g,
                                        '',
                                      )
                                      .slice(0, 10)
                                    e.target.value = filteredValue
                                    onChange(e.target.value)

                                    const price = baseUnitPrice.find(
                                      value =>
                                        value.id === data.parentPriceUnitId,
                                    )?.price

                                    if (!isNaN(Number(e.target.value))) {
                                      setValue(
                                        `pair.${idx}.price`,
                                        Number(
                                          (
                                            price! *
                                            (Number(e.target.value) / 100)
                                          )
                                            .toString()
                                            .slice(0, 10),
                                        ),
                                      )

                                      trigger(`pair.${idx}.price`)
                                    }
                                  }
                                }}
                                error={
                                  errors.pair?.length
                                    ? !!errors.pair[idx]?.weighting
                                    : false
                                }
                                onBlur={e => {
                                  const { value } = e.target
                                  if (value === '') {
                                    onChangePair(idx, 'weighting', null)
                                  } else {
                                    const filteredValue = value
                                      .replace(
                                        /[^0-9!@#$%^&*()_+{}\[\]:;.,\-\\/]/g,
                                        '',
                                      )
                                      .slice(0, 10)
                                    e.target.value = filteredValue
                                    onChangePair(
                                      idx,
                                      'weighting',
                                      e.target.value,
                                    )
                                  }
                                }}
                              />
                            )}
                          />
                          {errors.pair?.length
                            ? errors.pair[idx]?.weighting && (
                                <FormHelperText sx={{ color: 'error.main' }}>
                                  {errors?.pair[idx]?.weighting?.message}
                                </FormHelperText>
                              )
                            : ''}
                        </FormControl>
                      </Grid>
                    </Grid>
                  </Box>
                )
              })
            ) : (
              <Box
                sx={{
                  height: '350px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Typography variant='subtitle2'>
                  No price unit has been selected
                </Typography>
              </Box>
            )}
          </Box>
          <Divider />
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: '24px',
              mt: '30px',
            }}
          >
            <Button
              variant='outlined'
              onClick={() =>
                openModal({
                  type: 'cancelSetPriceUnitModal',
                  children: (
                    <PriceActionModal
                      onClose={() => closeModal('cancelSetPriceUnitModal')}
                      onClickAction={() => onClickAction('Cancel')}
                      type='Cancel'
                    />
                  ),
                })
              }
            >
              Cancel
            </Button>
            {priceUnitPair.length ? (
              <Button
                variant='contained'
                type='submit'
                disabled={pairFields.some(item => {
                  return !item.weighting || !item.quantity || !item.price
                })}
              >
                Save
              </Button>
            ) : (
              <Button
                variant='contained'
                type='submit'
                disabled={
                  pairFields.some(item => {
                    return !item.weighting || !item.quantity || !item.price
                  }) || pairFields.length === 0
                }
              >
                Save
              </Button>
            )}
          </Box>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export const Input = styled(TextField)(({ theme }) => ({
  '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
    display: 'none',
  },
  '& input[type=number]': {
    MozAppearance: 'textfield',
  },
}))

export default SetPriceUnitModal
