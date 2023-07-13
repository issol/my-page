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

import { v4 as uuidv4 } from 'uuid'

import {
  CommonPriceUnitType,
  PriceUnitListType,
  SetPriceUnit,
  SetPriceUnitPair,
  StandardPriceListType,
  SubPriceUnitType,
} from '@src/types/common/standard-price'
import { setPriceUnitSchema } from '@src/types/schema/price-unit.schema'
import {
  Controller,
  FieldArrayWithId,
  useFieldArray,
  useForm,
} from 'react-hook-form'

import { PriceUnitType } from '@src/types/common/standard-price'
import { SyntheticEvent, useEffect, useState } from 'react'
import _ from 'lodash'

import PriceActionModal from '../../standard-prices-modal/modal/price-action-modal'
import BasePriceUnitRemoveModal from '../../standard-prices-modal/modal/base-price-unit-remove-modal'

type ClientPriceUnitType = Omit<PriceUnitListType, 'priceId'> & {
  priceId: string
  id: number
}

type Props = {
  onClose: any
  onSubmit: (data: SetPriceUnitPair[]) => void
  currency: string
  priceUnit: PriceUnitType[]
  price: StandardPriceListType
  priceUnitPair: PriceUnitListType[]
}

const SetPriceUnitModal = ({
  onClose,
  onSubmit,
  currency,
  priceUnit,
  price,
  priceUnitPair,
}: Props) => {
  const { closeModal, openModal } = useModal()

  const [priceUnits, setPriceUnits] = useState<PriceUnitType[]>([])
  const [subPriceUnits, setSubPriceUnits] = useState<Array<SubPriceUnitType>>(
    [],
  )

  const [priceUnitOptions, setPriceUnitOptions] =
    useState<PriceUnitType[]>(priceUnit)

  const [subPriceUnitOptions, setSubPriceUnitOptions] = useState<
    Array<SubPriceUnitType>
  >([])

  const handleChange = (event: SyntheticEvent, newValue: PriceUnitType[]) => {
    setPriceUnits(newValue)
  }

  const handleSubPriceUnit = (
    event: SyntheticEvent,
    newValue: CommonPriceUnitType[],
  ) => {
    setSubPriceUnits(newValue)
  }

  const [baseUnitPrice, setBaseUnitPrice] = useState<
    { id: number; price: number }[]
  >([])

  const {
    control,
    handleSubmit,
    reset,
    watch,
    trigger,
    setValue,
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

  const onClickAction = (type: string, data?: SetPriceUnitPair[]) => {
    if (type === 'Discard' || type === 'Cancel') {
      closeModal('setPriceUnitModal')
    } else if (type === 'Save') {
      onSubmit(data!) //추가
      closeModal('setPriceUnitModal')
    }
  }

  const openConfirmModal = (data: SetPriceUnit) => {
    const res: SetPriceUnitPair[] = data.pair.map((value, idx) => ({
      ...value, //추가
      id: idx,
      priceId: uuidv4(), //추가
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

    openModal({
      type: 'saveSetPriceUnitModal',
      children: (
        <PriceActionModal
          onClose={() => closeModal('saveSetPriceUnitModal')}
          onClickAction={() => onClickAction('Save', res)}
          type='Save'
        />
      ),
    })
  }
  const handleRemovePair = (item: CommonPriceUnitType, isBase: boolean) => {
    const idx = pairFields.map(item => item.unitId).indexOf(item.unitId)

    const subUnits = isBase
      ? pairFields
          .filter(data => data.parentPriceUnitId === item.unitId)
          .map(value => value.unitId)
      : []

    const indexes = pairFields.reduce((acc: number[], obj, index) => {
      if (subUnits.find(id => obj.unitId === id)) {
        acc.push(index)
      }
      return acc
    }, [])

    idx !== -1 && remove([idx, ...indexes])

    let arr = priceUnitOptions

    priceUnit
      .filter(value => value.id === item.unitId)
      .map(value => {
        arr.push(value)
      })

    arr = _.sortBy(arr, ['title'])

    setPriceUnitOptions(arr)
  }

  const removePair = (item: CommonPriceUnitType) => {
    if (item.parentPriceUnitId === null) {
      openModal({
        type: 'BasePriceUnitRemoveModal',
        children: (
          <BasePriceUnitRemoveModal
            onClose={() => closeModal('BasePriceUnitRemoveModal')}
            onClickAction={handleRemovePair}
            item={item}
            isBase={item.parentPriceUnitId === null}
          />
        ),
      })
    } else {
      handleRemovePair(item, item.parentPriceUnitId === null)
    }
  }

  const removeSubPair = (
    item: SubPriceUnitType,
    baseIndex: number,
    baseUnitId: number,
    subIndex: number,
  ) => {
    const base = pairFields[baseIndex]
    let subUnits = base.subPriceUnits!

    subUnits.splice(subIndex, 1)

    let arr = subPriceUnitOptions

    priceUnit
      .find(value => value.id === baseUnitId)!
      .subPriceUnits.filter(value => value.id === item.unitId)
      .map(value => {
        arr.push({
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
    arr = _.sortBy(arr, ['unitId'])

    setSubPriceUnitOptions(_.uniqBy(arr, 'unitId'))

    const result = {
      ...base,
      subPriceUnits: subUnits,
    }

    update(baseIndex, result)
    trigger('pair')
  }

  const onClickAddPriceUnit = () => {
    priceUnits.map(value => {
      append({
        unitId: value.id,
        quantity: value.unit === 'Percent' ? '-' : 1,
        price: (1.0).toFixed(1),
        weighting: value.weighting ?? '-',
        title: value.title,
        isBase: value.parentPriceUnitId === null,
        parentPriceUnitId: value.parentPriceUnitId,
        subPriceUnits: value.subPriceUnits.map(value => ({
          unitId: value.id,
          quantity: value.unit === 'Percent' ? '-' : 1,
          price: (1.0 * value.weighting) / 100,
          weighting: value.weighting ?? '-',
          title: value.title,
          isBase: value.parentPriceUnitId === null,
          parentPriceUnitId: value.parentPriceUnitId,
          unit: value.unit,
        })),
        unit: value.unit,
      })
      if (value.parentPriceUnitId === null) {
        setBaseUnitPrice([{ id: value.id, price: 1.0 }])
      }
    })

    const removeUnitsId = priceUnits.map(value => value.id)
    const newArr = priceUnitOptions.filter(
      obj => !removeUnitsId.includes(obj.id),
    )
    setPriceUnitOptions(newArr)
    setPriceUnits([])
  }

  const onClickAddSubPriceUnit = (baseIndex: number) => {
    const basePriceUnit = pairFields[baseIndex]
    let subPriceUnitList = basePriceUnit.subPriceUnits!
    // const addArray = subPriceUnits.map(value => ({}))
    subPriceUnits.map(value => {
      subPriceUnitList.push(value)
    })

    const result = {
      ...basePriceUnit,
      subPriceUnits: subPriceUnitList,
    }

    const removeUnitsId = subPriceUnits.map(value => value.unitId)
    const newArr = subPriceUnitOptions.filter(
      obj => !removeUnitsId.includes(obj.unitId),
    )

    setSubPriceUnits([])
    setSubPriceUnitOptions(newArr)
    update(baseIndex, result)
    trigger('pair')
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

  const onChangeSubPair = (
    baseIndex: number,
    subIndex: number,
    type: 'quantity' | 'price' | 'weighting',
    value: any,
  ) => {
    const base = pairFields[baseIndex]
    let subUnits = base.subPriceUnits
    let sub = base.subPriceUnits![subIndex]

    console.log(price)

    let newVal = { ...sub, [type]: value }
    subUnits![subIndex] = newVal

    const result = {
      ...base,
      subPriceUnits: subUnits,
    }

    update(baseIndex, result)
    trigger('pair')
  }

  useEffect(() => {
    setPriceUnitOptions(priceUnit)
    console.log(priceUnitPair)

    const subUnit = priceUnitPair
      .filter(value => value.parentPriceUnitId !== null)
      .map(data => ({
        unitId: data.priceUnitId,
        priceUnitId: data.priceUnitId,
        isBase: data.parentPriceUnitId === null,
        title: data.title,
        unit: data.unit,
        weighting: data.weighting ?? '-',
        parentPriceUnitId: data.parentPriceUnitId!,
        quantity: data.quantity ?? '-',
        price: data.price,
      }))

    priceUnitPair.map(value => {
      if (value.parentPriceUnitId === null) {
        append({
          id: value.priceUnitId,
          unitId: value.priceUnitId,
          quantity: value.quantity ?? '-',
          price: value.price,
          weighting: value.weighting ?? '-',
          title: value.title,
          isBase: value.parentPriceUnitId === null,
          parentPriceUnitId: value.parentPriceUnitId,
          subPriceUnits: subUnit.filter(
            data => data.parentPriceUnitId === value.priceUnitId,
          ),
          unit: value.unit,
        })
        setBaseUnitPrice(prevState => [
          ...prevState,
          { id: value.priceUnitId, price: Number(value.price) },
        ])
      } else {
        const subOptions = priceUnit
          .map(item => item.subPriceUnits)
          .flat()
          .map(data => {
            return data.id === value.priceUnitId
              ? {
                  unitId: data.id,
                  quantity: data.unit === 'Percent' ? '-' : 1,
                  price: (1.0 * data.weighting! ?? 0) / 100,
                  weighting: data.weighting ?? '-',
                  title: data.title,
                  isBase: data.parentPriceUnitId === null,
                  parentPriceUnitId: data.parentPriceUnitId!,
                  unit: data.unit,
                }
              : null
          })
          .filter(data => data !== null) as {
          unitId: number
          quantity: string | number
          price: string | number
          weighting: string | number
          title: string
          isBase: boolean
          parentPriceUnitId: number
          unit: string
        }[]

        setSubPriceUnitOptions(subOptions)
      }
    })

    const removeUnitsId = priceUnitPair.map(value => value.priceUnitId)
    const newArr = priceUnitOptions.filter(
      obj => !removeUnitsId.includes(obj.id),
    )
    setPriceUnitOptions(newArr)
  }, [priceUnitPair, priceUnit])

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

        <form
          onSubmit={handleSubmit(openConfirmModal)}
          style={{ marginTop: '30px' }}
        >
          <Box
            sx={{
              minHeight: '350px',
              maxHeight: '900px',
              overflow: 'scroll',
              '&::-webkit-scrollbar': {
                display: 'none',
              },
            }}
          >
            {pairFields.length ? (
              pairFields?.map((data, idx) => {
                const currentData = {
                  unitId: data.unitId,
                  quantity: data.quantity,
                  price: data.price,
                  weighting: data.weighting,
                  title: data.title,
                  isBase: data.isBase,
                  parentPriceUnitId: data.parentPriceUnitId,
                  subPriceUnits: data.subPriceUnits,
                  unit: data.unit,
                }
                return (
                  <>
                    <Box key={data.id}>
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
                          {/* @ts-ignore */}
                          {idx === 0
                            ? idx + 1
                            : idx +
                              1 +
                              pairFields
                                .slice(0, idx)
                                .reduce(
                                  (acc, cur) => acc + cur.subPriceUnits!.length,
                                  0,
                                )}
                          .&nbsp;
                          {data.title}
                        </Typography>

                        <IconButton
                          onClick={() => removePair(currentData)}
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
                                          value => value.unitId,
                                        )
                                        console.log(res)

                                        const subUnitIds = res?.map(value => {
                                          return {
                                            index: pairFields[
                                              idx
                                            ].subPriceUnits!.findIndex(
                                              data => data.unitId === value,
                                            ),
                                            weighting: pairFields[
                                              idx
                                            ].subPriceUnits!.find(
                                              data => data.unitId === value,
                                            )?.weighting,
                                          }
                                        })

                                        subUnitIds?.map(value => {
                                          setValue(
                                            `pair.${idx}.subPriceUnits.${value.index}.price`,
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
                                          trigger(
                                            `pair.${idx}.subPriceUnits.${value.index}.price`,
                                          )
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
                                  value={value === 0 ? '-' : value}
                                  disabled={true}
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
                    {data.subPriceUnits?.map((item, index) => {
                      // setSubIndex(data.subPriceUnits!.length + 1)

                      const currentData = {
                        unitId: item.unitId,
                        quantity: item.quantity,
                        price: item.price,
                        weighting: item.weighting,
                        title: item.title,
                        isBase: item.isBase,
                        parentPriceUnitId: item.parentPriceUnitId,

                        unit: item.unit,
                      }
                      return (
                        <Box sx={{ pl: '50px' }} key={uuidv4()}>
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
                                <img
                                  src='/images/icons/price-icons/sub-price-arrow.svg'
                                  alt=''
                                />
                              </Box>
                              {idx === 0
                                ? idx + index + 2
                                : idx +
                                  index +
                                  2 +
                                  pairFields
                                    .slice(0, idx)
                                    .reduce(
                                      (acc, cur) =>
                                        acc + cur.subPriceUnits!.length,
                                      0,
                                    )}
                              .&nbsp;{item.title}
                            </Typography>

                            <IconButton
                              onClick={() =>
                                removeSubPair(
                                  currentData,
                                  idx,
                                  data.unitId!,
                                  index,
                                )
                              }
                              sx={{ padding: 1 }}
                            >
                              <Icon icon='mdi:delete-outline'></Icon>
                            </IconButton>
                          </Box>
                          <Grid container xs={12} spacing={3}>
                            <Grid item xs={4}>
                              <FormControl sx={{ mb: 4 }} fullWidth>
                                <Controller
                                  name={`pair.${idx}.subPriceUnits.${index}.quantity`}
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
                                          onChangeSubPair(
                                            idx,
                                            index,
                                            'quantity',
                                            null,
                                          )
                                        } else {
                                          const filteredValue = value
                                            .replace(
                                              /[^0-9!@#$%^&*()_+{}\[\]:;.,\-\\/]/g,
                                              '',
                                            )
                                            .slice(0, 10)
                                          e.target.value = filteredValue
                                          onChangeSubPair(
                                            idx,
                                            index,
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
                                      <FormHelperText
                                        sx={{ color: 'error.main' }}
                                      >
                                        {errors?.pair[idx]?.quantity?.message}
                                      </FormHelperText>
                                    )
                                  : ''}
                              </FormControl>
                            </Grid>
                            <Grid item xs={4}>
                              <FormControl sx={{ mb: 4 }} fullWidth>
                                <Controller
                                  name={`pair.${idx}.subPriceUnits.${index}.price`}
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

                                          const price = baseUnitPrice.find(
                                            value =>
                                              value.id ===
                                              item.parentPriceUnitId,
                                          )?.price

                                          console.log(filteredValue)

                                          if (!isNaN(Number(filteredValue))) {
                                            setValue(
                                              `pair.${idx}.subPriceUnits.${index}.weighting`,
                                              calculateRoundedRatio(
                                                price!,
                                                Number(filteredValue),
                                              ),
                                            )

                                            // trigger(
                                            //   `pair.${idx}.subPriceUnits.${index}.weighting`,
                                            // )
                                          }
                                          // e.target.value = filteredValue

                                          onChange(filteredValue)
                                        }
                                      }}
                                      onBlur={e => {
                                        const { value } = e.target
                                        if (value === '') {
                                          onChangeSubPair(
                                            idx,
                                            index,
                                            'price',
                                            null,
                                          )
                                        } else {
                                          const filteredValue = value
                                            .replace(
                                              /[^0-9!@#$%^&*()_+{}\[\]:;.,\-\\/]/g,
                                              '',
                                            )
                                            .slice(0, 10)

                                          onChangeSubPair(
                                            idx,
                                            index,
                                            'price',
                                            filteredValue,
                                          )
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
                                      <FormHelperText
                                        sx={{ color: 'error.main' }}
                                      >
                                        {errors?.pair[idx]?.price?.message}
                                      </FormHelperText>
                                    )
                                  : ''}
                              </FormControl>
                            </Grid>
                            <Grid item xs={4}>
                              <FormControl sx={{ mb: 4 }} fullWidth>
                                <Controller
                                  name={`pair.${idx}.subPriceUnits.${index}.weighting`}
                                  control={control}
                                  render={({
                                    field: { onChange, value, onBlur },
                                  }) => (
                                    <Input
                                      id='icons-start-adornment'
                                      label='Weighting(%)*'
                                      value={value === 0 ? '-' : value}
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
                                              value.id ===
                                              item.parentPriceUnitId,
                                          )?.price

                                          console.log(price)

                                          if (!isNaN(Number(e.target.value))) {
                                            setValue(
                                              `pair.${idx}.subPriceUnits.${index}.price`,
                                              Number(
                                                (
                                                  price! *
                                                  (Number(e.target.value) / 100)
                                                )
                                                  .toString()
                                                  .slice(0, 10),
                                              ),
                                            )

                                            // trigger(
                                            //   `pair.${idx}.subPriceUnits.${index}.price`,
                                            // )
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
                                          onChangeSubPair(
                                            idx,
                                            index,
                                            'weighting',
                                            null,
                                          )
                                        } else {
                                          const filteredValue = value
                                            .replace(
                                              /[^0-9!@#$%^&*()_+{}\[\]:;.,\-\\/]/g,
                                              '',
                                            )
                                            .slice(0, 10)

                                          onChangeSubPair(
                                            idx,
                                            index,
                                            'weighting',
                                            filteredValue,
                                          )
                                        }
                                      }}
                                    />
                                  )}
                                />
                                {/* {errors.pair?.length
                                  ? errors.pair[idx]?.subPriceUnits![index]
                                      ?.weighting && (
                                      <FormHelperText
                                        sx={{ color: 'error.main' }}
                                      >
                                        {errors?.pair[idx]?.weighting?.message}
                                      </FormHelperText>
                                    )
                                  : ''} */}
                              </FormControl>
                            </Grid>
                          </Grid>
                        </Box>
                      )
                    })}
                    {priceUnit[idx]?.subPriceUnits?.length !==
                      data.subPriceUnits!.length && (
                      <Box
                        sx={{
                          display: 'flex',
                          gap: '20px',
                          alignItems: 'center',
                          mb: '30px',
                          ml: '50px',
                        }}
                      >
                        <Autocomplete
                          multiple
                          fullWidth
                          onChange={handleSubPriceUnit}
                          value={subPriceUnits.filter(
                            value => value.parentPriceUnitId === data.unitId,
                          )}
                          isOptionEqualToValue={(option, newValue) => {
                            return option.unitId === newValue.unitId
                          }}
                          disableCloseOnSelect
                          limitTags={2}
                          options={subPriceUnitOptions.filter(
                            value => value.parentPriceUnitId === data.unitId,
                          )}
                          id='priceUnit'
                          getOptionLabel={option => option.title}
                          renderInput={params => (
                            <TextField {...params} label='Price unit' />
                          )}
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
                          onClick={() => onClickAddSubPriceUnit(idx)}
                          disabled={
                            subPriceUnits.filter(
                              value => value.parentPriceUnitId === data.unitId,
                            ).length === 0
                          }
                        >
                          Add
                        </Button>
                      </Box>
                    )}
                  </>
                )
              })
            ) : (
              <Box
                sx={{
                  height: '350px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
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
                disabled={
                  pairFields.some(item => {
                    return (
                      (!item.weighting && item.weighting !== 0) ||
                      !item.quantity ||
                      !item.price
                    )
                  }) || pairFields.length === 0
                }
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
