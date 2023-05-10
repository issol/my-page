// ** react
import { useEffect, useState } from 'react'

// ** mui
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  Grid,
  Typography,
} from '@mui/material'

// ** types
import { CreateClientBodyType } from '@src/apis/client.api'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** react hook form
import {
  useForm,
  useFieldArray,
  Control,
  FieldErrors,
  UseFormGetValues,
  UseFormSetValue,
  UseFormWatch,
  UseFormReset,
} from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

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
import { ClientFormType } from '@src/types/schema/client.schema'

// ** fetches & mutations
import { useGetClientList } from '@src/queries/client.query'
import { createClient, createContactPerson } from '@src/apis/client.api'
import { saveClientFormData } from '@src/shared/auth/storage'

// ** components
import RegisterClientForm from '@src/pages/components/forms/register-client-form'
import AddNewClientModal from '@src/pages/components/form-container/clients/add-new-client-modal'
import ConfirmCreateClientModal from '@src/pages/client/components/modals/confirm-create-client-modal'
import CloseConfirmModal from '@src/pages/client/components/modals/close-confirm-modal'

// ** hooks
import useModal from '@src/hooks/useModal'
import { NOT_APPLICABLE } from '@src/shared/const/not-applicable'

type Props = {
  control: Control<ClientFormType, any>
  setValue: UseFormSetValue<ClientFormType>
  isValid: boolean
  watch: UseFormWatch<ClientFormType>
  handleBack: () => void
  onNextStep: () => void
  type: string
}
export default function ClientQuotesFormContainer({
  control,
  setValue,
  isValid,
  watch,
  handleBack,
  onNextStep,
  type,
}: Props) {
  const { openModal, closeModal } = useModal()
  const [openForm, setOpenForm] = useState(false)
  // ** stepper
  const [activeStep, setActiveStep] = useState<number>(0)

  const steps = [
    {
      title: 'Company info',
    },
    {
      title: 'Addresses',
    },
  ]

  const handleModalBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1)
  }

  const onModalNextStep = () => {
    setActiveStep(activeStep + 1)
  }

  const {
    control: companyInfoControl,
    getValues: getCompanyInfoValues,
    setValue: setCompanyInfoValues,
    watch: companyInfoWatch,
    formState: { errors: companyInfoErrors, isValid: isCompanyInfoValid },
  } = useForm<CompanyInfoFormType>({
    mode: 'onChange',
    defaultValues: companyInfoDefaultValue,
    resolver: yupResolver(companyInfoSchema),
  })
  const {
    control: addressControl,
    getValues: getAddressValues,
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

  const [clients, setClients] = useState<
    Array<{ value: string; label: string }>
  >([])
  const {
    data: clientList,
    isSuccess,
    refetch,
  } = useGetClientList({
    skip: 0,
    take: 1000,
  })

  useEffect(() => {
    if (isSuccess) {
      setClients(
        clientList.data.map(item => ({
          value: item.clientId.toString(),
          label: item.name,
        })),
      )
    }
  }, [clientList, isSuccess])

  function appendContactPerson() {
    const companyInfo = getCompanyInfoValues() ?? undefined
    appendContactPersons({
      personType: 'Mr.',
      firstName: '',
      lastName: '',
      timezone: companyInfo
        ? companyInfo.timezone
        : { code: '', label: '', phone: '' },
      email: '',
    })
  }

  function onCloseFormModal() {
    openModal({
      type: 'close-confirm',
      children: (
        <CloseConfirmModal
          message='Are you sure? Changes you made may not be saved.'
          onClick={() => setOpenForm(false)}
          onClose={() => closeModal('close-confirm')}
        />
      ),
    })
  }

  const setValueOptions = {
    shouldDirty: true,
    shouldValidate: true,
  }

  function mutateClientData(
    clientData: CreateClientBodyType,
    contactPersonData: ContactPersonType[] | undefined,
  ) {
    createClient(clientData)
      .then(res => {
        setValue('clientId', res.clientId, setValueOptions)
        if (!contactPersonData || !contactPersonData?.length) {
          setOpenForm(false)
          return
        }
        createContactPerson([
          { ...contactPersonData[0], clientId: res.clientId },
        ]).then(res => {
          if (res.length) {
            setValue(
              'contactPersonId',
              res[0]?.id ?? NOT_APPLICABLE,
              setValueOptions,
            )
          }

          setOpenForm(false)
        })
      })
      .finally(() => {
        setOpenForm(false)
        refetch()
      })
  }
  function onSaveClient() {
    const address = getAddressValues()?.clientAddresses?.map(item => {
      delete item.id
      return item
    })

    const data: CreateClientBodyType = {
      ...getCompanyInfoValues(),
      clientAddresses: address,
      ...getContactPersonValues()!,
    }
    saveClientFormData(data)
    openModal({
      type: 'create-client',
      children: (
        <ConfirmCreateClientModal
          clientName={getCompanyInfoValues().name}
          onAdd={() =>
            mutateClientData(
              {
                ...getCompanyInfoValues(),
                clientAddresses: address,
              },
              getContactPersonValues()?.contactPersons,
            )
          }
          onClose={() => closeModal('create-client')}
        />
      ),
    })
  }

  return (
    <Grid container spacing={6}>
      <Grid
        item
        xs={12}
        display='flex'
        justifyContent='space-between'
        alignItems='center'
      >
        <Typography variant='h6'>Select client</Typography>
        <Button variant='contained' onClick={() => setOpenForm(true)}>
          Add new client
        </Button>
      </Grid>
      <Grid item xs={12} display='flex' justifyContent='flex-end'>
        <RegisterClientForm
          control={control}
          setValue={setValue}
          watch={watch}
          clientList={clients}
        />
      </Grid>

      {type === 'create' ? (
        <Grid item xs={12} display='flex' justifyContent='space-between'>
          <Button variant='outlined' color='secondary' onClick={handleBack}>
            <Icon icon='material-symbols:arrow-back-rounded' />
            Previous
          </Button>
          <Button variant='contained' disabled={!isValid} onClick={onNextStep}>
            Next <Icon icon='material-symbols:arrow-forward-rounded' />
          </Button>
        </Grid>
      ) : (
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
            <Button variant='outlined' color='secondary' onClick={handleBack}>
              Cancel
            </Button>
            <Button
              variant='contained'
              disabled={!isValid}
              onClick={onNextStep}
            >
              Save
            </Button>
          </Box>
        </Grid>
      )}

      {/* Add new client modal */}
      <Dialog open={openForm} maxWidth='lg'>
        <DialogContent style={{ padding: '40px' }}>
          <AddNewClientModal
            onClose={onCloseFormModal}
            activeStep={activeStep}
            steps={steps}
            companyInfoControl={companyInfoControl}
            setCompanyInfoValues={setCompanyInfoValues}
            companyInfoErrors={companyInfoErrors}
            companyInfoWatch={companyInfoWatch}
            isCompanyInfoValid={isCompanyInfoValid}
            contactPersons={contactPersons}
            contactPersonControl={contactPersonControl}
            contactPersonErrors={contactPersonErrors}
            watchContactPerson={watchContactPerson}
            appendContactPerson={appendContactPerson}
            removeContactPersons={removeContactPersons}
            addressControl={addressControl}
            addresses={addresses}
            appendAddress={appendAddress}
            removeAddress={removeAddress}
            updateAddress={updateAddress}
            addressErrors={addressErrors}
            isAddressValid={isAddressValid}
            onNextStep={onModalNextStep}
            handleBack={handleModalBack}
            onSave={onSaveClient}
          />
        </DialogContent>
      </Dialog>
    </Grid>
  )
}
