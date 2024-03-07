import { Icon } from '@iconify/react'
import { Box, Card, Divider, IconButton, Typography } from '@mui/material'
import CustomModal from '@src/@core/components/common-modal/custom-modal'
import useModal from '@src/hooks/useModal'
import { useRouter } from 'next/router'
import Stepper from '@src/pages/components/stepper'
import { useMemo, useState } from 'react'

import { Resolver, useFieldArray, useForm } from 'react-hook-form'
import { LinguistTeamFormType } from '@src/types/pro/linguist-team'
import { yupResolver } from '@hookform/resolvers/yup'
import { linguistTeamSchema } from '@src/types/schema/pro/linguist-team.schema'
import LinguistTeamInfoForm from './components/info'
import { useGetClientList } from '@src/queries/client.query'
import { getGloLanguage } from '@src/shared/transformer/language.transformer'
import { useGetServiceType } from '@src/queries/common.query'
import SelectPro from './components/select-pro'
import SelectProModal from './components/select-pro-modal'

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

  const languageList = getGloLanguage()
  const { data: serviceTypeList } = useGetServiceType()
  const { data: clientData } = useGetClientList({ take: 1000, skip: 0 })
  const clientList = useMemo(
    () => clientData?.data?.map(i => i.name) || [],
    [clientData],
  )

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
    defaultValues: {
      isPrivate: false,
      isPriority: false,
      pros: [],
    },
    resolver: yupResolver(
      linguistTeamSchema,
    ) as unknown as Resolver<LinguistTeamFormType>,
  })

  const { fields, append, remove, update } = useFieldArray({
    control: control,
    name: 'pros',
  })

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1)
  }

  const handleNext = () => {
    setActiveStep(prevActiveStep => prevActiveStep + 1)
  }

  const onClickSave = (data: LinguistTeamFormType) => {
    handleNext()
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
                Pros.
                <br />
                <br /> The linguist team registered here will be recommended
                when assigning Pros for actual projects based on the registered
                team information.
              </Typography>
            </Box>
          }
          noButton
          closeButton
          rightButtonText='Close'
          onClick={() => closeModal('LinguistHelper')}
          onClose={() => closeModal('LinguistHelper')}
        />
      ),
    })
  }

  const onClickSelectProsHelperIcon = () => {
    openModal({
      type: 'SelectProsHelper',
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
                Select Pros
              </Typography>
              <Typography variant='body2' fontSize={16} fontWeight={400}>
                "Selected Pros" is the place where Pros intended to be added to
                the Linguist team are displayed.
                <br />
                <br /> If there is a priority order among Pros, you can assign
                priority to a Pro using the "Priority mode" checkbox.
                <br />
                <br />
                This assigned priority can be taken into consideration when
                submitting job requests to the Pros.
              </Typography>
            </Box>
          }
          noButton
          closeButton
          rightButtonText='Close'
          onClick={() => closeModal('SelectProsHelper')}
          onClose={() => closeModal('SelectProsHelper')}
        />
      ),
    })
  }

  const onClickAddPros = () => {
    openModal({
      type: 'SelectProModal',
      children: <SelectProModal onClose={() => closeModal('SelectProModal')} />,
      isCloseable: true,
    })
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        height: '100%',
      }}
    >
      <Box display='flex' alignItems='center' gap='8px'>
        <IconButton onClick={() => router.back()}>
          <Icon icon='material-symbols:arrow-back-ios-new-rounded' />
        </IconButton>
        <Typography variant='h5'>Create new linguist team</Typography>
        <IconButton sx={{ padding: 0 }} onClick={onClickLinguistHelperIcon}>
          <Icon icon='mdi:info-circle-outline' />
        </IconButton>
      </Box>
      <Card sx={{ height: '100%' }}>
        <Stepper
          activeStep={activeStep}
          steps={steps}
          style={{
            maxWidth: '50%',
            margin: '0 auto',
            padding: '20px 20px 20px 0',
          }}
        />

        <Divider />
        {activeStep === 0 ? (
          <LinguistTeamInfoForm
            handleNext={handleNext}
            control={control}
            handleSubmit={handleSubmit}
            onClickSave={onClickSave}
            isSubmitted={isSubmitted}
            clientList={clientList}
            languageList={languageList}
            serviceTypeList={serviceTypeList || []}
            getValues={getValues}
            trigger={trigger}
          />
        ) : (
          <SelectPro
            onClickSelectProsHelperIcon={onClickSelectProsHelperIcon}
            fields={fields}
            append={append}
            setValue={setValue}
            control={control}
            trigger={trigger}
            getValues={getValues}
            onClickAddPros={onClickAddPros}
          />
        )}
      </Card>
    </Box>
  )
}

AddNew.acl = {
  subject: 'pro',
  action: 'create',
}

export default AddNew
