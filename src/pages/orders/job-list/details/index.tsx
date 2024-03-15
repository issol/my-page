import {
  Box,
  Button,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material'
import CustomModal from '@src/@core/components/common-modal/custom-modal'
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
import { deleteJob, getAssignableProList } from '@src/apis/jobs/job-detail.api'
import { useGetStatusList } from '@src/queries/common.query'
import OverlaySpinner from '@src/@core/components/spinner/overlay-spinner'
import { useRecoilValueLoadable } from 'recoil'
import { authState } from '@src/states/auth'
import { getCurrentRole } from '@src/shared/auth/storage'
import { AssignProFilterPostType } from '@src/types/orders/job-detail'
import toast from 'react-hot-toast'
import JobListCard from '@src/pages/orders/job-list/details/jobListCard'
import {
  ArrowBackIos,
  AutoMode,
  DeleteOutline,
  MoreVert,
} from '@mui/icons-material'
import { useTheme } from '@mui/material/styles'
import styled from '@emotion/styled'

const JobDetails = () => {
  const theme = useTheme()
  const router = useRouter()

  const tableRowRef = useRef<HTMLTableRowElement>(null)
  const { openModal, closeModal } = useModal()

  const queryClient = useQueryClient()

  const auth = useRecoilValueLoadable(authState)
  const currentRole = getCurrentRole()

  const { orderId, jobId } = router.query

  const { data: jobDetails, refetch } = useGetJobDetails(Number(orderId!), true)
  const { data: orderDetail } = useGetProjectInfo(Number(orderId!))
  const { data: projectTeam, isLoading: projectTeamLoading } =
    useGetProjectTeam(Number(orderId!))
  const { data: statusList } = useGetStatusList('Job')

  const [isUserInTeamMember, setIsUserInTeamMember] = useState(false)
  const [isLoadingDeleteState, setIsLoadingDeleteState] = useState(false)

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

  const handleRemoveJob = async (
    jobId: number,
    corporationId: string,
    jobName: string,
  ) => {
    //job에 request 또는 Assign이 있을 경우 삭제하면 안됨
    try {
      setIsLoadingDeleteState(true)
      const assignableProListFilters: AssignProFilterPostType = {
        take: 5,
        skip: 0,
        isOffBoard: '1',
      }
      const assignableProList = await getAssignableProList(
        jobId,
        assignableProListFilters,
        false,
      )
      if (assignableProList.data.some(list => list.assignmentStatus !== null)) {
        openModal({
          type: 'RemoveImpossibleModal',
          children: (
            <CustomModal
              soloButton={true}
              onClose={() => closeModal('RemoveImpossibleModal')}
              onClick={() => closeModal('RemoveImpossibleModal')}
              title='This job cannot be deleted because it’s already been requested to Pro(s).'
              subtitle={`[${corporationId}] ${jobName ?? ''}`}
              vary={'error'}
              rightButtonText='Okay'
            />
          ),
        })
      } else {
        openModal({
          type: 'RemoveJobModal',
          children: (
            <CustomModal
              onClose={() => closeModal('RemoveJobModal')}
              onClick={() => {
                deleteJobMutation.mutate(jobId)
                closeModal('RemoveJobModal')
              }}
              title='Are you sure you want to delete this job?'
              subtitle={`[${corporationId}] ${jobName ?? ''}`}
              vary={'error'}
              rightButtonText='Delete'
            />
          ),
        })
      }
    } catch (e) {
      toast.error('Something went wrong. Please try again.', {
        position: 'bottom-left',
      })
    } finally {
      setIsLoadingDeleteState(false)
    }
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
    router.back()
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

  const onAutoCreateJob = () => {
    openModal({
      type: 'AutoCreateJobProceedConfirm',
      children: <div>sdvd</div>,
    })
  }

  const onDeleteJobs = () => {}

  const onEditTrigger = () => {}

  const onManageJobStatus = () => {}

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
            <JobButton label='Auto-create jobs' onClick={onAutoCreateJob}>
              <AutoMode color='inherit' sx={{ fontSize: 20 }} />
            </JobButton>
            <JobButton label='Delete jobs' onClick={onDeleteJobs}>
              <DeleteOutline
                color='inherit'
                sx={{ fontSize: 20 }}
                fontWeight={500}
              />
            </JobButton>
            <JobButton label='Edit trigger' onClick={onEditTrigger}>
              <img
                width={20}
                src='/images/icons/job-icons/icon-trigger.svg'
                alt='trigger on'
              />
            </JobButton>
            <JobButton label='Manage job status' onClick={onManageJobStatus}>
              <img
                width={20}
                src='/images/icons/job-icons/icon-job-status.svg'
                alt='trigger on'
              />
            </JobButton>
          </Box>
        </JobTitleSection>

        <CardListSection display='flex' flexDirection='column' gap='24px'>
          {jobDetails?.items.map((value, index) => {
            return (
              <JobListCard
                key={`${value.id}-${index}`}
                tableRowRef={tableRowRef}
                index={index}
                serviceType={serviceType}
                info={value}
                statusList={statusList}
                isUserInTeamMember={isUserInTeamMember}
                handleRemoveJob={handleRemoveJob}
                handleChangeServiceType={handleChangeServiceType}
                onClickAddJob={onClickAddJob}
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
  children,
}: {
  label: string
  onClick?: () => void
  children: ReactElement
}) => {
  return (
    <Button
      sx={{ display: 'flex', gap: '2px', color: '#8D8E9A' }}
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
