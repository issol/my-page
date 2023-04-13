import { useState } from 'react'
import { useRouter } from 'next/router'
import useModal from '@src/hooks/useModal'

import { Box, Grid, IconButton, Typography } from '@mui/material'
import PageHeader from '@src/@core/components/page-header'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

import PageLeaveModal from '../components/modals/page-leave-modal'
import AddClientStepper from '../components/stepper/add-client-stepper'

/* 
TODO : 
1. stepper
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

  // Handle Stepper
  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1)
  }

  const onNextStep = () => {
    setActiveStep(activeStep + 1)
  }

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
