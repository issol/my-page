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
import {
  autoCreateByItem,
  autoCreateByOrder,
  createJob,
  createWithJobTemplate,
} from '@src/apis/jobs/jobs.api'
import {
  addTriggerBetweenJobs,
  deleteJob,
  saveTriggerOptions,
  setJobStatus,
} from '@src/apis/jobs/job-detail.api'
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
import { displayCustomToast } from '@src/shared/utils/toast'
import { useFieldArray, useForm } from 'react-hook-form'
import { JobType } from '@src/types/common/item.type'

export type ItemOptionType = {
  items: {
    jobs: JobType[]
    id: number
    itemName: string
    sourceLanguage: string
    targetLanguage: string
    contactPersonId: number
    sortingOrder: number
  }[]
}

const JobDetails = () => {
  const router = useRouter()
  const { orderId, jobId } = router.query

  const tableRowRef = useRef<HTMLTableRowElement>(null)
  const [deleteJobId, setDeleteJobId] = useState<number[]>([])
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
  const [isMasterManagerUser, setIsMasterManagerUser] = useState(false)

  const [mode, setMode] = useState<JobListMode>('view')

  const [selectedAllItemJobs, setSelectedAllItemJobs] = useState<number[]>([])
  const [selectedJobs, setSelectedJobs] = useState<{ [key: number]: number[] }>(
    {},
  )
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation()
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const {
    control,
    getValues,
    setValue,
    watch,
    reset,
    trigger,
    formState: { errors, isValid, isDirty, dirtyFields },
  } = useForm<ItemOptionType>({
    mode: 'onSubmit',

    // resolver: yupResolver(projectTeamSchema) as Resolver<ProjectTeamType>,
  })

  // const {
  //   fields: members,
  //   append: appendMember,
  //   remove: removeMember,
  //   update: updateMember,
  // } = useFieldArray({
  //   control: teamControl,
  //   name: 'teams',
  // })

  const createJobMutation = useMutation(
    (params: CreateJobParamsType) => createJob(params),
    {
      onSuccess: (data, variables) => {
        // if (variables.index) {
        //   const newServiceType = [...serviceType]
        //   newServiceType.splice(variables.index, 1)
        //   setServiceType(newServiceType)
        // } else {
        //   setServiceType([])
        // }
        refetch()
      },
    },
  )

  const createWithJobTemplateMutation = useMutation(
    (params: { itemId: number; templateId: number }) =>
      createWithJobTemplate(Number(orderId), params.itemId, params.templateId),
    {
      onSuccess: (data, variables) => {
        // if (variables.index) {
        //   const newServiceType = [...serviceType]
        //   newServiceType.splice(variables.index, 1)
        //   setServiceType(newServiceType)
        // } else {
        //   setServiceType([])
        // }
        refetch()
      },
      onError: () => {},
    },
  )

  const autoCreateJobMutation = useMutation(
    (itemId: number[]) =>
      itemId.length === 1
        ? autoCreateByItem(Number(orderId), itemId[0])
        : autoCreateByOrder(Number(orderId)),
    {
      onSuccess: (data, variables) => {
        // if (variables.index) {
        //   const newServiceType = [...serviceType]
        //   newServiceType.splice(variables.index, 1)
        //   setServiceType(newServiceType)
        // } else {
        //   setServiceType([])
        // }
        refetch()
      },
    },
  )

  const changeStatusMutation = useMutation(
    (value: { jobIds: number[]; status: number }) =>
      Promise.all(value.jobIds.map(jobId => setJobStatus(jobId, value.status))),
    {
      onSuccess: () => {
        refetch()
      },
    },
  )

  const deleteJobsMutation = useMutation(
    (jobIds: number[]) => Promise.all(jobIds.map(jobId => deleteJob(jobId))),
    {
      onSuccess: () => {
        refetch()
      },
    },
  )

  const saveTriggerOptionsMutation = useMutation(
    (data: {
      updateData: {
        jobId: number
        statusCodeForAutoNextJob: number | null
        autoNextJob: '0' | '1'
        autoSharingFile: '0' | '1'
      }[]
      deleteData: { jobId: number[] }
    }) => saveTriggerOptions(data),
    {
      onSuccess: () => {
        refetch()
        onChangeViewMode()
        setDeleteJobId([])
        setSelectedAllItemJobs([])
        setSelectedJobs({})
        displayCustomToast('Saved successfully.', 'success')
      },
    },
  )

  const addTriggerBetweenJobsMutation = useMutation(
    (
      data: {
        jobId: number
        sortingOrder: number
        triggerOrder?: number
      }[],
    ) => addTriggerBetweenJobs(data),
    {
      onSuccess: () => {
        refetch()
        onChangeViewMode()
        setSelectedAllItemJobs([])
        setSelectedJobs({})
        displayCustomToast('Added successfully.', 'success')
      },
    },
  )

  const onClickAddJob = (
    itemId: number,
    index: number,
    serviceType: string[],
  ) => {
    createJobMutation.mutate({
      orderId: Number(orderId),
      itemId: itemId,
      serviceType: serviceType,
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

  useEffect(() => {
    if (auth.state === 'hasValue') {
      const roles = auth.getValue().user?.roles ?? [{ name: '', type: '' }]
      setIsMasterManagerUser(
        roles.some(
          role =>
            role.name === 'LPM' &&
            (role.type === 'Master' || role.type === 'Manager'),
        ),
      )
    }
  }, [auth])

  const onClickBack = () => {
    // TODO edit 모드일때는 이탈 모달 띄워줘야 함
    if (mode !== 'view') {
      openModal({
        type: 'LeavePageConfirm',
        children: (
          <CustomModalV2
            onClick={() => {
              onChangeViewMode()
              handleBack()
              closeModal('LeavePageConfirm')
            }}
            onClose={() => closeModal('LeavePageConfirm')}
            title='Leave this page?'
            vary='error-alert'
            subtitle={
              <p>
                Are you sure you want to leave this page? Changes you made will
                not be saved.
              </p>
            }
            rightButtonText='Leave'
          />
        ),
      })
      return
    } else {
      handleBack()
    }
  }

  const handleBack = () => {
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

  const onAutoCreateJob = (type: 'itemUnit' | 'JobUnit', itemId: number[]) => {
    if (!itemId || itemId.length === 0) return

    const itemDescription = (
      <p>
        Based on the service type and language pair configured in the order,
        jobs will be automatically created. <br />
        <br />
        Would you like to proceed with the creation of Jobs?
      </p>
    )

    const JobDescription = (
      <p>
        Based on the service type and language pair configured in the order,
        jobs will be automatically created under each Item.
        <br />
        <br />
        Would you like to proceed with the creation of Jobs?
      </p>
    )

    const subtitle = type === 'itemUnit' ? itemDescription : JobDescription

    openModal({
      type: 'AutoCreateJobProceedConfirm',
      children: (
        <CustomModalV2
          onClick={() => {
            autoCreateJobMutation
              .mutateAsync(itemId)
              .then(() => {
                closeModal('AutoCreateJobProceedConfirm')
              })
              .catch(() => {
                displayCustomToast('Failed to delete.', 'error')
                closeModal('AutoCreateJobProceedConfirm')
              })
          }}
          onClose={() => closeModal('AutoCreateJobProceedConfirm')}
          title='Auto-create jobs'
          vary='successful'
          subtitle={subtitle}
          rightButtonText='Proceed'
        />
      ),
    })
  }

  const onCreateWithJobTemplate = (itemId: number, templateId: number) => {
    createWithJobTemplateMutation
      .mutateAsync({ itemId, templateId })
      .then(() => {
        closeModal('AddJobTemplate')
      })
  }

  const onDeleteJobs = () => {
    setMode('delete')
  }

  const onEditTrigger = () => {
    setMode('edit')
  }

  const onManageJobStatus = () => {
    setMode('manageStatus')
  }

  const hasJobs = () => {
    let count = 0
    if (jobDetails?.items) {
      count = jobDetails.items.reduce(
        (total, item) => total + item.jobs.length,
        0,
      )
    }
    return count > 0
  }

  const isStatusUpdatable = (changeStatus: number, jobIds: number[]) => {
    let flag = true
    let immutableCorporationId: string[] = []
    // approved
    if (changeStatus === 60600) {
      jobIds.map(jobId => {
        const job = jobDetails?.items
          .map(item => item.jobs)
          .flat()
          .find(row => row.id === jobId)
        // partially delivered, delivered, invoiced, Redelivery requested 일때만 true
        if (job && ![60400, 60500, 60700, 60250].includes(job.status)) {
          flag = false
          immutableCorporationId.push(job.corporationId)
        }
      })
    }
    // without invoice
    else if (changeStatus === 60900) {
      jobIds.map(jobId => {
        const job = jobDetails?.items
          .map(item => item.jobs)
          .flat()
          .find(row => row.id === jobId)
        // delivered, approved, invoiced, Redelivery requested 일때만 true
        if (job && ![60500, 60600, 60700, 60250].includes(job.status)) {
          flag = false
          immutableCorporationId.push(job.corporationId)
        }
      })
    }
    // canceled
    else if (changeStatus === 601000) {
      jobIds.map(jobId => {
        const job = jobDetails?.items
          .map(item => item.jobs)
          .flat()
          .find(row => row.id === jobId)
        // canceled, paid가 아닐때만 true
        if (job && [60800, 601000].includes(job.status)) {
          flag = false
          immutableCorporationId.push(job.corporationId)
        }
      })
    }
    return {
      isUpdatable: flag,
      immutableCorporationId: immutableCorporationId,
    }
  }

  useEffect(() => {
    if (jobDetails) {
      reset({
        items: jobDetails.items,
      })
    }
  }, [jobDetails])

  console.log(isDirty, 'dirty')

  return (
    <Grid item xs={12} sx={{ pb: '100px' }}>
      {createJobMutation.isLoading ||
      autoCreateJobMutation.isLoading ||
      changeStatusMutation.isLoading ||
      deleteJobsMutation.isLoading ||
      isLoadingDeleteState ? (
        <OverlaySpinner />
      ) : null}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          position: 'relative',
        }}
      >
        <JobTitleSection
          width='100%'
          display='flex'
          alignItems='center'
          justifyContent='space-between'
          padding='20px'
          gap='12px'
          borderRadius='6px'
          bgcolor='#fff'
          // sx={{
          //   position: 'sticky',
          //   top: 128,
          //   zIndex: 1000,
          //   left: 0,
          //   border: '2px solid #e0e0e0',
          // }}
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
            {mode === 'view' && (
              <Box>
                <IconButton onClick={handleClick}>
                  <MoreVert />
                </IconButton>
                {jobDetailMenu()}
              </Box>
            )}
          </Box>
          {(isUserInTeamMember || isMasterManagerUser) && (
            <Box display='flex' alignItems='center'>
              <JobButton
                label='Auto-create jobs'
                onClick={() =>
                  onAutoCreateJob(
                    'JobUnit',
                    jobDetails?.items.map(item => item.id)!,
                  )
                }
                disabled={mode !== 'view'}
              >
                <AutoMode sx={{ fontSize: 20 }} />
              </JobButton>
              <JobButton
                label='Delete jobs'
                onClick={onDeleteJobs}
                disabled={mode !== 'view' || !hasJobs()}
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
                // disabled={true} // 에딧 모드는 추후 개발
              >
                {/* <TriggerIcon disabled={mode !== 'view'} /> */}
                <TriggerIcon disabled={true} />
              </JobButton>
              <JobButton
                label='Manage job status'
                onClick={onManageJobStatus}
                disabled={mode !== 'view' || !hasJobs()}
              >
                <JobStatusIcon disabled={mode !== 'view' || !hasJobs()} />
              </JobButton>
            </Box>
          )}
        </JobTitleSection>

        <CardListSection
          display='flex'
          flexDirection='column'
          gap='24px'
          // sx={{ marginTop: '100px' }}
        >
          {jobDetails?.items.map((value, index) => {
            return (
              <JobListCard
                tableRowRef={tableRowRef}
                key={`${value.id}-${index}`}
                selected={selectedJobs[index] ?? []}
                setSelected={(selected: number[]) => {
                  if (selected.length === 0) {
                    setSelectedJobs({})
                  } else {
                    setSelectedJobs(prev => ({
                      ...prev,
                      [index]: selected,
                    }))
                  }
                }}
                index={index}
                mode={mode}
                info={value}
                statusList={statusList}
                allJobs={jobDetails.items.map(item => item.jobs).flat()}
                allItems={jobDetails.items}
                isUserInTeamMember={isUserInTeamMember}
                isMasterManagerUser={isMasterManagerUser}
                onClickAddJob={onClickAddJob}
                onAutoCreateJob={onAutoCreateJob}
                onChangeViewMode={onChangeViewMode}
                createWithJobTemplateMutation={createWithJobTemplateMutation}
                deleteJobsMutation={deleteJobsMutation}
                changeStatusMutation={changeStatusMutation}
                setSelectedAllItemJobs={setSelectedAllItemJobs}
                selectedAllItemJobs={selectedAllItemJobs}
                isStatusUpdatable={isStatusUpdatable}
                control={control}
                setValue={setValue}
                getValues={getValues}
                trigger={trigger}
                isDirty={isDirty}
                refetch={refetch}
                dirtyFields={dirtyFields}
                saveTriggerOptionsMutation={saveTriggerOptionsMutation}
                addTriggerBetweenJobsMutation={addTriggerBetweenJobsMutation}
                deleteJobId={deleteJobId}
                setDeleteJobId={setDeleteJobId}
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
