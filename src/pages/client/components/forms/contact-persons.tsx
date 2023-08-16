import { useEffect, useState } from 'react'

// ** style components
import {
  Button,
  Card,
  DialogContent,
  Grid,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material'
import { Box } from '@mui/system'
import { GridColumns } from '@mui/x-data-grid'
import Dialog from '@mui/material/Dialog'
import { TableTitleTypography } from '@src/@core/styles/typography'

// ** types
import {
  ClientContactPersonType,
  ContactPersonType,
} from '@src/types/schema/client-contact-person.schema'

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
  UseFormHandleSubmit,
  UseFormWatch,
} from 'react-hook-form'

// ** helper
import { getLegalName } from 'src/shared/helpers/legalname.helper'

// ** components
import DiscardContactPersonModal from '../modals/discard-contact-person-modal'
import { CompanyInfoFormType } from '@src/types/schema/company-info.schema'
import ContactPersonList from '../list/contact-person-list'
import AddContactPersonForm from '@src/pages/components/forms/add-contact-person-form'
import AddContactPersonConfirmModal from '../modals/add-contact-person-confirm-modal'

type Props<T extends number | string = string> = {
  isGeneral: boolean
  getCompanyInfo?: UseFormGetValues<CompanyInfoFormType>
  control: Control<ClientContactPersonType<T>, any>
  fields: FieldArrayWithId<ClientContactPersonType, 'contactPersons', 'id'>[]
  append: UseFieldArrayAppend<ClientContactPersonType<T>, 'contactPersons'>
  remove: UseFieldArrayRemove
  update: UseFieldArrayUpdate<ClientContactPersonType<T>, 'contactPersons'>
  getValues: UseFormGetValues<ClientContactPersonType<T>>
  errors: FieldErrors<ClientContactPersonType<T>>
  isValid: boolean
  watch: UseFormWatch<ClientContactPersonType<T>>
  handleSubmit: UseFormHandleSubmit<ClientContactPersonType<T>>
  onClientDataSubmit: () => void
  onNextStep: () => void
  handleBack: () => void
}

export default function ContactPersonForm<T extends number | string = string>({
  isGeneral,
  getCompanyInfo,
  control,
  fields,
  append,
  remove,
  update,
  getValues,
  errors,
  isValid,
  watch,
  handleSubmit,
  onClientDataSubmit,
  onNextStep,
  handleBack,
}: Props<T>) {
  const [idx, setIdx] = useState<number>(0)
  const [mode, setMode] = useState<'create' | 'update'>('create')
  const [pageSize, setPageSize] = useState(10)

  // ** modals
  const [openForm, setOpenForm] = useState(false)
  const [openAdd, setOpenAdd] = useState(false)
  const [openDiscard, setOpenDiscard] = useState(false)

  const columns: GridColumns<ContactPersonType<T>> = [
    {
      flex: 0.1,
      minWidth: 210,
      field: 'name',
      headerName: 'Name / Email',
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => <Box>Company name / Email</Box>,
      renderCell: ({ row }: { row: ContactPersonType<T> }) => {
        return (
          <Box display='flex' flexDirection='column'>
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
      renderCell: ({ row }: { row: ContactPersonType<T> }) => {
        return <Typography>{row.department}</Typography>
      },
    },
    {
      flex: 0.05,
      minWidth: 180,
      field: 'jobTitle',
      headerName: 'Job title',
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => <Box>Job title</Box>,
    },
    {
      flex: 0.05,
      minWidth: 180,
      field: 'action',
      headerName: '',
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      renderCell: ({ row }: { row: ContactPersonType<T> }) => {
        return (
          <Box>
            <IconButton onClick={() => updateContactPerson(String(row.id!))}>
              <Icon icon='mdi:pencil-outline' />
            </IconButton>
            <IconButton onClick={() => removeContactPerson(String(row.id!))}>
              <Icon icon='mdi:trash-outline' />
            </IconButton>
          </Box>
        )
      },
    },
  ]

  function onSubmit(data: ClientContactPersonType<T>) {
    setOpenForm(false)
    if (!data.contactPersons?.length) return
    update(idx, data.contactPersons[idx])
  }

  function openContactPersonForm() {
    appendContactPerson()
    setIdx(fields.length)
    setMode('create')
    setOpenForm(true)
  }

  function appendContactPerson() {
    const companyInfo = getCompanyInfo ? getCompanyInfo() : undefined
    append({
      personType: 'Mr.',
      firstName: '',
      lastName: '',
      timezone: companyInfo?.timezone ?? { code: '', label: '', phone: '' },
      email: '',
      userId: null,
    })
  }

  function removeContactPerson(id: string) {
    const idx = fields.map(item => item.id as string).indexOf(id)
    idx !== -1 && remove(idx)
  }

  function updateContactPerson(id: string) {
    const idx = fields.map(item => item.id as string).indexOf(id)
    setIdx(idx)
    setMode('update')
    setOpenForm(true)
  }

  function cancelUpdateForm() {
    const data = fields?.[idx]
    update(idx, data)
    setOpenForm(false)
  }

  return (
    <Grid item xs={12}>
      <ContactPersonList<T>
        fields={fields}
        columns={columns}
        openForm={openContactPersonForm}
        pageSize={pageSize}
        setPageSize={setPageSize}
      />
      <Grid
        item
        xs={12}
        display='flex'
        justifyContent='space-between'
        mt='24px'
      >
        <Button variant='outlined' color='secondary' onClick={handleBack}>
          <Icon icon='material-symbols:arrow-back-rounded' />
          Previous
        </Button>
        {isGeneral ? (
          <Button
            variant='contained'
            disabled={!isValid}
            onClick={onClientDataSubmit}
          >
            Save <Icon icon='material-symbols:arrow-forward-rounded' />
          </Button>
        ) : (
          <Button variant='contained' disabled={!isValid} onClick={onNextStep}>
            Next <Icon icon='material-symbols:arrow-forward-rounded' />
          </Button>
        )}
      </Grid>
      <Dialog open={openForm} maxWidth='lg'>
        <DialogContent>
          <Grid container spacing={6}>
            {mode === 'create' ? (
              <Grid item xs={12} display='flex' justifyContent='flex-start'>
                <Typography variant='h5'>Add contact person</Typography>
              </Grid>
            ) : null}
            <AddContactPersonForm<T>
              fields={fields.length ? [fields[idx]] : []}
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
              {mode === 'create' ? (
                <Button
                  variant='outlined'
                  color='secondary'
                  onClick={() => {
                    setOpenForm(false)
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

              {mode === 'create' ? (
                <Button
                  variant='contained'
                  type='button'
                  disabled={!isValid}
                  onClick={() => setOpenAdd(true)}
                >
                  Add
                </Button>
              ) : (
                <Button variant='contained' type='submit' disabled={!isValid}>
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
          remove(idx)
        }}
        onCancel={() => {
          const data = watch('contactPersons')?.[idx]
          data && update(idx, data)
          setOpenForm(true)
          setOpenDiscard(false)
        }}
        onClose={() => {
          setOpenDiscard(false)
        }}
      />
      <AddContactPersonConfirmModal
        open={openAdd}
        onAdd={() => onSubmit(getValues())}
        onClose={() => setOpenAdd(false)}
      />
    </Grid>
  )
}
