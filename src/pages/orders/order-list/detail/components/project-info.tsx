import {
  Box,
  Card,
  Divider,
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
import { ProjectInfoType } from '@src/types/orders/order-detail'
import { v4 as uuidv4 } from 'uuid'

type Props = {
  type: string
  projectInfo: ProjectInfoType
}
const ProjectInfo = ({ type, projectInfo }: Props) => {
  return (
    <Card sx={{ padding: '24px' }}>
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
            <IconButton>
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
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
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
    </Card>
  )
}

export default ProjectInfo
