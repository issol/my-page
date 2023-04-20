import { useState } from 'react'

// ** style components
import { Icon } from '@iconify/react'
import {
  Box,
  Button,
  Card,
  Dialog,
  DialogContent,
  Divider,
  Grid,
  IconButton,
  Typography,
  Tooltip,
} from '@mui/material'
import { TableTitleTypography } from '@src/@core/styles/typography'
import styled from 'styled-components'

// ** react hook form
import { Controller, useFieldArray, useForm } from 'react-hook-form'

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
import DiscardChangesModal from '@src/pages/components/modals/discard-modals/discard-changes'
import ConfirmSaveAllChanges from '@src/pages/components/modals/confirm-save-modals/confirm-save-all-chages'
import AddContactPersonForm from '../../components/forms/add-contact-person-form'
import DiscardContactPersonModal from '../../components/modals/discard-contact-person-modal'

// ** fetch & mutation
import { useMutation, useQueryClient } from 'react-query'
import {
  createContactPerson,
  updateContactPerson as patchContactPerson,
} from '@src/apis/client.api'

// ** toast
import { toast } from 'react-hot-toast'
import ContactPersonDetailModal from '../../components/modals/contact-person-detail-modal'

type Props = {
  clientId: number
  clientInfo: ClientDetailType
}

/* TODO : contact person detail모달 추가, update, delete 추가 */
export default function ContactPersons({ clientId, clientInfo }: Props) {
  const { contactPersons } = clientInfo

  const queryClient = useQueryClient()
  const { openModal, closeModal } = useModal()

  // const [idx, setIdx] = useState<number>(0)
  const [open, setOpen] = useState(false)
  const [openDiscard, setOpenDiscard] = useState(false)
  const [pageSize, setPageSize] = useState(10)

  const [formMode, setFormMode] = useState<'create' | 'update'>('create')

  const modalType = {
    discard: 'discard',
    save: 'save',
    contactPerson: 'contactPerson',
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

  const updateContactPersonMutation = useMutation(
    (data: { id: number; body: ContactPersonType }) =>
      patchContactPerson(data.id, data.body),
    {
      onSuccess: () => onMutationSuccess(),
      onError: () => onMutationError(),
    },
  )
  const createContactPersonMutation = useMutation(
    (body: Array<CreateContactPersonFormType>) => createContactPerson(body),
    {
      onSuccess: () => onMutationSuccess(),
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
  console.log(getValues())
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

  function onRowClick(data: GridRowParams<ContactPersonType>) {
    openModal({
      type: modalType.contactPerson,
      children: (
        <ContactPersonDetailModal
          data={data.row}
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
