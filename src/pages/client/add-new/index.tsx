import { useState } from 'react'
import { useRouter } from 'next/router'
import useModal from '@src/hooks/useModal'

// ** mui
import { Box, Card, Grid, IconButton, Typography } from '@mui/material'
import PageHeader from '@src/@core/components/page-header'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** components
import PageLeaveModal from '../components/modals/page-leave-modal'
import AddClientStepper from '../components/stepper/add-client-stepper'
import CompanyInfoForm from '../components/forms/company-info'
import AddressesForm from '../components/forms/addresses'

// ** react hook form
import { useForm, Controller, useFieldArray } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

// ** validation values
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
import ContactPersonForm from '../components/forms/contact-persons'

/* 
TODO : 
1. stepper - done
2. react hook form setting / validator 제작 - done
3. form 1,2,3,4
*/
export default function AddNewClient() {
  const router = useRouter()
  const { openModal, closeModal } = useModal()

  // ** confirm page leaving
  router.beforePopState(() => {
    openModal({
      type: 'alert-modal',
      children: (
        <PageLeaveModal
          onClose={() => closeModal('alert-modal')}
          onClick={() => router.push('/client')}
        />
      ),
    })
    return false
  })

  // ** TODO : steps는 role별로 다르게 주기
  const steps = [
    {
      title: 'Company info',
    },
    {
      title: 'AddressesForm',
    },
    {
      title: 'Contact person',
    },
    {
      title: 'Prices',
    },
  ]

  // ** stepper
  const [activeStep, setActiveStep] = useState<number>(2)

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1)
  }

  const onNextStep = () => {
    setActiveStep(activeStep + 1)
  }

  // ** forms
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

  //   const {
  //     control: priceControl,
  //     getValues: getPriceValues,
  //     setValue: setPriceValues,
  //     handleSubmit: submitPrice,
  //     formState: { errors: priceErrors, isValid: isPriceValid },
  //   } = useForm<PriceFormType>({
  //     defaultValues,
  //     mode: 'onBlur',
  //     resolver: yupResolver(priceUnitSchema),
  //   })

  return (
    <Grid container spacing={6}>
      <PageHeader
        title={
          <Box display='flex' alignItems='center' gap='8px'>
            <IconButton onClick={() => router.back()}>
              <Icon icon='material-symbols:arrow-back-ios-new-rounded' />
            </IconButton>
            <Typography variant='h5'>Add new client</Typography>
          </Box>
        }
      />
      <Grid item xs={12}>
        <AddClientStepper activeStep={activeStep} steps={steps} />
      </Grid>
      <Grid item xs={12}>
        {activeStep === 0 ? (
          <Card sx={{ padding: '24px' }}>
            <CompanyInfoForm
              control={companyInfoControl}
              getValues={getCompanyInfoValues}
              setValue={setCompanyInfoValues}
              handleSubmit={submitCompanyInfo}
              errors={companyInfoErrors}
              isValid={isCompanyInfoValid}
              watch={companyInfoWatch}
              onNextStep={onNextStep}
            />
          </Card>
        ) : activeStep === 1 ? (
          <Card sx={{ padding: '24px' }}>
            <AddressesForm
              control={addressControl}
              fields={addresses}
              append={appendAddress}
              remove={removeAddress}
              update={updateAddress}
              getValues={getAddressValues}
              errors={addressErrors}
              isValid={isAddressValid}
              watch={watchAddress}
              handleBack={handleBack}
              onNextStep={onNextStep}
            />
          </Card>
        ) : activeStep === 2 ? (
          <Card sx={{ padding: '24px' }}>
            <ContactPersonForm
              control={contactPersonControl}
              fields={contactPersons}
              append={appendContactPersons}
              remove={removeContactPersons}
              update={updateContactPersons}
              getValues={getContactPersonValues}
              errors={contactPersonErrors}
              isValid={isContactPersonValid}
              watch={watchContactPerson}
              handleSubmit={submitContactPerson}
              onNextStep={handleBack}
              handleBack={handleBack}
            />
          </Card>
        ) : (
          <Card>여기여기</Card>
        )}
      </Grid>
    </Grid>
  )
}

AddNewClient.acl = {
  subject: 'client',
  action: 'create',
}
