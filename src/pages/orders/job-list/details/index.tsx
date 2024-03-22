import {
  Box,
  Button,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material'
import useModal from '@src/hooks/useModal'
import { useGetJobDetails } from '@src/queries/order/job.query'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, {
  MouseEvent,
  ReactElement,
  SyntheticEvent,
  useEffect,
  useRef,
  useState,
} from 'react'
import {
  useGetProjectInfo,
  useGetProjectTeam,
} from '@src/queries/order/order.query'
import { useMutation, useQueryClient } from 'react-query'
import { CreateJobParamsType } from '@src/types/jobs/jobs.type'
import { createJob } from '@src/apis/jobs/jobs.api'
import { deleteJob } from '@src/apis/jobs/job-detail.api'
import { useGetStatusList } from '@src/queries/common.query'
import OverlaySpinner from '@src/@core/components/spinner/overlay-spinner'
import { useRecoilValueLoadable } from 'recoil'
import { authState } from '@src/states/auth'
import JobListCard from '@src/pages/orders/job-list/details/jobListCard'
import {
  ArrowBackIos,
  AutoMode,
  DeleteOutline,
  MoreVert,
} from '@mui/icons-material'
import styled from '@emotion/styled'
import CustomModalV2 from '@src/@core/components/common-modal/custom-modal-v2'
import { JobStatusIcon, TriggerIcon } from '@src/views/svgIcons'
import { JobListMode } from '@src/views/jobDetails/viewModes'

const JobDetails = () => {
  const router = useRouter()
  const { orderId, jobId } = router.query

  const tableRowRef = useRef<HTMLTableRowElement>(null)
  const { openModal, closeModal } = useModal()

  const queryClient = useQueryClient()

  const auth = useRecoilValueLoadable(authState)

  const { data: jobDetails, refetch } = useGetJobDetails(Number(orderId!), true)
  const { data: orderDetail } = useGetProjectInfo(Number(orderId!))
  const { data: projectTeam, isLoading: projectTeamLoading } =
    useGetProjectTeam(Number(orderId!))
  const { data: statusList } = useGetStatusList('Job')

  const [isUserInTeamMember, setIsUserInTeamMember] = useState(false)
  const [isLoadingDeleteState, setIsLoadingDeleteState] = useState(false)

  const [mode, setMode] = useState<JobListMode>('view')
  const [serviceType, setServiceType] = useState<
    Array<{ label: string; value: string }[]>
  >([])

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation()
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const createJobMutation = useMutation(
    (params: CreateJobParamsType) => createJob(params),
    {
      onSuccess: (data, variables) => {
        if (variables.index) {
          const newServiceType = [...serviceType]
          newServiceType.splice(variables.index, 1)
          setServiceType(newServiceType)
        } else {
          setServiceType([])
        }
        refetch()
      },
    },
  )

  // NOTE : 현재 단일값만 처리할 수 있도록 API 구성되어 있어서 변경 필요함
  const deleteJobMutation = useMutation((jobId: number) => deleteJob(jobId), {
    onSuccess: () => {
      refetch()
    },
  })

  const handleChangeServiceType = (
    event: SyntheticEvent<Element, Event>,
    value: {
      label: string
      value: string
    }[],
    index: number,
  ) => {
    const newSelections = [...serviceType]
    newSelections[index] = value
    setServiceType(newSelections)
    // setTmpServiceType(newSelections)
  }

  const onClickAddJob = (itemId: number, index: number) => {
    createJobMutation.mutate({
      orderId: Number(orderId),
      itemId: itemId,
      serviceType: serviceType[index].map(value => value.value),
      index: index,
    })
  }

  useEffect(() => {
    // 선택된 행으로 스크롤하기

    if (jobDetails) {
      if (tableRowRef.current) {
        // console.log(ref.current)

        tableRowRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        })
      }
    }
  }, [jobDetails])

  useEffect(() => {
    if (projectTeam) {
      const isUserInTeamMember = projectTeam.some(
        member => member.userId === Number(auth.getValue().user?.id!),
      )
      setIsUserInTeamMember(isUserInTeamMember)
    }
  }, [projectTeam])

  const onClickBack = () => {
    //TODO 이전 페이지의 주소기반으로 라우팅 해야함, 무조건 back 할경우 사이드이펙이 나올수 있음
    const filter = {
      status: [],
      client: [],
      category: [],
      serviceType: [],
      startedAt: [null, null],
      dueAt: [null, null],
      search: '',
      isMyJobs: '0',
      isHidePaid: '0',
      skip: 0,
      take: 10,
    }
    queryClient.invalidateQueries(['jobList', filter])
    router.push('/orders/job-list')
  }

  const jobDetailMenu = () => {
    return (
      <Menu
        elevation={8}
        anchorEl={anchorEl}
        id='customized-menu'
        onClose={handleClose}
        open={Boolean(anchorEl)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        {jobDetails ? (
          <MenuItem
            sx={{
              gap: 2,
              '&:hover': {
                background: 'inherit',
                cursor: 'default',
              },
            }}
          >
            Linked order :
            <Link
              href={`/orders/order-list/detail/${jobDetails?.id}`}
              style={{ color: 'rgba(76, 78, 100, 0.87)' }}
            >
              {jobDetails?.cooperationId ?? '-'}
            </Link>
          </MenuItem>
        ) : null}
      </Menu>
    )
  }

  const onChangeViewMode = () => {
    setMode('view')
  }

  const onAutoCreateJob = () => {
    // NOTE : 생성될 잡의 갯수추가
    openModal({
      type: 'AutoCreateJobProceedConfirm',
      children: (
        <CustomModalV2
          onClick={() => closeModal('AutoCreateJobProceedConfirm')}
          onClose={() => closeModal('AutoCreateJobProceedConfirm')}
          title='Auto-create jobs'
          vary='successful'
          subtitle={
            <p>
              Based on the service type and language pair configured in the
              order, jobs will be automatically created under each Item. <br />
              <br />
              Would you like to proceed with the creation of {0} Jobs?
            </p>
          }
          rightButtonText='Proceed'
        />
      ),
    })
  }

  const onDeleteJobs = () => {
    setMode('delete')
  }

  const onEditTrigger = () => {}

  const onManageJobStatus = () => {
    setMode('manageStatus')
  }

  return (
    <Grid item xs={12} sx={{ pb: '100px' }}>
      {createJobMutation.isLoading ||
      deleteJobMutation.isLoading ||
      isLoadingDeleteState ? (
        <OverlaySpinner />
      ) : null}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <JobTitleSection
          width='100%'
          display='flex'
          alignItems='center'
          justifyContent='space-between'
          padding='20px'
          gap='12px'
          borderRadius='6px'
          bgcolor='#fff'
        >
          <Box display='flex' alignItems='center' gap='8px'>
            <IconButton
              sx={{ padding: '0 !important', height: '24px' }}
              onClick={() => onClickBack()}
            >
              <ArrowBackIos />
            </IconButton>
            <Box display='flex' alignItems='center' gap='8px'>
              <img
                src='/images/icons/job-icons/job-detail.svg'
                alt='trigger on'
              />
              <Typography variant='h5'>Job details</Typography>
            </Box>
            <Box>
              <IconButton onClick={handleClick}>
                <MoreVert />
              </IconButton>
              {jobDetailMenu()}
            </Box>
          </Box>
          <Box display='flex' alignItems='center'>
            <JobButton
              label='Auto-create jobs'
              onClick={onAutoCreateJob}
              disabled={mode !== 'view'}
            >
              <AutoMode sx={{ fontSize: 20 }} />
            </JobButton>
            <JobButton
              label='Delete jobs'
              onClick={onDeleteJobs}
              disabled={mode !== 'view'}
            >
              <DeleteOutline
                color='inherit'
                sx={{ fontSize: 20 }}
                fontWeight={500}
              />
            </JobButton>
            <JobButton
              label='Edit trigger'
              onClick={onEditTrigger}
              disabled={mode !== 'view'}
            >
              <TriggerIcon disabled={mode !== 'view'} />
            </JobButton>
            <JobButton
              label='Manage job status'
              onClick={onManageJobStatus}
              disabled={mode !== 'view'}
            >
              <JobStatusIcon disabled={mode !== 'view'} />
            </JobButton>
          </Box>
        </JobTitleSection>

        <CardListSection display='flex' flexDirection='column' gap='24px'>
          {jobDetails?.items.map((value, index) => {
            return (
              <JobListCard
                tableRowRef={tableRowRef}
                key={`${value.id}-${index}`}
                index={index}
                mode={mode}
                info={value}
                statusList={statusList}
                isUserInTeamMember={isUserInTeamMember}
                handleChangeServiceType={handleChangeServiceType}
                onClickAddJob={onClickAddJob}
                onAutoCreateJob={onAutoCreateJob}
                onChangeViewMode={onChangeViewMode}
              />
            )
          })}
        </CardListSection>
      </Box>
    </Grid>
  )
}

const JobTitleSection = styled(Box)``
const CardListSection = styled(Box)``

export const JobButton = ({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string
  onClick?: () => void
  disabled?: boolean
  children: ReactElement
}) => {
  return (
    <Button
      sx={{ display: 'flex', gap: '2px', color: '#8D8E9A' }}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
      <Typography variant='body2' color='inherit' fontWeight={500}>
        {label}
      </Typography>
    </Button>
  )
}

export default JobDetails

JobDetails.acl = {
  subject: 'job_list',
  action: 'read',
}
