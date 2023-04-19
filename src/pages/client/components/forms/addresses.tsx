// ** mui
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Divider,
  FormHelperText,
  Grid,
  IconButton,
  TextField,
  Typography,
} from '@mui/material'

// ** types
import { isInvalidPhoneNumber } from '@src/shared/helpers/phone-number.validator'

import { ClientAddressFormType } from '@src/types/schema/client-address.schema'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** react hook form
import {
  Control,
  Controller,
  FieldArrayWithId,
  FieldErrors,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
  UseFieldArrayUpdate,
  UseFormGetValues,
  UseFormWatch,
} from 'react-hook-form'
import { Fragment, useState } from 'react'
import { getTypeList } from '@src/shared/transformer/type.transformer'

type Props = {
  checked: boolean
  setChecked: (v: boolean) => void
  control: Control<ClientAddressFormType, any>
  fields: FieldArrayWithId<ClientAddressFormType, 'clientAddresses', 'id'>[]
  append: UseFieldArrayAppend<ClientAddressFormType, 'clientAddresses'>
  remove: UseFieldArrayRemove
  update: UseFieldArrayUpdate<ClientAddressFormType, 'clientAddresses'>
  getValues: UseFormGetValues<ClientAddressFormType>
  errors: FieldErrors<ClientAddressFormType>
  isValid: boolean
  watch: UseFormWatch<ClientAddressFormType>
  onNextStep: () => void
  handleBack: () => void
}
export default function AddressesForm({
  checked,
  setChecked,
  control,
  fields,
  append,
  remove,
  update,
  getValues,
  errors,
  isValid,
  watch,
  onNextStep,
  handleBack,
}: Props) {
  const country = getTypeList('CountryCode')
  // const [checked, setChecked] = useState(false)
  const basicAddress = fields.filter(item => item.addressType !== 'additional')
  const additionalAddress = fields.filter(
    item => item.addressType === 'additional',
  )

  function renderForm(
    id: string,
    key:
      | 'baseAddress'
      | 'detailAddress'
      | 'city'
      | 'state'
      | 'zipCode'
      | 'name',
    label: string,
    maxLength: number,
  ) {
    const idx = fields.map(item => item.id).indexOf(id)
    return (
      <>
        <Controller
          name={`clientAddresses.${idx}.${key}`}
          control={control}
          render={({ field: { value, onChange } }) => (
            <TextField
              fullWidth
              error={
                key !== 'name'
                  ? false
                  : errors?.clientAddresses?.length
                  ? Boolean(errors?.clientAddresses[idx]?.name)
                  : false
              }
              label={label}
              value={value ?? ''}
              onChange={onChange}
              inputProps={{ maxLength }}
            />
          )}
        />
        {key === 'name' &&
          errors?.clientAddresses?.length &&
          errors?.clientAddresses[idx]?.name && (
            <FormHelperText sx={{ color: 'error.main' }}>
              {errors?.clientAddresses[idx]?.name?.message}
            </FormHelperText>
          )}
      </>
    )
  }

  function renderFormTemplate(id: string) {
    const idx = fields.map(item => item.id).indexOf(id)
    return (
      <>
        <Grid item xs={6}>
          {renderForm(id, 'baseAddress', 'Street 1', 200)}
        </Grid>
        <Grid item xs={6}>
          {renderForm(id, 'detailAddress', 'Street 2', 200)}
        </Grid>
        <Grid item xs={6}>
          {renderForm(id, 'city', 'City', 100)}
        </Grid>
        <Grid item xs={6}>
          {renderForm(id, 'state', 'State', 100)}
        </Grid>
        <Grid item xs={6}>
          <Controller
            name={`clientAddresses.${idx}.country`}
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
                    label='Country'
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
          {renderForm(id, 'zipCode', 'ZIP code', 20)}
        </Grid>
      </>
    )
  }

  function setShippingAddress(isSameWithBilling: boolean) {
    const id = fields.filter(item => item.addressType === 'shipping')[0].id
    const idx = fields.map(item => item.id).indexOf(id)
    const billingAddress = fields.filter(
      item => item.addressType === 'billing',
    )[0]
    if (isSameWithBilling) {
      update(idx, { ...billingAddress, addressType: 'shipping' })
    } else {
      update(idx, { addressType: 'shipping' })
    }
  }

  function appendAddress() {
    append({
      addressType: 'additional',
    })
  }

  function removeAddress(id: string) {
    if (fields.length > 1) {
      const idx = fields.map(item => item.id).indexOf(id)
      idx !== -1 && remove(idx)
    }
  }

  return (
    <Grid container spacing={6}>
      {basicAddress.map((item, idx) => {
        return (
          <Fragment key={item?.id}>
            <Grid item xs={12}>
              <Typography variant='h6'>
                {item.addressType === 'billing' ? 'Billing' : 'Shipping'}{' '}
                address
              </Typography>
              {item.addressType === 'shipping' ? (
                <Box>
                  <Checkbox
                    checked={checked}
                    onChange={e => {
                      setChecked(e.target.checked)
                      setShippingAddress(e.target.checked)
                    }}
                  />
                  <Typography
                    variant='body2'
                    component='label'
                    htmlFor='hideBlocked'
                  >
                    Same as the billing address
                  </Typography>
                </Box>
              ) : null}
            </Grid>
            {renderFormTemplate(item.id)}
            <Grid item xs={12}>
              <Divider />
            </Grid>
          </Fragment>
        )
      })}

      <Grid item xs={12}>
        <Typography variant='h6'>Additional address</Typography>
      </Grid>
      {additionalAddress?.map((item, idx) => (
        <Fragment key={item?.id}>
          <Grid item xs={12} display='flex' justifyContent='space-between'>
            <Typography variant='h6'>
              {idx < 9 ? 0 : null}
              {idx + 1}.
            </Typography>
            <IconButton onClick={() => removeAddress(item.id)}>
              <Icon icon='mdi:trash-outline' />
            </IconButton>
          </Grid>
          <Grid item xs={12}>
            {renderForm(item.id, 'name', 'Address name*', 100)}
          </Grid>
          {renderFormTemplate(item.id)}
        </Fragment>
      ))}
      <Grid item xs={12}>
        <Button
          onClick={appendAddress}
          variant='contained'
          disabled={!isValid}
          sx={{ p: 0.7, minWidth: 26 }}
        >
          <Icon icon='material-symbols:add' />
        </Button>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={12} display='flex' justifyContent='space-between'>
        <Button variant='outlined' color='secondary' onClick={handleBack}>
          <Icon icon='material-symbols:arrow-back-rounded' />
          Previous
        </Button>
        <Button variant='contained' disabled={!isValid} onClick={onNextStep}>
          Next <Icon icon='material-symbols:arrow-forward-rounded' />
        </Button>
      </Grid>
    </Grid>
  )
}
