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
  InputBase,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  styled,
} from '@mui/material'

import Dialog from '@mui/material/Dialog'

import DialogContent from '@mui/material/DialogContent'
import { v4 as uuidv4 } from 'uuid'
import Icon from 'src/@core/components/icon'

import useModal from '@src/hooks/useModal'
import { JobList } from '@src/shared/const/job/jobs'
import { getGloLanguage } from '@src/shared/transformer/language.transformer'
import {
  AddNewLanguagePair,
  SetPriceUnit,
  SetPriceUnitPair,
  StandardPriceListType,
} from '@src/types/common/standard-price'
import {
  languagePairSchema,
  setPriceUnitSchema,
} from '@src/types/schema/price-unit.schema'
import {
  Controller,
  FieldArrayWithId,
  useFieldArray,
  useForm,
} from 'react-hook-form'
import LanguagePairActionModal from '../modal/language-pair-action-modal'
import { useGetPriceUnitList } from '@src/queries/price-units.query'
import { PriceUnitType } from '@src/apis/price-units.api'
import { SyntheticEvent, useEffect, useState } from 'react'
import _ from 'lodash'

import PriceActionModal from '../modal/price-action-modal'
import { log } from 'console'

// const defaultValues: SetPriceUnit = {
//   pair: [
//     { unitId: null, quantity: null, price: null, weighting: null, title: '' },
//   ],
// }

type Props = {
  onClose: any
  currency: string
  priceUnit: PriceUnitType[]
  price: StandardPriceListType
}

const SetPriceUnitModal = ({ onClose, currency, priceUnit, price }: Props) => {
  const { closeModal, openModal } = useModal()

  const [priceUnits, setPriceUnits] = useState<PriceUnitType[]>([])
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

  const onSubmit = (data: SetPriceUnit) => {
    const res = data.pair.map(value => ({
      priceId: price.id,
      priceUnitId: value.unitId,
      quantity:
        typeof value.quantity === 'string' && value.quantity === '-'
          ? null
          : typeof value.quantity === 'string' && value.quantity !== '-'
          ? parseFloat(value.quantity)
          : value.quantity,
      price:
        typeof value.price === 'string' && value.price === '-'
          ? null
          : typeof value.price === 'string' && value.price !== '-'
          ? parseFloat(value.price)
          : value.price,
      weighting:
        typeof value.weighting === 'string' && value.weighting === '-'
          ? null
          : typeof value.weighting === 'string' && value.weighting !== '-'
          ? parseFloat(value.weighting)
          : value.weighting,
    }))

    console.log(res)
  }

  const languageList = getGloLanguage()

  const removePair = (item: FieldArrayWithId<SetPriceUnit, 'pair', 'id'>) => {
    // const res = selectedPriceUnits.filter(value => value.id !== item.unitId)
    // setSelectedPriceUnits(res)
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
        unit: value.unit,
      })
      if (value.subPriceUnits) {
        value.subPriceUnits.map(value => {
          append({
            unitId: value.id,
            quantity: value.unit === 'Percent' ? '-' : 1,
            price: (1.0).toFixed(1),
            weighting: value.weighting ?? '-',
            title: value.title,
            isBase: value.parentPriceUnitId === null,
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

  // setUnitPair(prevState => {
  //   return prevState
  //     .filter((value, idx) => idx === index)
  //     .map(value => ({ ...value, [type]: item }))
  // })

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

  const onClickAction = (type: string) => {
    if (type === 'Discard') {
      closeModal('addNewLanguagePairModal')
    } else if (type === 'Save') {
      closeModal('addNewLanguagePairModal')
    }
  }

  useEffect(() => {
    setPriceUnitOptions(priceUnit)
  }, [priceUnit])

  useEffect(() => {
    console.log(selectedPriceUnits)
  }, [selectedPriceUnits])

  return (
    <Dialog
      open={true}
      keepMounted
      fullWidth
      // onClose={() => {
      //   // setModal(null)
      //   onClose()
      // }}
      // TransitionComponent={Transition}
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
                      onClickAction={onClickAction}
                      type='Cancel'
                    />
                  ),
                })
              }
            >
              Cancel
            </Button>
            <Button
              variant='contained'
              type='submit'
              disabled={
                pairFields.some(item => {
                  return !item.weighting || !item.quantity || !item.price
                }) || pairFields.length === 0
              }
              onClick={() =>
                openModal({
                  type: 'saveSetPriceUnitModal',
                  children: (
                    <PriceActionModal
                      onClose={() => closeModal('saveSetPriceUnitModal')}
                      onClickAction={onClickAction}
                      type='Save'
                    />
                  ),
                })
              }
            >
              Save
            </Button>
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
