import React, { Dispatch, ReactElement, Suspense } from 'react'
import Grid from '@mui/material/Grid'
import { GridItem, Title } from '@src/views/dashboard/dashboardItem'
import { Box, IconButton } from '@mui/material'
import { toCapitalize } from '@src/pages/dashboards/lpm'
import { ViewType } from '@src/types/dashboard'
import {
  DEFAULT_QUERY_NAME,
  useDashboardCount,
} from '@src/queries/dashnaord.query'
import styled from '@emotion/styled'
import Typography from '@mui/material/Typography'
import { StatusAndListProps } from '@src/views/dashboard/dataGrid/status'
import {
  Approval,
  CheckCircleOutline,
  DoNotDisturbAlt,
  ReceiptLong,
  RefreshOutlined,
  SmsFailedRounded,
} from '@mui/icons-material'
import AddIcon from '@mui/icons-material/Add'
import FallbackSpinner from '@src/@core/components/spinner'
import { ErrorBoundary } from 'react-error-boundary'
import { useQueryClient } from 'react-query'

const StatusDefined: Record<ViewType, { icon: ReactElement; color: string }> = {
  ongoing: {
    icon: <DoNotDisturbAlt sx={{ color: 'rgba(224, 68, 64, 1)' }} />,
    color: 'rgba(224, 68, 64, 0.2)',
  },
  created: {
    icon: <AddIcon sx={{ color: 'rgba(102, 108, 255, 1)' }} />,
    color: 'rgba(102, 108, 255, 0.2)',
  },
  invoiced: {
    icon: <ReceiptLong sx={{ color: 'rgba(100, 198, 35, 1)' }} />,
    color: 'rgba(100, 198, 35, 0.2)',
  },
  canceled: {
    icon: <DoNotDisturbAlt sx={{ color: 'rgba(224, 68, 64, 1)' }} />,
    color: 'rgba(224, 68, 64, 0.2)',
  },
  applied: {
    icon: <AddIcon sx={{ color: 'rgba(102, 108, 255, 1)' }} />,
    color: 'rgba(102, 108, 255, 0.2)',
  },
  passed: {
    icon: <CheckCircleOutline sx={{ color: 'rgba(100, 198, 35, 1)' }} />,
    color: 'rgba(114, 225, 40, 0.2)',
  },
  failed: {
    icon: <SmsFailedRounded sx={{ color: 'rgba(224, 68, 64, 1)' }} />,
    color: 'rgba(224, 68, 64, 0.2)',
  },
  approved: {
    icon: <Approval sx={{ color: 'rgba(100, 198, 35, 1)' }} />,
    color: 'rgba(100, 198, 35, 0.2)',
  },
}

export interface OngoingProps<T extends { id: number; orderId?: number }>
  extends StatusAndListProps<T> {
  activeStatus: ViewType
  setActiveStatus: Dispatch<ViewType>
}
const Ongoing = <T extends { id: number; orderId?: number }>(
  props: OngoingProps<T>,
) => {
  const {
    type = 'order',
    to,
    from,
    activeStatus,
    setActiveStatus,
    movePage,
    userViewDate,
    setOpenInfoDialog,
  } = props

  const { data: countData } = useDashboardCount({ countType: type, to, from })

  return (
    <Grid item display='flex' flexDirection='column' gap='24px'>
      <GridItem width={300} height={175}>
        <Box sx={{ width: '100%' }}>
          <Title
            title={`Ongoing ${type}s`}
            marginBottom='20px'
            handleClick={movePage && movePage}
            openDialog={setOpenInfoDialog}
          />

          <StatusSectionList style={{ padding: '20px 0' }}>
            <li
              data-active={activeStatus === 'ongoing'}
              onClick={() => setActiveStatus('ongoing')}
            >
              <StatusIcon
                label='Ongoing'
                color='rgba(253, 181, 40, 0.2)'
                icon={
                  <img
                    width={24}
                    height={24}
                    src='/images/icons/dashnoard_loading_icon.svg'
                    alt='아이콘'
                  />
                }
              />
              <span className='value'>
                {countData && countData['ongoing'].toLocaleString()}
              </span>
            </li>
          </StatusSectionList>
        </Box>
      </GridItem>
      <GridItem width={300} height={290}>
        <Box sx={{ width: '100%', height: '100%' }}>
          <Title
            title={`${toCapitalize(type)} status`}
            marginBottom='20px'
            handleClick={movePage && movePage}
            openDialog={setOpenInfoDialog}
            subTitle={userViewDate}
          />
          <StatusSectionList>
            {Object.entries(countData || []).map(([key, value], index) => {
              if (key === 'ongoing') return null
              return (
                <li
                  key={`${key}-${index}`}
                  data-active={activeStatus === key}
                  onClick={() => setActiveStatus(key as ViewType)}
                >
                  <StatusIcon
                    label={toCapitalize(key)}
                    color={StatusDefined[key as ViewType]?.color}
                    icon={StatusDefined[key as ViewType]?.icon}
                  />
                  <span className='value'>{value.toLocaleString()}</span>
                </li>
              )
            })}
          </StatusSectionList>
        </Box>
      </GridItem>
    </Grid>
  )
}

const OngoingErrorFallback = <T extends { id: number; orderId?: number }>(
  props: OngoingProps<T>,
) => {
  const queryClient = useQueryClient()

  const { type = 'order', movePage, userViewDate, setOpenInfoDialog } = props

  const onChange = () => {
    queryClient.refetchQueries({
      queryKey: [DEFAULT_QUERY_NAME, 'ongoingCount', type],
    })
  }

  return (
    <Grid item display='flex' flexDirection='column' gap='24px'>
      <GridItem width={300} height={175}>
        <Box sx={{ width: '100%', height: '100%' }}>
          <Box>
            <Title
              title={`Ongoing ${type}s`}
              marginBottom='20px'
              handleClick={movePage && movePage}
              openDialog={setOpenInfoDialog}
            />
          </Box>
          <Box
            display='flex'
            flexDirection='column'
            alignItems='center'
            justifyContent='center'
            sx={{ width: '100%', height: '40%' }}
          >
            <IconButton
              color='primary'
              aria-label='refresh'
              size='large'
              onClick={() => onChange()}
            >
              <RefreshOutlined sx={{ fontSize: '32px' }} />
            </IconButton>
            <Typography textAlign='center'>
              Failed to load data. Please try again.
            </Typography>
          </Box>
        </Box>
      </GridItem>
      <GridItem width={300} height={290}>
        <Box sx={{ width: '100%', height: '100%' }}>
          <Box>
            <Title
              title={`${toCapitalize(type)} status`}
              marginBottom='20px'
              handleClick={movePage && movePage}
              openDialog={setOpenInfoDialog}
              subTitle={userViewDate}
            />
          </Box>
          <Box
            display='flex'
            flexDirection='column'
            alignItems='center'
            justifyContent='center'
            gap='20px'
            sx={{ width: '100%', height: '60%' }}
          >
            <IconButton
              color='primary'
              aria-label='refresh'
              size='large'
              onClick={() => onChange()}
            >
              <RefreshOutlined sx={{ fontSize: '32px' }} />
            </IconButton>
            <Typography textAlign='center'>
              Failed to load data. Please try again.
            </Typography>
          </Box>
        </Box>
      </GridItem>
    </Grid>
  )
}

const OngoingStatus = <T extends { id: number; orderId?: number }>(
  props: OngoingProps<T>,
) => {
  return (
    <Suspense fallback={<FallbackSpinner />}>
      <ErrorBoundary fallback={<OngoingErrorFallback {...props} />}>
        <Ongoing {...props} />
      </ErrorBoundary>
    </Suspense>
  )
}

const StatusSectionList = styled('ul')(() => {
  return {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    margin: 0,
    listStyle: 'none',
    padding: '0',

    '& > li': {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '16px',
      padding: '8px 10px',
      borderRadius: '10px',
      cursor: 'pointer',
      backgroundColor: '#fff',

      '&:hover': {
        backgroundColor: 'rgba(76, 78, 100, 0.05)',
        transition: 'background-color 0.5s',
      },

      '&:active': {
        backgroundColor: 'rgba(109, 120, 141, 0.1)',
        transition: 'background-color 0.5s',
      },

      '&[data-active=true]': {
        backgroundColor: 'rgba(109, 120, 141, 0.1)',
        transition: 'background-color 0.5s',
      },
    },

    '& > li > .value': {
      fontSize: '16px',
      fontWeight: 600,
    },
  }
})

interface StatusIconProps {
  label: string
  icon: ReactElement
  color: string
}

const StatusIcon = ({ label, icon, color }: StatusIconProps) => {
  return (
    <Box display='flex' alignItems='center' gap='10px'>
      <Box
        display='flex'
        alignItems='center'
        justifyContent='center'
        sx={{
          width: '30px',
          height: '30px',
          borderRadius: '8px',
          backgroundColor: color,
        }}
      >
        {icon}
      </Box>
      <Typography fontSize='14px' fontWeight={600} color='#4C4E64DE'>
        {label}
      </Typography>
    </Box>
  )
}

export default OngoingStatus
