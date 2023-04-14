import { useEffect, useState } from 'react'
import useModal from '@src/hooks/useModal'
import { v4 as uuidv4 } from 'uuid'

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
  Controller,
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
  const [openForm, setOpenForm] = useState(false)
  const [idx, setIdx] = useState<number>(0)
  const [mode, setMode] = useState<'create' | 'update'>('create')
  const [skip, setSkip] = useState(0)
  const [pageSize, setPageSize] = useState(2)

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

  // console.log(list, list.slice(skip, pageSize), skip, pageSize)
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
            // rows={fields}
            rows={fields.slice(skip, pageSize)}
            columns={columns}
            rowCount={fields?.length ?? 0}
            rowsPerPageOptions={[2, 25, 50]}
            // page={skip}
            pageSize={pageSize}
            onPageChange={setSkip}
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
      <Dialog open={openForm} onClose={() => setOpenForm(false)} maxWidth='lg'>
        <AddContactPersonForm
          mode={mode}
          idx={idx}
          control={control}
          errors={errors}
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
          watch={watch}
          isValid={isValid}
          onClose={() => setOpenForm(false)}
        />
      </Dialog>
    </Grid>
  )
}
