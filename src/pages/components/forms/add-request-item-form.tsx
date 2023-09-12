import { Fragment } from 'react'

// ** style components
import {
  Autocomplete,
  Box,
  FormHelperText,
  Grid,
  IconButton,
  TextField,
  Typography,
} from '@mui/material'
import styled from 'styled-components'
import { Icon } from '@iconify/react'

// ** react hook form
import {
  Control,
  Controller,
  FieldArrayWithId,
  FieldError,
  FieldErrors,
  Merge,
  UseFieldArrayRemove,
  UseFormSetValue,
  UseFormWatch,
} from 'react-hook-form'

// ** types
import { RequestFormType } from '@src/types/requests/common.type'
import { CountryType } from '@src/types/sign/personalInfoTypes'

// ** data
import {
  ServiceTypeList,
  ServiceTypePair,
} from '@src/shared/const/service-type/service-types'
import { CategoryList } from '@src/shared/const/category/categories'
import { getGloLanguage } from '@src/shared/transformer/language.transformer'
import { countries } from 'src/@fake-db/autocomplete'

// ** apis
import { useGetUnitOptions } from '@src/queries/options.query'

// ** Third Party Imports
import DatePicker from 'react-datepicker'

// ** Custom Component Imports
import CustomInput from '@src/views/forms/form-elements/pickers/PickersCustomInput'

// ** Date picker wrapper
import DatePickerWrapper from '@src/@core/styles/libs/react-datepicker'
import { DateTimePickerDefaultOptions } from '@src/shared/const/datePicker'
import { getGmtTime } from '@src/shared/helpers/timezone.helper'

type Props = {
  control: Control<RequestFormType, any>
  watch: UseFormWatch<RequestFormType>
  setValue: UseFormSetValue<RequestFormType>
  errors: FieldErrors<RequestFormType>
  fields: FieldArrayWithId<RequestFormType, 'items', 'id'>[]
  remove: UseFieldArrayRemove
}
export default function AddRequestForm({
  control,
  watch,
  setValue,
  errors,
  fields,
  remove,
}: Props) {
  const languageList = getGloLanguage()

  const { data: units } = useGetUnitOptions()

  function renderErrorMsg(
    errors:
      | FieldError
      | Merge<FieldError, (FieldError | undefined)[]>
      | undefined,
  ) {
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
    <Grid container spacing={6}>
      {fields?.map((item, idx) => {
        const watchCategory = watch(
          `items.${idx}.category`,
        ) as keyof typeof ServiceTypePair

        const numbering = idx + 1 > 9 ? `${idx}.` + 1 : `0${idx + 1}.`

        return (
          <Fragment key={item.id}>
            <Grid
              item
              xs={12}
              display='flex'
              alignItems='center'
              justifyContent='space-between'
            >
              <Typography fontWeight={600}>{numbering}</Typography>
              {idx > 0 && (
                <IconButton onClick={() => remove(idx)}>
                  <Icon icon='mdi:trash-outline' />
                </IconButton>
              )}
            </Grid>
            {/* item name */}
            <Grid item xs={12}>
              <Controller
                name={`items.${idx}.name`}
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <TextField
                    fullWidth
                    value={value}
                    onChange={onChange}
                    inputProps={{ maxLength: 200 }}
                    error={Boolean(errors?.items?.[idx]?.name)}
                    label='Item name*'
                    placeholder='Item name*'
                  />
                )}
              />
              {renderErrorMsg(errors?.items?.[idx]?.name)}
            </Grid>
            {/* language */}
            <Grid item xs={6}>
              <Controller
                name={`items.${idx}.sourceLanguage`}
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Autocomplete
                    autoHighlight
                    fullWidth
                    value={languageList.find(
                      option => option.value === value || '',
                    )}
                    options={languageList}
                    onChange={(event, v) => {
                      onChange(v ? v.value : '')
                    }}
                    renderInput={params => (
                      <TextField
                        {...params}
                        error={Boolean(errors?.items?.[idx]?.sourceLanguage)}
                        label='Source*'
                        placeholder='Source*'
                      />
                    )}
                  />
                )}
              />
              {renderErrorMsg(errors?.items?.[idx]?.sourceLanguage)}
            </Grid>
            <Grid item xs={6}>
              <Controller
                name={`items.${idx}.targetLanguage`}
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Autocomplete
                    autoHighlight
                    fullWidth
                    value={languageList.find(
                      option => option.value === value || '',
                    )}
                    options={languageList}
                    onChange={(event, v) => {
                      onChange(v ? v.value : '')
                    }}
                    renderInput={params => (
                      <TextField
                        {...params}
                        error={Boolean(errors?.items?.[idx]?.targetLanguage)}
                        label='Target*'
                        placeholder='Target*'
                      />
                    )}
                  />
                )}
              />
              {renderErrorMsg(errors?.items?.[idx]?.targetLanguage)}
            </Grid>

            {/* category */}
            <Grid item xs={6}>
              <Controller
                name={`items.${idx}.category`}
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <Autocomplete
                    autoHighlight
                    fullWidth
                    options={CategoryList}
                    value={CategoryList.find(i => i.value === value) || null}
                    onChange={(e, v) => {
                      onChange(v?.value ?? '')
                      setValue(`items.${idx}.serviceType`, [], {
                        shouldValidate: true,
                      })
                    }}
                    id='category'
                    getOptionLabel={option => option.label}
                    renderInput={params => (
                      <TextField
                        {...params}
                        error={Boolean(errors?.items?.[idx]?.category)}
                        label='Category*'
                        placeholder='Category*'
                      />
                    )}
                  />
                )}
              />
              {renderErrorMsg(errors?.items?.[idx]?.category)}
            </Grid>

            {/* service type */}
            <Grid item xs={6}>
              <Controller
                name={`items.${idx}.serviceType`}
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => {
                  return (
                    <Autocomplete
                      autoHighlight
                      fullWidth
                      multiple
                      disabled={!watchCategory}
                      options={ServiceTypePair[watchCategory] || []}
                      value={ServiceTypeList.filter(item =>
                        value?.includes(item.value),
                      )}
                      onChange={(e, v) => {
                        const data = v.map(i => i.value)
                        onChange(data)
                      }}
                      renderInput={params => (
                        <TextField
                          {...params}
                          error={Boolean(errors?.items?.[idx]?.serviceType)}
                          label='Service type*'
                          placeholder='Service type*'
                        />
                      )}
                    />
                  )
                }}
              />
              {renderErrorMsg(errors?.items?.[idx]?.serviceType)}
            </Grid>

            {/* Unit */}
            <Grid item xs={6}>
              <Controller
                name={`items.${idx}.unit`}
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Autocomplete
                    autoHighlight
                    fullWidth
                    value={units?.find(opt => opt.name === value || '')}
                    options={units || []}
                    onChange={(event, v) => {
                      onChange(v ? v.name : '')
                    }}
                    getOptionLabel={opt => opt.name}
                    renderInput={params => (
                      <TextField
                        {...params}
                        error={Boolean(errors?.items?.[idx]?.unit)}
                        label='Unit'
                        placeholder='Unit'
                      />
                    )}
                  />
                )}
              />
              {renderErrorMsg(errors?.items?.[idx]?.unit)}
            </Grid>
            <Grid item xs={6}>
              <Controller
                name={`items.${idx}.quantity`}
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => {
                  return (
                    <TextField
                      fullWidth
                      value={value ?? ''}
                      onChange={e => {
                        const val = e.target.value
                        onChange(!val ? null : val)
                      }}
                      type='number'
                      error={Boolean(errors?.items?.[idx]?.quantity)}
                      label='Quantity'
                      placeholder='Quantity'
                    />
                  )
                }}
              />
              {renderErrorMsg(errors?.items?.[idx]?.quantity)}
            </Grid>
            <Grid item xs={6}>
              <DatePickerWrapper>
                <Controller
                  name={`items.${idx}.desiredDueDate`}
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <FullWidthDatePicker
                      {...DateTimePickerDefaultOptions}
                      selected={!value ? null : new Date(value)}
                      onChange={onChange}
                      customInput={<CustomInput label='Desired due date*' />}
                    />
                  )}
                />
              </DatePickerWrapper>
            </Grid>
            <Grid item xs={6}>
              <Controller
                name={`items.${idx}.desiredDueTimezone`}
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    autoHighlight
                    fullWidth
                    {...field}
                    options={countries as CountryType[]}
                    onChange={(e, v) => field.onChange(v)}
                    disableClearable
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
                        error={Boolean(
                          errors?.items?.[idx]?.desiredDueTimezone?.code,
                        )}
                        inputProps={{
                          ...params.inputProps,
                        }}
                      />
                    )}
                  />
                )}
              />
            </Grid>
            {renderErrorMsg(errors?.items?.[idx]?.desiredDueTimezone?.code)}
          </Fragment>
        )
      })}
    </Grid>
  )
}

const FullWidthDatePicker = styled(DatePicker)`
  width: 100%;
`
