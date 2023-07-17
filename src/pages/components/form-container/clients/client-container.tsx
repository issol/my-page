// ** react
import { Fragment, useEffect, useState } from 'react'

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

// ** react hook form
import {
  useForm,
  useFieldArray,
  Control,
  UseFormSetValue,
  UseFormWatch,
} from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

// ** schema & types
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

// ** components
import RegisterClientForm from '@src/pages/components/forms/register-client-form'
import AddNewClientModal from '@src/pages/components/form-container/clients/add-new-client-modal'
import AddConfirmModal from '@src/pages/client/components/modals/add-confirm-with-title-modal'
import CloseConfirmModal from '@src/pages/client/components/modals/close-confirm-modal'

// ** hooks
import useModal from '@src/hooks/useModal'

// ** values
import { NOT_APPLICABLE } from '@src/shared/const/not-applicable'

type Props = {
  control: Control<ClientFormType, any>
  setValue: UseFormSetValue<ClientFormType>
  watch: UseFormWatch<ClientFormType>
  setTax: (n: number | null) => void
  setTaxable: (n: boolean) => void
  type: 'order' | 'invoice' | 'quotes' | 'request'
}
export default function ClientQuotesFormContainer({
  control,
  setValue,
  watch,
  setTax,
  setTaxable,
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
    Array<{ value: number; label: string }>
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
          value: item.clientId,
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
      userId: null,
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
    openModal({
      type: 'create-client',
      children: (
        <AddConfirmModal
          message='Are you sure you want to add this client?'
          title={getCompanyInfoValues().name}
          onClick={() =>
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
    <Fragment>
      <Grid
        item
        xs={12}
        display='flex'
        justifyContent='space-between'
        alignItems='center'
      >
        <Typography variant='h6'>Select client</Typography>
        {type === 'invoice' || type === 'request' ? null : (
          <Button variant='contained' onClick={() => setOpenForm(true)}>
            Add new client
          </Button>
        )}
      </Grid>
      <Grid item xs={12} display='flex' justifyContent='flex-end'>
        <RegisterClientForm
          control={control}
          setValue={setValue}
          watch={watch}
          clientList={clients}
          setTax={setTax}
          setTaxable={setTaxable}
          type={type}
        />
      </Grid>

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
    </Fragment>
  )
}
