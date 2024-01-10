import { useState } from 'react'

// ** style components
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

// ** react hook form
import { useFieldArray, useForm, useWatch } from 'react-hook-form'

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
import ContactPersonDetailModal from '../../components/modals/contact-person-detail-modal'
import DeleteConfirmModal from '../../components/modals/delete-confirm-modal'
import AddContactPersonForm from '@src/pages/components/forms/add-contact-person-form'
import AddContactPersonConfirmModal from '../../components/modals/add-contact-person-confirm-modal'
import SimpleAlertModal from '../../components/modals/simple-alert-modal'
import DiscardContactPersonModal from '../../components/modals/discard-contact-person-modal'
import CloseConfirmModal from '@src/pages/client/components/modals/close-confirm-modal'

// ** fetch & mutation
import { useMutation, useQueryClient } from 'react-query'
import {
  createContactPerson,
  deleteContactPerson,
  updateContactPerson as patchContactPerson,
} from '@src/apis/client.api'

// ** toast
import { toast } from 'react-hot-toast'
import isEqual from 'lodash/isEqual'

interface ContactPersonsProps {
  clientId: number
  clientInfo: ClientDetailType
  isUpdatable: boolean
  isDeletable: boolean
  isCreatable: boolean
  isSigned: boolean
}

const ContactPersons = ({
  clientId,
  clientInfo,
  isUpdatable,
  isDeletable,
  isCreatable,
  isSigned,
}: ContactPersonsProps) => {
  const { contactPersons } = clientInfo

  const queryClient = useQueryClient()
  const { openModal, closeModal } = useModal()

  const [open, setOpen] = useState(false)
  const [openAdd, setOpenAdd] = useState(false)
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
      renderHeader: () => <Box>Name / Email</Box>,
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
    reset,
    watch,
    getValues,
    formState: { errors, isValid, isDirty, dirtyFields },
  } = useForm<ClientContactPersonType>({
    defaultValues: contactPersonDefaultValue,
    mode: 'onChange',
    resolver: yupResolver(clientContactPersonSchema),
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'contactPersons',
  })

  const [contactPersonsItems] = useWatch({ control, name: ['contactPersons'] })

  const appendContactPerson = () => {
    append({
      personType: 'Mr.',
      firstName: '',
      lastName: '',
      timezone: { code: '', label: '', phone: '' },
      email: '',
      userId: null,
    })
  }

  const openCreateContactPersonForm = () => {
    reset({ contactPersons: [] })
    appendContactPerson()
    setFormMode('create')
    setOpen(true)
  }

  const openEditContactPersonForm = (data: ContactPersonType) => {
    closeModal(modalType.contactPerson)
    reset(
      { contactPersons: [data] },
      { keepDirty: false, keepDirtyValues: false },
    )

    setFormMode('update')
    setOpen(true)
  }

  const cancelUpdateForm = () => {
    if (!contactPersonsItems) return

    const email = contactPersonsItems[0].email
    const item1 = {
      ...contactPersons?.find(item => item.email === email),
      id: contactPersonsItems[0].id,
      fax: contactPersonsItems[0].fax,
      phone: contactPersonsItems[0].phone,
      mobile: contactPersonsItems[0].mobile,
    }
    const item2 = contactPersonsItems[0]

    if (isEqual(item1, item2)) {
      closeModal('close-confirm')
      setOpen(false)
      return
    }

    openModal({
      type: 'close-confirm',
      children: (
        <CloseConfirmModal
          message='Are you sure you want to discard all changes?'
          onClick={() => {
            setOpen(false)
          }}
          onClose={() => closeModal('close-confirm')}
        />
      ),
    })
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

  const onMutationSuccess = () => {
    reset({ contactPersons: [] })
    return queryClient.invalidateQueries(`client-detail-${clientId}`)
  }

  const onMutationError = () => {
    reset({ contactPersons: [] })
    toast.error('Something went wrong. Please try again.', {
      position: 'bottom-left',
    })
  }

  const onSubmit = (data: ClientContactPersonType) => {
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
        setOpenAdd(false)
      }
    }

    reset({ contactPersons: [] })
    setOpen(false)
  }

  const onContactPersonDelete = (data: ContactPersonType) => {
    if (data?.isReferred !== undefined) {
      if (data.isReferred) {
        openModal({
          type: modalType.cannotDelete,
          children: (
            <SimpleAlertModal
              message='This contact person cannot be deleted because it’s already registered
          on other pages.'
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
            <DeleteConfirmModal
              message='Are you sure you want to delete this contact person?'
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
  const onRowClick = (data: GridRowParams<ContactPersonType>) => {
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
        isSigned={isSigned}
        pageSize={pageSize}
        setPageSize={setPageSize}
        openForm={openCreateContactPersonForm}
        onRowClick={onRowClick}
      />

      <Dialog open={open} maxWidth='lg'>
        <DialogContent style={{ padding: '50px 60px' }}>
          <Grid container spacing={6}>
            <Grid item xs={12} display='flex' justifyContent='flex-start'>
              {formMode === 'create' ? (
                <Typography variant='h5'>Add contact person</Typography>
              ) : (
                ''
              )}
            </Grid>
            <AddContactPersonForm
              fields={fields.length ? [fields[0]] : []}
              control={control}
              errors={errors}
              watch={watch}
            />
            <Grid
              item
              xs={12}
              display='flex'
              gap='22px'
              justifyContent='center'
            >
              {formMode === 'create' ? (
                <Button
                  variant='outlined'
                  color='secondary'
                  onClick={() => {
                    // setOpen(false)
                    setOpenDiscard(true)
                  }}
                >
                  Discard
                </Button>
              ) : (
                <Button
                  variant='outlined'
                  color='secondary'
                  onClick={() => cancelUpdateForm()}
                >
                  Cancel
                </Button>
              )}

              {formMode === 'create' ? (
                <Button
                  variant='contained'
                  type='button'
                  disabled={!isValid}
                  onClick={() => setOpenAdd(true)}
                >
                  Add
                </Button>
              ) : (
                <Button
                  variant='contained'
                  disabled={!isValid}
                  onClick={() => setOpenAdd(true)}
                >
                  Save
                </Button>
              )}
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
      <DiscardContactPersonModal
        open={openDiscard}
        onDiscard={() => {
          setOpen(false)
          // reset({ contactPersons: [] })
        }}
        onCancel={() => {
          setOpen(true)
          setOpenDiscard(false)
        }}
        onClose={() => {
          setOpenDiscard(false)
        }}
      />
      <AddContactPersonConfirmModal
        formMode={formMode}
        open={openAdd}
        onAdd={() => onSubmit(getValues())}
        onClose={() => setOpenAdd(false)}
      />
    </Card>
  )
}

export default ContactPersons
