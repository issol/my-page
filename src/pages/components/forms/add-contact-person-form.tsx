import { Fragment, useRef, useState } from 'react'

import {
  Autocomplete,
  Box,
  Button,
  Divider,
  FormHelperText,
  Grid,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material'

// ** components
import { ModalContainer } from '@src/@core/components/modal'

// ** helper
import { isInvalidPhoneNumber } from '@src/shared/helpers/phone-number.validator'

// ** types
import {
  ClientContactPersonType,
  ContactPersonType,
  PersonType,
} from '@src/types/schema/client-contact-person.schema'

// ** react hook form
import {
  Control,
  Controller,
  FieldArrayWithId,
  FieldErrors,
  UseFormHandleSubmit,
  UseFormWatch,
} from 'react-hook-form'

// ** Data
import { countries } from 'src/@fake-db/autocomplete'
import { CountryType } from '@src/types/sign/personalInfoTypes'

type Props<T extends number | string = number> = {
  fields: FieldArrayWithId<ClientContactPersonType, 'contactPersons', 'id'>[]
  control: Control<ClientContactPersonType<T>, any>
  errors: FieldErrors<ClientContactPersonType<T>>
  watch: UseFormWatch<ClientContactPersonType<T>>
}

// ** TAD가 직접 contact person을 등록하는 경우에 사용되는 schema
export default function AddContactPersonForm<
  T extends number | string = number,
>(props: Props<T>) {
  const { fields, control, errors, watch } = props

  const personType: Array<PersonType> = ['Mr.', 'Ms.']

  function renderErrorMsg(idx: number, key: keyof ContactPersonType) {
    if (errors?.contactPersons?.length) {
      const error = errors?.contactPersons[idx]?.[key]?.message
      return (
        <FormHelperText sx={{ color: 'error.main' }}>
          {typeof error === 'string' && error}
        </FormHelperText>
      )
    }
    return null
  }

  function renderPersonTypeBtn(
    type: PersonType,
    value: PersonType,
    onChange: (...event: any[]) => void,
  ) {
    return (
      <Button
        key={type}
        variant='outlined'
        onClick={() => onChange(type)}
        color={value === type ? 'primary' : 'secondary'}
      >
        {type}
      </Button>
    )
  }

  function renderTextFieldForm(
    idx: number,
    key: keyof ContactPersonType,
    label: string,
    maxLength: number,
    placeholder?: string,
  ) {
    {
      return (
        <Fragment>
          <Controller
            name={`contactPersons.${idx}.${key}`}
            control={control}
            render={({ field: { value, onChange } }) => (
              <TextField
                fullWidth
                error={Boolean(errors?.contactPersons?.[idx]?.[key])}
                label={label}
                value={value ?? ''}
                onChange={onChange}
                placeholder={placeholder}
                inputProps={{ maxLength }}
              />
            )}
          />
          {renderErrorMsg(idx, key)}
        </Fragment>
      )
    }
  }

  function renderPhoneField(
    idx: number,
    key: keyof ContactPersonType,
    label: string,
  ) {
    return (
      <>
        <Controller
          name={`contactPersons.${idx}.${key}`}
          control={control}
          rules={{ required: false }}
          render={({ field: { value, onChange } }) => (
            <TextField
              fullWidth
              autoFocus
              label={label}
              variant='outlined'
              value={value ?? ''}
              onChange={e => {
                if (isInvalidPhoneNumber(e.target.value)) return
                onChange(e)
              }}
              inputProps={{ maxLength: 50 }}
              placeholder={
                !watch(`contactPersons.${idx}.timezone`)?.phone
                  ? `+ 1) 012 345 6789`
                  : `012 345 6789`
              }
              InputProps={{
                startAdornment: watch(`contactPersons.${idx}.timezone`)
                  ?.phone && (
                  <InputAdornment position='start'>
                    {'+' + watch(`contactPersons.${idx}.timezone`)?.phone}
                  </InputAdornment>
                ),
              }}
            />
          )}
        />
        {renderErrorMsg(idx, key)}
      </>
    )
  }

  return (
    <Fragment>
      {fields.length
        ? fields.map((item, idx) => (
            <Fragment key={item.id}>
              <Grid item xs={12}>
                <Controller
                  name={`contactPersons.${idx}.personType`}
                  control={control}
                  render={({ field: { value, onChange } }) => {
                    return (
                      <Box display='flex' gap='18px'>
                        {personType.map(item =>
                          renderPersonTypeBtn(item, value ?? 'Mr.', onChange),
                        )}
                      </Box>
                    )
                  }}
                />
              </Grid>
              <Grid item xs={4}>
                {renderTextFieldForm(idx, 'firstName', 'First name*', 50)}
              </Grid>
              <Grid item xs={4}>
                {renderTextFieldForm(idx, 'middleName', 'Middle name', 50)}
              </Grid>
              <Grid item xs={4}>
                {renderTextFieldForm(idx, 'lastName', 'Last name*', 50)}
              </Grid>
              <Grid item xs={6}>
                {renderTextFieldForm(
                  idx,
                  'department',
                  'Department',
                  50,
                  'IP business',
                )}
              </Grid>
              <Grid item xs={6}>
                {renderTextFieldForm(
                  idx,
                  'jobTitle',
                  'Job title',
                  50,
                  'Manager',
                )}
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={6}>
                <Controller
                  name={`contactPersons.${idx}.timezone`}
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      autoHighlight
                      fullWidth
                      {...field}
                      options={countries as CountryType[]}
                      onChange={(e, v) => field.onChange(v)}
                      disableClearable
                      renderOption={(props, option) => (
                        <Box component='li' {...props}>
                          {option.label} ({option.code}) +{option.phone}
                        </Box>
                      )}
                      renderInput={params => (
                        <TextField
                          {...params}
                          label='Time zone*'
                          error={Boolean(
                            errors?.contactPersons?.[idx]?.timezone,
                          )}
                          inputProps={{
                            ...params.inputProps,
                          }}
                        />
                      )}
                    />
                  )}
                />
                {renderErrorMsg(idx, 'timezone')}
              </Grid>
              <Grid item xs={6}>
                {renderPhoneField(idx, 'phone', 'Telephone')}
              </Grid>
              <Grid item xs={6}>
                {renderPhoneField(idx, 'mobile', 'Mobile phone')}
              </Grid>
              <Grid item xs={6}>
                {renderPhoneField(idx, 'fax', 'Fax')}
              </Grid>

              <Grid item xs={12}>
                {renderTextFieldForm(idx, 'email', 'Email*', 100)}
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12}>
                <Typography variant='h6' mb='24px' textAlign='left'>
                  Memo for contact person
                </Typography>
                <Controller
                  name={`contactPersons.${idx}.memo`}
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <>
                      <TextField
                        rows={4}
                        multiline
                        fullWidth
                        placeholder='Write down some information to keep in mind about this contact person'
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
          ))
        : null}
    </Fragment>
  )
}
