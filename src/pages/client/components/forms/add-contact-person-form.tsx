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
  FieldErrors,
  UseFormGetValues,
  UseFormHandleSubmit,
  UseFormWatch,
} from 'react-hook-form'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Data
import { countries } from 'src/@fake-db/autocomplete'
import { CountryType } from '@src/types/sign/personalInfoTypes'
import AddContactPersonConfirmModal from '../modals/add-contact-person-confirm-modal'

type Props = {
  mode: 'create' | 'update'
  idx: number
  control: Control<ClientContactPersonType, any>
  errors: FieldErrors<ClientContactPersonType>
  onSubmit: (data: ClientContactPersonType) => void
  handleSubmit: UseFormHandleSubmit<ClientContactPersonType>
  watch: UseFormWatch<ClientContactPersonType>
  isValid: boolean
  getValues: UseFormGetValues<ClientContactPersonType>
  onCancel: () => void
  onDiscard: () => void
}
export default function AddContactPersonForm(props: Props) {
  const {
    mode,
    idx,
    control,
    errors,
    onSubmit,
    watch,
    isValid,
    getValues,
    onCancel,
    handleSubmit,
    onDiscard,
  } = props

  const [openAdd, setOpenAdd] = useState(false)

  const personType: Array<PersonType> = ['Mr.', 'Ms.']

  function renderErrorMsg(key: keyof ContactPersonType) {
    return (
      <>
        {errors?.contactPersons?.length ? (
          <FormHelperText sx={{ color: 'error.main' }}>
            {errors?.contactPersons[idx]?.[key]?.message}
          </FormHelperText>
        ) : null}
      </>
    )
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
          {renderErrorMsg(key)}
        </Fragment>
      )
    }
  }

  function renderPhoneField(key: keyof ContactPersonType, label: string) {
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
        {renderErrorMsg(key)}
      </>
    )
  }

  return (
    <ModalContainer style={{ padding: '50px 60px' }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={6}>
          {mode === 'create' ? (
            <Grid item xs={12} display='flex' justifyContent='flex-start'>
              <Typography variant='h5'>Add contact person</Typography>
            </Grid>
          ) : null}

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
          <Grid item xs={6}>
            {renderTextFieldForm('firstName', 'First name*', 50)}
          </Grid>
          <Grid item xs={6}>
            {renderTextFieldForm('middleName', 'Middle name', 50)}
          </Grid>
          <Grid item xs={6}>
            {renderTextFieldForm('lastName', 'Last name*', 50)}
          </Grid>
          <Grid item xs={6}>
            {renderTextFieldForm('department', 'Department', 50, 'IP business')}
          </Grid>
          <Grid item xs={6}>
            {renderTextFieldForm('jobTitle', 'Job title', 50, 'Manager')}
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
                      error={Boolean(errors?.contactPersons?.[idx]?.timezone)}
                      inputProps={{
                        ...params.inputProps,
                      }}
                    />
                  )}
                />
              )}
            />
            {renderErrorMsg('timezone')}
          </Grid>
          <Grid item xs={6}>
            {renderPhoneField('mobile', 'Mobile phone')}
          </Grid>
          <Grid item xs={6}>
            {renderPhoneField('fax', 'Fax')}
          </Grid>

          <Grid item xs={12}>
            {renderTextFieldForm('email', 'Email*', 100)}
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
                    label='Write down some information to keep in mind about this contact person'
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
          <Grid item xs={12} display='flex' gap='22px' justifyContent='center'>
            {mode === 'create' ? (
              <Button variant='outlined' color='secondary' onClick={onDiscard}>
                Discard
              </Button>
            ) : (
              <Button variant='outlined' color='secondary' onClick={onCancel}>
                Cancel
              </Button>
            )}

            {mode === 'create' ? (
              <Button
                variant='contained'
                type='button'
                disabled={!isValid}
                onClick={() => setOpenAdd(true)}
              >
                Add
              </Button>
            ) : (
              <Button variant='contained' type='submit' disabled={!isValid}>
                Save
              </Button>
            )}
          </Grid>
        </Grid>
      </form>

      <AddContactPersonConfirmModal
        open={openAdd}
        onAdd={() => onSubmit(getValues())}
        onClose={() => setOpenAdd(false)}
      />
    </ModalContainer>
  )
}
