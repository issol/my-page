import { useState } from 'react'

// ** style components
import { Icon } from '@iconify/react'
import {
  Box,
  Button,
  Card,
  Dialog,
  DialogContent,
  Grid,
  Typography,
  Tooltip,
} from '@mui/material'
import { TableTitleTypography } from '@src/@core/styles/typography'
import styled from 'styled-components'

// ** react hook form
import { useFieldArray, useForm } from 'react-hook-form'

// ** types & schema
import { yupResolver } from '@hookform/resolvers/yup'
import {
  ClientDetailType,
  CreateContactPersonFormType,
} from '@src/types/client/client'
import {
  ClientContactPersonType,
  ContactPersonType,
  clientContactPersonSchema,
  contactPersonDefaultValue,
} from '@src/types/schema/client-contact-person.schema'
import { GridColumns, GridRowParams } from '@mui/x-data-grid'

// ** helpers
import { getLegalName } from '@src/shared/helpers/legalname.helper'

// ** hooks
import useModal from '@src/hooks/useModal'

// ** components
import ContactPersonList from '../../components/list/contact-person-list'
import AddContactPersonForm from '../../components/forms/add-contact-person-form'
import DiscardContactPersonModal from '../../components/modals/discard-contact-person-modal'

// ** fetch & mutation
import { useMutation, useQueryClient } from 'react-query'
import {
  createContactPerson,
  deleteContactPerson,
  updateContactPerson as patchContactPerson,
} from '@src/apis/client.api'

// ** toast
import { toast } from 'react-hot-toast'
import ContactPersonDetailModal from '../../components/modals/contact-person-detail-modal'
import DeleteContactPersonModal from '../../components/modals/delete-contact-person-modal'
import CannotDeleteContactPersonModal from '../../components/modals/cannot-delete-contact-person-modal'

type Props = {
  clientId: number
  clientInfo: ClientDetailType
  isUpdatable: boolean
  isDeletable: boolean
  isCreatable: boolean
}

/* TODO : delete 추가 */
export default function ContactPersons({
  clientId,
  clientInfo,
  isUpdatable,
  isDeletable,
  isCreatable,
}: Props) {
  const { contactPersons } = clientInfo

  const queryClient = useQueryClient()
  const { openModal, closeModal } = useModal()

  const [open, setOpen] = useState(false)
  const [openDiscard, setOpenDiscard] = useState(false)
  const [pageSize, setPageSize] = useState(10)

  const [formMode, setFormMode] = useState<'create' | 'update'>('create')

  const modalType = {
    discard: 'discard',
    save: 'save',
    contactPerson: 'contactPerson',
    deleteContactPerson: 'deleteContactPerson',
    cannotDelete: 'cannotDelete',
  }

  const columns: GridColumns<ContactPersonType> = [
    {
      flex: 0.15,
      field: 'name',
      headerName: 'Name / Email',
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => <Box>Company name / Email</Box>,
      renderCell: ({ row }: { row: ContactPersonType }) => {
        return (
          <Box display='flex' flexDirection='column' maxWidth='300px'>
            <Tooltip
              title={getLegalName({
                firstName: row.firstName!,
                middleName: row?.middleName,
                lastName: row.lastName!,
              })}
            >
              <TableTitleTypography fontWeight='bold'>
                {getLegalName({
                  firstName: row.firstName!,
                  middleName: row?.middleName,
                  lastName: row.lastName!,
                })}
              </TableTitleTypography>
            </Tooltip>

            <Typography variant='body2'>{row?.email}</Typography>
          </Box>
        )
      },
    },
    {
      flex: 0.1,
      minWidth: 210,
      field: 'department',
      headerName: 'Department',
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => <Box>Department</Box>,
      renderCell: ({ row }: { row: ContactPersonType }) => {
        return <Typography>{row.department}</Typography>
      },
    },
    {
      flex: 0.1,
      minWidth: 180,
      field: 'jobTitle',
      headerName: 'Job title',
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => <Box>Job title</Box>,
    },
  ]

  const {
    control,
    getValues,
    setValue,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm<ClientContactPersonType>({
    defaultValues: contactPersonDefaultValue,
    mode: 'onChange',
    resolver: yupResolver(clientContactPersonSchema),
  })

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: 'contactPersons',
  })

  function appendContactPerson() {
    append({
      personType: 'Mr.',
      firstName: '',
      lastName: '',
      timezone: { code: '', label: '', phone: '' },
      email: '',
    })
  }

  function openCreateContactPersonForm() {
    reset({ contactPersons: [] })
    appendContactPerson()
    setFormMode('create')
    setOpen(true)
  }

  function openEditContactPersonForm(data: ContactPersonType) {
    closeModal(modalType.contactPerson)
    reset({ contactPersons: [data] })
    setFormMode('update')
    setOpen(true)
  }

  function cancelUpdateForm() {
    reset({ contactPersons: [] })
    setOpen(false)
  }

  const createContactPersonMutation = useMutation(
    (body: Array<CreateContactPersonFormType>) => createContactPerson(body),
    {
      onSuccess: () => onMutationSuccess(),
      onError: () => onMutationError(),
    },
  )

  const updateContactPersonMutation = useMutation(
    (data: { id: number; body: ContactPersonType }) =>
      patchContactPerson(data.id, data.body),
    {
      onSuccess: () => onMutationSuccess(),
      onError: () => onMutationError(),
    },
  )

  const deleteContactPersonMutation = useMutation(
    (contactPersonId: number) => deleteContactPerson(contactPersonId),
    {
      onSuccess: () => {
        onMutationSuccess()
        closeModal(modalType.contactPerson)
      },
      onError: () => onMutationError(),
    },
  )

  function onMutationSuccess() {
    reset({ contactPersons: [] })
    return queryClient.invalidateQueries(`client-detail-${clientId}`)
  }
  function onMutationError() {
    reset({ contactPersons: [] })
    toast.error('Something went wrong. Please try again.', {
      position: 'bottom-left',
    })
  }

  function onSubmit(data: ClientContactPersonType) {
    const body = data.contactPersons
    if (body?.length) {
      if (formMode === 'create') {
        const finalForm: Array<CreateContactPersonFormType> = body.map(
          item => ({
            ...item,
            clientId,
          }),
        )
        createContactPersonMutation.mutate(finalForm)
      } else if (formMode === 'update') {
        const contactPersonId = body[0].id
        updateContactPersonMutation.mutate({
          id: Number(contactPersonId)!,
          body: body[0],
        })
      }
    }

    reset({ contactPersons: [] })
    setOpen(false)
  }

  function onContactPersonDelete(data: ContactPersonType) {
    if (data?.isReferred !== undefined) {
      if (data.isReferred) {
        openModal({
          type: modalType.cannotDelete,
          children: (
            <CannotDeleteContactPersonModal
              open={true}
              onClose={() => {
                closeModal(modalType.cannotDelete)
              }}
            />
          ),
        })
      } else {
        openModal({
          type: modalType.deleteContactPerson,
          children: (
            <DeleteContactPersonModal
              open={true}
              onDelete={() => deleteContactPersonMutation.mutate(data.id!)}
              onClose={() => {
                closeModal(modalType.deleteContactPerson)
              }}
            />
          ),
        })
      }
    }
  }
  function onRowClick(data: GridRowParams<ContactPersonType>) {
    openModal({
      type: modalType.contactPerson,
      children: (
        <ContactPersonDetailModal
          data={data.row}
          onDelete={onContactPersonDelete}
          isUpdatable={isUpdatable}
          isDeletable={isDeletable}
          onEdit={openEditContactPersonForm}
          onClose={() => {
            closeModal(modalType.contactPerson)
          }}
        />
      ),
    })
  }

  return (
    <Card>
      <ContactPersonList
        fields={contactPersons || []}
        columns={columns}
        isUpdatable={isUpdatable}
        pageSize={pageSize}
        setPageSize={setPageSize}
        openForm={openCreateContactPersonForm}
        onRowClick={onRowClick}
      />

      <Dialog open={open} maxWidth='lg'>
        <DialogContent style={{ padding: '50px 60px' }}>
          <Grid container spacing={6}>
            <AddContactPersonForm
              mode={formMode}
              idx={0}
              control={control}
              errors={errors}
              handleSubmit={handleSubmit}
              onSubmit={onSubmit}
              watch={watch}
              isValid={isValid}
              getValues={getValues}
              onCancel={() => cancelUpdateForm()}
              onDiscard={() => {
                setOpen(false)
                setOpenDiscard(true)
                reset({ contactPersons: [] })
              }}
            />
          </Grid>
        </DialogContent>
      </Dialog>
      <DiscardContactPersonModal
        open={openDiscard}
        onDiscard={() => {
          reset({ contactPersons: [] })
        }}
        onCancel={() => {
          const data = watch('contactPersons')?.[0]
          data && update(0, data)
          setOpen(true)
          setOpenDiscard(false)
        }}
        onClose={() => {
          setOpenDiscard(false)
        }}
      />
    </Card>
  )
}
