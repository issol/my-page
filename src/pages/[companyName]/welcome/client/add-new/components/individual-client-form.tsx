import { useState } from 'react'

// ** style components
import { Button, Grid, Typography } from '@mui/material'
import Stepper from 'src/pages/[companyName]/components/stepper'
import { Icon } from '@iconify/react'

// ** types & schemas
import {
  ClientClassificationType,
  ClientCompanyInfoType,
} from '@src/context/types'
import {
  clientCompanyInfoSchema,
  getClientCompanyInfoDefaultValue,
} from '@src/types/schema/client-info/client-company-info.schema'

// ** components
import CustomModal from '@src/@core/components/common-modal/custom-modal'

// ** hooks
import { Resolver, useFieldArray, useForm } from 'react-hook-form'
import useModal from '@src/hooks/useModal'

// ** third parties
import { yupResolver } from '@hookform/resolvers/yup'
import { isEmpty } from 'lodash'
import ClientCompanyInfoForm from 'src/pages/[companyName]/client/components/forms/client-info/client-company-info-form'
import {
  clientAddressAllRequiredSchema,
  clientAddressDefaultValue,
  ClientAddressFormType,
} from '@src/types/schema/client-address.schema'

import ClientAddressesForm from 'src/pages/[companyName]/client/components/forms/addresses-info-form'

type Props = {
  clientType: ClientClassificationType
  setClientType: (n: ClientClassificationType) => void
  onSubmit: (data: ClientCompanyInfoType & ClientAddressFormType) => void
}
export default function IndividualClientForm({
  clientType,
  setClientType,
  onSubmit,
}: Props) {
  const { openModal, closeModal } = useModal()

  const steps = [{ title: 'Company information' }, { title: 'Addresses' }]
  const [activeStep, setActiveStep] = useState<1 | 2>(1)

  const {
    control: companyInfoControl,
    getValues: getCompanyInfo,
    reset: resetCompanyInfo,
    watch: companyInfoWatch,
    formState: {
      errors: companyInfoErrors,
      isValid: isCompanyInfoValid,
      dirtyFields,
    },
  } = useForm<ClientCompanyInfoType>({
    defaultValues: getClientCompanyInfoDefaultValue(clientType),
    mode: 'onChange',
    resolver: yupResolver(
      clientCompanyInfoSchema,
    ) as Resolver<ClientCompanyInfoType>,
  })

  const {
    control: addressControl,
    getValues: getAddress,
    setValue,
    watch,
    formState: { errors: addressErrors, isValid: isAddressValid },
  } = useForm<ClientAddressFormType>({
    defaultValues: clientAddressDefaultValue,
    mode: 'onChange',
    resolver: yupResolver(
      clientAddressAllRequiredSchema,
    ) as Resolver<ClientAddressFormType>,
  })

  const [checked, setChecked] = useState(false)
  const { fields, append, remove, update } = useFieldArray({
    control: addressControl,
    name: 'clientAddresses',
  })

  function changeRole(type: ClientClassificationType) {
    const isFieldDirty = !isEmpty(dirtyFields)
    if (!isFieldDirty) {
      setClientType(type)
    } else {
      openModal({
        type: 'changeRoleAlert',
        children: (
          <CustomModal
            vary='error'
            title='Are you sure you want to leave this page? The information will not be saved.'
            leftButtonText='Stay on this page'
            rightButtonText='Leave this page'
            onClose={() => closeModal('changeRoleAlert')}
            onClick={() => {
              closeModal('changeRoleAlert')
              setClientType(type)
            }}
          />
        ),
      })
    }
  }

  function renderForm() {
    switch (activeStep) {
      case 1:
        return (
          <Grid item xs={12}>
            <Grid container spacing={6}>
              <ClientCompanyInfoForm
                control={companyInfoControl}
                errors={companyInfoErrors}
                watch={companyInfoWatch}
              />
              <Grid item xs={12} display='flex' justifyContent='end'>
                <Button
                  variant='contained'
                  disabled={!isCompanyInfoValid}
                  onClick={() => setActiveStep(2)}
                  startIcon={
                    <Icon icon='material-symbols:arrow-forward-rounded' />
                  }
                >
                  Next
                </Button>
              </Grid>
            </Grid>
          </Grid>
        )
      case 2:
        return (
          <Grid container spacing={6}>
            <ClientAddressesForm
              checked={checked}
              setChecked={setChecked}
              control={addressControl}
              fields={fields}
              append={append}
              remove={remove}
              update={update}
              errors={addressErrors}
              isValid={isAddressValid}
              type='all-required'
              getValues={getAddress}
            />
            <Grid item xs={12} display='flex' justifyContent='space-between'>
              <Button
                variant='contained'
                color='secondary'
                onClick={() => setActiveStep(1)}
                startIcon={<Icon icon='material-symbols:arrow-back-rounded' />}
              >
                Previous
              </Button>
              <Button
                variant='contained'
                disabled={!isAddressValid}
                onClick={() => handleSubmit()}
              >
                Get started!
              </Button>
            </Grid>
          </Grid>
        )
      default:
        return null
    }
  }

  function handleSubmit() {
    const companyInfo = getCompanyInfo()
    const address = getAddress()

    onSubmit({ ...companyInfo, ...address })
  }

  return (
    <Grid container spacing={6}>
      <Grid
        item
        xs={12}
        display='flex'
        alignItems='end'
        flexDirection='column'
        gap='2px'
        justifyContent='end'
      >
        <Button variant='text' onClick={() => changeRole('corporate')}>
          <Typography variant='body2'>We’re a corporate client</Typography>
          <Icon
            icon='basil:arrow-right-outline'
            color='rgba(76, 78, 100, 0.54)'
          />
        </Button>
        <Button
          variant='text'
          onClick={() => changeRole('corporate_non_korean')}
        >
          <Typography variant='body2'>
            We’re a corporate client (Non-Korean)
          </Typography>
          <Icon
            icon='basil:arrow-right-outline'
            color='rgba(76, 78, 100, 0.54)'
          />
        </Button>
      </Grid>

      <Grid item xs={12}>
        <Stepper
          activeStep={activeStep}
          steps={steps}
          style={{ maxWidth: '70%' }}
        />
      </Grid>
      {renderForm()}
    </Grid>
  )
}
