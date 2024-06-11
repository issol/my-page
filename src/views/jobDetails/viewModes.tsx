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
import React, { Dispatch, SetStateAction, useState } from 'react'
import { JobStatus } from '@src/types/common/status.type'
import {
  JobsStatusChip,
  ServiceTypeChip,
} from '@src/@core/components/chips/chips'
import { ServiceTypeList } from '@src/shared/const/service-type/service-types'
import CancelIcon from '@mui/icons-material/Cancel'
import { ServiceType } from '@src/shared/const/service-type/service-type.enum'
import { UseMutationResult } from 'react-query'
import { JobItemType, JobType } from '@src/types/common/item.type'
import { v4 as uuidv4 } from 'uuid'
import { Icon } from '@iconify/react'
import _ from 'lodash'
import { UseFormGetValues } from 'react-hook-form'
import { ItemOptionType } from 'src/pages/[companyName]/orders/job-list/details'

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

interface EditModeProps extends ModeProps {
  selected: JobType[]
  refetch: any
  isDirty: boolean
  saveTriggerOptionsMutation: UseMutationResult<
    boolean,
    unknown,
    {
      updateData: {
        jobId: number
        statusCodeForAutoNextJob: number | null
        autoNextJob: '0' | '1'
        autoSharingFile: '0' | '1'
      }[]
      deleteData: {
        jobId: number[]
      }
    },
    unknown
  >
  addTriggerBetweenJobsMutation: UseMutationResult<
    void,
    unknown,
    {
      jobId: number
      sortingOrder: number
      triggerOrder?: number
    }[],
    unknown
  >
  selectedItemJobs: JobType[]
  getValues: UseFormGetValues<{
    items: {
      jobs: JobType[]
      id: number
      itemName: string
      sourceLanguage: string
      targetLanguage: string
      contactPersonId: number
      sortingOrder: number
    }[]
  }>
  dirtyFields: any
  setDeleteJobId: Dispatch<SetStateAction<number[]>>
  deleteJobId: number[]
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
  isStatusUpdatable: (
    changeStatus: number,
    jobIds: number[],
  ) => {
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
    const isUpdatable = isStatusUpdatable(changeStatus, [...selected])
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

export const EditMode = ({
  mode,
  onChangeViewMode,
  resetSelected,
  selected,
  isDirty,
  refetch,
  getValues,
  saveTriggerOptionsMutation,
  addTriggerBetweenJobsMutation,
  selectedItemJobs,
  dirtyFields,
  setDeleteJobId,
  deleteJobId,
}: EditModeProps) => {
  const { openModal, closeModal } = useModal()

  console.log()

  type keyType =
    | `items.${number}.jobs.${number}`
    | 'items'
    | `items.${number}`
    | `items.${number}.jobs`
    | ''
  console.log(selected, 'jobjob')
  function flattenKeys(obj: any, path: string = ''): string[] {
    return Object.keys(obj).reduce((acc: string[], key: string) => {
      const newPath = path ? `${path}.${key}` : key
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        acc.push(...flattenKeys(obj[key], newPath))
      } else {
        acc.push(newPath)
      }
      return acc
    }, [])
  }

  const extractNumbers = (str: string) => {
    const numbers = str.match(/[0-9]+/g)
    if (numbers && numbers.length >= 2) {
      const itemIndex = parseInt(numbers[0], 10)
      const rowIndex = parseInt(numbers[1], 10)
      return { itemIndex, rowIndex }
    }
    return { itemIndex: -1, rowIndex: -1 }
  }

  if (mode !== 'edit') return null

  return (
    <Box
      width='100%'
      height='100%'
      display='flex'
      alignItems='center'
      justifyContent='space-between'
      padding='32px 20px'
    >
      <Box display='flex' alignItems='center' gap='120px'>
        {selected.length > 0 && (
          <>
            <Typography fontSize={16} fontWeight={600}>
              Add a trigger
            </Typography>
            <Box
              sx={{
                padding: '20px',
                border: '1px solid #666CFF',
                borderRadius: '10px',
                display: 'flex',
              }}
            >
              {selected.map((value, index) => {
                return (
                  <Box
                    key={uuidv4()}
                    sx={{ display: 'flex', gap: '8px', alignItems: 'center' }}
                  >
                    <Typography>{value.corporationId}</Typography>
                    <ServiceTypeChip size='small' label={value.serviceType} />
                    {(index === 0 || index !== selected.length - 1) && (
                      <Box
                        sx={{
                          mr: '8px',
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        <Icon
                          icon='fluent:arrow-right-24-filled'
                          fontSize={24}
                          color='#8D8E9A'
                        />
                      </Box>
                    )}
                  </Box>
                )
              })}
            </Box>
          </>
        )}
      </Box>
      <Box display='flex' gap='16px'>
        <Button
          size='large'
          variant='outlined'
          onClick={() => {
            if (selected.length > 0) {
              resetSelected && resetSelected()
            } else {
              if (isDirty) {
                openModal({
                  type: 'CancelEditAlert',
                  children: (
                    <CustomModalV2
                      onClick={() => {
                        closeModal('CancelEditAlert')
                        resetSelected && resetSelected()
                        onChangeViewMode()
                        refetch()
                      }}
                      onClose={() => closeModal('CancelEditAlert')}
                      title='Discard changes?'
                      vary='error-alert'
                      subtitle='Are you sure you want to discard all changes?'
                      rightButtonText='Discard'
                    />
                  ),
                })
              } else {
                resetSelected && resetSelected()
                setDeleteJobId([])
                onChangeViewMode()
                refetch()
              }
            }
          }}
        >
          Cancel
        </Button>
        <Button
          size='large'
          variant='contained'
          disableElevation
          disabled={
            selected.length > 0 ? (selected.length === 1 ? true : false) : false
          }
          onClick={() => {
            openModal({
              type: 'SaveChangesModal',
              children: (
                <CustomModalV2
                  onClick={() => {
                    closeModal('SaveChangesModal')
                    // TODO : API 연결필요, 성공시 Toast
                    if (selected.length > 1) {
                      let tmpSelected = [...selectedItemJobs]
                      let triggerGroup = !!selected[0].triggerGroup
                        ? selectedItemJobs.filter(
                            value =>
                              value.triggerGroup === selected[0].triggerGroup,
                          )
                        : []

                      let result = []

                      if (triggerGroup.length > 0) {
                        const triggerGroupIndex = triggerGroup.findIndex(
                          value => value.id === selected[0].id,
                        )
                        // triggerGroup.splice(triggerGroupIndex, 1)
                        const firstSelectedJobs = selectedItemJobs.findIndex(
                          value => value.id === selected[0].id,
                        )
                        const secondSelectedJobs = selectedItemJobs.findIndex(
                          value => value.id === selected[1].id,
                        )
                        tmpSelected.splice(firstSelectedJobs, 1, ...selected)
                        tmpSelected.splice(secondSelectedJobs, 1)
                        triggerGroup.splice(triggerGroupIndex, 1, ...selected)
                        const triggerGroupFirstIndex = tmpSelected.findIndex(
                          value => value.id === triggerGroup[0].id,
                        )

                        const trigger: Array<{
                          jobId: number
                          sortingOrder: number
                          triggerOrder?: number
                        }> = triggerGroup.map((value, index) => ({
                          jobId: value.id,
                          sortingOrder: index + 1,
                          triggerOrder: index + 1,
                        }))

                        let tmp: Array<{
                          jobId: number
                          sortingOrder: number
                          triggerOrder?: number
                        }> = tmpSelected.map((value, index) => ({
                          jobId: value.id,
                          sortingOrder: index + 1,
                        }))

                        tmp.splice(
                          triggerGroupFirstIndex,
                          trigger.length,
                          ...trigger,
                        )

                        const tmpResult = tmp.map((value, index) => ({
                          ...value,
                          sortingOrder: index + 1,
                        }))

                        result = tmpResult
                      } else {
                        const firstSelectedJobs = selectedItemJobs.findIndex(
                          value => value.id === selected[0].id,
                        )
                        const secondSelectedJobs = selectedItemJobs.findIndex(
                          value => value.id === selected[1].id,
                        )
                        tmpSelected.splice(firstSelectedJobs, 1, ...selected)
                        tmpSelected.splice(secondSelectedJobs, 1)
                        const firstIndex = tmpSelected.findIndex(
                          value => value.id === selected[0].id,
                        )
                        const secondIndex = tmpSelected.findIndex(
                          value => value.id === selected[1].id,
                        )

                        let tmpResult: Array<{
                          jobId: number
                          sortingOrder: number
                          triggerOrder?: number
                        }> = tmpSelected.map((value, index) => {
                          if (index === firstIndex || index === secondIndex) {
                            return {
                              jobId: value.id,
                              sortingOrder: index + 1,
                              triggerOrder: index === firstIndex ? 1 : 2,
                            }
                          } else {
                            return {
                              jobId: value.id,
                              sortingOrder: index + 1,
                            }
                          }
                        })

                        result = tmpResult
                      }

                      addTriggerBetweenJobsMutation.mutate(result)
                    } else {
                      const flattenedDirtyFields = flattenKeys(dirtyFields).map(
                        value => {
                          const lastDotIndex = value.lastIndexOf('.')
                          const str =
                            lastDotIndex >= 0
                              ? value.substring(0, lastDotIndex)
                              : value
                          const { itemIndex, rowIndex } = extractNumbers(str)
                          return { str, itemIndex, rowIndex }
                        },
                      )
                      const changedJob = flattenedDirtyFields.map(value => {
                        const result = getValues(
                          `items.${value.itemIndex}.jobs.${value.rowIndex}`,
                        )
                        return result
                      })
                      const uniqueChangedJob = changedJob.reduce(
                        (acc: { [key: number]: any }, cur) => {
                          acc[cur.id] = cur
                          return acc
                        },
                        {},
                      )

                      const finalChangedJob = Object.values(uniqueChangedJob)

                      const result: {
                        jobId: number
                        statusCodeForAutoNextJob: number | null
                        autoNextJob: '0' | '1'
                        autoSharingFile: '0' | '1'
                      }[] = finalChangedJob
                        .filter(value => !deleteJobId.includes(value.id))
                        .map((value, index) => ({
                          jobId: value.id,
                          statusCodeForAutoNextJob:
                            value.statusCodeForAutoNextJob,
                          autoNextJob: value.autoNextJob ? '1' : '0',
                          autoSharingFile: value.autoSharingFile ? '1' : '0',
                        }))

                      saveTriggerOptionsMutation.mutate({
                        updateData: result,
                        deleteData: { jobId: deleteJobId },
                      })
                    }
                  }}
                  onClose={() => closeModal('SaveChangesModal')}
                  title='Save changes?'
                  vary='successful'
                  subtitle='Are you sure you want to save all changes?'
                  rightButtonText='Save'
                />
              ),
            })
          }}
        >
          {selected.length > 0
            ? selected.length === 1
              ? '1 selected left'
              : 'Add a trigger'
            : 'Save'}
        </Button>
      </Box>
    </Box>
  )
}
