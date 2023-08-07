import { Fragment, useState } from 'react'

// ** style components
import { Box, Button, Grid, Typography } from '@mui/material'
import Stepper from '@src/pages/components/stepper'
import { Icon } from '@iconify/react'

// ** types & schemas
import {
  ClientClassificationType,
  ClientCompanyInfoType,
  CorporateClientInfoType,
} from '@src/context/types'
import {
  corporateClientDefaultValue,
  corporateClientInfoSchema,
} from '@src/types/schema/client-info/corporate-company-info.schema'
import {
  getClientCompanyInfoDefaultValue,
  clientCompanyInfoSchema,
} from '@src/types/schema/client-info/client-company-info.schema'

// ** components
import CorporateCompanyInfoForm from '@src/pages/client/components/forms/client-info/corporate-company-info-form'
import SimpleAlertModal from '@src/pages/client/components/modals/simple-alert-modal'
import CustomModal from '@src/@core/components/common-modal/custom-modal'

// ** hooks
import { useFieldArray, useForm } from 'react-hook-form'
import useModal from '@src/hooks/useModal'

// ** apis
import { verifyCompanyInfo } from '@src/apis/user.api'

// ** third parties
import { yupResolver } from '@hookform/resolvers/yup'
import { toast } from 'react-hot-toast'
import { isEmpty } from 'lodash'
import ClientCompanyInfoForm from '@src/pages/client/components/forms/client-info/client-company-info-form'
import {
  ClientAddressFormType,
  clientAddressAllRequiredSchema,
  clientAddressDefaultValue,
  clientAddressSchema,
} from '@src/types/schema/client-address.schema'

import ClientAddressesForm from '@src/pages/client/components/forms/addresses-info-form'

type Props = {
  clientType: ClientClassificationType
  setClientType: (n: ClientClassificationType) => void
}
export default function CorporateClientForm({
  clientType,
  setClientType,
}: Props) {
  const { openModal, closeModal } = useModal()

  const steps = [
    { title: 'Company verification' },
    { title: 'Company information' },
    { title: 'Addresses' },
  ]
  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1)

  const {
    control,
    getValues,
    formState: { errors, isValid, dirtyFields },
  } = useForm<CorporateClientInfoType>({
    defaultValues: corporateClientDefaultValue,
    mode: 'onChange',
    resolver: yupResolver(corporateClientInfoSchema),
  })

  const {
    control: companyInfoControl,
    getValues: getCompanyInfo,
    reset: resetCompanyInfo,
    watch: companyInfoWatch,
    formState: { errors: companyInfoErrors, isValid: isCompanyInfoValid },
  } = useForm<ClientCompanyInfoType>({
    defaultValues: getClientCompanyInfoDefaultValue(clientType),
    mode: 'onChange',
    resolver: yupResolver(clientCompanyInfoSchema),
  })

  const {
    control: addressControl,
    getValues: getAddress,
    setValue,
    handleSubmit,
    watch,
    formState: { errors: addressErrors, isValid: isAddressValid },
  } = useForm<ClientAddressFormType>({
    defaultValues: clientAddressDefaultValue,
    mode: 'onChange',
    resolver: yupResolver(clientAddressAllRequiredSchema),
  })

  const [checked, setChecked] = useState(false)
  const { fields, append, remove, update } = useFieldArray({
    control: addressControl,
    name: 'clientAddresses',
  })

  function handleVerify() {
    const corporateCompanyInfo = getValues()
    verifyCompanyInfo(corporateCompanyInfo)
      .then(res => {
        setActiveStep(2)
      })
      .catch(e => {
        openModal({
          type: 'verifyError',
          children: (
            <SimpleAlertModal
              message='No matching company was found. Please try again.'
              onClose={() => closeModal('verifyError')}
            />
          ),
        })
      })
  }

  function changeRole() {
    const isFieldDirty = !isEmpty(dirtyFields)
    if (!isFieldDirty) {
      setClientType('individual')
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
              setClientType('individual')
            }}
          />
        ),
      })
    }
  }

  function handleStepBack() {
    openModal({
      type: 'stepBackAlert',
      children: (
        <CustomModal
          vary='error'
          title='Are you sure you want to move to previous page? You have to verify the company again.'
          leftButtonText='Stay on this page'
          rightButtonText='Move to previous page'
          onClose={() => closeModal('stepBackAlert')}
          onClick={() => {
            closeModal('stepBackAlert')
            resetCompanyInfo(getClientCompanyInfoDefaultValue(clientType))
            setActiveStep(1)
          }}
        />
      ),
    })
  }

  function onError() {
    toast.error('Something went wrong. Please try again.', {
      position: 'bottom-left',
    })
  }

  function renderForm() {
    switch (activeStep) {
      case 1:
        return (
          <Fragment>
            <CorporateCompanyInfoForm control={control} errors={errors} />
            <Grid item xs={12} display='flex' justifyContent='end'>
              <Button
                onClick={handleVerify}
                disabled={!isValid}
                variant='contained'
              >
                Verify
              </Button>
            </Grid>
          </Fragment>
        )
      case 2:
        return (
          <Grid item xs={12}>
            <Grid container spacing={6}>
              <ClientCompanyInfoForm
                control={companyInfoControl}
                errors={companyInfoErrors}
                watch={companyInfoWatch}
              />
              <Grid item xs={12} display='flex' justifyContent='space-between'>
                <Button
                  variant='contained'
                  color='secondary'
                  onClick={handleStepBack}
                  startIcon={
                    <Icon icon='material-symbols:arrow-back-rounded' />
                  }
                >
                  Previous
                </Button>
                <Button
                  variant='contained'
                  disabled={!isCompanyInfoValid}
                  onClick={() => setActiveStep(3)}
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
      case 3:
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
            />
            <Grid item xs={12} display='flex' justifyContent='space-between'>
              <Button
                variant='contained'
                color='secondary'
                onClick={() => setActiveStep(2)}
                startIcon={<Icon icon='material-symbols:arrow-back-rounded' />}
              >
                Previous
              </Button>
              <Button
                variant='contained'
                disabled={!isAddressValid}
                onClick={() => setActiveStep(3)}
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

  return (
    <Grid container spacing={6}>
      <Grid
        item
        xs={12}
        display='flex'
        alignItems='center'
        gap='2px'
        justifyContent='end'
      >
        <Button variant='text' onClick={() => changeRole()}>
          <Typography variant='body2'>I’m an individual client</Typography>
          <Icon
            icon='basil:arrow-right-outline'
            color='rgba(76, 78, 100, 0.54)'
          />
        </Button>
      </Grid>
      <Grid item xs={12}>
        <Stepper activeStep={activeStep} steps={steps} />
      </Grid>
      {renderForm()}
    </Grid>
  )
}
