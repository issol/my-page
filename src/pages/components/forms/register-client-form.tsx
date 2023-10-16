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
  UseFormReset,
  UseFormSetValue,
  UseFormTrigger,
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
import { id } from 'date-fns/locale'

type Props = {
  control: Control<ClientFormType, any>
  setValue: UseFormSetValue<ClientFormType>
  watch: UseFormWatch<ClientFormType>
  clientList: Array<{ value: number; label: string; tax: number | null }>
  trigger?: UseFormTrigger<ClientFormType>

  setTaxable: (n: boolean) => void
  setTax: (n: number | null) => void
  type: 'order' | 'invoice' | 'quotes' | 'request'
  formType: 'create' | 'edit'
  getValue: UseFormGetValues<ClientFormType>
  fromQuote: boolean
  reset?: UseFormReset<ClientFormType>
}

const setValueOptions = { shouldDirty: true, shouldValidate: true }

export default function RegisterClientForm({
  control,
  setValue,
  watch,
  clientList,

  setTaxable,
  setTax,
  type,
  formType,
  getValue,
  fromQuote,
  trigger,
  reset,
}: Props) {
  const defaultFilter: Array<any> = [
    { value: NOT_APPLICABLE, label: 'Not applicable' },
  ]
  const [contactPersonList, setContactPersonList] = useState<Array<any>>([
    ...defaultFilter,
  ])

  const [clientDetail, setClientDetail] = useState<ClientDetailType | null>(
    null,
  )

  const clientId = watch('clientId')
  const contacts = watch('contacts')

  useEffect(() => {
    console.log(clientId)

    if (!clientId) {
      reset &&
        reset({
          clientId: null,
          contactPersonId: null,
          contacts: {
            timezone: { code: '', label: '', phone: '' },
            phone: '',
            mobile: '',
            fax: '',
            email: '',
            addresses: [],
          },
        })
      return
    } else {
      getDetail(clientId, false)
    }
  }, [clientId])
  console.log(getValue())

  function getDetail(id: number, resetClientId = true) {
    console.log(id)

    return getClientDetail(id)
      .then(res => {
        setClientDetail(res)
        console.log(res)

        reset &&
          reset({
            ...getValue(),
            clientId: id,
            contacts: {
              timezone: res?.timezone!,
              phone: res?.phone ?? '',
              mobile: res?.mobile ?? '',
              fax: res?.fax ?? '',
              email: res?.email ?? '',
              addresses:
                res?.clientAddresses?.filter(
                  item => item.addressType !== 'additional',
                ) || [],
            },
          })

        if (res.isTaxable && res.tax) {
          setTaxable(res.isTaxable)
          setTax(res.tax)
        }
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
        // setClientDetail(null)
        setContactPersonList(defaultFilter)
      })
      .finally(() => {
        // setContactPerson(null)
        if (resetClientId) {
          setValue('contactPersonId', NOT_APPLICABLE, {
            shouldDirty: true,
            shouldValidate: true,
          })
        }
      })
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
      return `${address?.baseAddress ? `${address.baseAddress}, ` : ''} ${
        address?.detailAddress ? `${address.detailAddress}, ` : ''
      } ${address?.city ? `${address.city}, ` : ''} ${
        address?.state ? `${address.state}, ` : ''
      } ${address?.country ? `${address.country}, ` : ''} ${
        address.zipCode ?? ''
      }`
    } else return '-'
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
                    setTax(selectedClient?.tax ?? null)
                    onChange(v.value)
                  } else {
                    onChange(null)
                    reset &&
                      reset({
                        clientId: null,

                        contactPersonId: null,
                        contacts: {
                          timezone: { code: '', label: '', phone: '' },
                          phone: '',
                          mobile: '',
                          fax: '',
                          email: '',
                          addresses: [],
                        },
                      })
                    // setValue('contactPersonId', null, {
                    //   shouldValidate: true,
                    //   shouldDirty: true,
                    // })
                  }
                }}
                disabled={
                  type === 'request' ||
                  (formType === 'edit' && type === 'order') ||
                  type === 'invoice' ||
                  (fromQuote && getValue('isEnrolledClient'))
                }
                disableClearable={getValue('clientId') === null}
                value={selectedClient || { value: -0, label: '', tax: null }}
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
                    const res = contactPersonList.find(
                      item => item.id === Number(v.value),
                    )
                    // setContactPerson(res ? res : v)

                    if (res) {
                      reset &&
                        reset({
                          clientId: clientId,
                          contactPersonId: res?.id,

                          contacts: {
                            timezone: res?.timezone,
                            phone: res?.phone ?? '',
                            mobile: res?.mobile ?? '',
                            fax: res?.fax ?? '',
                            email: res?.email ?? '',
                            addresses: getValue('contacts.addresses'),
                          },
                        })
                    } else {
                      reset &&
                        reset({
                          clientId: clientId,
                          contactPersonId: v.value,

                          contacts: {
                            timezone: clientDetail?.timezone!,
                            phone: clientDetail?.phone ?? '',
                            mobile: clientDetail?.mobile ?? '',
                            fax: clientDetail?.fax ?? '',
                            email: clientDetail?.email ?? '',
                            addresses:
                              clientDetail?.clientAddresses?.filter(
                                item => item.addressType !== 'additional',
                              ) || [],
                          },
                        })
                    }
                  } else {
                    onChange(null)
                    // setValue('clientId', clientId)
                    console.log(clientDetail)

                    reset &&
                      reset({
                        clientId: clientId,
                        contactPersonId: null,
                        contacts: {
                          timezone: clientDetail?.timezone!,
                          phone: clientDetail?.phone ?? '',
                          mobile: clientDetail?.mobile ?? '',
                          fax: clientDetail?.fax ?? '',
                          email: clientDetail?.email ?? '',
                          addresses:
                            clientDetail?.clientAddresses?.filter(
                              item => item.addressType !== 'additional',
                            ) || [],
                        },
                      })
                    // setContactPerson(null)
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
        <Controller
          name='contacts.timezone'
          control={control}
          render={({ field: { value } }) => {
            return (
              <TextField
                fullWidth
                label={
                  value &&
                  getValue().contactPersonId &&
                  getGmtTimeEng(value.code) !== '-'
                    ? 'Time zone'
                    : null
                }
                value={
                  value &&
                  getValue().contactPersonId &&
                  getGmtTimeEng(value.code) !== '-'
                    ? getGmtTimeEng(value.code)
                    : ''
                }
                disabled={true}
                InputProps={{
                  startAdornment: (
                    <>
                      {value &&
                      getValue().contactPersonId &&
                      getGmtTimeEng(value.code) !== '-' ? null : (
                        <Box sx={{ width: '100%' }}>Time zone</Box>
                      )}
                    </>
                  ),
                }}
              />
            )
          }}
        ></Controller>
      </Grid>
      <Grid item xs={6}>
        <Controller
          name='contacts.phone'
          control={control}
          render={({ field: { value } }) => (
            <TextField
              fullWidth
              label={value && getValue().contactPersonId ? 'Telephone' : null}
              value={
                !value || value === '' || !getValue().contactPersonId
                  ? ''
                  : `+ ${getValue('contacts.timezone.phone')} ) ${value}`
              }
              disabled={true}
              InputProps={{
                startAdornment: (
                  <>
                    {(value || value !== '') &&
                    getValue().contactPersonId ? null : (
                      <Box sx={{ width: '100%' }}>Telephone</Box>
                    )}
                  </>
                ),
              }}
            />
          )}
        />
      </Grid>
      <Grid item xs={6}>
        <Controller
          name='contacts.mobile'
          control={control}
          render={({ field: { value } }) => (
            <TextField
              fullWidth
              label={
                value && getValue().contactPersonId ? 'Mobile phone' : null
              }
              // placeholder='Mobile phone'
              value={
                !value || value === '' || !getValue().contactPersonId
                  ? ''
                  : `+ ${getValue('contacts.timezone.phone')} ) ${value}`
              }
              disabled={true}
              InputProps={{
                startAdornment: (
                  <>
                    {(value || value !== '') &&
                    getValue().contactPersonId ? null : (
                      <Box sx={{ width: '100%' }}>Mobile phone</Box>
                    )}
                  </>
                ),
              }}
            />
          )}
        />
      </Grid>
      <Grid item xs={6}>
        <Controller
          name='contacts.fax'
          control={control}
          render={({ field: { value } }) => (
            <TextField
              fullWidth
              label={value && getValue().contactPersonId ? 'Fax' : null}
              // placeholder='Fax'
              value={
                !value || value === '' || !getValue().contactPersonId
                  ? ''
                  : `+ ${getValue('contacts.timezone.phone')} ) ${value}`
              }
              disabled={true}
              InputProps={{
                startAdornment: (
                  <>
                    {(value || value !== '') &&
                    getValue().contactPersonId ? null : (
                      <Box sx={{ width: '100%' }}>Fax</Box>
                    )}
                  </>
                ),
              }}
            />
          )}
        />
      </Grid>
      <Grid item xs={12}>
        <Controller
          name='contacts.email'
          control={control}
          render={({ field: { value } }) => (
            <TextField
              fullWidth
              // placeholder='Email'
              label={value && getValue().contactPersonId ? 'Email' : null}
              value={
                !value || value === '' || !getValue().contactPersonId
                  ? ''
                  : value
              }
              disabled={true}
              InputProps={{
                startAdornment: (
                  <>
                    {(value || value !== '') &&
                    getValue().contactPersonId ? null : (
                      <Box sx={{ width: '100%' }}>Email</Box>
                    )}{' '}
                    {}
                  </>
                ),
              }}
            />
          )}
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
                label={
                  <div style={{ whiteSpace: 'nowrap' }}>
                    Shipping address{' '}
                    <span style={{ fontWeight: 600 }}>
                      {getValue().contactPersonId
                        ? getAddress(contacts?.addresses, 'shipping')
                        : '-'}
                    </span>
                  </div>
                }
              />
              <FormControlLabel
                value='billing'
                onChange={(e, v) => field.onChange('billing')}
                checked={field.value === 'billing'}
                control={<Radio />}
                label={
                  <div style={{ whiteSpace: 'nowrap' }}>
                    Billing address{' '}
                    <span style={{ fontWeight: 600 }}>
                      {getValue().contactPersonId
                        ? getAddress(contacts?.addresses, 'billing')
                        : '-'}
                    </span>
                  </div>
                }
              />
            </RadioGroup>
          )}
        />
      </Grid>
    </Grid>
  )
}
