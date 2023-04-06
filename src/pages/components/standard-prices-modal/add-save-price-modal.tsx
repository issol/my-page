import { Box, Button, Checkbox, Grid, Typography } from '@mui/material'
import Dialog from '@mui/material/Dialog'

import DialogContent from '@mui/material/DialogContent'
import Autocomplete from '@mui/material/Autocomplete'
import { ModalContext } from '@src/context/ModalContext'
import { useContext } from 'react'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import {
  Control,
  Controller,
  FieldErrors,
  UseFormGetValues,
  UseFormWatch,
} from 'react-hook-form'
import FormHelperText from '@mui/material/FormHelperText'
import { AddPriceType } from '@src/types/company/standard-client-prices'
import { CategoryList } from '@src/shared/const/category/categories'
import { JobList } from '@src/shared/const/job/jobs'
import { ServiceTypeList } from '@src/shared/const/service-type/service-types'
import { CurrencyList } from '@src/shared/const/currency/currency'
import { CatBasisList } from '@src/shared/const/catBasis/cat-basis'
import { RoundingProcedureList } from '@src/shared/const/rounding-procedure/rounding-procedure'
import { useForm } from 'react-hook-form'

import { yupResolver } from '@hookform/resolvers/yup'
import { standardPricesSchema } from '@src/types/schema/standard-prices.schema'
import { FormErrors } from '@src/shared/const/formErrors'

type Props = {
  type: string

  memoForPrice: string
}

const defaultValue = {
  priceName: '',
  category: undefined,
  serviceType: [],
  currency: { label: '$ USD', value: 'USD' },
  catBasis: { label: 'Words', value: 'Words' },
  decimalPlace: undefined,
  roundingProcedure: undefined,
  memoForPrice: '',
}

const AddSavePriceModal = ({
  type,

  memoForPrice,
}: Props) => {
  const { setModal } = useContext(ModalContext)
  const {
    control,
    handleSubmit,
    reset,
    watch,
    setError,
    trigger,
    getValues,
    formState: { errors, dirtyFields, isValid },
  } = useForm<AddPriceType>({
    mode: 'onBlur',
    defaultValues: defaultValue,
    resolver: yupResolver(standardPricesSchema),
  })

  const onSubmit = (data: AddPriceType) => {
    console.log(data)
  }

  console.log(errors)
  console.log(watch('serviceType'))

  console.log(isValid)

  const resetData = () => {
    reset({
      priceName: '',
      category: { label: '', value: '' },
      serviceType: [],
      currency: { label: '', value: '' },
      catBasis: { label: '', value: '' },
      decimalPlace: undefined,
      roundingProcedure: { label: '', value: '' },
      memoForPrice: '',
    })
  }

  return (
    <Dialog
      open={true}
      keepMounted
      fullWidth
      onClose={() => {
        setModal(null)
        resetData()
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
                    }}
                    value={value}
                    options={ServiceTypeList}
                    id='ServiceType'
                    limitTags={1}
                    getOptionLabel={option => option.label}
                    renderInput={params => (
                      <TextField
                        {...params}
                        label='Service type*'
                        error={watch('serviceType').length === 0}
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
              {watch('serviceType').length === 0 && (
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
                >
                  Discard
                </Button>
                <Button
                  variant='contained'
                  size='medium'
                  type='submit'
                  disabled={!isValid}
                >
                  {type}
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
