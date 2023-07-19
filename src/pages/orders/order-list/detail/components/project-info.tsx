import {
  Autocomplete,
  Box,
  Button,
  Card,
  Divider,
  Grid,
  IconButton,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from '@mui/material'
import {
  JobTypeChip,
  OrderStatusChip,
  ServiceTypeChip,
} from '@src/@core/components/chips/chips'
import Icon from '@src/@core/components/icon'
import { OrderStatus } from '@src/shared/const/status/statuses'
import {
  FullDateHelper,
  FullDateTimezoneHelper,
} from '@src/shared/helpers/date.helper'
import {
  OrderProjectInfoFormType,
  OrderStatusType,
} from '@src/types/common/orders.type'
import { ClientType, ProjectInfoType } from '@src/types/orders/order-detail'
import {
  orderProjectInfoDefaultValue,
  orderProjectInfoSchema,
} from '@src/types/schema/orders-project-info.schema'
import { useForm } from 'react-hook-form'
import { v4 as uuidv4 } from 'uuid'
import { yupResolver } from '@hookform/resolvers/yup'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import ProjectInfoForm from '@src/pages/components/forms/orders-project-info-form'
import DatePickerWrapper from '@src/@core/styles/libs/react-datepicker'
import useModal from '@src/hooks/useModal'
import DiscardModal from '@src/@core/components/common-modal/discard-modal'
import EditSaveModal from '@src/@core/components/common-modal/edit-save-modal'
import CustomModal from '@src/@core/components/common-modal/custom-modal'
import { UseMutationResult, useMutation, useQueryClient } from 'react-query'
import { deleteOrder } from '@src/apis/order-detail.api'
import toast from 'react-hot-toast'
import { Router, useRouter } from 'next/router'
import dayjs from 'dayjs'
import { useGetStatusList } from '@src/queries/common.query'
import { UserRoleType } from '@src/context/types'
import { updateOrderType } from '../[id]'
import DeleteConfirmModal from '@src/pages/client/components/modals/delete-confirm-modal'
import SelectReasonModal from '@src/pages/quotes/components/modal/select-reason-modal'
import { CancelReasonType } from '@src/types/requests/detail.type'
import { CancelOrderReason } from '@src/shared/const/reason/reason'

type Props = {
  project: ProjectInfoType
  setEditMode: (v: boolean) => void
  isUpdatable: boolean
  updateStatus?: (status: number) => void
  role: UserRoleType
  client?: ClientType
  type: 'detail' | 'history'
  updateProject?: UseMutationResult<void, unknown, updateOrderType, unknown>
  statusList?: Array<{ value: number; label: string }>
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
}: Props) => {
  const { openModal, closeModal } = useModal()
  const router = useRouter()
  const queryClient = useQueryClient()
  const [value, setValue] = useState<string>(project.status)

  const deleteOrderMutation = useMutation((id: number) => deleteOrder(id), {
    onSuccess: () => {
      queryClient.invalidateQueries(['orderList'])
      router.push('/orders/order-list')
    },
  })

  const onClickDelete = () => {
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
          reasonList={CancelOrderReason}
        />
      ),
    })
  }

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
            {type === 'detail' ? (
              <IconButton onClick={() => setEditMode!(true)}>
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
                    {FullDateHelper(project.orderedAt)}
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
                  (project.status === 'New' ||
                    project.status === 'In preparation' ||
                    project.status === 'Internal review' ||
                    project.status === 'Order sent' ||
                    project.status === 'In progress' ||
                    project.status === 'Under revision' ||
                    project.status === 'Partially delivered' ||
                    project.status === 'Delivery completed' ||
                    project.status === 'Redelivery requested') ? (
                    <Autocomplete
                      autoHighlight
                      fullWidth
                      options={statusList ?? []}
                      onChange={(e, v) => {
                        if (updateStatus && v?.value) {
                          updateStatus(v.value as number)
                        }
                      }}
                      value={
                        (statusList &&
                          statusList.find(
                            item => item.label === project.status,
                          )) ||
                        null
                      }
                      renderInput={params => (
                        <TextField
                          {...params}
                          placeholder='Status'
                          size='small'
                          sx={{ maxWidth: '300px' }}
                        />
                      )}
                    />
                  ) : (
                    <OrderStatusChip
                      status={project.status}
                      label={project.status}
                    />
                  )}
                </Box>
              </Box>
            </Box>
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
                      {project.workName}
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
                    <JobTypeChip
                      label={project.category}
                      type={project.category}
                    />
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
                    {project.serviceType.map(value => {
                      return <ServiceTypeChip label={value} key={uuidv4()} />
                    })}
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
                    {project.expertise.map((value, idx) => {
                      return (
                        <Typography key={uuidv4()} variant='subtitle2'>
                          {project.expertise.length === idx + 1
                            ? value
                            : `${value}, `}
                        </Typography>
                      )
                    })}
                  </Box>
                </Box>
              </Box>
            </Box>
            <Divider />
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
            <Box sx={{ width: '100%' }}>
              <Box
                sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
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
                    Project description
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
                    {project.projectDescription}
                  </Typography>
                </Box>
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
                disabled={
                  project?.status === 'Invoiced' ||
                  project?.status === 'Canceled' ||
                  project?.status === 'Paid'
                }
                onClick={onClickCancel}
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
                disabled={
                  project?.status === 'New' ||
                  project?.status === 'In preparation' ||
                  project?.status === 'Internal review'
                }
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
