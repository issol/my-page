import { Icon } from '@iconify/react'
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
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

// ** Third Party Imports
import DatePicker from 'react-datepicker'
import { v4 as uuidv4 } from 'uuid'

// ** Custom Component Imports
import CustomInput from '@src/views/forms/form-elements/pickers/PickersCustomInput'

// ** types
import { Fragment, ReactNode, useEffect, useState } from 'react'

// ** react hook form
import {
  Control,
  Controller,
  FieldErrors,
  UseFormGetValues,
  UseFormSetValue,
  UseFormTrigger,
  UseFormWatch,
} from 'react-hook-form'

// ** fetch
import { useGetWorkNameList } from '@src/queries/pro/pro-project.query'

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
import { countries } from '@src/@fake-db/autocomplete'

// ** types
import { CountryType } from '@src/types/sign/personalInfoTypes'
import { InvoiceProjectInfoFormType } from '@src/types/invoice/common.type'
import { timeZoneFormatter } from '@src/shared/helpers/timezone.helper'
import InformationModal from '@src/@core/components/common-modal/information-modal'
import { ClientType } from '@src/types/orders/order-detail'
import { InvoiceReceivableDetailType } from '@src/types/invoice/receivable.type'
import { DateTimePickerDefaultOptions } from '@src/shared/const/datePicker'
import { TaxTypeList } from '@src/shared/const/tax/tax-type'
import dayjs from 'dayjs'
import { timezoneSelector } from '@src/states/permission'
import { useRecoilValueLoadable } from 'recoil'

type Props = {
  control: Control<InvoiceProjectInfoFormType, any>
  setValue: UseFormSetValue<InvoiceProjectInfoFormType>
  getValue: UseFormGetValues<InvoiceProjectInfoFormType>
  watch: UseFormWatch<InvoiceProjectInfoFormType>
  errors: FieldErrors<InvoiceProjectInfoFormType>
  trigger: UseFormTrigger<InvoiceProjectInfoFormType>
  clientTimezone?: CountryType | undefined | null
  client?: ClientType
  invoiceInfo?: InvoiceReceivableDetailType
  type: 'create' | 'edit'
  multipleOrder: boolean
}
export default function InvoiceProjectInfoForm({
  control,
  setValue,
  getValue,
  watch,
  trigger,
  errors,
  clientTimezone,
  client,
  invoiceInfo,
  type,
  multipleOrder,
}: Props) {
  const [workName, setWorkName] = useState<{ value: string; label: string }[]>(
    [],
  )
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

  const defaultValue = { value: '', label: '' }

  const { openModal, closeModal } = useModal()

  const setValueOptions = { shouldDirty: true, shouldValidate: true }

  const isClientRegistered =
    client?.contactPerson !== null && client?.contactPerson.userId === null

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

  useEffect(() => {
    if (clientTimezone && type === 'create') {
      setValue('paymentDueDate.timezone', clientTimezone, setValueOptions)
      setValue('invoiceConfirmDate.timezone', clientTimezone, setValueOptions)
      setValue('taxInvoiceDueDate.timezone', clientTimezone, setValueOptions)
      setValue('invoiceDateTimezone', clientTimezone, setValueOptions)
    }
  }, [clientTimezone])

  useEffect(() => {
    setValue('setReminder', true, setValueOptions)
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

  const dateValue = (date: Date) => {
    return dayjs(date).format('MM/DD/YYYY, hh:mm A')
  }

  return (
    <Fragment>
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Controller
            name='setReminder'
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

          <Typography variant='body2'>
            Send reminder for this invoice
          </Typography>
          <IconButton
            onClick={() => {
              openModal({
                type: 'invoiceReminderModal',
                children: (
                  <InformationModal
                    onClose={() => closeModal('invoiceReminderModal')}
                    title='Reminder information'
                    subtitle='A reminder email will be automatically sent to the client when the invoice is overdue.'
                    vary='info'
                  />
                ),
              })
            }}
          >
            <Icon icon='ic:outline-info' />
          </IconButton>
        </Box>
      </Grid>
      <Divider />
      <Grid item xs={6}>
        <Controller
          name='invoiceDate'
          control={control}
          render={({ field: { value, onChange } }) => (
            <FullWidthDatePicker
              {...DateTimePickerDefaultOptions}
              selected={!value ? null : formattedNow(new Date(value))}
              onChange={onChange}
              customInput={
                <Box>
                  <CustomInput
                    label='Invoice date*'
                    icon='calendar'
                    readOnly
                    placeholder='MM/DD/YYYY HH:MM'
                    value={
                      value ? dateValue(formattedNow(new Date(value))) : ''
                    }
                  />
                </Box>
              }
            />
          )}
        />
        {renderErrorMsg('invoiceDate')}
      </Grid>
      <Grid item xs={6}>
        <Controller
          name='invoiceDateTimezone'
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
                  autoComplete='off'
                  label='Time zone*'
                  error={Boolean(errors?.invoiceDateTimezone)}
                  inputProps={{
                    ...params.inputProps,
                  }}
                />
              )}
            />
          )}
        />

        {renderErrorMsg('invoiceDateTimezone')}
      </Grid>
      {multipleOrder ? null : (
        <Grid item xs={6}>
          <Controller
            name='workName'
            control={control}
            render={({ field: { value, onChange } }) => {
              return (
                <Autocomplete
                  disableClearable
                  autoHighlight
                  fullWidth
                  disabled={true}
                  options={[]}
                  // onChange={(e, v) => {
                  //   onChange(v?.value ?? '')
                  // }}
                  value={value}
                  // sx={{
                  //   borderRadius: '8px',
                  //   background: 'rgba(76, 78, 100, 0.12) !important',
                  //   '& .MuiChip-root': {
                  //     '&. MuiChip-label': {
                  //       color: 'rgba(76, 78, 100, 0.38)',
                  //       opacity: '1 !important',
                  //     },
                  //     '& .MuiSvgIcon-root': {
                  //       display: 'none',
                  //     },
                  //   },
                  // }}
                  renderInput={params => (
                    <TextField
                      {...params}
                      autoComplete='off'
                      error={Boolean(errors.workName)}
                      label='Work name'
                      placeholder='Work name'
                    />
                  )}
                />
              )
            }}
          />
        </Grid>
      )}

      <Grid item xs={6}>
        <Controller
          name='projectName'
          control={control}
          render={({ field: { value, onChange } }) => (
            <TextField
              fullWidth
              autoComplete='off'
              disabled={!multipleOrder}
              label='Project name*'
              variant='outlined'
              value={value ?? ''}
              onChange={onChange}
              inputProps={{ maxLength: 100 }}
              error={Boolean(errors.projectName)}
            />
          )}
        />
        {renderErrorMsg('projectName')}
      </Grid>
      {multipleOrder ? null : (
        <Grid item xs={6}>
          <Controller
            name='category'
            control={control}
            render={({ field: { value, onChange } }) => (
              <Autocomplete
                autoHighlight
                disabled
                fullWidth
                options={CategoryList}
                onChange={(e, v) => {
                  if (!v) {
                    setValue('serviceType', [], setValueOptions)
                    setValue('expertise', [], setValueOptions)
                  }
                  onChange(v?.value ?? '')
                }}
                // sx={{
                //   borderRadius: '8px',
                //   background: 'rgba(76, 78, 100, 0.12) !important',
                //   '& .MuiChip-root': {
                //     '&. MuiChip-label': {
                //       color: 'rgba(76, 78, 100, 0.38)',
                //       opacity: '1 !important',
                //     },
                //     '& .MuiSvgIcon-root': {
                //       display: 'none',
                //     },
                //   },
                // }}
                value={
                  !value
                    ? defaultValue
                    : CategoryList.find(item => item.value === value)
                }
                renderInput={params => (
                  <TextField
                    {...params}
                    autoComplete='off'
                    error={Boolean(errors.category)}
                    label='Category'
                    placeholder='Category'
                  />
                )}
              />
            )}
          />
        </Grid>
      )}
      {multipleOrder ? null : (
        <Grid item xs={6}>
          <Controller
            name='serviceType'
            control={control}
            render={({ field: { value, onChange } }) => {
              const category = watch('category') as keyof typeof ServiceTypePair
              return (
                <Autocomplete
                  autoHighlight
                  fullWidth
                  disabled
                  multiple
                  // sx={{
                  //   borderRadius: '8px',
                  //   background: 'rgba(76, 78, 100, 0.12) !important',
                  //   '& .MuiChip-root': {
                  //     '&. MuiChip-label': {
                  //       color: 'rgba(76, 78, 100, 0.38)',
                  //       opacity: '1 !important',
                  //     },
                  //     '& .MuiSvgIcon-root': {
                  //       display: 'none',
                  //     },
                  //   },
                  // }}
                  options={
                    !category || !ServiceTypePair[category]
                      ? ServiceTypeList
                      : ServiceTypePair[category]
                  }
                  onChange={(e, v) => {
                    onChange(v.map(item => item.value))
                  }}
                  value={ServiceTypeList.filter(item =>
                    value?.includes(item.value),
                  )}
                  renderInput={params => (
                    <TextField {...params} autoComplete='off' label='Service type' />
                  )}
                />
              )
            }}
          />
        </Grid>
      )}
      {multipleOrder ? null : (
        <Grid item xs={12}>
          <Controller
            name='expertise'
            control={control}
            render={({ field: { value, onChange } }) => {
              const category = watch(
                'category',
              ) as keyof typeof AreaOfExpertisePair
              return (
                <Autocomplete
                  autoHighlight
                  fullWidth
                  disabled
                  multiple
                  options={
                    !category || !AreaOfExpertisePair[category]
                      ? AreaOfExpertiseList
                      : AreaOfExpertisePair[category]
                  }
                  onChange={(e, v) => {
                    onChange(v.map(item => item.value))
                  }}
                  value={AreaOfExpertiseList.filter(item =>
                    value?.includes(item.value),
                  )}
                  renderInput={params => (
                    <TextField
                      {...params}
                      autoComplete='off'
                      label='Area of expertise'
                      sx={{ color: 'red' }}
                    />
                  )}
                />
              )
            }}
          />
        </Grid>
      )}
      <Grid item xs={6}>
        <Controller
          name='revenueFrom'
          control={control}
          render={({ field: { value, onChange } }) => {
            return (
              <Autocomplete
                autoHighlight
                fullWidth
                disabled
                options={RevenueFrom}
                onChange={(e, v) => {
                  onChange(v?.value ?? '')
                }}
                value={
                  RevenueFrom.find(item => value?.includes(item.value)) || {
                    value: '',
                    label: '',
                  }
                }
                sx={
                  {
                    // borderRadius: '8px',
                    // background: 'rgba(76, 78, 100, 0.12) !important',
                    // '& .MuiChip-root': {
                    //   '&. MuiChip-label': {
                    //     color: 'rgba(76, 78, 100, 0.38)',
                    //     opacity: '1 !important',
                    //   },
                    //   '& .MuiSvgIcon-root': {
                    //     display: 'none',
                    //   },
                    // },
                  }
                }
                renderInput={params => (
                  <TextField
                    {...params}
                    autoComplete='off'
                    error={Boolean(errors.revenueFrom)}
                    label='Revenue from*'
                    placeholder='Revenue from*'
                  />
                )}
              />
            )
          }}
        />
        {renderErrorMsg('revenueFrom')}
      </Grid>
      <Grid item xs={6}>
        <Controller
          name='isTaxable'
          control={control}
          render={({ field: { value, onChange } }) => {
            const findValue = TaxTypeList.find(item => item.value === value)
            return (
              <Autocomplete
                autoHighlight
                fullWidth
                // disabled
                disableClearable={value === null}
                options={TaxTypeList}
                onChange={(e, v) => {
                  if (!v) onChange(null)
                  else {
                    onChange(v.value)
                    if (v.value === false) {
                      setValue('tax', null)
                      trigger('tax')
                    }
                  }
                }}
                value={!value && !findValue ? null : findValue}
                getOptionLabel={option => option.label}
                renderInput={params => (
                  <TextField
                    {...params}
                    autoComplete='off'
                    error={Boolean(errors.isTaxable)}
                    label='Tax type*'
                  />
                )}
              />
            )
          }}
        />
        {renderErrorMsg('revenueFrom')}
      </Grid>
      {multipleOrder ? (
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
                  // value={value ? Number(value) : null}
                  value={value ?? ''}
                  error={Boolean(errors.tax) && getValue('isTaxable')}
                  onFocus={e =>
                    e.target.addEventListener(
                      'wheel',
                      function (e) {
                        e.preventDefault()
                      },
                      { passive: false },
                    )
                  }
                  onChange={e => {
                    if (e.target.value.length > 10) return
                    onChange(Number(e.target.value))
                  }}
                  disabled={!watch('isTaxable')}
                  endAdornment={
                    !watch('isTaxable') ? null : (
                      <InputAdornment position='end'>%</InputAdornment>
                    )
                  }
                  type='number'
                  // inputProps={{ inputMode: 'decimal' }}
                  label='Tax rate*'
                  // endAdornment={<InputAdornment position='end'>%</InputAdornment>}
                />
              </FormControl>
            )}
          />
          {renderErrorMsg('tax')}
        </Grid>
      ) : null}

      <Grid item xs={6}>
        <Controller
          name='paymentDueDate.date'
          control={control}
          render={({ field: { value, onChange } }) => (
            <FullWidthDatePicker
              showTimeSelect
              timeFormat='HH:mm'
              timeIntervals={30}
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
      {type === 'edit' && (
        <>
          <Grid item xs={6}>
            <Controller
              name='invoiceConfirmDate.date'
              control={control}
              render={({ field: { value, onChange } }) => {
                const selected = !value ? null : new Date(value)
                const clientConfirmedDate = !invoiceInfo?.clientConfirmedAt
                  ? null
                  : new Date(invoiceInfo?.clientConfirmedAt)
                return (
                  <FullWidthDatePicker
                    showTimeSelect
                    timeFormat='HH:mm'
                    timeIntervals={30}
                    // selected={
                    //   !client
                    //     ? selected
                    //     : isClientRegistered
                    //     ? clientConfirmedDate
                    //     : selected
                    // }
                    selected={!value ? null : new Date(value)}
                    disabled={!isClientRegistered}
                    dateFormat='MM/dd/yyyy h:mm aa'
                    onChange={onChange}
                    customInput={
                      <CustomInput
                        label='Invoice confirm date'
                        icon='calendar'
                      />
                    }
                  />
                )
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <Controller
              name='invoiceConfirmDate.timezone'
              control={control}
              render={({ field }) => {
                const selected = !field.value ? undefined : field.value
                const clientConfirmedTimezone =
                  !invoiceInfo?.clientConfirmTimezone
                    ? undefined
                    : invoiceInfo?.clientConfirmTimezone

                return (
                  <Autocomplete
                    autoHighlight
                    fullWidth
                    {...field}
                    value={
                      !client
                        ? selected
                        : isClientRegistered
                          ? clientConfirmedTimezone
                          : selected
                    }
                    disabled={!isClientRegistered}
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
                        autoComplete='off'
                        label='Time zone'
                        error={Boolean(errors?.invoiceConfirmDate?.timezone)}
                        inputProps={{
                          ...params.inputProps,
                        }}
                      />
                    )}
                  />
                )
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <Controller
              name='taxInvoiceDueDate.date'
              control={control}
              render={({ field: { value, onChange } }) => {
                const selected = !value ? null : new Date(value)
                const clientConfirmedDate = !invoiceInfo?.clientConfirmedAt
                  ? null
                  : new Date(invoiceInfo?.clientConfirmedAt)

                console.log(isClientRegistered)

                return (
                  <FullWidthDatePicker
                    showTimeSelect
                    timeFormat='HH:mm'
                    timeIntervals={30}
                    dateFormat='MM/dd/yyyy h:mm aa'
                    // selected={
                    //   !client
                    //     ? selected
                    //     : isClientRegistered
                    //     ? clientConfirmedDate
                    //     : selected
                    // }
                    selected={!value ? null : new Date(value)}
                    onChange={onChange}
                    customInput={
                      <CustomInput
                        label='Tax invoice due date'
                        icon='calendar'
                      />
                    }
                  />
                )
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <Controller
              name='taxInvoiceDueDate.timezone'
              control={control}
              render={({ field }) => {
                const selected = !field.value ? undefined : field.value
                return (
                  <Autocomplete
                    autoHighlight
                    fullWidth
                    {...field}
                    value={selected}
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
                        autoComplete='off'
                        label='Time zone'
                        error={Boolean(errors?.taxInvoiceDueDate?.timezone)}
                        inputProps={{
                          ...params.inputProps,
                        }}
                      />
                    )}
                  />
                )
              }}
            />
          </Grid>
        </>
      )}

      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={12}>
        <Box display='flex' justifyContent='space-between' alignItems='center'>
          <Typography variant='h6' mb='24px'>
            Invoice description
          </Typography>
          <Box display='flex' alignItems='center'>
            <Controller
              name={'showDescription'}
              control={control}
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

            <Typography variant='body2'>
              Show invoice description to client
            </Typography>
          </Box>
        </Box>
        <Controller
          name='invoiceDescription'
          control={control}
          render={({ field: { value, onChange } }) => (
            <>
              <TextField
                rows={4}
                autoComplete='off'
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
