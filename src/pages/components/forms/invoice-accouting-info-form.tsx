import { Fragment, useEffect, useState } from 'react'
import {
  Autocomplete,
  Box,
  Checkbox,
  Divider,
  FormHelperText,
  Grid,
  TextField,
  Typography,
} from '@mui/material'
import styled from 'styled-components'

// ** Third Party Imports
import DatePicker from 'react-datepicker'

// ** Custom Component Imports
import CustomInput from '@src/views/forms/form-elements/pickers/PickersCustomInput'
import { v4 as uuidv4 } from 'uuid'

// ** react hook form
import {
  Control,
  Controller,
  FieldErrors,
  UseFormGetValues,
  UseFormSetValue,
  UseFormWatch,
} from 'react-hook-form'

// ** values
import { countries } from 'src/@fake-db/autocomplete'

// ** types
import { CountryType } from '@src/types/sign/personalInfoTypes'
import { InvoiceProjectInfoFormType } from '@src/types/invoice/common.type'

// ** helpers
import { timeZoneFormatter } from '@src/shared/helpers/timezone.helper'
import DatePickerWrapper from '@src/@core/styles/libs/react-datepicker'
import { getTimeZoneFromLocalStorage } from '@src/shared/auth/storage'
import { timezoneSelector } from '@src/states/permission'
import { useRecoilValueLoadable } from 'recoil'

type Props = {
  control: Control<InvoiceProjectInfoFormType, any>
  setValue: UseFormSetValue<InvoiceProjectInfoFormType>
  getValue: UseFormGetValues<InvoiceProjectInfoFormType>
  watch: UseFormWatch<InvoiceProjectInfoFormType>
  errors: FieldErrors<InvoiceProjectInfoFormType>
  clientTimezone?: CountryType | undefined
}
export default function InvoiceAccountingInfoForm({
  control,
  setValue,
  getValue,
  watch,
  errors,
  clientTimezone,
}: Props) {
  const setValueOptions = { shouldDirty: true, shouldValidate: true }
  const [timeZoneList, setTimeZoneList] = useState<
    {
      code: string
      label: string
      phone: string
    }[]
  >([])

  const timezone = useRecoilValueLoadable(timezoneSelector)

  useEffect(() => {
    const timezoneList = timezone.getValue()
    const filteredTimezone = timezoneList.map(list => {
      return {
        code: list.timezoneCode,
        label: list.timezone,
        phone: '',
      }
    })
    setTimeZoneList(filteredTimezone)
  }, [timezone])
  useEffect(() => {
    if (clientTimezone) {
      setValue('paymentDate.timezone', clientTimezone, setValueOptions)
      setValue('invoiceConfirmDate.timezone', clientTimezone, setValueOptions)
      setValue('taxInvoiceDueDate.timezone', clientTimezone, setValueOptions)
    }
  }, [clientTimezone])

  useEffect(() => {
    setValue('setReminder', true, setValueOptions)
    if (!getValue('salesCategory'))
      setValue('salesCategory', getValue('category'))
  }, [])

  function renderErrorMsg(key: keyof InvoiceProjectInfoFormType) {
    return (
      <>
        {errors[key] && (
          <FormHelperText sx={{ color: 'error.main' }}>
            {errors[key]?.message}
          </FormHelperText>
        )}
      </>
    )
  }

  return (
    <Fragment>
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Controller
            name='taxInvoiceIssued'
            control={control}
            defaultValue={true}
            render={({ field: { value, onChange } }) => (
              <Checkbox
                value={value}
                onChange={e => {
                  onChange(e.target.checked)
                }}
                checked={value}
              />
            )}
          />

          <Typography variant='body2'>Tax invoice issued</Typography>
        </Box>
      </Grid>
      <Divider />

      <Grid item xs={6}>
        <DatePickerWrapper>
          <Controller
            name='paymentDate.date'
            control={control}
            render={({ field: { value, onChange } }) => (
              <FullWidthDatePicker
                showTimeSelect
                timeFormat='HH:mm'
                timeIntervals={30}
                selected={!value ? null : new Date(value)}
                dateFormat='MM/dd/yyyy h:mm aa'
                onChange={onChange}
                customInput={
                  <CustomInput label='Payment date*' icon='calendar' />
                }
              />
            )}
          />
        </DatePickerWrapper>
      </Grid>
      <Grid item xs={6}>
        <Controller
          name='paymentDate.timezone'
          control={control}
          render={({ field }) => (
            <Autocomplete
              autoHighlight
              fullWidth
              {...field}
              value={
                !field.value ? { code: '', label: '', phone: '' } : field.value
              }
              options={timeZoneList as CountryType[]}
              onChange={(e, v) => field.onChange(v)}
              getOptionLabel={option =>
                timeZoneFormatter(option, timezone.getValue()) ?? ''
              }
              renderOption={(props, option) => (
                <Box component='li' {...props} key={uuidv4()}>
                  {timeZoneFormatter(option, timezone.getValue())}
                </Box>
              )}
              renderInput={params => (
                <TextField
                  {...params}
                  label='Time zone*'
                  error={Boolean(errors?.paymentDueDate?.timezone)}
                  inputProps={{
                    ...params.inputProps,
                  }}
                />
              )}
            />
          )}
        />
      </Grid>
      <Grid item xs={6}>
        <DatePickerWrapper>
          <Controller
            name='taxInvoiceIssuanceDate.date'
            control={control}
            render={({ field: { value, onChange } }) => (
              <FullWidthDatePicker
                showTimeSelect
                timeFormat='HH:mm'
                timeIntervals={30}
                selected={!value ? null : new Date(value)}
                dateFormat='MM/dd/yyyy h:mm aa'
                onChange={onChange}
                customInput={
                  <CustomInput
                    label='Issuance date of tax invoice'
                    icon='calendar'
                  />
                }
              />
            )}
          />
        </DatePickerWrapper>
      </Grid>
      <Grid item xs={6}>
        <Controller
          name='taxInvoiceIssuanceDate.timezone'
          control={control}
          render={({ field }) => (
            <Autocomplete
              autoHighlight
              fullWidth
              {...field}
              value={
                !field.value ? { code: '', label: '', phone: '' } : field.value
              }
              options={timeZoneList as CountryType[]}
              onChange={(e, v) => field.onChange(v)}
              getOptionLabel={option =>
                timeZoneFormatter(option, timezone.getValue()) ?? ''
              }
              renderOption={(props, option) => (
                <Box component='li' {...props} key={uuidv4()}>
                  {timeZoneFormatter(option, timezone.getValue())}
                </Box>
              )}
              renderInput={params => (
                <TextField
                  {...params}
                  label='Time zone'
                  error={Boolean(errors?.taxInvoiceIssuanceDate?.timezone)}
                  inputProps={{
                    ...params.inputProps,
                  }}
                />
              )}
            />
          )}
        />
      </Grid>
      <Grid item xs={6}>
        <DatePickerWrapper>
          <Controller
            name='salesRecognitionDate.date'
            control={control}
            render={({ field: { value, onChange } }) => (
              <FullWidthDatePicker
                showTimeSelect
                timeFormat='HH:mm'
                timeIntervals={30}
                selected={!value ? null : new Date(value)}
                dateFormat='MM/dd/yyyy h:mm aa'
                onChange={onChange}
                customInput={
                  <CustomInput label='Sales recognition date' icon='calendar' />
                }
              />
            )}
          />
        </DatePickerWrapper>
      </Grid>
      <Grid item xs={6}>
        <Controller
          name='salesRecognitionDate.timezone'
          control={control}
          render={({ field }) => (
            <Autocomplete
              autoHighlight
              fullWidth
              {...field}
              value={
                !field.value ? { code: '', label: '', phone: '' } : field.value
              }
              options={timeZoneList as CountryType[]}
              onChange={(e, v) => field.onChange(v)}
              getOptionLabel={option =>
                timeZoneFormatter(option, timezone.getValue()) ?? ''
              }
              renderOption={(props, option) => (
                <Box component='li' {...props} key={uuidv4()}>
                  {timeZoneFormatter(option, timezone.getValue())}
                </Box>
              )}
              renderInput={params => (
                <TextField
                  {...params}
                  label='Time zone'
                  error={Boolean(errors?.salesRecognitionDate?.timezone)}
                  inputProps={{
                    ...params.inputProps,
                  }}
                />
              )}
            />
          )}
        />
      </Grid>
      {/* <Grid item xs={12}>
        <Controller
          name='salesCategory'
          control={control}
          render={({ field }) => (
            <Autocomplete
              autoHighlight
              fullWidth
              {...field}
              value={field.value ?? getValue('category')}
              options={[]}
              disabled
              onChange={(e, v) => field.onChange(v)}
              getOptionLabel={option => option}
              renderInput={params => (
                <TextField
                  {...params}
                  label='Sales category'
                  disabled={true}
                  inputProps={{
                    ...params.inputProps,
                  }}
                />
              )}
            />
          )}
        />
      </Grid> */}
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={12}>
        <Typography variant='h6' mb='24px'>
          Notes
        </Typography>
        <Controller
          name='notes'
          control={control}
          render={({ field: { value, onChange } }) => (
            <>
              <TextField
                rows={4}
                multiline
                fullWidth
                error={Boolean(errors.notes)}
                // label='Write down an invoice description.'
                placeholder='Write down a note.'
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
