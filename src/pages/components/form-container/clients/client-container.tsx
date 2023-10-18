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
  UseFormGetValues,
  UseFormTrigger,
  UseFormReset,
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
import CustomModal from '@src/@core/components/common-modal/custom-modal'

type Props = {
  control: Control<ClientFormType, any>
  setValue: UseFormSetValue<ClientFormType>
  getValue: UseFormGetValues<ClientFormType>
  watch: UseFormWatch<ClientFormType>
  trigger?: UseFormTrigger<ClientFormType>
  setTaxable: (n: boolean) => void
  setTax: (n: number | null) => void
  type: 'order' | 'invoice' | 'quotes' | 'request'
  formType: 'edit' | 'create'
  fromQuote: boolean
  reset?: UseFormReset<ClientFormType>
}
export default function ClientQuotesFormContainer({
  control,
  setValue,
  watch,
  trigger,
  setTax,
  setTaxable,
  type,
  formType,
  getValue,
  fromQuote = false,
  reset,
}: Props) {
  const { openModal, closeModal } = useModal()
  const [openForm, setOpenForm] = useState(false)
  // ** stepper
  const setValueOptions = {
    shouldDirty: true,
    shouldValidate: true,
  }

  const [clients, setClients] = useState<
    Array<{ value: number; label: string; tax: number | null }>
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
      console.log(clientList.data)

      setClients(
        clientList.data.map(item => ({
          value: item.clientId,
          label: item.name,
          tax: item.isTaxable ? (item.tax ? Number(item.tax) : null) : null,
        })),
      )
    }
  }, [clientList, isSuccess])

  function onCloseFormModal() {
    openModal({
      type: 'close-confirm',
      children: (
        <CustomModal
          title='Are you sure? Changes you made may not be saved.'
          vary='error'
          rightButtonText='Close'
          onClick={() => {
            closeModal('add-new-client')
            closeModal('close-confirm')
          }}
          onClose={() => {
            // resetAddNewClientForm()
            closeModal('close-confirm')
          }}
        />
        // <CloseConfirmModal
        //   message='Are you sure? Changes you made may not be saved.'

        // />
      ),
    })
  }

  function mutateClientData(
    clientData: CreateClientBodyType,
    contactPersonData: ContactPersonType[] | undefined,
  ) {
    createClient(clientData)
      .then(res => {
        setValue('clientId', res.clientId, setValueOptions)
        if (!contactPersonData || !contactPersonData?.length) {
          closeModal('add-new-client')
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

          closeModal('add-new-client')
        })
      })
      .finally(() => {
        closeModal('add-new-client')
        refetch()
        // resetAddNewClientForm()
      })
  }
  const onSaveClient = (
    clientData: CreateClientBodyType,
    contactPersonData: ContactPersonType[] | undefined,
  ) => {
    console.log(clientData, contactPersonData)

    const address = clientData.clientAddresses?.map(item => {
      delete item.id
      return item
    })
    openModal({
      type: 'create-client',
      children: (
        <AddConfirmModal
          message='Are you sure you want to add this client?'
          title={clientData.name}
          onClick={() =>
            mutateClientData(
              {
                ...clientData,
                clientAddresses: address,
              },
              contactPersonData,
            )
          }
          onClose={() => {
            // resetAddNewClientForm()
            closeModal('create-client')
          }}
        />
      ),
    })
  }

  const onClickAddNewClient = () => {
    openModal({
      type: 'add-new-client',
      children: (
        <AddNewClientModal
          onSave={onSaveClient}
          onClose={() => onCloseFormModal()}
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
        {type === 'invoice' ||
        type === 'request' ||
        fromQuote ||
        formType === 'edit' ? null : (
          <Button variant='contained' onClick={() => onClickAddNewClient()}>
            Add new client
          </Button>
        )}
      </Grid>
      <Grid item xs={12} display='flex' justifyContent='flex-end'>
        <RegisterClientForm
          control={control}
          setValue={setValue}
          getValue={getValue}
          watch={watch}
          trigger={trigger}
          clientList={clients}
          setTaxable={setTaxable}
          setTax={setTax}
          type={type}
          formType={formType}
          fromQuote={fromQuote}
          reset={reset}
        />
      </Grid>
    </Fragment>
  )
}
