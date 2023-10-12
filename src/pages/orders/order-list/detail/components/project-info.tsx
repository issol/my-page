import {
  Autocomplete,
  Box,
  Button,
  Card,
  Checkbox,
  Divider,
  Grid,
  IconButton,
  TextField,
  Typography,
} from '@mui/material'
import {
  JobTypeChip,
  OrderStatusChip,
  ServiceTypeChip,
} from '@src/@core/components/chips/chips'
import Icon from '@src/@core/components/icon'
import {
  FullDateHelper,
  FullDateTimezoneHelper,
} from '@src/shared/helpers/date.helper'

import {
  ClientType,
  JobInfoType,
  OrderFeatureType,
  ProjectInfoType,
} from '@src/types/orders/order-detail'

import { v4 as uuidv4 } from 'uuid'

import { useEffect, useState } from 'react'

import useModal from '@src/hooks/useModal'

import { UseMutationResult, useMutation, useQueryClient } from 'react-query'
import { deleteOrder } from '@src/apis/order-detail.api'

import { useRouter } from 'next/router'

import { UserRoleType } from '@src/context/types'
import { updateOrderType } from '../[id]'
import DeleteConfirmModal from '@src/pages/client/components/modals/delete-confirm-modal'
import SelectReasonModal from '@src/pages/quotes/components/modal/select-reason-modal'
import { CancelReasonType } from '@src/types/requests/detail.type'
import { CancelOrderReason } from '@src/shared/const/reason/reason'
import AlertModal from '@src/@core/components/common-modal/alert-modal'
import ReasonModal from '@src/@core/components/common-modal/reason-modal'
import SimpleMultilineAlertModal from '@src/pages/components/modals/custom-modals/simple-multiline-alert-modal'

import { ContactPersonType } from '@src/types/schema/client-contact-person.schema'
import { getClientDetail } from '@src/apis/client.api'
import { getLegalName } from '@src/shared/helpers/legalname.helper'
import SimpleMultilineAlertWithCumtomTitleModal from '@src/pages/components/modals/custom-modals/simple-multiline-alert-with-custom-title-modal'

type Props = {
  project: ProjectInfoType
  setEditMode?: (v: boolean) => void
  isUpdatable: boolean
  updateStatus?: (status: number) => void
  role: UserRoleType
  client?: ClientType
  type: 'detail' | 'history'
  updateProject?: UseMutationResult<void, unknown, updateOrderType, unknown>
  statusList?: Array<{ value: number; label: string }>
  canUseFeature: (v: OrderFeatureType) => boolean
  jobInfo: Array<JobInfoType>
}
const ProjectInfo = ({
  project,
  setEditMode,
  isUpdatable,
  updateStatus,
  role,
  client,
  type,
  updateProject,
  statusList,
  canUseFeature,
  jobInfo,
}: Props) => {
  const { openModal, closeModal } = useModal()
  const router = useRouter()
  const queryClient = useQueryClient()
  const [contactPersonEdit, setContactPersonEdit] = useState(false)
  const [contactPersonId, setContactPersonId] = useState<number | null>(null)
  const [contactPersonList, setContactPersonList] = useState<
    Array<
      ContactPersonType<number> & {
        value: number
        label: string
      }
    >
  >([])

  const [showDescription, setShowDescription] = useState<boolean>(
    project.showDescription,
  )

  const deleteOrderMutation = useMutation((id: number) => deleteOrder(id), {
    onSuccess: () => {
      queryClient.invalidateQueries(['orderList'])
      router.push('/orders/order-list')
    },
  })

  const onClickDelete = () => {
    if (!project.linkedInvoiceReceivable && !project.linkedJobs.length) {
      openModal({
        type: 'DeleteOrderModal',
        children: (
          <DeleteConfirmModal
            onClose={() => closeModal('DeleteOrderModal')}
            onDelete={() => deleteOrderMutation.mutate(project.id)}
            message='Are you sure you want to delete this order?'
            title={`[${project?.corporationId}] ${project?.projectName}`}
          />
        ),
      })
    } else if (!project.linkedInvoiceReceivable) {
      openModal({
        type: 'DisableDeleteOrderModal',
        children: (
          <AlertModal
            onClick={() => closeModal('DisableDeleteOrderModal')}
            title='This order cannot be deleted because invoice have already been created.'
            subtitle={`[${project?.corporationId}] ${project?.projectName}`}
            vary='error'
            buttonText='Okay'
          />
        ),
      })
    } else if (!project.linkedJobs.length) {
      openModal({
        type: 'DisableDeleteOrderModal',
        children: (
          <AlertModal
            onClick={() => closeModal('DisableDeleteOrderModal')}
            title='This order cannot be deleted because jobs has already been created.'
            subtitle={`[${project?.corporationId}] ${project?.projectName}`}
            vary='error'
            buttonText='Okay'
          />
        ),
      })
    }
  }

  const onClickCancel = () => {
    openModal({
      type: 'CancelOrderModal',
      children: (
        <SelectReasonModal
          onClose={() => closeModal('CancelOrderModal')}
          onClick={(status: number, reason: CancelReasonType) =>
            updateProject &&
            updateProject.mutate(
              { status: status, reason: reason },
              {
                onSuccess: () => {
                  closeModal('CancelOrderModal')
                },
              },
            )
          }
          title='Are you sure you want to cancel this order?'
          vary='error'
          rightButtonText='Cancel'
          action='Canceled'
          from='lsp'
          statusList={statusList!}
          type='canceled'
          reasonList={CancelOrderReason}
        />
      ),
    })
  }

  const onClickReason = () => {
    openModal({
      type: `${project.status}ReasonModal`,
      children: (
        <ReasonModal
          onClose={() => closeModal(`${project.status}ReasonModal`)}
          reason={project.reason}
          type={
            project.status === 'Redelivery requested'
              ? 'Requested'
              : statusList?.find(i => i.value === project?.status)?.label || ''
          }
          vary='info'
        />
      ),
    })
  }

  const onChangeStatus = (status: number) => {
    if (status === 10950) {
      openModal({
        type: `ChangeWithoutInvoiceStatusModal`,
        children: (
          <SimpleMultilineAlertModal
            onClose={() => closeModal('ChangeWithoutInvoiceStatusModal')}
            onConfirm={() => updateStatus && updateStatus(status)}
            closeButtonText='Cancel'
            confirmButtonText='Proceed'
            message={`Are you sure you want to change the status to Without invoice?\n\nThe client's status will also be updated accordingly.`}
            vary='error'
          />
        ),
      })
    } else {
      updateStatus && updateStatus(status)
    }
  }

  const filterStatusList = () => {
    if (client && statusList) {
      if (!client.isEnrolledClient) {
        if (project.status === 'Delivery confirmed') {
          return statusList?.filter(value => value.label === 'Without invoice')
        } else {
          return statusList?.filter(
            value =>
              value.label !== 'Invoiced' &&
              value.label !== 'Paid' &&
              value.label !== 'Canceled',
          )
        }
      } else {
        if (project.status === 'Delivery confirmed') {
          return statusList?.filter(value => value.label === 'Without invoice')
        } else {
          return statusList?.filter(
            value =>
              value.label === 'New' ||
              value.label === 'In preparation' ||
              value.label === 'Internal review' ||
              value.label === 'Without invoice',
          )
        }
      }
    } else {
      return statusList!
    }
  }

  const onClickEditSaveContactPerson = () => {
    // TODO api
    updateProject &&
      updateProject.mutate(
        { contactPersonId: contactPersonId },
        {
          onSuccess: () => {
            setContactPersonEdit(false)
          },
        },
      )
  }

  // TODO: Order에 포함된 Job의 status를 체크하는 함수 필요
  function handleCancelJob() {
    // 포함된 job이 없는 경우 => 기본 캔슬 모달
    if (!jobInfo || jobInfo?.length === 0) onClickCancel()
    else {
      const filteredJob = jobInfo.filter(job => job.isProAssigned)

      // 포함된 job중에서 pro가 assign된 job이 없는 경우 => cancel 가능 + 경고모달
      if (!filteredJob || filteredJob.length === 0) {
        const jobTitle = jobInfo.map(job => job.jobName)
        openModal({
          type: `CancelJobInfoModal`,
          children: (
            <SimpleMultilineAlertWithCumtomTitleModal
              onClose={() => closeModal('CancelJobInfoModal')}
              onConfirm={() => onClickCancel()}
              closeButtonText='Cancel'
              confirmButtonText='Proceed'
              title={jobTitle}
              message={`Are you sure you want to cancel the order?\n\nThe following jobs will be canceled.`}
              vary='error'
            />
          ),
        })
      } else {
        // 포함된 job중에서 pro가 assign된 job이 있는 경우 => cancel 불가
        const jobTitle = filteredJob.map(job => job.jobName)
        openModal({
          type: `DenyCancelModal`,
          children: (
            <SimpleMultilineAlertWithCumtomTitleModal
              onClose={() => closeModal('DenyCancelModal')}
              closeButtonText='Okey'
              title={jobTitle}
              message={`The following jobs are currently assigned to Pro and require manual cancellation.`}
              vary='error'
            />
          ),
        })
      }
    }
  }

  useEffect(() => {
    if (client) {
      setContactPersonId(client.contactPerson ? client.contactPerson.id! : null)

      getClientDetail(client.client.clientId)
        .then(res => {
          if (res?.contactPersons?.length) {
            const result: Array<
              ContactPersonType<number> & {
                value: number
                label: string
              }
            > = res.contactPersons.map(item => ({
              ...item,
              value: item.id!,
              label: !item?.jobTitle
                ? getLegalName({
                    firstName: item.firstName!,
                    middleName: item.middleName,
                    lastName: item.lastName!,
                  })
                : `${getLegalName({
                    firstName: item.firstName!,
                    middleName: item.middleName,
                    lastName: item.lastName!,
                  })} / ${item.jobTitle}`,
            }))
            setContactPersonList(result)
          } else {
            setContactPersonList([])
          }
        })
        .catch(e => {
          setContactPersonList([])
        })
    }
  }, [client])
  console.log('project status', project.status, type, isUpdatable)
  console.log(project)

  console.log(filterStatusList())
  console.log(
    statusList
      ?.filter(value => !filterStatusList().some(v => v.value === value.value))
      .some(status => status.value === project.status),
  )

  return (
    <>
      <Card sx={{ padding: '24px' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography variant='h6'>{project.projectName}</Typography>
            {type === 'detail' && isUpdatable ? (
              <IconButton
                onClick={() => {
                  if (canUseFeature('button-Edit-Set-Status-To-UnderRevision'))
                    updateStatus && updateStatus(10500)
                  setEditMode!(true)
                }}
              >
                <Icon icon='mdi:pencil-outline' />
              </IconButton>
            ) : null}
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <Box sx={{ display: 'flex' }}>
              <Box sx={{ display: 'flex', flex: 1 }}>
                <Box
                  sx={{
                    display: 'flex',
                    gap: '8px',
                    alignItems: 'center',
                    width: '25.21%',
                  }}
                >
                  <Typography
                    variant='subtitle1'
                    sx={{
                      fontSize: '14px',
                      fontWeight: 600,
                      width: '100%',
                    }}
                  >
                    Order date
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    gap: '8px',
                    alignItems: 'center',
                    width: '73.45%',
                  }}
                >
                  <Typography
                    variant='subtitle2'
                    sx={{
                      width: '100%',
                    }}
                  >
                    {FullDateTimezoneHelper(
                      project.orderedAt,
                      project.orderTimezone,
                    )}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', flex: 1 }}>
                <Box
                  sx={{
                    display: 'flex',
                    gap: '8px',
                    alignItems: 'center',
                    width: '25.21%',
                  }}
                >
                  <Typography
                    variant='subtitle1'
                    sx={{
                      fontSize: '14px',
                      fontWeight: 600,
                      width: '100%',
                    }}
                  >
                    Status
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    gap: '8px',
                    alignItems: 'center',
                    width: '73.45%',
                  }}
                >
                  {type === 'detail' &&
                  isUpdatable &&
                  statusList
                    ?.filter(
                      value =>
                        !filterStatusList().some(v => v.value === value.value),
                    )
                    .some(status => status.value === project.status) ? (
                    <Box
                      sx={{ display: 'flex', gap: '8px', alignItems: 'center' }}
                    >
                      <OrderStatusChip
                        status={project.status}
                        label={project.status}
                      />
                      {(project.status === 'Redelivery requested' ||
                        project.status === 'Canceled') && (
                        <IconButton
                          onClick={() => {
                            project.reason && onClickReason()
                          }}
                          sx={{ padding: 0 }}
                        >
                          <img
                            src='/images/icons/onboarding-icons/more-reason.svg'
                            alt='more'
                          />
                        </IconButton>
                      )}
                    </Box>
                  ) : (
                    <Autocomplete
                      fullWidth
                      disableClearable={true}
                      options={filterStatusList() ?? []}
                      onChange={(e, v) => {
                        if (v?.value) {
                          onChangeStatus(v.value as number)
                        }
                      }}
                      isOptionEqualToValue={(option, newValue) => {
                        return option.value === newValue.value
                      }}
                      value={
                        statusList &&
                        statusList.find(item => item.label === project.status)
                      }
                      renderInput={params => (
                        <TextField
                          {...params}
                          placeholder='Status'
                          size='small'
                          autoComplete='off'
                          sx={{ maxWidth: '300px' }}
                        />
                      )}
                    />
                  )}
                </Box>
              </Box>
            </Box>
            {role.name === 'CLIENT' ? (
              <Box sx={{ display: 'flex' }}>
                <Box sx={{ display: 'flex', width: '50%' }}>
                  <Box
                    sx={{
                      display: 'flex',
                      gap: '8px',
                      alignItems: 'center',

                      width: '25.21%',
                    }}
                  >
                    <Typography fontSize={14} fontWeight={600}>
                      Contact person
                    </Typography>
                  </Box>
                  {contactPersonEdit ? (
                    <Box
                      sx={{
                        display: 'flex',
                        gap: '10px',
                        width: '300px',
                      }}
                    >
                      <Autocomplete
                        autoHighlight
                        fullWidth
                        options={contactPersonList
                          .filter(item => item.id !== contactPersonId)
                          .map(value => ({
                            value: value.value,
                            label: value.label,
                          }))}
                        onChange={(e, v) => {
                          // onChange(v.value)
                          const res = contactPersonList.filter(
                            item => item.id === Number(v.value),
                          )
                          setContactPersonId(
                            res.length ? res[0].id! : Number(v.value)!,
                          )
                        }}
                        disableClearable
                        // disabled={type === 'request'}
                        value={
                          contactPersonList
                            .filter(value => value.id === contactPersonId)
                            .map(value => ({
                              value: value.value,
                              label: value.label,
                            }))[0] || { value: '', label: '' }
                        }
                        renderInput={params => (
                          <TextField
                            {...params}
                            size='small'
                            // label='Contact person*'
                            inputProps={{
                              ...params.inputProps,
                            }}
                          />
                        )}
                      />
                      <Box
                        sx={{
                          display: 'flex',
                          gap: '5px',
                          alignItems: 'center',
                        }}
                      >
                        <Button
                          variant='outlined'
                          sx={{
                            width: '26px !important',
                            height: '26px',
                            minWidth: '26px !important',
                            padding: '0 !important',
                            border: 'none',
                            color: 'rgba(76, 78, 100, 0.6)',
                          }}
                          onClick={() => setContactPersonEdit(false)}
                        >
                          <Icon icon='ic:outline-close' fontSize={20} />
                        </Button>
                        <Button
                          variant='contained'
                          sx={{
                            width: '26px !important',
                            height: '26px',
                            minWidth: '26px !important',
                            padding: '0 !important',
                          }}
                          onClick={onClickEditSaveContactPerson}
                        >
                          <Icon icon='mdi:check' fontSize={20} />
                        </Button>
                      </Box>
                    </Box>
                  ) : (
                    <Typography
                      variant='body2'
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                      }}
                    >
                      {getLegalName({
                        firstName: client?.contactPerson?.firstName,
                        middleName: client?.contactPerson?.middleName,
                        lastName: client?.contactPerson?.lastName,
                      })}
                      {client?.contactPerson?.jobTitle
                        ? ` / ${client?.contactPerson?.jobTitle}`
                        : ''}
                      {type === 'history' ? null : (
                        <IconButton onClick={() => setContactPersonEdit(true)}>
                          <Icon icon='mdi:pencil-outline' />
                        </IconButton>
                      )}
                    </Typography>
                  )}
                </Box>
              </Box>
            ) : null}
            <Divider />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <Box sx={{ display: 'flex' }}>
                <Box sx={{ display: 'flex', flex: 1 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      gap: '8px',
                      alignItems: 'center',
                      width: '25.21%',
                    }}
                  >
                    <Typography
                      variant='subtitle1'
                      sx={{
                        fontSize: '14px',
                        fontWeight: 600,
                        width: '100%',
                      }}
                    >
                      Work name
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      gap: '8px',
                      alignItems: 'center',
                      width: '73.45%',
                    }}
                  >
                    <Typography
                      variant='subtitle2'
                      sx={{
                        width: '100%',
                      }}
                    >
                      {project.workName ?? '-'}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', flex: 1 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      gap: '8px',
                      alignItems: 'center',
                      width: '25.21%',
                    }}
                  >
                    <Typography
                      variant='subtitle1'
                      sx={{
                        fontSize: '14px',
                        fontWeight: 600,
                        width: '100%',
                      }}
                    >
                      Category
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      gap: '8px',
                      alignItems: 'center',
                      width: '73.45%',
                    }}
                  >
                    {project.category ? (
                      <JobTypeChip
                        label={project.category}
                        type={project.category}
                      />
                    ) : (
                      '-'
                    )}
                  </Box>
                </Box>
              </Box>
              <Box sx={{ display: 'flex' }}>
                <Box sx={{ display: 'flex', flex: 1, alignItems: 'start' }}>
                  <Box
                    sx={{
                      display: 'flex',
                      gap: '8px',
                      alignItems: 'center',
                      width: '25.21%',
                    }}
                  >
                    <Typography
                      variant='subtitle1'
                      sx={{
                        fontSize: '14px',
                        fontWeight: 600,
                        width: '100%',
                      }}
                    >
                      Service type
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      gap: '8px',

                      width: '73.45%',
                      flexWrap: 'wrap',
                    }}
                  >
                    {project.serviceType && project.serviceType.length > 0
                      ? project.serviceType.map(value => {
                          return (
                            <ServiceTypeChip label={value} key={uuidv4()} />
                          )
                        })
                      : '-'}
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', flex: 1 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      gap: '8px',

                      width: '25.21%',
                    }}
                  >
                    <Typography
                      variant='subtitle1'
                      sx={{
                        fontSize: '14px',
                        fontWeight: 600,
                        width: '100%',
                      }}
                    >
                      Area of expertise
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      gap: '8px',
                      flexWrap: 'wrap',
                      width: '73.45%',
                    }}
                  >
                    {project.expertise && project.expertise.length > 0
                      ? project.expertise.map((value, idx) => {
                          return (
                            <Typography key={uuidv4()} variant='subtitle2'>
                              {project.expertise.length === idx + 1
                                ? value
                                : `${value}, `}
                            </Typography>
                          )
                        })
                      : '-'}
                  </Box>
                </Box>
              </Box>
            </Box>
            <Divider />
            <Box sx={{ display: 'flex' }}>
              {role.name === 'CLIENT' ? null : (
                <Box sx={{ display: 'flex', flex: 1 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      gap: '8px',
                      alignItems: 'center',
                      width: '25.21%',
                    }}
                  >
                    <Typography
                      variant='subtitle1'
                      sx={{
                        fontSize: '14px',
                        fontWeight: 600,
                        width: '100%',
                      }}
                    >
                      Revenue from
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: 'flex',
                      gap: '8px',
                      alignItems: 'center',
                      width: '73.45%',
                    }}
                  >
                    <Typography
                      variant='subtitle2'
                      sx={{
                        width: '100%',
                      }}
                    >
                      {project.revenueFrom}
                    </Typography>
                  </Box>
                </Box>
              )}

              <Box
                sx={{
                  display: 'flex',
                  flex: role.name === 'CLIENT' ? 0.5 : 1,
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    gap: '8px',
                    alignItems: 'center',
                    width: '25.21%',
                  }}
                >
                  <Typography
                    variant='subtitle1'
                    sx={{
                      fontSize: '14px',
                      fontWeight: 600,
                      width: '100%',
                    }}
                  >
                    Project due date
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    gap: '8px',
                    alignItems: 'center',
                    width: '73.45%',
                  }}
                >
                  <Typography
                    variant='subtitle2'
                    sx={{
                      width: '100%',
                    }}
                  >
                    {FullDateTimezoneHelper(
                      project.projectDueAt,
                      project.projectDueTimezone,
                    )}
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Divider />

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Box
                sx={{
                  display: 'flex',

                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Typography
                  variant='subtitle1'
                  sx={{
                    fontSize: '14px',
                    fontWeight: 600,
                    width: '100%',
                  }}
                >
                  Project description
                </Typography>
                {role.name === 'CLIENT' ? null : (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      opacity:
                        project?.status === 'Delivery confirmed' ||
                        project.status === 'Invoiced' ||
                        project.status === 'Paid' ||
                        project.status === 'Canceled'
                          ? 0.5
                          : 1,
                    }}
                  >
                    <Checkbox
                      value={showDescription}
                      onChange={e => {
                        updateProject &&
                          updateProject.mutate({
                            showDescription: e.target.checked,
                          })
                        setShowDescription(e.target.checked)
                      }}
                      checked={showDescription}
                      disabled={
                        !canUseFeature('checkBox-ProjectInfo-Description')
                      }
                    />

                    <Typography
                      variant='body1'
                      fontSize={14}
                      fontWeight={400}
                      lineHeight='21px'
                      letterSpacing='0.15px'
                      sx={{ minWidth: 230 }}
                    >
                      Show project description to client
                    </Typography>
                  </Box>
                )}
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  gap: '8px',
                  alignItems: 'center',
                  width: '73.45%',
                }}
              >
                <Typography
                  variant='subtitle2'
                  sx={{
                    width: '100%',
                  }}
                >
                  {project.projectDescription &&
                  project.showDescription &&
                  project.projectDescription !== ''
                    ? project.projectDescription
                    : '-'}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Card>
      {type === 'history' || role.name === 'CLIENT' ? null : (
        <Grid container sx={{ mt: '24px' }} xs={12} spacing={4}>
          <Grid item xs={4}>
            <Card sx={{ padding: '20px', width: '100%' }}>
              <Button
                variant='outlined'
                fullWidth
                color='error'
                size='large'
                disabled={!canUseFeature('button-ProjectInfo-CancelOrder')}
                onClick={handleCancelJob}
              >
                Cancel this order
              </Button>
            </Card>
          </Grid>
          <Grid item xs={4}>
            <Card sx={{ padding: '20px', width: '100%' }}>
              <Button
                variant='outlined'
                fullWidth
                color='error'
                size='large'
                disabled={!canUseFeature('button-ProjectInfo-DeleteOrder')}
                onClick={onClickDelete}
              >
                Delete this order
              </Button>
            </Card>
          </Grid>
        </Grid>
      )}
    </>
  )
}

export default ProjectInfo
