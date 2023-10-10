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

import useModal from '@src/hooks/useModal'

// ** components
import DiscardContactPersonModal from '../modals/discard-contact-person-modal'
import { CompanyInfoFormType } from '@src/types/schema/company-info.schema'
import ContactPersonList from '../list/contact-person-list'
import AddContactPersonForm from '@src/pages/components/forms/add-contact-person-form'
import AddContactPersonConfirmModal from '../modals/add-contact-person-confirm-modal'
import CustomModal from '@src/@core/components/common-modal/custom-modal'

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
  const { openModal, closeModal } = useModal()

  const columns: GridColumns<ContactPersonType<T>> = [
    {
      flex: 0.1,
      minWidth: 210,
      field: 'name',
      headerName: 'Name / Email',
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => <Box>Name / Email</Box>,
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
            <IconButton onClick={() => onClickRemove(String(row.id!))}>
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

  const onClickAdd = () => {
    openModal({
      type: 'ConfirmModal',
      children: (
        <CustomModal
          title={'Are you sure you want to add this contact person?'}
          onClose={() => closeModal('ConfirmModal')}
          leftButtonText='Cancel'
          rightButtonText='Add'
          vary='successful'
          onClick={() => {
            onSubmit(getValues()) // Form Close는 onSubmit 안에 있음
            closeModal('ConfirmModal')
          }}
        />
      ),
    })
  }

  const onClickDiscard = () => {
    openModal({
      type: 'DiscardModal',
      children: (
        <CustomModal
          title={'Are you sure you want to discard this contact person?'}
          onClose={() => closeModal('DiscardModal')}
          leftButtonText='Cancel'
          rightButtonText='Discard'
          vary='error'
          onClick={() => {
            setOpenForm(false)
            remove(idx)
            closeModal('DiscardModal')
          }}
        />
      ),
    })
  }

  const onClickSave = () => {
    openModal({
      type: 'SaveModal',
      children: (
        <CustomModal
          title={'Are you sure you want to save all changes?'}
          onClose={() => closeModal('SaveModal')}
          leftButtonText='Cancel'
          rightButtonText='Save'
          vary='successful'
          onClick={() => {
            onSubmit(getValues()) 
            closeModal('SaveModal')
          }}
        />
      ),
    })
  }

  const onClickCancel = () => {
    openModal({
      type: 'CancelModal',
      children: (
        <CustomModal
          title={'Are you sure you want to discard all changes?'}
          onClose={() => closeModal('CancelModal')}
          leftButtonText='Cancel'
          rightButtonText='Discard'
          vary='error'
          onClick={() => {
            cancelUpdateForm()
            closeModal('CancelModal')
          }}
        />
      ),
    })
  }

  const onClickRemove = (id: string) => {
    openModal({
      type: 'RemoveModal',
      children: (
        <CustomModal
          title={'Are you sure you want to delete this contact person?'}
          onClose={() => closeModal('RemoveModal')}
          leftButtonText='Cancel'
          rightButtonText='Delete'
          vary='error'
          onClick={() => {
            removeContactPerson(id)
            closeModal('RemoveModal')
          }}
        />
      ),
    })
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
            {/* TODO: general일때 save로 버튼명을 바꾸는거 였던거 같은데 지금은 아닌거 같음, 기획 확인 필요함 */}
            Next <Icon icon='material-symbols:arrow-forward-rounded' />
          </Button>
        ) : (
          <Button variant='contained' disabled={!isValid} onClick={onNextStep}>
            Next <Icon icon='material-symbols:arrow-forward-rounded' />
          </Button>
        )}
      </Grid>
      <Dialog
        open={openForm}
        maxWidth='lg'
        sx={{ zIndex: 1299 }}
      >
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
              index={idx}
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
                  onClick={() => onClickDiscard()}
                >
                  Discard
                </Button>
              ) : (
                <Button
                  variant='outlined'
                  color='secondary'
                  onClick={() => onClickCancel()}
                >
                  Cancel
                </Button>
              )}

              {mode === 'create' ? (
                <Button
                  variant='contained'
                  type='button'
                  disabled={!isValid}
                  onClick={() => onClickAdd()}
                >
                  Add
                </Button>
              ) : (
                <Button
                  variant='contained'
                  type='submit'
                  disabled={!isValid}
                  onClick={() => onClickSave()}
                >
                  Save
                </Button>
              )}
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </Grid>
  )
}
