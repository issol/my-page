import { useEffect, useState } from 'react'
import { Fragment } from 'react'

// ** mui
import {
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  Typography,
} from '@mui/material'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** react hook form
import {
  Control,
  FieldArrayWithId,
  FieldErrors,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
  UseFieldArrayUpdate,
  UseFormGetValues,
  UseFormSetValue,
  UseFormWatch,
} from 'react-hook-form'

import { CompanyInfoFormType } from '@src/types/schema/company-info.schema'
import { ClientAddressFormType } from '@src/types/schema/client-address.schema'
import { ClientContactPersonType } from '@src/types/schema/client-contact-person.schema'

// ** components
import Stepper from '@src/pages/components/stepper'
import CompanyInfoForm from '@src/pages/client/components/forms/company-info-form'
import AddContactPersonForm from '@src/pages/components/forms/add-contact-person-form'
import ClientAddressesForm from '@src/pages/client/components/forms/addresses-info-form'

type Props = {
  onClose: () => void
  // ** stepper
  activeStep: number
  steps: Array<{ title: string }>

  // ** company
  companyInfoControl: Control<CompanyInfoFormType, any>
  setCompanyInfoValues: UseFormSetValue<CompanyInfoFormType>
  companyInfoErrors: FieldErrors<CompanyInfoFormType>
  companyInfoWatch: UseFormWatch<CompanyInfoFormType>
  getCompanyInfoValues: UseFormGetValues<CompanyInfoFormType>
  isCompanyInfoValid: boolean

  // ** contact person
  contactPersons: FieldArrayWithId<
    ClientContactPersonType,
    'contactPersons',
    'id'
  >[]
  contactPersonControl: Control<ClientContactPersonType, any>
  contactPersonErrors: FieldErrors<ClientContactPersonType>
  watchContactPerson: UseFormWatch<ClientContactPersonType>
  appendContactPerson: () => void
  removeContactPersons: UseFieldArrayRemove

  // ** addresses
  addressControl: Control<ClientAddressFormType, any>
  getAddress: UseFormGetValues<ClientAddressFormType>
  addresses: FieldArrayWithId<ClientAddressFormType, 'clientAddresses', 'id'>[]
  appendAddress: UseFieldArrayAppend<ClientAddressFormType, 'clientAddresses'>
  removeAddress: UseFieldArrayRemove
  updateAddress: UseFieldArrayUpdate<ClientAddressFormType, 'clientAddresses'>
  addressErrors: FieldErrors<ClientAddressFormType>
  isAddressValid: boolean
  onNextStep: () => void
  handleBack: () => void
  onSave: () => void
}
export default function AddNewClientModal({
  onClose,
  activeStep,
  steps,
  companyInfoControl,
  setCompanyInfoValues,
  getCompanyInfoValues,
  companyInfoErrors,
  companyInfoWatch,
  isCompanyInfoValid,
  contactPersons,
  contactPersonControl,
  contactPersonErrors,
  watchContactPerson,
  appendContactPerson,
  removeContactPersons,
  addressControl,
  getAddress,
  addresses,
  appendAddress,
  removeAddress,
  updateAddress,
  addressErrors,
  isAddressValid,
  onNextStep,
  handleBack,
  onSave,
}: Props) {
  const [checked, setChecked] = useState(false)
  return (
    <Fragment>
      <Grid container spacing={6}>
        <Grid item xs={12} display='flex' justifyContent='space-between'>
          <Box>
            <Typography variant='h5'>Add new client</Typography>
            <Typography variant='caption'>
              The client will be added to the client list
            </Typography>
          </Box>
          <Box>
            <IconButton onClick={onClose}>
              <Icon icon='material-symbols:close' />
            </IconButton>
          </Box>
        </Grid>
        <Grid item xs={8}>
          <Stepper activeStep={activeStep} steps={steps} />
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
      </Grid>
      {activeStep === 0 ? (
        <Fragment>
          {/* company info */}
          <Grid container spacing={6} mt={1}>
            <CompanyInfoForm
              mode='create'
              control={companyInfoControl}
              setValue={setCompanyInfoValues}
              getValue={getCompanyInfoValues}
              errors={companyInfoErrors}
              watch={companyInfoWatch}
            />
          </Grid>
          <Grid container spacing={6}>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            {/* contact person */}
            <Grid item xs={12} display='flex' justifyContent='space-between'>
              <Typography variant='h6'>Contact person</Typography>
              <IconButton
                onClick={() => removeContactPersons(0)}
                disabled={!contactPersons.length}
              >
                <Icon icon='mdi:trash-outline' />
              </IconButton>
            </Grid>
            <AddContactPersonForm
              fields={contactPersons}
              control={contactPersonControl}
              errors={contactPersonErrors}
              watch={watchContactPerson}
            />
            {contactPersons.length < 1 ? (
              <Grid item xs={12}>
                <Button
                  onClick={appendContactPerson}
                  variant='contained'
                  disabled={!isCompanyInfoValid || contactPersons.length >= 1}
                  sx={{ p: 0.7, minWidth: 26 }}
                >
                  <Icon icon='material-symbols:add' />
                </Button>
              </Grid>
            ) : null}
            <Grid item xs={12}>
              <Divider />
            </Grid>
          </Grid>
          <Grid item xs={12} display='flex' justifyContent='flex-end'>
            <Button
              variant='contained'
              disabled={!isCompanyInfoValid}
              onClick={onNextStep}
            >
              Next <Icon icon='material-symbols:arrow-forward-rounded' />
            </Button>
          </Grid>
        </Fragment>
      ) : (
        <Grid container spacing={6}>
          <ClientAddressesForm
            checked={checked}
            setChecked={setChecked}
            control={addressControl}
            fields={addresses}
            append={appendAddress}
            remove={removeAddress}
            update={updateAddress}
            errors={addressErrors}
            isValid={isAddressValid}
            getValues={getAddress}
          />
          <Grid item xs={12} display='flex' justifyContent='space-between'>
            <Button variant='outlined' color='secondary' onClick={handleBack}>
              <Icon icon='material-symbols:arrow-back-rounded' />
              Previous
            </Button>
            <Button
              variant='contained'
              disabled={!isAddressValid}
              onClick={onSave}
            >
              Save
            </Button>
          </Grid>
        </Grid>
      )}
    </Fragment>
  )
}
