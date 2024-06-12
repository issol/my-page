import { Fragment, useEffect, useState } from 'react'
import {
  Autocomplete,
  Box,
  Checkbox,
  Divider,
  FormHelperText,
  Grid,
  IconButton,
  TextField,
  Typography,
} from '@mui/material'
import { styled } from '@mui/system'

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
import { countries } from '@src/@fake-db/autocomplete'

// ** types
import { CountryType } from '@src/types/sign/personalInfoTypes'
import { InvoiceProjectInfoFormType } from '@src/types/invoice/common.type'

// ** helpers
import { timeZoneFormatter } from '@src/shared/helpers/timezone.helper'
import DatePickerWrapper from '@src/@core/styles/libs/react-datepicker'

import { timezoneSelector } from '@src/states/permission'
import { useRecoilValueLoadable } from 'recoil'
import PushPinIcon from '@mui/icons-material/PushPin'
import { getTimezonePin, setTimezonePin } from '@src/shared/auth/storage'

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
  const [timezoneList, setTimezoneList] = useState<
    {
      id: number
      code: string
      label: string
      pinned: boolean
    }[]
  >([])

  const timezone = useRecoilValueLoadable(timezoneSelector)

  const loadTimezonePin = ():
    | {
        id: number
        code: string
        label: string
        pinned: boolean
      }[]
    | null => {
    const storedOptions = getTimezonePin()
    return storedOptions ? JSON.parse(storedOptions) : null
  }

  useEffect(() => {
    if (timezoneList.length !== 0) return
    const zoneList = timezone.getValue()
    const loadTimezonePinned = loadTimezonePin()
    const filteredTimezone = zoneList.map((list, idx) => {
      return {
        id: idx,
        code: list.timezoneCode,
        label: list.timezone,
        pinned:
          loadTimezonePinned && loadTimezonePinned.length > 0
            ? loadTimezonePinned[idx].pinned
            : false,
      }
    })
    setTimezoneList(filteredTimezone)
  }, [timezone])

  useEffect(() => {
    if (clientTimezone && timezoneList.length > 0) {
      const getClientTimezone = timezoneList.find(
        zone => zone.label === clientTimezone.label,
      ) ?? { id: undefined, code: '', label: '', pinned: false }
      setValue('paymentDate.timezone', getClientTimezone, setValueOptions)
      setValue(
        'invoiceConfirmDate.timezone',
        getClientTimezone,
        setValueOptions,
      )
      setValue('taxInvoiceDueDate.timezone', getClientTimezone, setValueOptions)
    }
  }, [clientTimezone, timezoneList])

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

  const handleTimezonePin = (option: {
    id: number | undefined
    code: string
    label: string
    pinned: boolean
  }) => {
    const newOptions = timezoneList.map(opt =>
      opt.label === option.label ? { ...opt, pinned: !opt.pinned } : opt,
    )
    setTimezoneList(newOptions)
    setTimezonePin(newOptions)
  }

  const pinSortedOptions = timezoneList.sort((a, b) => {
    if (a.pinned === b.pinned) return a.id - b.id // 핀 상태가 같으면 원래 순서 유지
    return b.pinned ? 1 : -1 // 핀 상태에 따라 정렬
  })

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
                !field.value
                  ? { id: undefined, code: '', label: '', pinned: false }
                  : field.value
              }
              options={pinSortedOptions}
              onChange={(e, v) => field.onChange(v)}
              getOptionLabel={option =>
                timeZoneFormatter(option, timezone.getValue()) ?? ''
              }
              renderOption={(props, option) => (
                <Box
                  component='li'
                  {...props}
                  key={uuidv4()}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Typography
                    noWrap
                    sx={{
                      width: '100%',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {timeZoneFormatter(option, timezone.getValue())}
                  </Typography>
                  <IconButton
                    onClick={event => {
                      event.stopPropagation() // 드롭다운이 닫히는 것 방지
                      handleTimezonePin(option)
                    }}
                    size='small'
                    style={{ color: option.pinned ? '#FFAF66' : undefined }}
                  >
                    <PushPinIcon />
                  </IconButton>
                </Box>
              )}
              renderInput={params => (
                <TextField
                  {...params}
                  autoComplete='off'
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
                !field.value
                  ? { id: undefined, code: '', label: '', pinned: false }
                  : field.value
              }
              options={pinSortedOptions}
              onChange={(e, v) => field.onChange(v)}
              getOptionLabel={option =>
                timeZoneFormatter(option, timezone.getValue()) ?? ''
              }
              renderOption={(props, option) => (
                <Box
                  component='li'
                  {...props}
                  key={uuidv4()}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Typography
                    noWrap
                    sx={{
                      width: '100%',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {timeZoneFormatter(option, timezone.getValue())}
                  </Typography>
                  <IconButton
                    onClick={event => {
                      event.stopPropagation() // 드롭다운이 닫히는 것 방지
                      handleTimezonePin(option)
                    }}
                    size='small'
                    style={{ color: option.pinned ? '#FFAF66' : undefined }}
                  >
                    <PushPinIcon />
                  </IconButton>
                </Box>
              )}
              renderInput={params => (
                <TextField
                  {...params}
                  autoComplete='off'
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
                !field.value
                  ? { id: undefined, code: '', label: '', pinned: false }
                  : field.value
              }
              options={pinSortedOptions}
              onChange={(e, v) => field.onChange(v)}
              getOptionLabel={option =>
                timeZoneFormatter(option, timezone.getValue()) ?? ''
              }
              renderOption={(props, option) => (
                <Box
                  component='li'
                  {...props}
                  key={uuidv4()}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Typography
                    noWrap
                    sx={{
                      width: '100%',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {timeZoneFormatter(option, timezone.getValue())}
                  </Typography>
                  <IconButton
                    onClick={event => {
                      event.stopPropagation() // 드롭다운이 닫히는 것 방지
                      handleTimezonePin(option)
                    }}
                    size='small'
                    style={{ color: option.pinned ? '#FFAF66' : undefined }}
                  >
                    <PushPinIcon />
                  </IconButton>
                </Box>
              )}
              renderInput={params => (
                <TextField
                  {...params}
                  autoComplete='off'
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
                autoComplete='off'
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
