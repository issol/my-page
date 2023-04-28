import { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'

// ** hooks
import useModal from '@src/hooks/useModal'

// ** mui
import { Box, Button, Card, Grid, IconButton, Typography } from '@mui/material'
import PageHeader from '@src/@core/components/page-header'

import { useForm, Controller, useFieldArray } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** third parties
import { toast } from 'react-hot-toast'

// ** validation values & types
import {
  ProjectTeamType,
  projectTeamSchema,
} from '@src/types/schema/project-team.schema'
import { ClientFormType, clientSchema } from '@src/types/schema/client.schema'

import { removeClientFormData } from '@src/shared/auth/storage'

// ** components
import PageLeaveModal from '@src/pages/client/components/modals/page-leave-modal'
import Stepper from '@src/pages/components/stepper'
import ProjectTeamFormContainer from '@src/pages/quotes/components/form-container/project-team-container'
import ClientQuotesFormContainer from '@src/pages/quotes/components/form-container/client-container'
import { OrderProjectInfoFormType } from '@src/types/common/orders.type'
import {
  orderProjectInfoDefaultValue,
  orderProjectInfoSchema,
} from '@src/types/schema/orders-project-info.schema'
import ProjectInfoForm from '@src/pages/components/forms/orders-project-info-form'

import LanguagesAndItemsContainer from '@src/pages/components/form-container/languages-and-items/languages-and-items-container'
import { StandardPriceListType } from '@src/types/common/standard-price'
import { itemDefaultValue, itemSchema } from '@src/types/schema/item.schema'
import { ItemType } from '@src/types/common/item.type'
import { AuthContext } from '@src/context/AuthContext'
import { getLegalName } from '@src/shared/helpers/legalname.helper'
import DatePickerWrapper from '@src/@core/styles/libs/react-datepicker'

export type languageType = {
  id: string
  source: string
  target: string
  price: StandardPriceListType | null
  isDeletable?: boolean
}
export default function AddNewQuotes() {
  const router = useRouter()
  const { user } = useContext(AuthContext)

  const { openModal, closeModal } = useModal()

  // ** stepper
  const [activeStep, setActiveStep] = useState<number>(3)

  const [languagePairs, setLanguagePairs] = useState<Array<languageType>>([])

  const setValueOptions = { shouldValidate: true, shouldDirty: true }

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1)
  }

  const onNextStep = () => {
    setActiveStep(activeStep + 1)
  }

  const steps = [
    {
      title: 'Project team',
    },
    {
      title: 'Client',
    },
    {
      title: 'Project info',
    },
    {
      title: ' Languages & Items',
    },
  ]

  useEffect(() => {
    return removeClientFormData()
  }, [])

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

  // ** step1
  const [tax, setTax] = useState(0)
  const {
    control: teamControl,
    getValues: getTeamValues,
    setValue: setTeamValues,
    handleSubmit: submitTeam,
    watch: teamWatch,
    formState: { errors: teamErrors, isValid: isTeamValid },
  } = useForm<ProjectTeamType>({
    mode: 'onChange',
    defaultValues: {
      // ** TODO : test데이터 지.우.기 (id : null 로 수정하기)
      teams: [
        { type: 'supervisorId', id: 7 },
        {
          type: 'projectManagerId',
          id: user?.userId!,
          name: getLegalName({
            firstName: user?.firstName!,
            middleName: user?.middleName,
            lastName: user?.lastName!,
          }),
        },
        { type: 'member', id: 5 },
      ],
    },
    resolver: yupResolver(projectTeamSchema),
  })

  const {
    fields: members,
    append: appendMember,
    remove: removeMember,
    update: updateMember,
  } = useFieldArray({
    control: teamControl,
    name: 'teams',
  })

  // ** step2
  const {
    control: clientControl,
    getValues: getClientValue,
    setValue: setClientValue,
    watch: clientWatch,
    reset: clientReset,
    formState: { errors: clientErrors, isValid: isClientValid },
  } = useForm<ClientFormType>({
    mode: 'onChange',
    defaultValues: {
      clientId: null,
      contactPersonId: null,
      addressType: 'shipping',
    },
    resolver: yupResolver(clientSchema),
  })

  // ** step3
  const {
    control: projectInfoControl,
    getValues: getProjectInfo,
    setValue: setProjectInfo,
    watch: projectInfoWatch,
    reset: projectInfoReset,
    formState: { errors: projectInfoErrors, isValid: isProjectInfoValid },
  } = useForm<OrderProjectInfoFormType>({
    mode: 'onChange',
    defaultValues: orderProjectInfoDefaultValue,
    resolver: yupResolver(orderProjectInfoSchema),
  })

  // ** step4
  const {
    control: itemControl,
    getValues: getItem,
    setValue: setItem,
    watch: itemWatch,
    reset: itemReset,
    formState: { errors: itemErrors, isValid: isItemValid },
  } = useForm<{ items: ItemType[] }>({
    mode: 'onChange',
    defaultValues: { items: [] },
    resolver: yupResolver(itemSchema),
  })

  const {
    fields: items,
    append: appendItems,
    remove: removeItems,
    update: updateItems,
  } = useFieldArray({
    control: itemControl,
    name: 'items',
  })

  return (
    <Grid container spacing={6}>
      <PageHeader
        title={
          <Box display='flex' alignItems='center' gap='8px'>
            <IconButton onClick={() => router.back()}>
              <Icon icon='material-symbols:arrow-back-ios-new-rounded' />
            </IconButton>
            <Typography variant='h5'>Create new order</Typography>
          </Box>
        }
      />
      <Grid item xs={12}>
        <Card>
          <Stepper
            activeStep={activeStep}
            steps={steps}
            style={{ maxWidth: '80%', margin: '0 auto' }}
          />
        </Card>
      </Grid>
      <Grid item xs={12}>
        {activeStep === 0 ? (
          <Card sx={{ padding: '24px' }}>
            <ProjectTeamFormContainer
              control={teamControl}
              field={members}
              append={appendMember}
              remove={removeMember}
              update={updateMember}
              getValues={getTeamValues}
              setValue={setTeamValues}
              errors={teamErrors}
              isValid={isTeamValid}
              watch={teamWatch}
              onNextStep={onNextStep}
            />
          </Card>
        ) : activeStep === 1 ? (
          <Card sx={{ padding: '24px' }}>
            <ClientQuotesFormContainer
              control={clientControl}
              reset={clientReset}
              getValues={getClientValue}
              setValue={setClientValue}
              errors={clientErrors}
              isValid={isClientValid}
              watch={clientWatch}
              handleBack={handleBack}
              onNextStep={onNextStep}
            />
          </Card>
        ) : activeStep === 2 ? (
          <Card sx={{ padding: '24px' }}>
            <DatePickerWrapper>
              <Grid container spacing={6}>
                <ProjectInfoForm
                  control={projectInfoControl}
                  setValue={setProjectInfo}
                  watch={projectInfoWatch}
                  errors={projectInfoErrors}
                />
                <Grid
                  item
                  xs={12}
                  display='flex'
                  justifyContent='space-between'
                >
                  <Button
                    variant='outlined'
                    color='secondary'
                    onClick={handleBack}
                  >
                    <Icon icon='material-symbols:arrow-back-rounded' />
                    Previous
                  </Button>
                  <Button
                    variant='contained'
                    disabled={!isProjectInfoValid}
                    onClick={onNextStep}
                  >
                    Next <Icon icon='material-symbols:arrow-forward-rounded' />
                  </Button>
                </Grid>
              </Grid>
            </DatePickerWrapper>
          </Card>
        ) : (
          <Card sx={{ padding: '24px' }}>
            <LanguagesAndItemsContainer
              tax={tax}
              setTax={setTax}
              languagePairs={languagePairs}
              setLanguagePairs={setLanguagePairs}
              clientId={getClientValue('clientId')}
              itemControl={itemControl}
              getItem={getItem}
              setItem={setItem}
              itemWatch={itemWatch}
              itemErrors={itemErrors}
              items={items}
              appendItems={appendItems}
              removeItems={removeItems}
              updateItems={updateItems}
              isItemValid={isItemValid}
              teamMembers={getTeamValues()?.teams}
              handleBack={handleBack}
            />
          </Card>
        )}
      </Grid>
    </Grid>
  )
}

AddNewQuotes.acl = {
  subject: 'quotes',
  action: 'create',
}
