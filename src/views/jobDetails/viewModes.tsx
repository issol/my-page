import useModal from '@src/hooks/useModal'
import { displayCustomToast } from '@src/shared/utils/toast'
import CustomModalV2 from '@src/@core/components/common-modal/custom-modal-v2'
import {
  Autocomplete,
  Box,
  Button,
  Card,
  Checkbox,
  Chip,
  FormControl,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from '@mui/material'
import React, { Dispatch, useState } from 'react'
import { JobStatusType } from '@src/types/jobs/jobs.type'
import { JobsStatusChip } from '@src/@core/components/chips/chips'
import { ServiceTypeList } from '@src/shared/const/service-type/service-types'
import CancelIcon from '@mui/icons-material/Cancel'
import { ServiceType } from '@src/shared/const/service-type/service-type.enum'

export type JobListMode = 'view' | 'edit' | 'delete' | 'manageStatus'

export interface ModeProps {
  mode?: JobListMode
  onChangeViewMode: () => void
}

interface DeleteModeProps extends ModeProps {
  selected: readonly number[]
}

export const DeleteMode = ({
  mode,
  selected,
  onChangeViewMode,
}: DeleteModeProps) => {
  if (mode !== 'delete') return null

  const { openModal, closeModal } = useModal()

  const NONE_FLOW_TEXT = 'Selected Jobs will be deleted.'
  const FLOW_TEXT =
    'Triggers between the jobs will be deleted with the jobs. Proceed?'

  const onClickAlertDelete = () => {
    // NOTE : 삭제하는 로직 필요
    displayCustomToast('Deleted successfully.', 'error')
    closeModal('DeleteJobsConfirm')
    onChangeViewMode()
  }

  const onClickDelete = () => {
    openModal({
      type: 'DeleteJobsConfirm',
      children: (
        <CustomModalV2
          onClick={onClickAlertDelete}
          onClose={() => closeModal('DeleteJobsConfirm')}
          title='Delete jobs?'
          vary='error-alert'
          subtitle={NONE_FLOW_TEXT}
          rightButtonText='Delete'
        />
      ),
    })
  }

  return (
    <Box
      width='100%'
      height='100%'
      display='flex'
      alignItems='center'
      justifyContent='flex-end'
      padding='32px 20px'
      gap='16px'
    >
      <Button size='large' variant='outlined' onClick={onChangeViewMode}>
        Cancel
      </Button>
      <Button
        size='large'
        variant='contained'
        disableElevation
        onClick={onClickDelete}
        disabled={selected.length === 0}
      >
        {selected.length === 0 && 'Delete'}
        {selected.length !== 0 && `Delete selected jobs (${selected.length})`}
      </Button>
    </Box>
  )
}

interface ManageStatusModeProps extends ModeProps {
  changeJobStatus: JobStatusType | null
  statusList?: Array<{ value: number; label: string }>
  setChangeJobStatus: Dispatch<JobStatusType | null>
}

export const ManageStatusMode = ({
  mode,
  statusList,
  changeJobStatus,
  onChangeViewMode,
  setChangeJobStatus,
}: ManageStatusModeProps) => {
  if (mode !== 'manageStatus') return null

  const { openModal, closeModal } = useModal()

  const onClickAlertDelete = () => {
    // NOTE : 삭제하는 로직 필요
    displayCustomToast('Saved successfully.', 'success')
    closeModal('StatusChangeAlert')
    onChangeViewMode()
  }

  const onClickSave = () => {
    const isStatusChanged = true

    if (!isStatusChanged) {
      openModal({
        type: 'StatusChangeAlert',
        children: (
          <CustomModalV2
            onClick={onClickAlertDelete}
            onClose={() => closeModal('StatusChangeAlert')}
            title='Save changes?'
            vary='successful'
            subtitle='Are you sure you want to save all changes?'
            leftButtonText='Cancel'
            rightButtonText='Save'
          />
        ),
      })
      return
    }

    openModal({
      type: 'NotStatusChangeAlert',
      children: (
        <CustomModalV2
          buttonDirection='column-reverse'
          onClick={() => closeModal('NotStatusChangeAlert')}
          onClose={() => closeModal('NotStatusChangeAlert')}
          title='Status change unavailable'
          vary='error-alert'
          rightButtonText='Okay'
          soloButton
          subtitle={
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                fontSize: '16px',
              }}
            >
              <p>
                The statuses of this jobs cannot be changed due to conditions
                not being fulfilled.
              </p>
              <ul style={{ display: 'flex', flexDirection: 'column' }}>
                <li>TRA-001</li>
                <li>TRA-002</li>
              </ul>
            </div>
          }
        />
      ),
    })
  }

  const handleChange = (event: SelectChangeEvent) => {
    const {
      target: { value },
    } = event

    setChangeJobStatus(Number(value) as JobStatusType)
  }

  return (
    <Box
      width='100%'
      height='100%'
      display='flex'
      alignItems='center'
      justifyContent='space-between'
      padding='32px 20px'
    >
      <Box display='flex' alignItems='center' gap='16px'>
        <Typography variant='body1' fontWeight={600}>
          Change status of 2 Job(s) to:
        </Typography>
        <FormControl>
          <Select
            size='small'
            labelId='demo-multiple-chip-label'
            id='demo-multiple-chip'
            value={changeJobStatus ? `${changeJobStatus}` : ''}
            onChange={handleChange}
            input={<OutlinedInput />}
            renderValue={selected => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {JobsStatusChip(Number(selected) as JobStatusType, statusList!)}
              </Box>
            )}
          >
            {statusList?.map(status => (
              <MenuItem key={status.value} value={status.value}>
                {JobsStatusChip(status.value as JobStatusType, statusList!)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Box display='flex' gap='16px'>
        <Button size='large' variant='outlined' onClick={onChangeViewMode}>
          Cancel
        </Button>
        <Button
          size='large'
          variant='contained'
          disableElevation
          onClick={onClickSave}
        >
          Save
        </Button>
      </Box>
    </Box>
  )
}

interface AddJobProps extends ModeProps {
  alertClose: () => void
}

export const AddJobMenu = ({ alertClose }: AddJobProps) => {
  const [serviceTypes] = useState(ServiceTypeList)
  const [selectedServiceType, setSelectedServiceType] = useState<
    (keyof typeof ServiceType)[]
  >([])

  const onClickAdd = () => {
    console.log('selected', selectedServiceType)
    alertClose()
  }

  return (
    <Card
      sx={{
        position: 'absolute',
        top: 58,
        right: -190,
        zIndex: 10,
        padding: '20px',
      }}
    >
      <Box display='flex' alignItems='center' gap='16px'>
        <Box>
          <Autocomplete
            id='serviceType'
            size='small'
            autoHighlight
            fullWidth
            multiple
            disableCloseOnSelect
            options={serviceTypes || []}
            getOptionLabel={option => option.label}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  label={option.label}
                  size='small'
                  {...getTagProps({ index })}
                  key={`${option.value}-${index}`}
                  deleteIcon={
                    <CancelIcon sx={{ color: '#6D788D !important' }} />
                  }
                />
              ))
            }
            renderInput={params => (
              <TextField
                {...params}
                fullWidth
                autoComplete='off'
                placeholder={
                  selectedServiceType.length === 0 ? 'Service Type' : ''
                }
              />
            )}
            renderOption={(props, option, { selected }) => (
              <li {...props}>
                <Checkbox checked={selected} sx={{ mr: 2 }} />
                {option.label}
              </li>
            )}
            value={serviceTypes.filter(st =>
              selectedServiceType.includes(st.value),
            )}
            onChange={(event, newValue) => {
              setSelectedServiceType(newValue.map(item => item.value))
            }}
            sx={{
              minWidth: 306,
              '& .MuiOutlinedInput-root': {
                padding: '9px 12px !important',
              },
            }}
          />
        </Box>
        <Button
          variant='contained'
          size='large'
          onClick={onClickAdd}
          disabled={selectedServiceType.length === 0}
        >
          Add
        </Button>
      </Box>
    </Card>
  )
}
