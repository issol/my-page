import { Icon } from '@iconify/react'
import {
  Autocomplete,
  Box,
  Button,
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
import { Fragment, useEffect, useState } from 'react'

// ** data
import { ClientStatus } from '@src/shared/const/status/statuses'
import { countries } from 'src/@fake-db/autocomplete'

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

// ** types
import {
  ClientType,
  CompanyInfoFormType,
} from '@src/types/schema/company-info.schema'

import DatePicker from 'react-datepicker'

// ** helpers
import { isInvalidPhoneNumber } from '@src/shared/helpers/phone-number.validator'
import { CountryType } from '@src/types/sign/personalInfoTypes'
import { TaxTypeList } from '@src/shared/const/tax/tax-type'
import { getTypeList } from '@src/shared/transformer/type.transformer'
import styled from 'styled-components'
import { DatePickerDefaultOptions } from '@src/shared/const/datePicker'
import DatePickerWrapper from '@src/@core/styles/libs/react-datepicker'
import { timeZoneFormatter } from '@src/shared/helpers/timezone.helper'
import { FormErrors } from '@src/shared/const/formErrors'
import MuiPhone from '@src/pages/components/phone/mui-phone'

import { useRecoilValueLoadable } from 'recoil'
import { timezoneSelector } from '@src/states/permission'

type Props = {
  mode: 'create' | 'update'
  control: Control<CompanyInfoFormType, any>
  setValue: UseFormSetValue<CompanyInfoFormType>
  getValue: UseFormGetValues<CompanyInfoFormType>
  errors: FieldErrors<CompanyInfoFormType>
  watch: UseFormWatch<CompanyInfoFormType>
}
export default function CompanyInfoForm({
  mode,
  control,
  setValue,
  errors,
  watch,
  getValue,
}: Props) {
  const clientType: Array<ClientType> = ['Company', 'Mr', 'Ms']
  const country = getTypeList('CountryCode')
  const timezone = useRecoilValueLoadable(timezoneSelector)

  const [timeZoneList, setTimeZoneList] = useState<
    {
      code: string
      label: string
      phone: string
    }[]
  >([])

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

  // console.log('errors', errors)
  function renderCompanyTypeBtn(
    type: ClientType,
    value: ClientType,
    onChange: (...event: any[]) => void,
  ) {
    return (
      <Button
        key={type}
        variant='outlined'
        onClick={() => onChange(type)}
        color={value === type ? 'primary' : 'secondary'}
      >
        {type === 'Mr' ? 'Mr.' : type === 'Ms' ? 'Ms.' : 'Company'}
      </Button>
    )
  }

  function renderErrorMsg(key: keyof CompanyInfoFormType) {
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
  function renderPhoneField(key: keyof CompanyInfoFormType, label: string) {
    return (
      <>
        <Controller
          name={key}
          control={control}
          rules={{ required: false }}
          render={({ field: { value, onChange } }) => (
            <MuiPhone
              value={(value as string) || ''}
              onChange={onChange}
              label={'Mobile phone'}
            />
          )}
        />
        {renderErrorMsg(key)}
      </>
    )
  }

  const formattedNow = (now: Date) => {
    const minutes = now.getMinutes()

    const formattedMinutes =
      minutes % 30 === 0 ? minutes : minutes > 30 ? 0 : 30

    const formattedHours = minutes > 30 ? now.getHours() + 1 : now.getHours()
    const formattedTime = `${formattedHours}:${formattedMinutes
      .toString()
      .padStart(2, '0')}`
    const formattedDate = new Date(now)
    formattedDate.setHours(parseInt(formattedTime.split(':')[0]))
    formattedDate.setMinutes(parseInt(formattedTime.split(':')[1]))

    return formattedDate
  }

  console.log(Boolean(errors.tax) && getValue('isTaxable'))

  return (
    <Fragment>
      <Grid item xs={6}>
        <Controller
          name='clientType'
          control={control}
          render={({ field: { value, onChange } }) => {
            return (
              <Box display='flex' gap='18px'>
                {clientType.map(item =>
                  renderCompanyTypeBtn(item, value!, onChange),
                )}
              </Box>
            )
          }}
        />
      </Grid>
      <Grid item xs={6}>
        <Controller
          name='status'
          control={control}
          render={({ field: { value, onChange } }) => (
            <Autocomplete
              fullWidth
              options={ClientStatus}
              disableClearable
              onChange={(e, v) => {
                if (!v) onChange({ value: '', label: '' })
                else onChange(v.value)
              }}
              value={
                !value
                  ? { value: '', label: '' }
                  : ClientStatus.filter(item => item.value === value)[0]
              }
              renderInput={params => (
                <TextField
                  {...params}
                  error={Boolean(errors.status)}
                  label='Status*'
                  placeholder='Status*'
                />
              )}
            />
          )}
        />
        {renderErrorMsg('status')}
      </Grid>
      <Grid item xs={6}>
        <Controller
          name='name'
          control={control}
          render={({ field: { value, onChange } }) => (
            <TextField
              fullWidth
              error={Boolean(errors.name)}
              label='Company name*'
              value={value}
              onChange={onChange}
              inputProps={{ maxLength: 100 }}
            />
          )}
        />
        {renderErrorMsg('name')}
      </Grid>
      <Grid item xs={6}>
        <Controller
          name='email'
          control={control}
          render={({ field: { value, onChange } }) => (
            <TextField
              fullWidth
              error={Boolean(errors.email)}
              label='Email*'
              value={value}
              placeholder='client@example.com'
              onChange={onChange}
              inputProps={{ maxLength: 100 }}
            />
          )}
        />
        {renderErrorMsg('email')}
      </Grid>
      <Grid item xs={6}>
        <Controller
          name='timezone'
          control={control}
          render={({ field: { onChange, value } }) => (
            <Autocomplete
              fullWidth
              value={value || { code: '', label: '', phone: '' }}
              options={timeZoneList as CountryType[]}
              onChange={(e, v) => {
                if (v) {
                  onChange(v)
                } else {
                  onChange(undefined)
                }
              }}
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
                  error={Boolean(errors.timezone)}
                  inputProps={{
                    ...params.inputProps,
                  }}
                />
              )}
            />
          )}
        />
        {errors.timezone && (
          <FormHelperText sx={{ color: 'error.main' }}>
            {errors.timezone.label?.message}
          </FormHelperText>
        )}
      </Grid>

      <Grid item xs={6}>
        {renderPhoneField('phone', 'Telephone')}
      </Grid>
      <Grid item xs={6}>
        {renderPhoneField('mobile', 'Mobile phone')}
      </Grid>
      <Grid item xs={6}>
        {renderPhoneField('fax', 'Fax')}
      </Grid>

      <Grid item xs={12}>
        <Controller
          name='websiteLink'
          control={control}
          render={({ field: { value, onChange } }) => (
            <FormControl fullWidth error={Boolean(errors.websiteLink)}>
              <InputLabel>Website</InputLabel>
              <OutlinedInput
                value={value ?? ''}
                error={Boolean(errors.websiteLink)}
                onChange={onChange}
                label='Website'
                placeholder='https://www.website.com'
                endAdornment={
                  <InputAdornment position='end'>
                    <IconButton
                      edge='end'
                      disabled={Boolean(errors.websiteLink) || !value}
                      onClick={() => window.open(`${value}`, '_blank')}
                    >
                      <Icon icon='material-symbols:open-in-new' opacity={0.7} />
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
          )}
        />
        {renderErrorMsg('websiteLink')}
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={6}>
        <Controller
          name='headquarter'
          control={control}
          render={({ field }) => (
            <Autocomplete
              autoHighlight
              fullWidth
              {...field}
              options={country}
              onChange={(e, v) => field.onChange(v.value)}
              disableClearable
              value={
                !field?.value
                  ? { value: '', label: '' }
                  : country.filter(item => item.value === field?.value)[0]
              }
              renderInput={params => (
                <TextField
                  {...params}
                  label='Headquarter'
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
          name='registrationNumber'
          control={control}
          render={({ field: { value, onChange } }) => (
            <TextField
              fullWidth
              error={Boolean(errors.registrationNumber)}
              label='Business registration number'
              value={value}
              onChange={onChange}
              inputProps={{ maxLength: 50 }}
            />
          )}
        />
        {renderErrorMsg('registrationNumber')}
      </Grid>
      <Grid item xs={6}>
        <Controller
          name='representativeName'
          control={control}
          render={({ field: { value, onChange } }) => (
            <TextField
              fullWidth
              error={Boolean(errors.representativeName)}
              label='Name of representative'
              value={value}
              onChange={onChange}
              inputProps={{ maxLength: 100 }}
            />
          )}
        />
        {renderErrorMsg('representativeName')}
      </Grid>
      <Grid item xs={6}>
        <DatePickerWrapper>
          <Controller
            name='commencementDate'
            control={control}
            render={({ field: { value, onChange } }) => (
              <FullWidthDatePicker
                {...DatePickerDefaultOptions}
                selected={!value ? null : new Date(value)}
                onChange={onChange}
                customInput={
                  <CustomInput
                    label='Business commencement date'
                    icon='calendar'
                  />
                }
              />
            )}
          />
        </DatePickerWrapper>

        {renderErrorMsg('commencementDate')}
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={6}>
        <Controller
          name='isTaxable'
          control={control}
          render={({ field: { value, onChange } }) => {
            const findValue = TaxTypeList.find(item => item.value === value)
            return (
              <Autocomplete
                fullWidth
                options={TaxTypeList}
                onChange={(e, v) => {
                  if (!v) onChange(null)
                  else {
                    onChange(v.value)
                    if (v.value === false) setValue('tax', null)
                  }
                }}
                value={!value && !findValue ? null : findValue}
                renderInput={params => (
                  <TextField
                    {...params}
                    error={Boolean(errors.isTaxable)}
                    label='Tax type*'
                    placeholder='Tax type*'
                  />
                )}
              />
            )
          }}
        />
        {errors.isTaxable && (
          <FormHelperText sx={{ color: 'error.main' }}>
            {FormErrors.required}
          </FormHelperText>
        )}
      </Grid>
      <Grid item xs={6}>
        <Controller
          name='tax'
          control={control}
          render={({ field: { value, onChange } }) => (
            <FormControl
              fullWidth
              error={Boolean(errors.tax) && getValue('isTaxable')}
            >
              <InputLabel>Tax rate*</InputLabel>
              <OutlinedInput
                value={value ?? ''}
                error={Boolean(errors.tax) && getValue('isTaxable')}
                onChange={onChange}
                label='Tax rate*'
                disabled={!watch('isTaxable')}
                endAdornment={
                  !watch('isTaxable') ? null : (
                    <InputAdornment position='end'>%</InputAdornment>
                  )
                }
              />
            </FormControl>
          )}
        />
        {errors.tax && getValue('isTaxable') && (
          <FormHelperText sx={{ color: 'error.main' }}>
            {FormErrors.required}
          </FormHelperText>
        )}
      </Grid>

      {mode === 'create' ? (
        <>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid item xs={12}>
            <Typography variant='h6' mb='24px'>
              Memo for client
            </Typography>
            <Controller
              name='memo'
              control={control}
              render={({ field: { value, onChange } }) => (
                <>
                  <TextField
                    rows={4}
                    multiline
                    fullWidth
                    error={Boolean(errors.memo)}
                    placeholder='Write down some information to keep in mind about this client.'
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
        </>
      ) : null}
    </Fragment>
  )
}

const FullWidthDatePicker = styled(DatePicker)`
  width: 100%;
`
