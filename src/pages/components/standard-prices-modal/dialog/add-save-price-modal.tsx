import { Box, Button, Checkbox, Grid, Typography } from '@mui/material'
import Dialog from '@mui/material/Dialog'

import DialogContent from '@mui/material/DialogContent'
import Autocomplete from '@mui/material/Autocomplete'
import { ModalContext } from '@src/context/ModalContext'
import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import {
  Control,
  Controller,
  FieldErrors,
  UseFormGetValues,
  UseFormHandleSubmit,
  UseFormSetValue,
  UseFormTrigger,
  UseFormWatch,
} from 'react-hook-form'
import FormHelperText from '@mui/material/FormHelperText'
import { AddPriceType } from '@src/types/company/standard-client-prices'
import { CategoryList } from '@src/shared/const/category/categories'
import { JobList } from '@src/shared/const/job/jobs'
import {
  ServiceTypeList,
  ServiceTypePair,
} from '@src/shared/const/service-type/service-types'
import { CurrencyList } from '@src/shared/const/currency/currency'
import { CatBasisList } from '@src/shared/const/catBasis/cat-basis'
import { RoundingProcedureList } from '@src/shared/const/rounding-procedure/rounding-procedure'
import { useForm } from 'react-hook-form'

import { yupResolver } from '@hookform/resolvers/yup'
import { standardPricesSchema } from '@src/types/schema/standard-prices.schema'
import { FormErrors } from '@src/shared/const/formErrors'
import { StandardPriceListType } from '@src/types/common/standard-price'
import { ServiceType } from '@src/shared/const/service-type/service-type.enum'
import PriceActionModal from '../modal/price-action-modal'
import useModal from '@src/hooks/useModal'

const defaultValue = {
  priceName: '',
  category: undefined,
  serviceType: undefined,
  currency: { label: '$ USD', value: 'USD' },
  catBasis: { label: 'Words', value: 'Words' },
  decimalPlace: undefined,
  roundingProcedure: undefined,
  memoForPrice: '',
}

type Props = {
  open: boolean
  onClose: any
  type: string
  selectedPriceData?: StandardPriceListType

  onSubmit: (data: AddPriceType) => void

  setServiceTypeList: Dispatch<
    SetStateAction<
      {
        label: ServiceType
        value: ServiceType
      }[]
    >
  >
  serviceTypeList: {
    label: ServiceType
    value: ServiceType
  }[]
  onClickAction: (type: string) => void
}

const AddSavePriceModal = ({
  open,
  onClose,
  type,
  selectedPriceData,
  setServiceTypeList,

  onSubmit,
  serviceTypeList,
  onClickAction,
}: Props) => {
  const { setModal } = useContext(ModalContext)
  const { closeModal, openModal } = useModal()
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
    mode: 'onBlur',
    defaultValues: defaultValue,
    resolver: yupResolver(standardPricesSchema),
  })

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
    if (type === 'Edit' && selectedPriceData) {
      setValue('priceName', selectedPriceData.priceName)

      setValue('category', {
        label: selectedPriceData.category,
        value: selectedPriceData.category,
      })

      setValue(
        'serviceType',
        selectedPriceData.serviceType.map(value => ({
          label: value,
          value: value,
        })),
      )
      setValue('currency', {
        label:
          selectedPriceData.currency === 'USD'
            ? '$ USD'
            : selectedPriceData.currency === 'KRW'
            ? '₩ KRW'
            : selectedPriceData.currency === 'JPY'
            ? '¥ JPY'
            : selectedPriceData.currency === 'SGD'
            ? '$ SGD'
            : '',
        value: selectedPriceData.currency,
      })
      setValue('catBasis', {
        label: selectedPriceData.catBasis,
        value: selectedPriceData.catBasis,
      })
      setValue('decimalPlace', selectedPriceData.decimalPlace)
      setValue('roundingProcedure', {
        label: selectedPriceData.roundingProcedure,
        value: selectedPriceData.roundingProcedure,
      })
      setValue('memoForPrice', selectedPriceData.memoForPrice)
    }
  }, [type, selectedPriceData])
  return (
    <Dialog
      open={open}
      keepMounted
      fullWidth
      onClose={() => {
        resetData()
        // setModal(null)
        onClose()
      }}
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
        {type === 'Add' ? (
          <Typography variant='h5' sx={{ mb: '30px' }}>
            Add new price
          </Typography>
        ) : null}
        <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
          <Grid container xs={12} spacing={6}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='priceName'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <TextField
                      value={value}
                      onBlur={onBlur}
                      label='Price name*'
                      onChange={onChange}
                      inputProps={{ maxLength: 50 }}
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
                        setServiceTypeList(res)
                        trigger('serviceType')
                      }
                    }}
                    value={value}
                    options={CategoryList}
                    id='category'
                    getOptionLabel={option => option.label}
                    renderInput={params => (
                      <TextField
                        {...params}
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
                    value={value}
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
                    }}
                    value={value}
                    defaultValue={CurrencyList[0]}
                    options={CurrencyList}
                    id='Currency'
                    getOptionLabel={option => option.label}
                    renderInput={params => (
                      <TextField
                        {...params}
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
                    value={value}
                    defaultValue={{ label: 'Words', value: 'Words' }}
                    options={CatBasisList}
                    id='CAT Basis'
                    getOptionLabel={option => option.label}
                    renderInput={params => (
                      <TextField {...params} label='CAT calculation basis' />
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
                      value={value}
                      onBlur={onBlur}
                      label='Number of decimal places*'
                      onChange={onChange}
                      // inputProps={{ maxLength: 50 }}
                      error={Boolean(errors.decimalPlace)}
                      // placeholder='Number of decimal places*'
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
                      return option.value === newValue.value
                    }}
                    onChange={(event, item) => {
                      onChange(item)
                    }}
                    value={value}
                    options={RoundingProcedureList}
                    id='RoundingProcedure'
                    getOptionLabel={option => option.label}
                    renderInput={params => (
                      <TextField
                        {...params}
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
                    // setPriceActionModalOpen(true)
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
                          onClickAction={onClickAction}
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
