import {
  Box,
  Button,
  Card,
  Divider,
  Grid,
  IconButton,
  MenuItem,
  Select,
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
import { OrderProjectInfoFormType } from '@src/types/common/orders.type'
import { ProjectInfoType } from '@src/types/orders/order-detail'
import {
  orderProjectInfoDefaultValue,
  orderProjectInfoSchema,
} from '@src/types/schema/orders-project-info.schema'
import { useForm } from 'react-hook-form'
import { v4 as uuidv4 } from 'uuid'
import { yupResolver } from '@hookform/resolvers/yup'
import { Dispatch, SetStateAction } from 'react'
import ProjectInfoForm from '@src/pages/components/forms/orders-project-info-form'
import DatePickerWrapper from '@src/@core/styles/libs/react-datepicker'
import useModal from '@src/hooks/useModal'
import DiscardModal from '@src/@core/components/common-modal/discard-modal'
import EidtSaveModal from '@src/@core/components/common-modal/edit-save-modal'

type Props = {
  type: string
  projectInfo: ProjectInfoType
  edit: boolean
  setEdit?: Dispatch<SetStateAction<boolean>>
}
const ProjectInfo = ({ type, projectInfo, edit, setEdit }: Props) => {
  const { openModal, closeModal } = useModal()

  const onClickDiscard = () => {
    setEdit!(false)
    closeModal('DiscardModal')
  }

  const onClickSave = () => {
    setEdit!(false)
    closeModal('EditSaveModal')
  }

  const {
    control: projectInfoControl,
    getValues: getProjectInfo,
    setValue: setProjectInfo,
    watch: projectInfoWatch,
    reset: projectInfoReset,
    formState: { errors: projectInfoErrors, isValid: isProjectInfoValid },
  } = useForm<OrderProjectInfoFormType>({
    mode: 'onChange',
    defaultValues: orderProjectInfoDefaultValue,
    resolver: yupResolver(orderProjectInfoSchema),
  })

  return (
    <>
      <Card sx={{ padding: '24px' }}>
        {edit ? (
          <DatePickerWrapper>
            <Grid container xs={12} spacing={6}>
              <ProjectInfoForm
                control={projectInfoControl}
                setValue={setProjectInfo}
                watch={projectInfoWatch}
                errors={projectInfoErrors}
              />
              <Grid item xs={12}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '16px',
                  }}
                >
                  <Button
                    variant='outlined'
                    color='secondary'
                    onClick={() =>
                      openModal({
                        type: 'DiscardModal',
                        children: (
                          <DiscardModal
                            onClose={() => closeModal('DiscardModal')}
                            onClick={onClickDiscard}
                          />
                        ),
                      })
                    }
                  >
                    Cancel
                  </Button>
                  <Button
                    variant='contained'
                    disabled={!isProjectInfoValid}
                    onClick={() =>
                      openModal({
                        type: 'EditSaveModal',
                        children: (
                          <EidtSaveModal
                            onClose={() => closeModal('EditSaveModal')}
                            onClick={onClickSave}
                          />
                        ),
                      })
                    }
                  >
                    Save
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </DatePickerWrapper>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography variant='h6'>{projectInfo.projectName}</Typography>
              {type === 'detail' ? (
                <IconButton onClick={() => setEdit!(true)}>
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
                      {FullDateHelper(projectInfo.orderedAt)}
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
                    {type === 'history' ? (
                      <OrderStatusChip
                        status={projectInfo.status}
                        label={projectInfo.status}
                      />
                    ) : (
                      <Select
                        defaultValue={projectInfo.status}
                        size='small'
                        sx={{ width: '253px' }}
                      >
                        {OrderStatus.map(status => {
                          return (
                            <MenuItem key={uuidv4()} value={status.value}>
                              {status.label}
                            </MenuItem>
                          )
                        })}
                      </Select>
                    )}
                  </Box>
                </Box>
              </Box>
              <Divider />
              <Box
                sx={{ display: 'flex', flexDirection: 'column', gap: '15px' }}
              >
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
                        {projectInfo.workName}
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
                        label={projectInfo.category}
                        type={projectInfo.category}
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
                      {projectInfo.serviceType.map(value => {
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
                      {projectInfo.expertise.map((value, idx) => {
                        return (
                          <Typography key={uuidv4()} variant='subtitle2'>
                            {projectInfo.expertise.length === idx + 1
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
                      {projectInfo.revenueFrom}
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
                      {FullDateTimezoneHelper(projectInfo.projectDueAt, {
                        code: 'KR',
                        label: 'Korea, Republic of',
                        phone: '82',
                      })}
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
                      {projectInfo.projectDescription}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        )}
      </Card>
      {edit || type === 'history' ? null : (
        <Grid xs={12} container sx={{ mt: '24px' }}>
          <Grid item xs={4}>
            <Card sx={{ padding: '20px', width: '100%' }}>
              <Button variant='outlined' fullWidth color='error' size='large'>
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