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
  useFieldArray,
  useForm,
} from 'react-hook-form'

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
  ContactPersonType,
  clientContactPersonSchema,
  contactPersonDefaultValue,
} from '@src/types/schema/client-contact-person.schema'

// ** components
import Stepper from '@src/pages/components/stepper'
import CompanyInfoForm from '@src/pages/client/components/forms/company-info-form'
import AddContactPersonForm from '@src/pages/components/forms/add-contact-person-form'
import ClientAddressesForm from '@src/pages/client/components/forms/addresses-info-form'
import { useGetClientList } from '@src/queries/client.query'
import { yupResolver } from '@hookform/resolvers/yup'
import { CreateClientBodyType } from '@src/apis/client.api'

type Props = {
  onClose: any

  onSave: (
    clientData: CreateClientBodyType,
    contactPersonData: ContactPersonType[] | undefined,
  ) => void
}
export default function AddNewClientModal({ onClose, onSave }: Props) {
  const [checked, setChecked] = useState(false)

  const [activeStep, setActiveStep] = useState<number>(0)

  const steps = [
    {
      title: 'Company info',
    },
    {
      title: 'Addresses',
    },
  ]

  const onClickBackStep = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1)
  }

  const onClickNextStep = () => {
    setActiveStep(activeStep + 1)
  }

  const {
    control: companyInfoControl,
    getValues: getCompanyInfoValues,
    setValue: setCompanyInfoValues,
    watch: companyInfoWatch,
    reset: resetCompanyInfo,
    formState: { errors: companyInfoErrors, isValid: isCompanyInfoValid },
  } = useForm<CompanyInfoFormType>({
    mode: 'onChange',
    defaultValues: companyInfoDefaultValue,

    resolver: yupResolver(companyInfoSchema),
  })

  console.log(getCompanyInfoValues())

  const {
    control: addressControl,
    getValues: getAddressValues,
    reset: resetAddressControl,
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
    watch: watchContactPerson,
    reset: resetContactPersons,
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
  } = useFieldArray({
    control: contactPersonControl,
    name: 'contactPersons',
  })

  function appendContactPerson() {
    const companyInfo = getCompanyInfoValues() ?? undefined
    appendContactPersons({
      personType: 'Mr.',
      firstName: '',
      lastName: '',
      timezone: companyInfo.timezone ?? null,
      email: '',
      userId: null,
    })
  }

  const resetAddNewClientForm = () => {
    resetCompanyInfo()
    resetAddressControl()
    resetContactPersons()
    setActiveStep(0)
  }

  return (
    <Box
      sx={{
        maxWidth: '900px',
        maxHeight: '90vh',
        overflow: 'scroll',
        width: '100%',
        background: '#ffffff',
        boxShadow: '0px 0px 20px rgba(76, 78, 100, 0.4)',
        borderRadius: '10px',
        padding: '50px 60px',
        position: 'relative',
        '&::-webkit-scrollbar': {
          display: 'none',
        },
      }}
    >
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
              onClick={onClickNextStep}
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
            getValues={getAddressValues}
          />
          <Grid item xs={12} display='flex' justifyContent='space-between'>
            <Button
              variant='outlined'
              color='secondary'
              onClick={onClickBackStep}
            >
              <Icon icon='material-symbols:arrow-back-rounded' />
              Previous
            </Button>
            <Button
              variant='contained'
              disabled={!isAddressValid}
              onClick={() =>
                onSave(
                  { ...getCompanyInfoValues(), ...getAddressValues() },
                  getContactPersonValues('contactPersons'),
                )
              }
            >
              Save
            </Button>
          </Grid>
        </Grid>
      )}
    </Box>
  )
}
