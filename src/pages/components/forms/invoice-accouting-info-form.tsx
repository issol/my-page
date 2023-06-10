import { Icon } from '@iconify/react'
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Divider,
  FormHelperText,
  Grid,
  IconButton,
  TextField,
  Typography,
} from '@mui/material'
import styled from 'styled-components'

// ** Third Party Imports
import DatePicker from 'react-datepicker'

// ** Custom Component Imports
import CustomInput from '@src/views/forms/form-elements/pickers/PickersCustomInput'

// ** types
import { OrderProjectInfoFormType } from '@src/types/common/orders.type'
import { Fragment, ReactNode, useEffect, useState } from 'react'

// ** react hook form
import {
  Control,
  Controller,
  FieldErrors,
  UseFormSetValue,
  UseFormWatch,
} from 'react-hook-form'

// ** fetch
import { useGetWorkNameList } from '@src/queries/pro-project/project.query'

// ** hooks
import useModal from '@src/hooks/useModal'

// ** components

// ** values
import { CategoryList } from '@src/shared/const/category/categories'
import { ServiceTypeList } from '@src/shared/const/service-type/service-types'
import { ServiceTypePair } from '@src/shared/const/service-type/service-types'
import {
  AreaOfExpertisePair,
  AreaOfExpertiseList,
} from '@src/shared/const/area-of-expertise/area-of-expertise'
import { RevenueFrom } from '@src/shared/const/revenue-from'
import { countries } from 'src/@fake-db/autocomplete'

// ** types
import { CountryType } from '@src/types/sign/personalInfoTypes'
import { InvoiceProjectInfoFormType } from '@src/types/invoice/common.type'
import { getGmtTime } from '@src/shared/helpers/timezone.helper'
import InformationModal from '@src/@core/components/common-modal/information-modal'

type Props = {
  control: Control<InvoiceProjectInfoFormType, any>
  setValue: UseFormSetValue<InvoiceProjectInfoFormType>
  watch: UseFormWatch<InvoiceProjectInfoFormType>
  errors: FieldErrors<InvoiceProjectInfoFormType>
  clientTimezone?: CountryType | undefined
  statusList: {
    id: number
    statusName: string
  }[]
}
export default function InvoiceAccountingInfoForm({
  control,
  setValue,
  watch,
  errors,
  clientTimezone,
  statusList,
}: Props) {
  const [workName, setWorkName] = useState<{ value: string; label: string }[]>(
    [],
  )

  const defaultValue = { value: '', label: '' }

  const { openModal, closeModal } = useModal()

  const setValueOptions = { shouldDirty: true, shouldValidate: true }

  useEffect(() => {
    if (clientTimezone) {
      setValue('paymentDueDate.timezone', clientTimezone, setValueOptions)
      setValue('invoiceConfirmDate.timezone', clientTimezone, setValueOptions)
      setValue('taxInvoiceDueDate.timezone', clientTimezone, setValueOptions)
    }
  }, [clientTimezone])

  useEffect(() => {
    setValue('sendReminder', true, setValueOptions)
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
        <Controller
          name='paymentDueDate.date'
          control={control}
          render={({ field: { value, onChange } }) => (
            <FullWidthDatePicker
              showTimeSelect
              timeFormat='HH:mm'
              timeIntervals={15}
              selected={!value ? null : new Date(value)}
              dateFormat='MM/dd/yyyy h:mm aa'
              onChange={onChange}
              customInput={<CustomInput label='Payment due*' icon='calendar' />}
            />
          )}
        />
      </Grid>
      <Grid item xs={6}>
        <Controller
          name='paymentDueDate.timezone'
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
              getOptionLabel={option => getGmtTime(option.code)}
              renderOption={(props, option) => (
                <Box component='li' {...props}>
                  {getGmtTime(option.code)}
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
        <Controller
          name='invoiceConfirmDate.date'
          control={control}
          render={({ field: { value, onChange } }) => (
            <FullWidthDatePicker
              showTimeSelect
              timeFormat='HH:mm'
              timeIntervals={15}
              selected={!value ? null : new Date(value)}
              dateFormat='MM/dd/yyyy h:mm aa'
              onChange={onChange}
              customInput={
                <CustomInput label='Invoice confirm date' icon='calendar' />
              }
            />
          )}
        />
      </Grid>
      <Grid item xs={6}>
        <Controller
          name='invoiceConfirmDate.timezone'
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
              getOptionLabel={option => getGmtTime(option.code)}
              renderOption={(props, option) => (
                <Box component='li' {...props}>
                  {getGmtTime(option.code)}
                </Box>
              )}
              renderInput={params => (
                <TextField
                  {...params}
                  label='Time zone'
                  error={Boolean(errors?.invoiceConfirmDate?.timezone)}
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
        <Controller
          name='taxInvoiceDueDate.date'
          control={control}
          render={({ field: { value, onChange } }) => (
            <FullWidthDatePicker
              showTimeSelect
              timeFormat='HH:mm'
              timeIntervals={15}
              selected={!value ? null : new Date(value)}
              dateFormat='MM/dd/yyyy h:mm aa'
              onChange={onChange}
              customInput={
                <CustomInput
                  label='Due date for the tax invoice'
                  icon='calendar'
                />
              }
            />
          )}
        />
      </Grid>
      <Grid item xs={6}>
        <Controller
          name='taxInvoiceDueDate.timezone'
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
              getOptionLabel={option => getGmtTime(option.code)}
              renderOption={(props, option) => (
                <Box component='li' {...props}>
                  {getGmtTime(option.code)}
                </Box>
              )}
              renderInput={params => (
                <TextField
                  {...params}
                  label='Time zone'
                  error={Boolean(errors?.taxInvoiceDueDate?.timezone)}
                  inputProps={{
                    ...params.inputProps,
                  }}
                />
              )}
            />
          )}
        />
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={12}>
        <Typography variant='h6' mb='24px'>
          Invoice description
        </Typography>
        <Controller
          name='invoiceDescription'
          control={control}
          render={({ field: { value, onChange } }) => (
            <>
              <TextField
                rows={4}
                multiline
                fullWidth
                error={Boolean(errors.invoiceDescription)}
                // label='Write down an invoice description.'
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