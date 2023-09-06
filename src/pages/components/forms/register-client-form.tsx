import { useEffect, useState } from 'react'

// ** mui
import {
  Autocomplete,
  Divider,
  FormControlLabel,
  Grid,
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
import { getGmtTime } from '@src/shared/helpers/timezone.helper'

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
  setTax: (n: number) => void
  setTaxable: (n: boolean) => void
  type: 'order' | 'invoice' | 'quotes' | 'request'
  formType: 'create' | 'edit'
  getValue: UseFormGetValues<ClientFormType>
}

export default function RegisterClientForm({
  control,
  setValue,
  watch,
  clientList,
  setTax,
  setTaxable,
  type,
  formType,
  getValue,
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
  const contracts = watch('contacts')

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
        setTax(clientDetail.tax)
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
                  type === 'invoice'
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
                disabled={type === 'request' || getValue('clientId') === null}
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
          placeholder='Time zone'
          value={
            !contracts?.timezone ? '-' : getGmtTime(contracts?.timezone?.code)
          }
          disabled={true}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          fullWidth
          placeholder='Telephone'
          value={
            !contracts?.phone
              ? '-'
              : getPhoneNumber(contracts?.timezone?.phone, contracts?.phone)
          }
          disabled={true}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          fullWidth
          placeholder='Mobile phone'
          value={
            !contracts?.mobile
              ? '-'
              : getPhoneNumber(contracts?.timezone?.phone, contracts?.mobile)
          }
          disabled={true}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          fullWidth
          placeholder='Fax'
          value={
            !contracts?.fax
              ? '-'
              : getPhoneNumber(contracts?.timezone?.phone, contracts?.fax)
          }
          disabled={true}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          placeholder='Email'
          value={!contracts?.email ? '-' : contracts?.email}
          disabled={true}
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
                label={`Shipping address ${getAddress(
                  contracts?.addresses,
                  'shipping',
                )}`}
              />
              <FormControlLabel
                value='billing'
                onChange={(e, v) => field.onChange('billing')}
                checked={field.value === 'billing'}
                control={<Radio />}
                label={`Billing address ${getAddress(
                  contracts?.addresses,
                  'billing',
                )}`}
              />
            </RadioGroup>
          )}
        />
      </Grid>
    </Grid>
  )
}
