// ** mui
import { Button, CardHeader, Grid } from '@mui/material'

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
import { yupResolver } from '@hookform/resolvers/yup'

import {
  CompanyInfoFormType,
  companyInfoDefaultValue,
  companyInfoSchema,
} from '@src/types/schema/company-info.schema'
import {
  ClientAddressFormType,
  clientAddressDefaultValue,
  clientAddressSchema,
} from '@src/types/schema/client-address.schema'
import {
  ClientContactPersonType,
  clientContactPersonSchema,
  contactPersonDefaultValue,
} from '@src/types/schema/client-contact-person.schema'
import { ClientFormType } from '@src/types/schema/client.schema'

// ** components
import ProjectTeamForm from '@src/pages/components/forms/project-team-form'
import { useGetMemberList } from '@src/queries/quotes.query'
import { useGetClientList } from '@src/queries/client.query'
import { useEffect, useState } from 'react'
import RegisterClientForm from '@src/pages/components/forms/register-client.form'

type Props = {
  control: Control<ClientFormType, any>
  getValues: UseFormGetValues<ClientFormType>
  setValue: UseFormSetValue<ClientFormType>
  errors: FieldErrors<ClientFormType>
  isValid: boolean
  watch: UseFormWatch<ClientFormType>
  handleBack: () => void
  onNextStep: () => void
}
export default function ClientQuotesFormContainer({
  control,
  getValues,
  setValue,
  errors,
  isValid,
  watch,
  handleBack,
  onNextStep,
}: Props) {
  const {
    control: companyInfoControl,
    getValues: getCompanyInfoValues,
    setValue: setCompanyInfoValues,
    handleSubmit: submitCompanyInfo,
    watch: companyInfoWatch,
    formState: { errors: companyInfoErrors, isValid: isCompanyInfoValid },
  } = useForm<CompanyInfoFormType>({
    mode: 'onChange',
    defaultValues: companyInfoDefaultValue,
    resolver: yupResolver(companyInfoSchema),
  })
  const {
    control: addressControl,
    getValues: getAddressValues,
    setValue: setAddressValues,
    handleSubmit: submitAddress,
    watch: watchAddress,
    formState: { errors: addressErrors, isValid: isAddressValid },
  } = useForm<ClientAddressFormType>({
    defaultValues: clientAddressDefaultValue,
    mode: 'onChange',
    resolver: yupResolver(clientAddressSchema),
  })

  const {
    fields: addresses,
    append: appendAddress,
    remove: removeAddress,
    update: updateAddress,
  } = useFieldArray({
    control: addressControl,
    name: 'clientAddresses',
  })

  const {
    control: contactPersonControl,
    getValues: getContactPersonValues,
    setValue: setContactPersonValues,
    handleSubmit: submitContactPerson,
    watch: watchContactPerson,
    formState: { errors: contactPersonErrors, isValid: isContactPersonValid },
  } = useForm<ClientContactPersonType>({
    defaultValues: contactPersonDefaultValue,
    mode: 'onChange',
    resolver: yupResolver(clientContactPersonSchema),
  })

  const {
    fields: contactPersons,
    append: appendContactPersons,
    remove: removeContactPersons,
    update: updateContactPersons,
  } = useFieldArray({
    control: contactPersonControl,
    name: 'contactPersons',
  })

  //fetch client
  const [clients, setClients] = useState<
    Array<{ value: string; label: string }>
  >([])
  const {
    data: clientList,
    isLoading,
    isSuccess,
  } = useGetClientList({
    skip: 0,
    take: 1000,
  })

  useEffect(() => {
    if (isSuccess) {
      setClients(
        clientList.data.map(item => ({
          value: item.clientId.toString(),
          label: item.name,
        })),
      )
    }
  }, [isSuccess])

  return (
    <Grid container spacing={6}>
      <CardHeader title='Select client' />
      <Grid item xs={12} display='flex' justifyContent='flex-end'>
        {/* <ProjectTeamForm
          control={control}
          field={field}
          append={append}
          remove={remove}
          update={update}
          setValue={setValue}
          errors={errors}
          isValid={isValid}
          watch={watch}
          memberList={data || []}
        /> */}
        <RegisterClientForm
          control={control}
          getValues={getValues}
          setValue={setValue}
          errors={errors}
          isValid={isValid}
          watch={watch}
          clientList={clients}
        />
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
