import { useEffect, useState } from 'react'

// ** mui
import {
  Autocomplete,
  Box,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material'

// ** react hook form
import {
  Control,
  Controller,
  UseFormGetValues,
  UseFormSetValue,
  UseFormWatch,
} from 'react-hook-form'

// ** fetch
import { getClientDetail } from '@src/apis/client.api'

// ** helpers
import { getLegalName } from '@src/shared/helpers/legalname.helper'
import { getGmtTimeEng } from '@src/shared/helpers/timezone.helper'

// ** types
import { ClientFormType } from '@src/types/schema/client.schema'
import { ClientDetailType } from '@src/types/client/client'
import { CountryType } from '@src/types/sign/personalInfoTypes'
import { ClientAddressType } from '@src/types/schema/client-address.schema'
import { NOT_APPLICABLE } from '@src/shared/const/not-applicable'

type Props = {
  control: Control<ClientFormType, any>
  setValue: UseFormSetValue<ClientFormType>
  watch: UseFormWatch<ClientFormType>
  clientList: Array<{ value: number; label: string }>

  setTaxable: (n: boolean) => void
  type: 'order' | 'invoice' | 'quotes' | 'request'
  formType: 'create' | 'edit'
  getValue: UseFormGetValues<ClientFormType>
  fromQuote: boolean
}

export default function RegisterClientForm({
  control,
  setValue,
  watch,
  clientList,

  setTaxable,
  type,
  formType,
  getValue,
  fromQuote,
}: Props) {
  const [clientDetail, setClientDetail] = useState<ClientDetailType | null>(
    null,
  )
  const [contactPerson, setContactPerson] = useState<{
    id: number
    firstName: string
    middleName: string | null
    lastName: string
    timezone: CountryType
    phone: string | null
    mobile: string | null
    fax: string | null
    email: string
    label?: string
  } | null>(null)

  const defaultFilter: Array<any> = [
    { value: NOT_APPLICABLE, label: 'Not applicable' },
  ]
  const [contactPersonList, setContactPersonList] = useState<Array<any>>([
    ...defaultFilter,
  ])

  const clientId = watch('clientId')
  const contacts = watch('contacts')

  useEffect(() => {
    if (!clientId) return
    getDetail(clientId!, false)
  }, [clientId])

  useEffect(() => {
    const contracts: {
      timezone?: CountryType
      phone?: string | null
      mobile?: string | null
      fax?: string | null
      email?: string | null
      addresses?: ClientAddressType[]
    } = {
      timezone: { phone: '', label: '', code: '' },
      phone: '',
      mobile: '',
      fax: '',
      email: '',
    }
    if (!contactPerson?.label || contactPerson?.label === 'Not applicable') {
      contracts.timezone = clientDetail?.timezone
      contracts.phone = clientDetail?.phone
      contracts.mobile = clientDetail?.mobile
      contracts.fax = clientDetail?.fax
      contracts.email = clientDetail?.email
      if (clientDetail?.isTaxable && clientDetail?.tax) {
        setTaxable(clientDetail.isTaxable)
      }
    } else {
      contracts.timezone = contactPerson?.timezone
      contracts.phone = contactPerson?.phone
      contracts.mobile = contactPerson?.mobile
      contracts.fax = contactPerson?.fax
      contracts.email = contactPerson?.email
    }
    contracts.addresses = clientDetail?.clientAddresses
    setValue('contacts', contracts)
  }, [contactPerson, clientDetail])

  function getDetail(id: number, resetClientId = true) {
    return getClientDetail(id)
      .then(res => {
        setClientDetail(res)
        if (res?.contactPersons?.length) {
          const result = res.contactPersons.map(item => ({
            ...item,
            value: item.id,
            label: !item?.jobTitle
              ? getLegalName({
                  firstName: item.firstName!,
                  middleName: item.middleName,
                  lastName: item.lastName!,
                })
              : `${getLegalName({
                  firstName: item.firstName!,
                  middleName: item.middleName,
                  lastName: item.lastName!,
                })} / ${item.jobTitle}`,
          }))
          if (!result[0].userId) {
            setContactPersonList(defaultFilter.concat(result))
          } else {
            setContactPersonList(result)
          }
        } else {
          setContactPersonList(defaultFilter)
        }
      })
      .catch(e => {
        setClientDetail(null)
        setContactPersonList(defaultFilter)
      })
      .finally(() => {
        setContactPerson(null)
        if (resetClientId) {
          setValue('contactPersonId', NOT_APPLICABLE, {
            shouldDirty: true,
            shouldValidate: true,
          })
        }
      })
  }

  console.log(contacts)

  function getPhoneNumber(
    code: string | undefined,
    phone: string | undefined | null,
  ) {
    if (!code || !phone) return ''
    return `+ ${code} ) phone`
  }

  function getAddress(
    addresses:
      | Array<ClientAddressType & { id?: string | undefined }>
      | undefined,
    type: 'shipping' | 'billing',
  ) {
    if (!addresses) return '-'
    const result = addresses.filter(item => item.addressType === type)
    if (result.length) {
      const address = result[0]
      return `${address?.baseAddress ?? ''} ${address?.detailAddress ?? ''} ${
        address?.city ?? ''
      } ${address?.state ?? ''} ${address?.country ?? ''} ${
        address.zipCode ?? '-'
      }`
    }
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={6}>
        <Controller
          name='clientId'
          control={control}
          render={({ field: { value, onChange } }) => {
            const selectedClient = clientList.find(item => item.value === value)
            return (
              <Autocomplete
                autoHighlight
                fullWidth
                options={clientList}
                isOptionEqualToValue={(option, newValue) => {
                  return option.value === newValue.value
                }}
                onChange={(e, v) => {
                  if (v) {
                    onChange(v.value)
                  } else {
                    onChange(null)
                    setValue('contactPersonId', null, {
                      shouldValidate: true,
                      shouldDirty: true,
                    })
                  }
                }}
                disabled={
                  type === 'request' ||
                  (formType === 'edit' && type === 'order') ||
                  type === 'invoice' ||
                  (fromQuote && getValue('isEnrolledClient'))
                }
                disableClearable={getValue('clientId') === null}
                value={selectedClient || { value: -0, label: '' }}
                renderInput={params => (
                  <TextField
                    {...params}
                    label='Company name*'
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
          name='contactPersonId'
          control={control}
          render={({ field: { value, onChange } }) => {
            const personList = contactPersonList.map(item => ({
              value: item.value,
              label: item.label,
            }))
            const selectedPerson = personList.find(item => item.value === value)
            return (
              <Autocomplete
                autoHighlight
                fullWidth
                options={personList}
                isOptionEqualToValue={(option, newValue) => {
                  return option.value === newValue.value
                }}
                onChange={(e, v) => {
                  if (v) {
                    onChange(v.value)
                    const res = contactPersonList.filter(
                      item => item.id === Number(v.value),
                    )
                    setContactPerson(res.length ? res[0] : v)
                  } else {
                    onChange(null)
                    setContactPerson(null)
                  }
                }}
                disableClearable={getValue('contactPersonId') === null}
                disabled={
                  type === 'request' ||
                  getValue('clientId') === null ||
                  (fromQuote && getValue('isEnrolledClient'))
                }
                value={selectedPerson || { value: '', label: '' }}
                renderInput={params => (
                  <TextField
                    {...params}
                    label='Contact person*'
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
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={12}>
        <Typography variant='h6'>Contacts</Typography>
      </Grid>
      <Grid item xs={6}>
        <TextField
          fullWidth
          label={contacts?.timezone ? 'Time zone' : null}
          // label='Time zone'
          // placeholder='Time zone'
          value={
            !contacts?.timezone ? null : getGmtTimeEng(contacts?.timezone?.code)
          }
          disabled={true}
          InputProps={{
            startAdornment: (
              <>
                {contacts?.timezone ? null : (
                  <Box sx={{ width: '100%' }}>Time zone</Box>
                )}
              </>
            ),
          }}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          fullWidth
          label={contacts?.phone ? 'Telephone' : null}
          // placeholder='Telephone'
          // label='Telephone'
          value={
            !contacts?.phone
              ? null
              : getPhoneNumber(contacts?.timezone?.phone, contacts?.phone)
          }
          disabled={true}
          InputProps={{
            startAdornment: (
              <>
                {contacts?.phone ? null : (
                  <Box sx={{ width: '100%' }}>Telephone</Box>
                )}
              </>
            ),
          }}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          fullWidth
          label={contacts?.mobile ? 'Mobile phone' : null}
          // placeholder='Mobile phone'
          value={
            !contacts?.mobile
              ? null
              : getPhoneNumber(contacts?.timezone?.phone, contacts?.mobile)
          }
          disabled={true}
          InputProps={{
            startAdornment: (
              <>
                {contacts?.mobile ? null : (
                  <Box sx={{ width: '100%' }}>Mobile phone</Box>
                )}
              </>
            ),
          }}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          fullWidth
          label={contacts?.fax ? 'Fax' : null}
          // placeholder='Fax'
          value={
            !contacts?.fax
              ? null
              : getPhoneNumber(contacts?.timezone?.phone, contacts?.fax)
          }
          disabled={true}
          InputProps={{
            startAdornment: (
              <>
                {contacts?.fax ? null : <Box sx={{ width: '100%' }}>Fax</Box>}
              </>
            ),
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          // placeholder='Email'
          label={contacts?.email ? 'Email' : null}
          value={!contacts?.email ? null : contacts?.email}
          disabled={true}
          InputProps={{
            startAdornment: (
              <>
                {contacts?.email ? null : (
                  <Box sx={{ width: '100%' }}>Email</Box>
                )}
              </>
            ),
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={12}>
        <Typography variant='h6'>Address</Typography>
      </Grid>
      <Grid item xs={12}>
        <Controller
          name='addressType'
          control={control}
          render={({ field }) => (
            <RadioGroup
              aria-label='address'
              name='address'
              defaultValue='shipping'
            >
              <FormControlLabel
                value='shipping'
                control={<Radio />}
                onChange={(e, v) => field.onChange('shipping')}
                checked={field.value === 'shipping'}
                label={`Shipping address ${
                  contacts?.addresses && contacts?.addresses.length > 0 ? (
                    <Typography variant='body1' fontWeight={600}>
                      {getAddress(contacts?.addresses, 'shipping')}
                    </Typography>
                  ) : (
                    '-'
                  )
                }`}
              />
              <FormControlLabel
                value='billing'
                onChange={(e, v) => field.onChange('billing')}
                checked={field.value === 'billing'}
                control={<Radio />}
                label={`Billing address ${
                  contacts?.addresses && contacts?.addresses.length > 0 ? (
                    <Typography variant='body1' fontWeight={600}>
                      {getAddress(contacts?.addresses, 'billing')}
                    </Typography>
                  ) : (
                    '-'
                  )
                }`}
              />
            </RadioGroup>
          )}
        />
      </Grid>
    </Grid>
  )
}
