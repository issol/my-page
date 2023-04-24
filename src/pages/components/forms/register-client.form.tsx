import { useState } from 'react'

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

// ** types
import { ProjectTeamType } from '@src/types/schema/project-team.schema'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** react hook form
import {
  useForm,
  useFieldArray,
  Control,
  Controller,
  FieldArrayWithId,
  FieldErrors,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
  UseFieldArrayUpdate,
  UseFormGetValues,
  UseFormHandleSubmit,
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

type Props = {
  control: Control<ClientFormType, any>
  getValues: UseFormGetValues<ClientFormType>
  setValue: UseFormSetValue<ClientFormType>
  errors: FieldErrors<ClientFormType>
  isValid: boolean
  watch: UseFormWatch<ClientFormType>
  clientList: Array<{ value: string; label: string }>
}

export default function RegisterClientForm({
  control,
  getValues,
  setValue,
  errors,
  isValid,
  watch,
  clientList,
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
  const [contactPersonList, setContactPersonList] = useState<Array<any>>([
    { value: null, label: 'Not applicable' },
  ])
  const defaultFilter: Array<any> = [{ value: null, label: 'Not applicable' }]

  console.log(contactPersonList)
  function getDetail(id: number) {
    return getClientDetail(id)
      .then(res => {
        setClientDetail(res)
        if (res?.contactPersons?.length) {
          const result = res.contactPersons.map(item => ({
            ...item,
            value: item.id,
            label: getLegalName({
              firstName: item.firstName!,
              middleName: item.middleName,
              lastName: item.lastName!,
            }),
          }))
          setContactPersonList(defaultFilter.concat(result))
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
        setValue('contactPersonId', null, {
          shouldDirty: true,
          shouldValidate: true,
        })
      })
  }

  console.log(getValues())
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
          render={({ field }) => (
            <Autocomplete
              autoHighlight
              fullWidth
              {...field}
              options={clientList.map(item => ({
                value: item.value,
                label: item.label,
              }))}
              onChange={(e, v) => {
                field.onChange(v.value)
                getDetail(Number(v.value))
              }}
              disableClearable
              value={
                !field?.value
                  ? { value: '', label: '' }
                  : clientList.filter(
                      item => item.value === field.value?.toString(),
                    )[0]
              }
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
          )}
        />
      </Grid>
      <Grid item xs={6}>
        <Controller
          name='contactPersonId'
          control={control}
          render={({ field }) => {
            return (
              <Autocomplete
                autoHighlight
                fullWidth
                {...field}
                options={contactPersonList.map(item => ({
                  value: item.value,
                  label: item.label,
                }))}
                onChange={(e, v) => {
                  field.onChange(v.value)
                  const res = contactPersonList.filter(
                    item => item.id === Number(v.value),
                  )
                  setContactPerson(res.length ? res[0] : v)
                }}
                disableClearable
                value={
                  !field?.value
                    ? defaultFilter[0]
                    : contactPersonList.filter(
                        item => item.value === field.value,
                      )[0]
                }
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
            contactPerson === null
              ? '-'
              : contactPerson?.label === 'Not applicable'
              ? getGmtTime(clientDetail?.timezone?.code)
              : getGmtTime(contactPerson?.timezone?.code)
          }
          disabled={true}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          fullWidth
          placeholder='Telephone'
          value={
            contactPerson === null
              ? '-'
              : contactPerson?.label === 'Not applicable'
              ? getPhoneNumber(
                  clientDetail?.timezone?.phone,
                  clientDetail?.phone,
                )
              : getPhoneNumber(
                  contactPerson?.timezone?.phone,
                  contactPerson?.phone,
                )
          }
          disabled={true}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          fullWidth
          placeholder='Mobile phone'
          value={
            contactPerson === null
              ? '-'
              : contactPerson?.label === 'Not applicable'
              ? getPhoneNumber(
                  clientDetail?.timezone?.phone,
                  clientDetail?.mobile,
                )
              : getPhoneNumber(
                  contactPerson?.timezone?.phone,
                  contactPerson?.mobile,
                )
          }
          disabled={true}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          fullWidth
          placeholder='Fax'
          value={
            contactPerson === null
              ? ''
              : contactPerson?.label === 'Not applicable'
              ? getPhoneNumber(clientDetail?.timezone?.phone, clientDetail?.fax)
              : getPhoneNumber(
                  contactPerson?.timezone?.phone,
                  contactPerson?.fax,
                )
          }
          disabled={true}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          placeholder='Email'
          value={
            contactPerson === null
              ? ''
              : contactPerson?.label === 'Not applicable'
              ? clientDetail?.email
              : contactPerson?.email
          }
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
                  clientDetail?.clientAddresses,
                  'shipping',
                )}`}
              />
              <FormControlLabel
                value='billing'
                onChange={(e, v) => field.onChange('billing')}
                checked={field.value === 'billing'}
                control={<Radio />}
                label={`Billing address ${getAddress(
                  clientDetail?.clientAddresses,
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
