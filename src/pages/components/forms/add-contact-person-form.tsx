import { Fragment, useEffect, useRef, useState } from 'react'

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

import { v4 as uuidv4 } from 'uuid'
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
import { timeZoneFormatter } from '@src/shared/helpers/timezone.helper'
import MuiPhone from '../phone/mui-phone'

import { timezoneSelector } from '@src/states/permission'
import { useRecoilValueLoadable } from 'recoil'

type Props<T extends number | string = number> = {
  fields: FieldArrayWithId<ClientContactPersonType, 'contactPersons', 'id'>[]
  control: Control<ClientContactPersonType<T>, any>
  errors: FieldErrors<ClientContactPersonType<T>>
  watch: UseFormWatch<ClientContactPersonType<T>>
  index?: number
}

// ** TAD가 직접 contact person을 등록하는 경우에 사용되는 schema
export default function AddContactPersonForm<
  T extends number | string = number,
>(props: Props<T>) {
  const { fields, control, errors, watch, index } = props
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

  const personType: Array<PersonType> = ['Mr.', 'Ms.']

  const fieldIndex = index ? index : 0

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
            <MuiPhone
              value={(value as string) || ''}
              onChange={onChange}
              label={label}
            />
          )}
        />
        {renderErrorMsg(idx, key)}
      </>
    )
  }

  return (
    <Fragment>
      {fields.length && fields[0] !== undefined
        ? fields.map(item => (
            <Fragment key={item.id}>
              <Grid item xs={12}>
                <Controller
                  name={`contactPersons.${fieldIndex}.personType`}
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
                {renderTextFieldForm(
                  fieldIndex,
                  'firstName',
                  'First name*',
                  50,
                )}
              </Grid>
              <Grid item xs={4}>
                {renderTextFieldForm(
                  fieldIndex,
                  'middleName',
                  'Middle name',
                  50,
                )}
              </Grid>
              <Grid item xs={4}>
                {renderTextFieldForm(fieldIndex, 'lastName', 'Last name*', 50)}
              </Grid>
              <Grid item xs={6}>
                {renderTextFieldForm(
                  fieldIndex,
                  'department',
                  'Department',
                  50,
                  'IP business',
                )}
              </Grid>
              <Grid item xs={6}>
                {renderTextFieldForm(
                  fieldIndex,
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
                  name={`contactPersons.${fieldIndex}.timezone`}
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <Autocomplete
                      fullWidth
                      value={value || { code: '', label: '', phone: '' }}
                      options={timeZoneList as CountryType[]}
                      onChange={(e, v) => {
                        if (!v) onChange(null)
                        else onChange(v)
                      }}
                      renderOption={(props, option) => (
                        <Box component='li' {...props} key={uuidv4()}>
                          {timeZoneFormatter(option, timezone.getValue())}
                        </Box>
                      )}
                      renderInput={params => (
                        <TextField
                          {...params}
                          label='Time zone*'
                          error={Boolean(
                            errors.contactPersons?.[fieldIndex]?.timezone,
                          )}
                          inputProps={{
                            ...params.inputProps,
                          }}
                        />
                      )}
                      getOptionLabel={option =>
                        timeZoneFormatter(option, timezone.getValue()) ?? ''
                      }
                    />
                  )}
                />
                {renderErrorMsg(fieldIndex, 'timezone')}
              </Grid>
              <Grid item xs={6}>
                {renderPhoneField(fieldIndex, 'phone', 'Telephone')}
              </Grid>
              <Grid item xs={6}>
                {renderPhoneField(fieldIndex, 'mobile', 'Mobile phone')}
              </Grid>
              <Grid item xs={6}>
                {renderPhoneField(fieldIndex, 'fax', 'Fax')}
              </Grid>

              <Grid item xs={12}>
                {renderTextFieldForm(
                  fieldIndex,
                  'email',
                  'Email*',
                  100,
                  'username@example.com',
                )}
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12}>
                <Typography variant='h6' mb='24px' textAlign='left'>
                  Memo for contact person
                </Typography>
                <Controller
                  name={`contactPersons.${fieldIndex}.memo`}
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <>
                      <TextField
                        rows={4}
                        multiline
                        fullWidth
                        placeholder='Write down some information to keep in mind about this contact person.'
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
