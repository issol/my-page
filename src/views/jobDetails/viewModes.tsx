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
import { JobStatus } from '@src/types/common/status.type'
import { JobsStatusChip } from '@src/@core/components/chips/chips'
import { ServiceTypeList } from '@src/shared/const/service-type/service-types'
import CancelIcon from '@mui/icons-material/Cancel'
import { ServiceType } from '@src/shared/const/service-type/service-type.enum'
import { UseMutationResult } from 'react-query'

export type JobListMode = 'view' | 'edit' | 'delete' | 'manageStatus'

export interface ModeProps {
  mode?: JobListMode
  onChangeViewMode: () => void
  resetSelected?: () => void
}

interface DeleteModeProps extends ModeProps {
  deleteJobsMutation: UseMutationResult<void[], unknown, number[], unknown>
  isTriggerJob: (jobId: number) => void
  selected: readonly number[]
}

export const DeleteMode = ({
  mode,
  selected,
  onChangeViewMode,
  deleteJobsMutation,
  isTriggerJob,
  resetSelected,
}: DeleteModeProps) => {
  if (mode !== 'delete') return null

  const { openModal, closeModal } = useModal()

  const NONE_TRIGGER_TEXT = 'Selected Jobs will be deleted.'
  const TRIGGER_TEXT =
    'Triggers between the jobs will be deleted with the jobs. Proceed?'

  const onClickAlertDelete = () => {
    deleteJobsMutation
      .mutateAsync([...selected])
      .then(() => {
        displayCustomToast('Deleted successfully.', 'success')
        closeModal('DeleteJobsConfirm')
        resetSelected && resetSelected()
        onChangeViewMode()
      })
      .catch(e => {
        displayCustomToast('Failed to delete.', 'error')
        closeModal('DeleteJobsConfirm')
      })
  }

  const onClickDelete = () => {
    const hasTriggerJob = selected.some(jobId => isTriggerJob(jobId))

    openModal({
      type: 'DeleteJobsConfirm',
      children: (
        <CustomModalV2
          onClick={onClickAlertDelete}
          onClose={() => closeModal('DeleteJobsConfirm')}
          title='Delete jobs?'
          vary='error-alert'
          subtitle={hasTriggerJob ? TRIGGER_TEXT : NONE_TRIGGER_TEXT}
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
      <Button
        size='large'
        variant='outlined'
        onClick={() => {
          resetSelected && resetSelected()
          onChangeViewMode()
        }}
      >
        Cancel
      </Button>
      <Button
        size='large'
        variant='contained'
        disableElevation
        onClick={() => onClickDelete()}
        disabled={selected.length === 0}
      >
        {selected.length === 0 && 'Delete'}
        {selected.length !== 0 && `Delete selected jobs (${selected.length})`}
      </Button>
    </Box>
  )
}

interface ManageStatusModeProps extends ModeProps {
  changeJobStatus: JobStatus | null
  statusList?: Array<{ value: number; label: string }>
  setChangeJobStatus: Dispatch<JobStatus | null>
  selected: readonly number[]
  isStatusUpdatable: (changeStatus: number) => {
    isUpdatable: boolean
    immutableCorporationId: string[]
  }
  changeStatusMutation: UseMutationResult<
    void[],
    unknown,
    {
      jobIds: number[]
      status: number
    },
    unknown
  >
}

export const ManageStatusMode = ({
  mode,
  selected,
  statusList,
  changeJobStatus,
  onChangeViewMode,
  setChangeJobStatus,
  resetSelected,
  isStatusUpdatable,
  changeStatusMutation,
}: ManageStatusModeProps) => {
  if (mode !== 'manageStatus') return null

  const { openModal, closeModal } = useModal()

  const onClickChangeStatus = () => {
    changeStatusMutation
      .mutateAsync({
        jobIds: [...selected],
        status: changeJobStatus!,
      })
      .then(() => {
        displayCustomToast('Saved successfully.', 'success')
        closeModal('StatusChangeAlert')
        resetSelected && resetSelected()
        onChangeViewMode()
      })
      .catch(e => {
        displayCustomToast('Failed to save.', 'error')
        closeModal('StatusChangeAlert')
      })
  }

  const onClickSave = (changeStatus: number) => {
    const isUpdatable = isStatusUpdatable(changeStatus)
    if (isUpdatable.isUpdatable) {
      openModal({
        type: 'StatusChangeAlert',
        children: (
          <CustomModalV2
            onClick={onClickChangeStatus}
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
                {isUpdatable.immutableCorporationId.map(
                  (corporationId, index) => (
                    <li key={index}>{corporationId}</li>
                  ),
                )}
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

    setChangeJobStatus(Number(value) as JobStatus)
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
          {`Change status of ${selected.length} Job(s) to:`}
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
                {JobsStatusChip(Number(selected) as JobStatus, statusList!)}
              </Box>
            )}
          >
            {statusList?.map(status => (
              <MenuItem key={status.value} value={status.value}>
                {JobsStatusChip(status.value as JobStatus, statusList!)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Box display='flex' gap='16px'>
        <Button
          size='large'
          variant='outlined'
          onClick={() => {
            resetSelected && resetSelected()
            onChangeViewMode()
          }}
        >
          Cancel
        </Button>
        <Button
          size='large'
          variant='contained'
          disableElevation
          disabled={selected.length === 0 || !changeJobStatus}
          onClick={() => changeJobStatus && onClickSave(changeJobStatus)}
        >
          Save
        </Button>
      </Box>
    </Box>
  )
}

interface AddJobProps extends ModeProps {
  alertClose: () => void
  onClickAddJob: (itemId: number, index: number, serviceType: string[]) => void
  itemId: number
  jobIndex: number
}

export const AddJobMenu = ({
  alertClose,
  onClickAddJob,
  itemId,
  jobIndex,
}: AddJobProps) => {
  const [serviceTypes] = useState(ServiceTypeList)
  const [selectedServiceType, setSelectedServiceType] = useState<
    (keyof typeof ServiceType)[]
  >([])
  const onClickAdd = () => {
    onClickAddJob(itemId, jobIndex, selectedServiceType)
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
