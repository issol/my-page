import { Icon } from '@iconify/react'
import { Box, Card, Divider, IconButton, Typography } from '@mui/material'
import CustomModal from '@src/@core/components/common-modal/custom-modal'
import useModal from '@src/hooks/useModal'
import { useRouter } from 'next/router'
import Stepper from 'src/pages/[companyName]/components/stepper'
import { useEffect, useMemo, useState } from 'react'

import { Resolver, useFieldArray, useForm } from 'react-hook-form'
import { LinguistTeamFormType } from '@src/types/pro/linguist-team'
import { yupResolver } from '@hookform/resolvers/yup'
import { linguistTeamSchema } from '@src/types/schema/pro/linguist-team.schema'
import LinguistTeamInfoForm from './components/info'
import { useGetClientList } from '@src/queries/client.query'
import { getGloLanguage } from '@src/shared/transformer/language.transformer'
import {
  useGetServiceType,
  useGetSimpleClientList,
} from '@src/queries/common.query'
import SelectPro from './components/select-pro'
import SelectProModal from './components/select-pro-modal'
import { ProListType } from '@src/types/pro/list'
import registDND from './components/dnd'
import { useMutation } from 'react-query'
import { createLinguistTeam } from '@src/apis/pro/linguist-team'
import { displayCustomToast } from '@src/shared/utils/toast'
import CustomModalV2 from '@src/@core/components/common-modal/custom-modal-v2'
import { getValue } from '@mui/system'

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

  const createMutation = useMutation(
    (
      data: Omit<LinguistTeamFormType, 'pros'> & {
        pros: Array<{ userId: number; order: number }>
      },
    ) => createLinguistTeam(data),
    {
      onSuccess: (data: any) => {
        displayCustomToast('Saved successfully', 'success')
        router.replace(`/pro/linguist-team/detail/${data.id}`)
      },
      onError: (error: any) => {
        displayCustomToast('Failed to save', 'error')
      },
    },
  )

  const languageList = getGloLanguage()
  const { data: serviceTypeList } = useGetServiceType()
  const { data: clientList } = useGetSimpleClientList()

  const {
    control,
    handleSubmit,
    getValues,
    setValue,
    trigger,
    setError,
    watch,
    reset,
    formState: {
      errors,
      isValid,
      isSubmitted,
      touchedFields,
      isDirty,
      dirtyFields,
    },
  } = useForm<LinguistTeamFormType>({
    mode: 'onSubmit',
    defaultValues: {
      pros: [],
      isPrioritized: '0',
      isPrivate: '0',
    },
    resolver: yupResolver(
      linguistTeamSchema,
    ) as unknown as Resolver<LinguistTeamFormType>,
  })

  const { fields, append, remove, update, move } = useFieldArray({
    control: control,
    name: 'pros',
  })

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1)
  }

  const handleNext = (data: LinguistTeamFormType) => {
    setActiveStep(prevActiveStep => prevActiveStep + 1)
  }

  const onClickSave = () => {
    // router.replace('/pro/linguist-team/detail/1')
    console.log(getValues())
    const pros = getValues().pros.map((pro, index) => {
      return {
        userId: pro.userId,
        order: index + 1,
      }
    })
    const result = {
      ...getValues(),
      pros,
    }

    createMutation.mutate(result)
  }

  const onClickLinguistHelperIcon = () => {
    openModal({
      type: 'LinguistHelper',
      isCloseable: true,
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
                <br /> You can select the linguist team registered here when
                assigning Pros for actual projects.
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
      isCloseable: true,
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
                Selected Pros
              </Typography>
              <Typography variant='body2' fontSize={16} fontWeight={400}>
                "Selected Pros" is the place where Pros intended to be added to
                the Linguist team are displayed.
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
  const onClickSelectPro = (proList: ProListType[]) => {
    proList.forEach((pro, index) => {
      if (!fields.some(existingPro => existingPro.userId === pro.userId)) {
        append({ ...pro, order: index + 1 })
      }
    })
    closeModal('SelectProModal')
  }

  const onClickAddPros = () => {
    openModal({
      type: 'SelectProModal',
      children: (
        <SelectProModal
          onClose={() => closeModal('SelectProModal')}
          getValues={getValues}
          onClickSelectPro={onClickSelectPro}
        />
      ),
      isCloseable: true,
    })
  }

  const onClickBack = () => {
    const {
      clientId,
      serviceTypeId,
      sourceLanguage,
      targetLanguage,
      name,
      description,
    } = getValues()
    console.log(getValues())

    if (
      clientId ||
      serviceTypeId ||
      sourceLanguage ||
      targetLanguage ||
      name ||
      description
    ) {
      openModal({
        type: 'BackConfirmModal',
        children: (
          <CustomModalV2
            vary='error-alert'
            title='Discard draft?'
            subtitle='Are you sure you want to discard the draft?'
            rightButtonText='Discard'
            onClick={() => {
              reset()
              closeModal('Confirm')
              router.back()
            }}
            onClose={() => closeModal('Confirm')}
          />
        ),
      })
    } else {
      router.back()
    }
  }

  // console.log(getValues())

  useEffect(() => {
    const clear = registDND(({ source, destination }) => {
      if (!destination) return

      move(source.index, destination.index)
    }, 'linguist')
    return () => clear()
  }, [move])

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        // height: '100%',
        paddingBottom: '100px',
      }}
    >
      <Box display='flex' alignItems='center' gap='8px'>
        <IconButton
          onClick={() => {
            onClickBack()
          }}
        >
          <Icon icon='material-symbols:arrow-back-ios-new-rounded' />
        </IconButton>
        <Typography variant='h5'>Create new linguist team</Typography>
        <IconButton sx={{ padding: 0 }} onClick={onClickLinguistHelperIcon}>
          <Icon icon='mdi:info-circle-outline' />
        </IconButton>
      </Box>
      <Card
        sx={{
          // height: 'calc(100vh - 350px)',
          height: '100%',
          position: 'relative',
          paddingBottom: '100px',
        }}
      >
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
            isSubmitted={isSubmitted}
            clientList={clientList || []}
            languageList={languageList}
            serviceTypeList={serviceTypeList || []}
            getValues={getValues}
            trigger={trigger}
          />
        ) : (
          <SelectPro
            onClickSelectProsHelperIcon={onClickSelectProsHelperIcon}
            fields={fields}
            control={control}
            trigger={trigger}
            getValues={getValues}
            onClickAddPros={onClickAddPros}
            remove={remove}
            handleBack={handleBack}
            onClickSave={onClickSave}
            type='create'
          />
        )}
      </Card>
    </Box>
  )
}

AddNew.acl = {
  subject: 'pro',
  action: 'read',
}

export default AddNew
