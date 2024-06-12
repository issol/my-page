import { Box, Button, Checkbox, Grid, Typography } from '@mui/material'
import Dialog from '@mui/material/Dialog'

import DialogContent from '@mui/material/DialogContent'
import Autocomplete from '@mui/material/Autocomplete'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import { Controller, Resolver, useForm } from 'react-hook-form'
import FormHelperText from '@mui/material/FormHelperText'
import { AddPriceType } from '@src/types/company/standard-client-prices'
import { CategoryList } from '@src/shared/const/category/categories'
import {
  ServiceTypeList,
  ServiceTypePair,
} from '@src/shared/const/service-type/service-types'
import { CurrencyList } from '@src/shared/const/currency/currency'
import { CatBasisList } from '@src/shared/const/catBasis/cat-basis'
import {
  RoundingProcedureList,
  RoundingProcedureObj,
  RoundingProcedureObjReversed,
} from '@src/shared/const/rounding-procedure/rounding-procedure'

import { yupResolver } from '@hookform/resolvers/yup'
import { standardPricesSchema } from '@src/types/schema/standard-prices.schema'
import { FormErrors } from '@src/shared/const/formErrors'
import { StandardPriceListType } from '@src/types/common/standard-price'
import PriceActionModal from '../../standard-prices-modal/modal/price-action-modal'
import useModal from '@src/hooks/useModal'
import { useGetStandardPrices } from '@src/queries/company/standard-price'

// ** Icon Imports
import Icon from '@src/@core/components/icon'

import CopyPriceModal from './copy-price-modal'
import { Currency } from '@src/types/common/currency.type'

const defaultValue = {
  priceName: '',
  category: undefined,
  serviceType: undefined,
  currency: { label: '$ USD', value: 'USD' as Currency },
  catBasis: { label: 'Words', value: 'Words' },
  decimalPlace: 2,
  roundingProcedure: undefined,
  memoForPrice: '',
}

type Props = {
  open: boolean
  onClose: any
  type: 'Edit' | 'Add'
  selectedPriceData?: StandardPriceListType
  setPriceList: Dispatch<SetStateAction<[] | StandardPriceListType[]>>
  onSubmit: (data: AddPriceType, modalType: string) => void
  onClickAction: (type: string) => void
}

const AddSavePriceModal = ({
  open,
  onClose,
  type,
  selectedPriceData,
  onSubmit,
  setPriceList,
  onClickAction,
}: Props) => {
  const { closeModal, openModal } = useModal()
  const [serviceTypeList, setServiceTypeList] = useState(ServiceTypeList)

  function getKeyByValue<T extends { [key: string]: string }>(
    object: T,
    value: string,
  ): keyof T | undefined {
    return Object.keys(object).find(key => object[key] === value) as
      | keyof T
      | undefined
  }

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setError,
    trigger,
    getValues,
    setValue,
    formState: { errors, dirtyFields, isValid },
  } = useForm<AddPriceType>({
    mode: 'onChange',
    defaultValues: defaultValue,
    resolver: yupResolver(
      standardPricesSchema,
    ) as unknown as Resolver<AddPriceType>,
  })
  const {
    data: standardPrices,
    isLoading,
    refetch,
  } = useGetStandardPrices('client', { take: 1000, skip: 0 })
  const [selected, setSelected] = useState<StandardPriceListType | null>(null)
  const setValueOptions = { shouldDirty: true, shouldValidate: true }

  const resetData = () => {
    reset({
      priceName: '',
      category: undefined,
      serviceType: undefined,
      currency: { label: '$ USD', value: 'USD' },
      catBasis: { label: 'Words', value: 'Words' },
      decimalPlace: undefined,
      roundingProcedure: undefined,
      memoForPrice: '',
    })
  }

  useEffect(() => {
    if (selectedPriceData) {
      setSelected(selectedPriceData)
    }
  }, [selectedPriceData])

  useEffect(() => {
    if (selected) {
      setValue('priceName', selected.priceName, setValueOptions)

      setValue(
        'category',
        {
          label: selected.category,
          value: selected.category,
        },
        setValueOptions,
      )

      setValue(
        'serviceType',
        selected.serviceType.map(
          value => ({
            label: value,
            value: value,
          }),
          setValueOptions,
        ),
      )
      setValue(
        'currency',
        {
          label:
            selected.currency === 'USD'
              ? '$ USD'
              : selected.currency === 'KRW'
                ? '₩ KRW'
                : selected.currency === 'JPY'
                  ? '¥ JPY'
                  : selected.currency === 'SGD'
                    ? '$ SGD'
                    : '',
          value: selected.currency! ?? 'KRW',
        },
        setValueOptions,
      )
      setValue(
        'catBasis',
        {
          label: selected.catBasis!,
          value: selected.catBasis!,
        },
        setValueOptions,
      )
      setValue('decimalPlace', selected.decimalPlace)
      setValue('memoForPrice', selected?.memoForPrice ?? '', setValueOptions)

      const roundingLabel =
        //@ts-ignore
        RoundingProcedureObjReversed[Number(selected.roundingProcedure)]
      //@ts-ignore
      const roundingValue = RoundingProcedureObj[selected.roundingProcedure]
      setValue(
        'roundingProcedure',
        {
          label: roundingLabel ?? selected.roundingProcedure,
          value: roundingValue ?? selected.roundingProcedure,
        },
        setValueOptions,
      )
    }
  }, [selected])

  function openCopyPriceModal() {
    openModal({
      type: 'copy-price',
      children: (
        <CopyPriceModal
          list={standardPrices ?? { data: [], count: 0 }}
          open={true}
          onSubmit={onAddCopiedPrice}
          onClose={() => closeModal('copy-price')}
        />
      ),
    })
  }

  function onAddCopiedPrice(data: StandardPriceListType) {
    setSelected(data)
  }

  return (
    <Dialog
      open={open}
      keepMounted
      fullWidth
      onClose={() => {
        resetData()
        onClose()
      }}
      maxWidth='md'
    >
      <DialogContent
        sx={{
          padding: '50px',
          position: 'relative',
        }}
      >
        {type === 'Add' ? (
          <Box
            display='flex'
            alignItems='center'
            justifyContent='space-between'
            mb='30px'
          >
            <Typography variant='h5'>Add new price</Typography>
            <Button
              variant='outlined'
              startIcon={<Icon icon='ic:baseline-file-download' />}
              onClick={openCopyPriceModal}
            >
              Copy price
            </Button>
          </Box>
        ) : null}
        <form
          noValidate
          autoComplete='off'
          onSubmit={handleSubmit(data => {
            // console.log('handleSubmit', data)
            // console.log(type)
            if (selected) {
              const finalData: StandardPriceListType = {
                ...selected,
                id: type === 'Edit' ? selected.id : Math.random(),
                isStandard: false,
                priceName: data.priceName,
                category: data?.category.value,
                serviceType: data?.serviceType.map(value => value.value),
                currency: data?.currency.value,
                catBasis: data?.catBasis!.value,
                decimalPlace: data?.decimalPlace,
                roundingProcedure: data?.roundingProcedure.value.toString(),
                memoForPrice: data?.memoForPrice,
              }
              if (type === 'Edit') {
                setPriceList(prev => {
                  const idx = prev.map(item => item.id).indexOf(selected.id)
                  const data = [...prev]
                  data[idx] = finalData
                  return data
                })
              } else {
                setPriceList(prev => [...prev, finalData])
              }

              onClose()
            } else onSubmit(data, type)
          })}
        >
          <Grid container xs={12} spacing={6}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='priceName'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <TextField
                      value={value || ''}
                      autoComplete='off'
                      onBlur={onBlur}
                      label='Price name*'
                      onChange={onChange}
                      inputProps={{ maxLength: 200 }}
                      error={Boolean(errors.priceName)}
                      // placeholder='Price name*'
                    />
                  )}
                />
                {errors.priceName && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    {errors.priceName.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <Controller
                control={control}
                name='category'
                render={({ field: { onChange, value } }) => (
                  <Autocomplete
                    fullWidth
                    isOptionEqualToValue={(option, newValue) => {
                      return option.value === newValue.value
                    }}
                    onChange={(event, item) => {
                      onChange(item)
                      if (item) {
                        // @ts-ignore
                        const res = ServiceTypePair[item.value]
                        trigger('serviceType')
                        setServiceTypeList(res)
                      }
                    }}
                    value={value || { label: '', value: '' }}
                    options={CategoryList}
                    id='category'
                    getOptionLabel={option => option.label}
                    renderInput={params => (
                      <TextField
                        {...params}
                        autoComplete='off'
                        label='Category*'
                        error={watch('category') === null}
                      />
                    )}
                  />
                )}
              />
              {watch('category') === null && (
                <FormHelperText sx={{ color: 'error.main' }}>
                  {FormErrors.required}
                </FormHelperText>
              )}
            </Grid>
            <Grid item xs={6}>
              <Controller
                control={control}
                name='serviceType'
                render={({ field: { onChange, value } }) => (
                  <Autocomplete
                    fullWidth
                    multiple
                    disableCloseOnSelect
                    isOptionEqualToValue={(option, newValue) => {
                      return option.value === newValue.value
                    }}
                    onChange={(event, item) => {
                      onChange(item)

                      // ServiceTypePair
                    }}
                    value={value || []}
                    options={serviceTypeList}
                    id='ServiceType'
                    limitTags={1}
                    disabled={
                      watch('category') === null ||
                      watch('category') === undefined
                    }
                    getOptionLabel={option => option.label}
                    renderInput={params => (
                      <TextField
                        {...params}
                        autoComplete='off'
                        label='Service type*'
                        disabled={
                          watch('category') === null ||
                          watch('category') === undefined
                        }
                        error={
                          watch('serviceType') &&
                          watch('serviceType').length === 0
                        }
                      />
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
              {watch('serviceType') && watch('serviceType').length === 0 && (
                <FormHelperText sx={{ color: 'error.main' }}>
                  {FormErrors.required}
                </FormHelperText>
              )}
            </Grid>
            <Grid item xs={6}>
              <Controller
                control={control}
                name='currency'
                render={({ field: { onChange, value } }) => (
                  <Autocomplete
                    fullWidth
                    isOptionEqualToValue={(option, newValue) => {
                      return option.value === newValue.value
                    }}
                    onChange={(event, item) => {
                      onChange(item)
                      if (item) {
                        if (item.value === 'KRW' || item.value === 'JPY') {
                          setValue('decimalPlace', 1000)
                          trigger('decimalPlace')
                        } else {
                          setValue('decimalPlace', 2)
                          trigger('decimalPlace')
                        }
                      }
                    }}
                    value={value || { label: '', value: '' }}
                    defaultValue={CurrencyList[0]}
                    options={CurrencyList}
                    id='Currency'
                    getOptionLabel={option => option.label}
                    renderInput={params => (
                      <TextField
                        {...params}
                        autoComplete='off'
                        label='Currency*'
                        error={watch('currency') === null}
                      />
                    )}
                  />
                )}
              />
              {watch('currency') === null && (
                <FormHelperText sx={{ color: 'error.main' }}>
                  {FormErrors.required}
                </FormHelperText>
              )}
            </Grid>
            <Grid item xs={6}>
              <Controller
                control={control}
                name='catBasis'
                render={({ field: { onChange, value } }) => (
                  <Autocomplete
                    fullWidth
                    isOptionEqualToValue={(option, newValue) => {
                      return option.value === newValue.value
                    }}
                    onChange={(event, item) => {
                      onChange(item)
                    }}
                    value={value || { value: '', label: '' }}
                    defaultValue={{ label: 'Words', value: 'Words' }}
                    options={CatBasisList}
                    id='CAT Basis'
                    getOptionLabel={option => option.label}
                    renderInput={params => (
                      <TextField
                        {...params}
                        autoComplete='off'
                        label='CAT calculation basis'
                      />
                    )}
                  />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <Controller
                  name='decimalPlace'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <TextField
                      value={value || null}
                      autoComplete='off'
                      onBlur={onBlur}
                      label={
                        watch('currency').value === 'USD' ||
                        watch('currency').value === 'SGD'
                          ? 'Number of decimal places*'
                          : watch('currency').value === 'KRW' ||
                              watch('currency').value === 'JPY'
                            ? 'Place value*'
                            : ''
                      }
                      onChange={e => {
                        const { value } = e.target
                        if (value === '') {
                          onChange(null)
                        } else {
                          const filteredValue = value
                            .replace(/[^0-9]/g, '')
                            .slice(
                              0,
                              watch('currency').value === 'USD' ||
                                watch('currency').value === 'SGD'
                                ? 1
                                : watch('currency').value === 'KRW' ||
                                    watch('currency').value === 'JPY'
                                  ? 10
                                  : 0,
                            )
                          e.target.value = filteredValue
                          onChange(e.target.value)
                        }
                      }}
                      error={Boolean(errors.decimalPlace)}
                      placeholder={
                        watch('currency').value === 'USD' ||
                        watch('currency').value === 'SGD'
                          ? '2'
                          : watch('currency').value === 'KRW' ||
                              watch('currency').value === 'JPY'
                            ? '1000'
                            : ''
                      }
                    />
                  )}
                />
                {errors.decimalPlace && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    {errors.decimalPlace.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <Controller
                control={control}
                rules={{ required: true }}
                name='roundingProcedure'
                render={({ field: { onChange, value } }) => (
                  <Autocomplete
                    fullWidth
                    isOptionEqualToValue={(option, newValue) => {
                      return option.label === newValue.label
                    }}
                    onChange={(event, item) => {
                      onChange(item)
                    }}
                    value={value || { value: null, label: '' }}
                    options={RoundingProcedureList}
                    id='RoundingProcedure'
                    getOptionLabel={option => option.label}
                    renderInput={params => (
                      <TextField
                        {...params}
                        autoComplete='off'
                        label='Rounding procedure*'
                        error={watch('roundingProcedure') === null}
                      />
                    )}
                  />
                )}
              />
              {watch('roundingProcedure') === null && (
                <FormHelperText sx={{ color: 'error.main' }}>
                  {FormErrors.required}
                </FormHelperText>
              )}
            </Grid>
            <Grid item xs={12}>
              <Typography variant='h5' sx={{ mb: '30px' }}>
                Memo for price
              </Typography>
              <Controller
                control={control}
                name='memoForPrice'
                render={({ field: { onChange, value } }) => (
                  <TextField
                    fullWidth
                    autoComplete='off'
                    rows={4}
                    multiline
                    value={value}
                    onChange={event => {
                      onChange(event.target.value)
                    }}
                    inputProps={{ maxLength: 500 }}
                    placeholder='Write down some information to keep in mind about this price.'
                  />
                )}
              />

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  fontSize: '12px',
                  lineHeight: '25px',
                  color: '#888888',
                }}
              >
                {watch('memoForPrice')?.length ?? 0}/500
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box display='flex' justifyContent='center' gap='15px'>
                <Button
                  variant='outlined'
                  size='medium'
                  color='secondary'
                  type='button'
                  onClick={() => {
                    openModal({
                      type: `${type}Price${
                        type === 'Edit' ? 'Cancel' : 'Discard'
                      }Modal`,
                      children: (
                        <PriceActionModal
                          priceData={getValues()}
                          onClose={() =>
                            closeModal(
                              `${type}Price${
                                type === 'Edit' ? 'Cancel' : 'Discard'
                              }Modal`,
                            )
                          }
                          type={type === 'Edit' ? 'Cancel' : 'Discard'}
                          onClickAction={() => {
                            if (type === 'Edit') {
                              closeModal(
                                `${type}Price${
                                  type === 'Edit' ? 'Cancel' : 'Discard'
                                }Modal`,
                              )
                            }
                            onClickAction(
                              type === 'Edit' ? 'Cancel' : 'Discard',
                            )
                          }}
                        />
                      ),
                    })
                  }}
                >
                  {type === 'Edit' ? 'Cancel' : 'Discard'}
                </Button>
                <Button
                  variant='contained'
                  size='medium'
                  type='submit'
                  disabled={!isValid}
                >
                  {type === 'Edit' ? 'Save' : 'Add'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default AddSavePriceModal
