import { Fragment } from 'react'

// ** style components
import { Icon } from '@iconify/react'
import {
  Autocomplete,
  Box,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
  Typography,
} from '@mui/material'
import styled from 'styled-components'
import { v4 as uuidv4 } from 'uuid'

// ** values
import { countries } from 'src/@fake-db/autocomplete'
import { TaxInfo } from '@src/shared/const/tax/tax-info'

// ** apis
import { useGetInvoicePayableStatus } from '@src/queries/invoice/common.query'

// ** helpers
import { getGmtTimeEng } from '@src/shared/helpers/timezone.helper'

// ** types & schema
import {
  InvoicePayableDetailType,
  PayableFormType,
} from '@src/types/invoice/payable.type'
import { CountryType } from '@src/types/sign/personalInfoTypes'

// ** Third Party Imports
import DatePicker from 'react-datepicker'

// ** Custom Component Imports
import CustomInput from '@src/views/forms/form-elements/pickers/PickersCustomInput'

// ** react hook form
import { Control, Controller, FieldError, FieldErrors } from 'react-hook-form'

// ** components
import InformationModal from '@src/@core/components/common-modal/information-modal'

// ** hooks
import useModal from '@src/hooks/useModal'

type Props = {
  data: InvoicePayableDetailType | undefined
  control: Control<PayableFormType, any>
  errors: FieldErrors<PayableFormType>
  isAccountManager: boolean
}
export default function InvoiceDetailInfoForm({
  data,
  control,
  errors,
  isAccountManager,
}: Props) {
  const { openModal, closeModal } = useModal()

  const { data: statusList, isLoading } = useGetInvoicePayableStatus()

  function renderErrorMsg(errors: FieldError | undefined) {
    return (
      <>
        {errors && (
          <FormHelperText sx={{ color: 'error.main' }}>
            {errors?.message}
          </FormHelperText>
        )}
      </>
    )
  }

  return (
    <Fragment>
      <Grid item xs={12}>
        <Box display='flex' alignItems='center'>
          <Typography fontSize={16} fontWeight={400}>
            Payment due
          </Typography>
          <IconButton
            onClick={() => {
              openModal({
                type: 'paymentInfo',
                children: (
                  <InformationModal
                    onClose={() => closeModal('paymentInfo')}
                    title='Payment due information'
                    subtitle='The minimum price has been applied to the item(s).'
                    vary='info'
                  />
                ),
              })
            }}
          >
            <Icon icon='material-symbols:info-outline' />
          </IconButton>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={6}>
        <TextField
          fullWidth
          disabled
          value={data?.invoicedAt}
          label='Invoice date*'
          placeholder='Invoice date*'
        />
      </Grid>

      <Grid item xs={6}>
        <TextField
          fullWidth
          disabled
          value={getGmtTimeEng(data?.invoicedAtTimezone?.code)}
          label='Time zone*'
          placeholder='Time zone*'
        />
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={6}>
        <Controller
          name='invoiceStatus'
          control={control}
          render={({ field: { value, onChange } }) => (
            <Autocomplete
              autoHighlight
              fullWidth
              disabled={isAccountManager}
              options={statusList || []}
              onChange={(e, v) => {
                onChange(v?.statusName ?? '')
              }}
              value={
                statusList?.find(item => item.statusName === value) ?? {
                  id: 0,
                  statusName: '',
                }
              }
              getOptionLabel={option => option.statusName}
              renderInput={params => (
                <TextField
                  {...params}
                  error={Boolean(errors.invoiceStatus)}
                  label='Status*'
                  placeholder='Status*'
                />
              )}
            />
          )}
        />
        {renderErrorMsg(errors.invoiceStatus)}
      </Grid>
      <Grid item xs={6}>
        <TextField
          fullWidth
          disabled
          value={data?.pro?.name}
          label='Pro*'
          placeholder='Pro*'
        />
      </Grid>
      <Grid item xs={6}>
        <Controller
          name='taxInfo'
          control={control}
          render={({ field: { value, onChange } }) => (
            <Autocomplete
              autoHighlight
              fullWidth
              options={TaxInfo}
              onChange={(e, v) => {
                onChange(v?.value ?? '')
              }}
              value={TaxInfo?.find(item => item.value === value) || null}
              getOptionLabel={option => option.label}
              renderInput={params => (
                <TextField
                  {...params}
                  error={Boolean(errors.taxInfo)}
                  label='Tax info*'
                  placeholder='Tax info*'
                />
              )}
            />
          )}
        />
        {renderErrorMsg(errors?.taxInfo)}
      </Grid>

      <Grid item xs={6}>
        <Controller
          name='taxRate'
          control={control}
          render={({ field: { value, onChange } }) => (
            <FormControl fullWidth error={Boolean(errors.tax)}>
              <InputLabel>Tax rate*</InputLabel>
              <OutlinedInput
                value={value ?? ''}
                error={Boolean(errors.tax)}
                onChange={e => {
                  if (e.target.value.length > 10) return
                  onChange(e)
                }}
                type='number'
                label='Tax rate*'
                endAdornment={<InputAdornment position='end'>%</InputAdornment>}
              />
            </FormControl>
          )}
        />
        {renderErrorMsg(errors.tax)}
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>

      <Grid item xs={6}>
        <Controller
          name='payDueAt'
          control={control}
          render={({ field: { value, onChange } }) => (
            <FullWidthDatePicker
              disabled={isAccountManager}
              showTimeSelect
              timeFormat='HH:mm'
              timeIntervals={30}
              selected={!value ? null : new Date(value)}
              dateFormat='MM/dd/yyyy h:mm aa'
              onChange={onChange}
              customInput={<CustomInput label='Payment due' icon='calendar' />}
            />
          )}
        />
        {renderErrorMsg(errors?.payDueAt)}
      </Grid>
      <Grid item xs={6}>
        <Controller
          name='payDueTimezone'
          control={control}
          render={({ field }) => (
            <Autocomplete
              autoHighlight
              fullWidth
              disabled={isAccountManager}
              {...field}
              value={
                !field.value ? { code: '', phone: '', label: '' } : field.value
              }
              options={countries as CountryType[]}
              onChange={(e, v) => field.onChange(v)}
              getOptionLabel={option => getGmtTimeEng(option.code) ?? ''}
              renderOption={(props, option) => (
                <Box component='li' {...props} key={uuidv4()}>
                  {getGmtTimeEng(option.code)}
                </Box>
              )}
              renderInput={params => (
                <TextField
                  {...params}
                  label='Time zone'
                  error={Boolean(errors?.payDueTimezone)}
                  inputProps={{
                    ...params.inputProps,
                  }}
                />
              )}
            />
          )}
        />
        {renderErrorMsg(errors?.payDueTimezone?.code)}
      </Grid>
      <Grid item xs={6}>
        <Controller
          name='paidAt'
          control={control}
          render={({ field: { value, onChange } }) => (
            <FullWidthDatePicker
              showTimeSelect
              timeFormat='HH:mm'
              timeIntervals={30}
              selected={!value ? null : new Date(value)}
              dateFormat='MM/dd/yyyy h:mm aa'
              onChange={onChange}
              customInput={<CustomInput label='Payment date' icon='calendar' />}
            />
          )}
        />
        {renderErrorMsg(errors?.paidAt)}
      </Grid>
      <Grid item xs={6}>
        <Controller
          name='paidDateTimezone'
          control={control}
          render={({ field }) => (
            <Autocomplete
              autoHighlight
              fullWidth
              {...field}
              value={
                !field.value ? { code: '', phone: '', label: '' } : field.value
              }
              options={countries as CountryType[]}
              onChange={(e, v) => field.onChange(v)}
              getOptionLabel={option => getGmtTimeEng(option.code) ?? ''}
              renderOption={(props, option) => (
                <Box component='li' {...props} key={uuidv4()}>
                  {getGmtTimeEng(option.code)}
                </Box>
              )}
              renderInput={params => (
                <TextField
                  {...params}
                  label='Time zone'
                  error={Boolean(errors?.paidDateTimezone)}
                  inputProps={{
                    ...params.inputProps,
                  }}
                />
              )}
            />
          )}
        />
        {renderErrorMsg(errors?.paidDateTimezone?.code)}
      </Grid>
      <Grid item xs={12}>
        <Typography variant='h6' mb='24px'>
          Invoice description
        </Typography>
        <Controller
          name='description'
          control={control}
          render={({ field: { value, onChange } }) => (
            <>
              <TextField
                rows={4}
                multiline
                fullWidth
                disabled={isAccountManager}
                error={Boolean(errors.description)}
                placeholder='Write down an invoice description.'
                value={value ?? ''}
                onChange={onChange}
                inputProps={{ maxLength: 500 }}
              />
              <Typography variant='body2' mt='12px' textAlign='right'>
                {value?.length ?? 0}/500
              </Typography>
            </>
          )}
        />
      </Grid>
    </Fragment>
  )
}

const FullWidthDatePicker = styled(DatePicker)`
  width: 100%;
`
