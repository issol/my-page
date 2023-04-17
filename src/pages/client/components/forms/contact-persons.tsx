import { useEffect, useState } from 'react'

// ** mui
import { Button, Card, Grid, IconButton, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { DataGrid, GridColumns } from '@mui/x-data-grid'
import CardHeader from '@mui/material/CardHeader'
import Dialog from '@mui/material/Dialog'

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
import AddContactPersonForm from './add-contact-person-form'
import DiscardContactPersonModal from '../modals/discard-contact-person-modal'

type Props = {
  control: Control<ClientContactPersonType, any>
  fields: FieldArrayWithId<ClientContactPersonType, 'contactPersons', 'id'>[]
  append: UseFieldArrayAppend<ClientContactPersonType, 'contactPersons'>
  remove: UseFieldArrayRemove
  update: UseFieldArrayUpdate<ClientContactPersonType, 'contactPersons'>
  getValues: UseFormGetValues<ClientContactPersonType>
  errors: FieldErrors<ClientContactPersonType>
  isValid: boolean
  watch: UseFormWatch<ClientContactPersonType>
  handleSubmit: UseFormHandleSubmit<ClientContactPersonType>
  onNextStep: () => void
  handleBack: () => void
}

export default function ContactPersonForm({
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
  onNextStep,
  handleBack,
}: Props) {
  const [idx, setIdx] = useState<number>(0)
  const [mode, setMode] = useState<'create' | 'update'>('create')
  const [pageSize, setPageSize] = useState(10)

  // ** modals
  const [openForm, setOpenForm] = useState(false)
  const [openDiscard, setOpenDiscard] = useState(false)

  const columns: GridColumns<ContactPersonType> = [
    {
      flex: 0.1,
      minWidth: 210,
      field: 'name',
      headerName: 'Name / Email',
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => <Box>Company name / Email</Box>,
      renderCell: ({ row }: { row: ContactPersonType }) => {
        return (
          <Box display='flex' flexDirection='column'>
            <Typography fontWeight='bold'>
              {getLegalName({
                firstName: row.firstName,
                middleName: row?.middleName,
                lastName: row.lastName,
              })}
            </Typography>
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
      renderCell: ({ row }: { row: ContactPersonType }) => {
        return (
          <Box>
            <IconButton onClick={() => updateContactPerson(row.id!)}>
              <Icon icon='mdi:pencil-outline' />
            </IconButton>
            <IconButton onClick={() => removeContactPerson(row.id!)}>
              <Icon icon='mdi:trash-outline' />
            </IconButton>
          </Box>
        )
      },
    },
  ]

  function NoList() {
    return (
      <Box
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Typography variant='subtitle1'>
          There are no contact persons
        </Typography>
      </Box>
    )
  }

  function onSubmit(data: ClientContactPersonType) {
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
    append({
      personType: 'Mr.',
      firstName: '',
      lastName: '',
      timezone: { code: '', phone: '', label: '' },
      email: '',
    })
  }

  function removeContactPerson(id: string) {
    const idx = fields.map(item => item.id).indexOf(id)
    idx !== -1 && remove(idx)
  }

  function updateContactPerson(id: string) {
    const idx = fields.map(item => item.id).indexOf(id)
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
      <Card>
        <CardHeader
          title={
            <Box display='flex' justifyContent='space-between'>
              <Typography variant='h6'>
                Contact person({fields?.length ?? 0})
              </Typography>{' '}
              <Button variant='contained' onClick={openContactPersonForm}>
                Add contact person
              </Button>
            </Box>
          }
          sx={{ pb: 4, '& .MuiCardHeader-title': { letterSpacing: '.15px' } }}
        />
        <Box
          sx={{
            '& .MuiDataGrid-columnHeaderTitle': {
              textTransform: 'none',
            },
          }}
        >
          <DataGrid
            autoHeight
            components={{
              NoRowsOverlay: () => NoList(),
              NoResultsOverlay: () => NoList(),
            }}
            sx={{ overflowX: 'scroll' }}
            rows={fields}
            columns={columns}
            pageSize={pageSize}
            rowsPerPageOptions={[10, 25, 50]}
            onPageSizeChange={newPageSize => setPageSize(newPageSize)}
          />
        </Box>
      </Card>
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
        <Button variant='contained' disabled={!isValid} onClick={onNextStep}>
          Next <Icon icon='material-symbols:arrow-forward-rounded' />
        </Button>
      </Grid>
      <Dialog open={openForm} maxWidth='lg'>
        <AddContactPersonForm
          mode={mode}
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
            setOpenForm(false)
            setOpenDiscard(true)
          }}
        />
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
    </Grid>
  )
}
