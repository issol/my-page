import { Fragment } from 'react'

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
} from 'react-hook-form'

import { getTypeList } from '@src/shared/transformer/type.transformer'

type Props = {
  checked?: boolean
  setChecked?: (v: boolean) => void
  control: Control<ClientAddressFormType, any>
  fields: FieldArrayWithId<ClientAddressFormType, 'clientAddresses', 'id'>[]
  append: UseFieldArrayAppend<ClientAddressFormType, 'clientAddresses'>
  remove: UseFieldArrayRemove
  update: UseFieldArrayUpdate<ClientAddressFormType, 'clientAddresses'>
  errors: FieldErrors<ClientAddressFormType>
  isValid: boolean
  // ** type : ClientAddressesForm과 동일한 format이나, 필수값에 차이가 있음.
  // ** all-required는 client address form을 수정할때, role이 CLIENT인 유저가 최초로 정보를 등록할 때 사용
  type?: 'all-required' | 'default'
  getValues: UseFormGetValues<ClientAddressFormType>
}

export default function ClientAddressesForm({
  checked,
  setChecked,
  control,
  fields,
  append,
  remove,
  update,
  errors,
  isValid,
  type = 'default',
  getValues,
}: Props) {
  const country = getTypeList('CountryCode')
  const basicAddress = fields.filter(item => item.addressType !== 'additional')
  const additionalAddress = fields.filter(
    item => item.addressType === 'additional',
  )
  const isAllRequired = type === 'all-required'

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
              error={Boolean(errors?.clientAddresses?.[idx]?.[key])}
              label={label}
              value={value ?? ''}
              onChange={onChange}
              inputProps={{ maxLength }}
            />
          )}
        />
        {errors?.clientAddresses?.[idx]?.[key] && (
          <FormHelperText sx={{ color: 'error.main' }}>
            {errors?.clientAddresses?.[idx]?.[key]?.message}
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
          {renderForm(
            id,
            'baseAddress',
            isAllRequired ? 'Street 1*' : 'Street 1',
            200,
          )}
        </Grid>
        <Grid item xs={6}>
          {renderForm(id, 'detailAddress', 'Street 2', 200)}
        </Grid>
        <Grid item xs={6}>
          {renderForm(id, 'city', isAllRequired ? 'City*' : 'City', 100)}
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
                    label={isAllRequired ? 'Country*' : 'Country'}
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
          {renderForm(
            id,
            'zipCode',
            isAllRequired ? 'ZIP code*' : 'ZIP code',
            20,
          )}
        </Grid>
      </>
    )
  }

  function setShippingAddress(isSameWithBilling: boolean) {
    const id = fields.filter(item => item.addressType === 'shipping')[0].id
    const idx = fields.map(item => item.id).indexOf(id)
    console.log('isSameWithBilling', getValues())
    const billingAddress = getValues()?.clientAddresses?.find(
      item => item.addressType === 'billing',
    )
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
    <Fragment>
      {basicAddress.map((item, idx) => {
        return (
          <Fragment key={item?.id}>
            <Grid item xs={12}>
              <Typography variant='h6'>
                {item.addressType === 'billing' ? 'Billing' : 'Shipping'}{' '}
                address
              </Typography>
              {item.addressType === 'shipping' &&
              checked !== undefined &&
              setChecked ? (
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
    </Fragment>
  )
}
