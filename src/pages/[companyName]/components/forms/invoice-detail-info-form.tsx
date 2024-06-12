import { Fragment, useEffect, useState } from 'react'

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
import { styled } from '@mui/system'
import { v4 as uuidv4 } from 'uuid'
import dayjs from 'dayjs'

// ** values
import { countries } from '@src/@fake-db/autocomplete'
import { TaxInfo } from '@src/shared/const/tax/tax-info'

// ** apis
import { useGetInvoicePayableStatus } from '@src/queries/invoice/common.query'

// ** helpers
import { timeZoneFormatter } from '@src/shared/helpers/timezone.helper'

// ** types & schema
import {
  InvoicePayableDetailType,
  PayableFormType,
  PayableHistoryType,
} from '@src/types/invoice/payable.type'
import { CountryType } from '@src/types/sign/personalInfoTypes'

// ** Third Party Imports
import DatePicker from 'react-datepicker'

// ** Custom Component Imports
import CustomInput from '@src/views/forms/form-elements/pickers/PickersCustomInput'

// ** react hook form
import {
  Control,
  Controller,
  FieldError,
  FieldErrors,
  UseFormGetValues,
  UseFormSetValue,
  UseFormTrigger,
} from 'react-hook-form'

// ** components
import InformationModal from '@src/@core/components/common-modal/information-modal'

// ** hooks
import useModal from '@src/hooks/useModal'

import { timezoneSelector } from '@src/states/permission'
import { useRecoilValueLoadable } from 'recoil'
import { authState } from '@src/states/auth'
import PushPinIcon from '@mui/icons-material/PushPin'
import { getTimezonePin, setTimezonePin } from '@src/shared/auth/storage'

type Props = {
  data: InvoicePayableDetailType | PayableHistoryType | undefined
  control: Control<PayableFormType, any>
  errors: FieldErrors<PayableFormType>
  isAccountManager: boolean
  statusList: Array<{
    label: string
    value: number
  }>
  setValue: UseFormSetValue<PayableFormType>
  getValues: UseFormGetValues<PayableFormType>
  trigger: UseFormTrigger<PayableFormType>
}
export default function InvoiceDetailInfoForm({
  data,
  control,
  errors,
  isAccountManager,
  statusList,
  setValue,
  getValues,
  trigger,
}: Props) {
  const { openModal, closeModal } = useModal()
  const [timezoneList, setTimezoneList] = useState<
    {
      id: number
      code: string
      label: string
      pinned: boolean
    }[]
  >([])

  const timezone = useRecoilValueLoadable(timezoneSelector)
  const auth = useRecoilValueLoadable(authState)

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

  // const { data: statusList, isLoading } = useGetInvoicePayableStatus()

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

  const dateValue = (date: Date) => {
    return dayjs(date).format('MM/DD/YYYY, hh:mm A')
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
          autoComplete='off'
          disabled
          value={data?.invoicedAt ? dateValue(new Date(data.invoicedAt)) : '-'}
          label='Invoice date*'
          placeholder='Invoice date*'
        />
      </Grid>

      <Grid item xs={6}>
        <TextField
          fullWidth
          autoComplete='off'
          disabled
          value={timeZoneFormatter(
            auth.getValue().user?.timezone!,
            timezone.getValue(),
          )}
          label='Time zone*'
          placeholder='Time zone*'
        />
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      {/* <Grid item xs={6}>
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
                onChange(v?.value ?? '')
              }}
              value={
                statusList?.find(item => item.value === value)
              }
              getOptionLabel={option => option.label}
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
      </Grid> */}
      <Grid item xs={12}>
        <TextField
          fullWidth
          autoComplete='off'
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
                if (v) {
                  onChange(v.value)
                  setValue(
                    'taxRate',
                    v.value === 'Japan resident' ||
                      v.value === 'Singapore resident' ||
                      v.value === 'US resident'
                      ? null
                      : v.value === 'Korea resident'
                        ? '-3.3'
                        : v.value === 'Korea resident (Sole proprietorship)'
                          ? '10'
                          : null,
                  )
                  trigger('taxRate')
                } else {
                  onChange(null)
                }
              }}
              value={TaxInfo?.find(item => item.value === value) || null}
              getOptionLabel={option => option.label}
              renderInput={params => (
                <TextField
                  {...params}
                  autoComplete='off'
                  error={Boolean(errors.taxInfo)}
                  label='Tax info*'
                />
              )}
              disabled={getValues().invoiceStatus === 40300}
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
              <InputLabel>
                {getValues('taxInfo') === 'Japan resident' ||
                getValues('taxInfo') === 'Singapore resident' ||
                getValues('taxInfo') === 'US resident'
                  ? 'Tax rate'
                  : 'Tax rate*'}
              </InputLabel>
              <OutlinedInput
                value={value ?? ''}
                error={Boolean(errors.tax)}
                disabled={
                  getValues('taxInfo') === 'Japan resident' ||
                  getValues('taxInfo') === 'Singapore resident' ||
                  getValues('taxInfo') === 'US resident' ||
                  getValues().invoiceStatus === 40300
                }
                onChange={e => {
                  if (e.target.value.length > 10) return
                  onChange(e)
                }}
                type='number'
                label={
                  getValues('taxInfo') === 'Japan resident' ||
                  getValues('taxInfo') === 'Singapore resident' ||
                  getValues('taxInfo') === 'US resident'
                    ? 'Tax rate'
                    : 'Tax rate*'
                }
                endAdornment={
                  getValues('taxInfo') === 'Japan resident' ||
                  getValues('taxInfo') === 'Singapore resident' ||
                  getValues('taxInfo') === 'US resident' ? null : (
                    <InputAdornment position='end'>%</InputAdornment>
                  )
                }
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
              disabled={getValues().invoiceStatus === 40300}
              showTimeSelect
              timeFormat='HH:mm'
              timeIntervals={30}
              selected={!value ? null : new Date(value)}
              placeholderText='MM/DD/YYYY, HH:MM'
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
          render={({ field: { value, onChange } }) => (
            <Autocomplete
              autoHighlight
              fullWidth
              disabled={getValues().invoiceStatus === 40300}
              disableClearable={value ? false : true}
              value={
                !value
                  ? { id: undefined, code: '', label: '', pinned: false }
                  : value
              }
              options={pinSortedOptions}
              onChange={(e, v) => onChange(v)}
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
              disabled={
                getValues().invoiceStatus !== 40300 || !isAccountManager
              }
              timeFormat='HH:mm'
              timeIntervals={30}
              selected={!value ? null : new Date(value)}
              placeholderText='MM/DD/YYYY, HH:MM'
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
          render={({ field: { value, onChange } }) => (
            <Autocomplete
              autoHighlight
              fullWidth
              disabled={
                getValues().invoiceStatus !== 40300 || !isAccountManager
              }
              disableClearable={value ? false : true}
              value={
                !value
                  ? { id: undefined, code: '', label: '', pinned: false }
                  : value
              }
              options={pinSortedOptions}
              onChange={(e, v) => onChange(v)}
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
                autoComplete='off'
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
