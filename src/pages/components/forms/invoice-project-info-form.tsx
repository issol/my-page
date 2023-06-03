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
export default function InvoiceProjectInfoForm({
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
  const { data, isSuccess } = useGetWorkNameList()

  const setValueOptions = { shouldDirty: true, shouldValidate: true }

  useEffect(() => {
    if (clientTimezone) {
      setValue('paymentDueDate.timezone', clientTimezone, setValueOptions)
      setValue('invoiceConfirmDate.timezone', clientTimezone, setValueOptions)
      setValue('taxInvoiceDueDate.timezone', clientTimezone, setValueOptions)
    }
  }, [clientTimezone])

  useEffect(() => {
    if (isSuccess) {
      setWorkName(data)
    }
  }, [isSuccess])

  function renderErrorMsg(key: keyof OrderProjectInfoFormType) {
    return (
      <>
        {/* {errors[key] && (
          <FormHelperText sx={{ color: 'error.main' }}>
            {errors[key]?.message}
          </FormHelperText>
        )} */}
      </>
    )
  }

  return (
    <Fragment>
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Controller
            name='sendReminder'
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
              showTimeSelect
              timeFormat='HH:mm'
              timeIntervals={15}
              selected={new Date(value)}
              dateFormat='MM/dd/yyyy h:mm aa'
              onChange={onChange}
              customInput={
                <CustomInput label='Invoice date*' icon='calendar' />
              }
            />
          )}
        />
        {renderErrorMsg('orderDate')}
      </Grid>
      <Grid item xs={6}>
        <Controller
          name='status'
          control={control}
          render={({ field: { value, onChange } }) => (
            <Autocomplete
              autoHighlight
              fullWidth
              options={statusList}
              onChange={(e, v) => {
                onChange(v?.statusName ?? '')
              }}
              value={
                statusList.find(item => item.statusName === value) ?? {
                  id: 0,
                  statusName: '',
                }
              }
              getOptionLabel={option => option.statusName}
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
          name='workName'
          control={control}
          render={({ field: { value, onChange } }) => {
            const finedValue = workName.find(item => item.value === value)
            return (
              <Autocomplete
                disableClearable
                autoHighlight
                fullWidth
                disabled={true}
                options={workName || []}
                onChange={(e, v) => {
                  onChange(v?.value ?? '')
                }}
                value={
                  !value || !workName
                    ? defaultValue
                    : finedValue ?? defaultValue
                }
                renderInput={params => (
                  <TextField
                    {...params}
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
      <Grid item xs={6}>
        <Controller
          name='projectName'
          control={control}
          render={({ field: { value, onChange } }) => (
            <TextField
              fullWidth
              disabled={true}
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
              value={
                !value
                  ? defaultValue
                  : CategoryList.find(item => item.value === value)
              }
              renderInput={params => (
                <TextField
                  {...params}
                  error={Boolean(errors.category)}
                  label='Category'
                  placeholder='Category'
                />
              )}
            />
          )}
        />
      </Grid>
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
                sx={{
                  borderRadius: '8px',
                  background: 'rgba(76, 78, 100, 0.12) !important',
                  '& .MuiChip-root': {
                    '&. MuiChip-label': {
                      color: 'rgba(76, 78, 100, 0.38)',
                      opacity: '1 !important',
                    },
                    '& .MuiSvgIcon-root': {
                      display: 'none',
                    },
                  },
                }}
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
                  <TextField {...params} label='Service type' />
                )}
              />
            )
          }}
        />
      </Grid>
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
                sx={{
                  borderRadius: '8px',
                  background: 'rgba(76, 78, 100, 0.12) !important',
                  '& .MuiChip-root': {
                    '&. MuiChip-label': {
                      color: 'rgba(76, 78, 100, 0.38)',
                      opacity: '1 !important',
                    },
                    '& .MuiSvgIcon-root': {
                      display: 'none',
                    },
                  },
                }}
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
                  <TextField {...params} label='Area of expertise' />
                )}
              />
            )
          }}
        />
      </Grid>
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
                renderInput={params => (
                  <TextField
                    {...params}
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
          name='taxable'
          control={control}
          render={({ field: { value, onChange } }) => {
            return (
              <Autocomplete
                autoHighlight
                fullWidth
                disabled
                options={[
                  { value: true, label: 'Taxable' },
                  { value: false, label: 'Non-Taxable' },
                ]}
                onChange={(e, v) => {
                  onChange(v?.label ?? { value: true, label: 'Taxable' })
                }}
                value={[
                  { value: true, label: 'Taxable' },
                  { value: false, label: 'Non-Taxable' },
                ].find(item => item.value === value)}
                getOptionLabel={option => option.label}
                renderInput={params => (
                  <TextField
                    {...params}
                    error={Boolean(errors.taxable)}
                    label='Tax type*'
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
                label='Write down an invoice description.'
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
