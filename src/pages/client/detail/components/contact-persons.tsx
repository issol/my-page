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
import { GridColumns } from '@mui/x-data-grid'

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

type Props = {
  clientId: number
  clientInfo: ClientDetailType
}

/* TODO : contact person detail모달 추가, update, delete 추가 */
export default function ContactPersons({ clientId, clientInfo }: Props) {
  const { contactPersons } = clientInfo

  const queryClient = useQueryClient()
  const { openModal, closeModal } = useModal()

  const [idx, setIdx] = useState<number>(0)
  const [open, setOpen] = useState(false)
  const [openDiscard, setOpenDiscard] = useState(false)
  const [pageSize, setPageSize] = useState(10)

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

  function openContactPersonForm() {
    appendContactPerson()
    setIdx(fields.length)
    setOpen(true)
  }

  function cancelUpdateForm() {
    const data = fields?.[idx]
    update(idx, data)
    setOpen(false)
  }

  function removeContactPerson(id: string) {
    const idx = fields.map(item => item.id).indexOf(id)
    idx !== -1 && remove(idx)
  }

  function updateContactPerson(id: string) {
    const idx = fields.map(item => item.id).indexOf(id)
    setIdx(idx)
    // setMode('update')
    setOpen(true)
  }

  const updateContactPersonMutation = useMutation(
    (body: ContactPersonType) => patchContactPerson(clientId, body),
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

  function onCancel() {
    openModal({
      type: 'discard',
      children: (
        <DiscardChangesModal
          onDiscard={() => setOpen(false)}
          onClose={() => closeModal('discard')}
        />
      ),
    })
  }

  function onSave() {
    openModal({
      type: 'save',
      children: (
        <ConfirmSaveAllChanges
          onSave={() => {
            setOpen(false)
            onSubmit()
          }}
          onClose={() => closeModal('save')}
        />
      ),
    })
  }

  function onSubmit() {
    const data = getValues().contactPersons
    if (data?.length) {
      const finalForm: Array<CreateContactPersonFormType> = data.map(item => ({
        ...item,
        clientId,
      }))
      createContactPersonMutation.mutate(finalForm)
    }
    reset({ contactPersons: [] })
    setOpen(false)
  }
  console.log(getValues())

  return (
    <Card>
      <ContactPersonList
        fields={contactPersons || []}
        columns={columns}
        pageSize={pageSize}
        setPageSize={setPageSize}
        openForm={openContactPersonForm}
      />

      <Dialog open={open} maxWidth='lg'>
        <DialogContent style={{ padding: '50px 60px' }}>
          <Grid container spacing={6}>
            <AddContactPersonForm
              mode='create'
              idx={idx}
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
              }}
            />
            {/* <Grid
              item
              xs={12}
              display='flex'
              justifyContent='center'
              gap='16px'
            >
              <Button variant='outlined' color='secondary' onClick={onCancel}>
                Cancel
              </Button>
              <Button variant='contained' disabled={!isValid} onClick={onSave}>
                Save
              </Button>
            </Grid> */}
          </Grid>
        </DialogContent>
      </Dialog>
      <DiscardContactPersonModal
        open={openDiscard}
        onDiscard={() => {
          remove(idx)
        }}
        onCancel={() => {
          const data = watch('contactPersons')?.[idx]
          data && update(idx, data)
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
