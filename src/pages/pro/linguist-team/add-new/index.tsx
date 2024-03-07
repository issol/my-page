import { Icon } from '@iconify/react'
import { Box, Card, Divider, IconButton, Typography } from '@mui/material'
import CustomModal from '@src/@core/components/common-modal/custom-modal'
import useModal from '@src/hooks/useModal'
import { useRouter } from 'next/router'
import Stepper from '@src/pages/components/stepper'
import { useState } from 'react'
import { CheckBox } from '@mui/icons-material'
import { Resolver, useForm } from 'react-hook-form'
import { LinguistTeamFormType } from '@src/types/pro/linguist-team'
import { yupResolver } from '@hookform/resolvers/yup'
import { linguistTeamSchema } from '@src/types/schema/pro/linguist-team.schema'
const steps = [
  {
    title: 'Linguist team info',
  },
  {
    title: 'Select Pros',
  },
]

const AddNew = () => {
  const router = useRouter()
  const { openModal, closeModal } = useModal()

  const [activeStep, setActiveStep] = useState<number>(0)

  const {
    control,
    handleSubmit,
    getValues,
    setValue,
    trigger,
    setError,
    watch,
    reset,
    formState: { errors, isValid, isSubmitted, touchedFields, isDirty },
  } = useForm<LinguistTeamFormType>({
    mode: 'onSubmit',

    resolver: yupResolver(
      linguistTeamSchema,
    ) as unknown as Resolver<LinguistTeamFormType>,
  })

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1)
  }

  const onClickLinguistHelperIcon = () => {
    openModal({
      type: 'LinguistHelper',
      children: (
        <CustomModal
          vary='info'
          title={
            <Box
              sx={{
                display: 'flex',
                gap: '10px',
                flexDirection: 'column',
              }}
            >
              <Typography variant='body1' fontSize={20} fontWeight={500}>
                Linguist team
              </Typography>
              <Typography variant='body2' fontSize={16} fontWeight={400}>
                The Linguist Team is a feature that allows you to pre-register
                Pros in specific combinations. This feature also supports
                priority mode, which enables setting priority to the selected
                Pros. The linguist team registered here will be recommended when
                assigning Pros for actual projects based on the registered team
                information.
              </Typography>
            </Box>
          }
          noButton
          closeButton
          rightButtonText='Close'
          onClick={() => closeModal('JobTemplateHelp')}
          onClose={() => closeModal('JobTemplateHelp')}
        />
      ),
    })
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <Box display='flex' alignItems='center' gap='8px'>
        <IconButton onClick={() => router.back()}>
          <Icon icon='material-symbols:arrow-back-ios-new-rounded' />
        </IconButton>
        <Typography variant='h5'>Create new linguist team</Typography>
        <IconButton sx={{ padding: 0 }} onClick={onClickLinguistHelperIcon}>
          <Icon icon='mdi:info-circle-outline' />
        </IconButton>
      </Box>
      <Card>
        <Stepper
          activeStep={activeStep}
          steps={steps}
          style={{
            maxWidth: '50%',
            margin: '0 auto',
            padding: '20px 0',
          }}
        />

        <Divider />
        <Box
          sx={{
            padding: '32px 0',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '50%',
              padding: '0px 8px',
            }}
          >
            <Typography fontSize={20} fontWeight={500}>
              Linguist team info
            </Typography>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <CheckBox />
              <Typography fontSize={14} fontWeight={400}>
                Private team
              </Typography>
              <Icon icon='mdi:lock' color='#8D8E9A' fontSize={20} />
            </Box>
          </Box>
        </Box>
      </Card>
    </Box>
  )
}

AddNew.acl = {
  subject: 'pro',
  action: 'create',
}

export default AddNew
