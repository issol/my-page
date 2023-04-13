import { useState } from 'react'
import { useRouter } from 'next/router'
import useModal from '@src/hooks/useModal'

// ** mui
import { Box, Grid, IconButton, Typography } from '@mui/material'
import PageHeader from '@src/@core/components/page-header'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** components
import PageLeaveModal from '../components/modals/page-leave-modal'
import AddClientStepper from '../components/stepper/add-client-stepper'

// ** react hook form
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

// ** validation values
import {
  CompanyInfoFormType,
  companyInfoDefaultValue,
  companyInfoSchema,
} from '@src/types/schema/company-info.schema'
import {
  ClientAddressFormType,
  clientAddressSchema,
} from '@src/types/schema/client-address.schema'
import {
  ClientContactPersonType,
  clientContactPersonSchema,
} from '@src/types/schema/client-contact-person.schema'

/* 
TODO : 
1. stepper - done
2. react hook form setting / validator 제작
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

  const steps = [
    {
      title: 'Company info',
    },
    {
      title: 'Addresses',
    },
    {
      title: 'Contact person',
    },
    {
      title: 'Prices',
    },
  ]

  // ** stepper
  const [activeStep, setActiveStep] = useState<number>(0)

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
    formState: { errors: companyInfoErrors, isValid: isCompanyInfoValid },
  } = useForm<CompanyInfoFormType>({
    defaultValues: companyInfoDefaultValue,
    resolver: yupResolver(companyInfoSchema),
  })
  const {
    control: addressControl,
    getValues: getAddressValues,
    setValue: setAddressValues,
    handleSubmit: submitAddress,
    formState: { errors: addressErrors, isValid: isAddressValid },
  } = useForm<ClientAddressFormType>({
    defaultValues: [],
    mode: 'onBlur',
    resolver: yupResolver(clientAddressSchema),
  })

  const {
    control: contactPersonControl,
    getValues: getContactPersonValues,
    setValue: setContactPersonValues,
    handleSubmit: submitContactPerson,
    formState: { errors: contactPersonErrors, isValid: isContactPersonValid },
  } = useForm<ClientContactPersonType>({
    defaultValues: [],
    mode: 'onBlur',
    resolver: yupResolver(clientContactPersonSchema),
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
    </Grid>
  )
}

AddNewClient.acl = {
  subject: 'client',
  action: 'create',
}
