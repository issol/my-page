import { Icon } from '@iconify/react'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import {
  Badge,
  Box,
  Button,
  IconButton,
  Tab,
  Tooltip,
  Typography,
} from '@mui/material'
import {
  useGetProJobDetail,
  useGetProJobDots,
  useGetProPreviousAndNextJob,
} from '@src/queries/jobs/jobs.query'
import { useRouter } from 'next/router'
import {
  MouseEvent,
  Suspense,
  SyntheticEvent,
  useEffect,
  useState,
} from 'react'
import { styled } from '@mui/system'

import DeliveriesFeedback from './deliveries-feedback'
import ProJobInfo from './job-info'
import { useGetJobPrices } from '@src/queries/order/job.query'
import { useGetStatusList } from '@src/queries/common.query'
import { JobStatus, StatusItem } from '@src/types/common/status.type'
import InfoDialogButton from '@src/views/pro/infoDialog'
import { ProJobStatusChip } from '@src/@core/components/chips/chips'
import Image from 'next/image'
import useModal from '@src/hooks/useModal'
import CustomModalV2 from '@src/@core/components/common-modal/custom-modal-v2'
import { getUserTokenFromBrowser } from '@src/shared/auth/storage'

type MenuType = 'jobInfo' | 'feedback'

const keysJobDetailDots = [
  'download',
  'name',
  'status',
  'contactPersonId',
  'dueAt',
  'dueAtTimezone',
  'prices',
  'description',
]
const excludedStatuses = [
  60100, 601000, 70000, 70100, 70200, /* 70300, */ 70400, 70500, 70600,
]

const activeStatus = [60200, 60250, 60300, 60400, 70300]
const deActiveStatus = [60500, 60600, 60700, 60800, 60900, 601000, 601100]

const videoExtensions = ['mp4', 'avi', 'mkv', 'mov']

const ProJobsDetail = () => {
  const router = useRouter()
  const { openModal, closeModal } = useModal()

  const { id, assigned, tab, isNextJob } = router.query
  const nextJob = JSON.parse((isNextJob as string) || 'false')

  const [value, setValue] = useState<MenuType>('jobInfo')
  const [statusList, setStatusList] = useState<Array<StatusItem>>([])

  const {
    data: jobDetailDots,
    refetch: jobDetailDotsRefetch,
    isFetched,
  } = useGetProJobDots(Number(id))
  // assigned이 false이면 히스토리를 조회한다.
  const {
    data: jobDetail,
    refetch: jobDetailRefetch,
    isLoading,
  } = useGetProJobDetail(
    Number(id),
    !!(assigned && assigned === 'false'),
    isFetched,
  )
  const { data: proPrevAndNextJob } = useGetProPreviousAndNextJob(Number(id))

  // 페이지가 처음 로딩될때 필요한 데이터를 모두 리패치 한다
  useEffect(() => {
    jobDetailDotsRefetch()
    jobDetailRefetch()
  }, [])

  useEffect(() => {
    if (!isLoading && Number(jobDetail?.id) !== Number(id)) {
      router.push(`/jobs/detail/${jobDetail?.id}/`)
    }
  }, [jobDetail, isLoading, id])

  // @ts-ignore
  const { data: jobPrices } = useGetJobPrices(
    Number(id),
    !!(assigned && assigned === 'false'),
  )
  const { data: jobStatusList, isLoading: statusListLoading } =
    useGetStatusList('Job')
  const {
    data: assignmentJobStatusList,
    isLoading: assignmentStatusListLoading,
  } = useGetStatusList('JobAssignment')

  const handleChange = (event: SyntheticEvent, newValue: MenuType) => {
    setValue(newValue)
  }
  const onClickBack = () => {
    router.push(`/jobs?tab=${tab}`)
  }

  const glosubButtonVisible = () => {
    if (jobDetail) {
      const statusCheck = excludedStatuses.includes(jobDetail?.status)
      const fileCheck =
        jobDetail.files &&
        jobDetail.files
          .filter(value => value.type === 'SOURCE')
          .some(file => {
            const extension = file.name.split('.').pop()?.toLowerCase()
            return videoExtensions.includes(extension || '')
          })

      if (!statusCheck && fileCheck) {
        return true
      } else if (jobDetail.status === 60110 || jobDetail.status === 70350) {
        return false
      } else {
        return false
      }
    }
  }

  const glosubButtonStatus = () => {
    if (jobDetail) {
      const status = jobDetail.status
      if (activeStatus.includes(status)) {
        return true
      } else if (deActiveStatus.includes(status)) {
        return false
      } else {
        return false
      }
    }
  }

  useEffect(() => {
    if (
      jobStatusList &&
      assignmentJobStatusList &&
      !statusListLoading &&
      !assignmentStatusListLoading
    ) {
      setStatusList([...jobStatusList, ...assignmentJobStatusList])
    }
  }, [
    jobStatusList,
    statusListLoading,
    assignmentJobStatusList,
    assignmentStatusListLoading,
  ])

  const onClickGlosubInfo = () => {
    openModal({
      type: 'GlosubInfoModal',
      isCloseable: true,
      children: (
        <CustomModalV2
          closeButton
          noButton
          onClick={() => closeModal('GlosubInfoModal')}
          onClose={() => closeModal('GlosubInfoModal')}
          rightButtonText=''
          vary='info'
          title='About Glosub'
          subtitle={
            <>
              Glosub is an online subtitling tool where source files are
              automatically uploaded, allowing users to start working right away
              and download completed subtitle files.
              <br />
              <br />
              Glosub offers three modes, Transcription, Translation, and QC.
              Users can choose one depending on what they need to do.
            </>
          }
        />
      ),
    })
  }

  const onClickGlosub = () => {
    window.open(
      `${process.env.NEXT_PUBLIC_GLOSUB_DOMAIN ?? 'https://glosub-dev.gloground.com'}/?jobId=${id}&token=${getUserTokenFromBrowser()}&role=PRO`,
      '_blank',
    )
  }

  return (
    <Box>
      <Box
        width='100%'
        display='flex'
        alignItems='center'
        justifyContent='space-between'
        gap='8px'
        padding='20px'
        marginBottom='24px'
        bgcolor='#fff'
      >
        <Box sx={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <IconButton
            sx={{ padding: '0 !important', height: '24px' }}
            onClick={() => onClickBack()}
          >
            <Icon icon='ic:sharp-arrow-back-ios' fontSize={24} />
          </IconButton>
          <img src='/images/icons/job-icons/job-detail.svg' alt='' />
          <Typography
            variant='h5'
            fontWeight={500}
          >{`${jobDetail?.order?.corporationId}-${jobDetail?.corporationId}`}</Typography>
          {ProJobStatusChip(
            statusList?.find(i => i.value === jobDetail?.status)?.label || '',
            jobDetail?.status as JobStatus,
          )}
          <Box
            display={
              proPrevAndNextJob?.nextJob || proPrevAndNextJob?.previousJob
                ? 'flex'
                : 'none'
            }
            position='relative'
          >
            <Icon icon='ic:outline-people' fontSize={32} color='#8D8E9A' />
            <div style={{ position: 'absolute', top: 0, left: 36 }}>
              <InfoDialogButton
                title='Connected jobs'
                style={{ position: 'absolute', top: 0, left: 0 }}
                contents='This job has preceding or succeeding worker. The job entails either continuing the work based on the output of the previous contributor or passing on the completed task to the subsequent participant.'
              />
            </div>
          </Box>
        </Box>
        {glosubButtonVisible() ? (
          <Box sx={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {!glosubButtonStatus() ? (
              <Tooltip title='This job is already completed'>
                <Box>
                  <Button
                    variant='outlined'
                    disabled={!glosubButtonStatus()}
                    sx={{ display: 'flex', alignItems: 'center' }}
                  >
                    <Image
                      src='/images/icons/job-icons/glosub.svg'
                      alt=''
                      width={16}
                      height={16}
                    />
                    &nbsp; Open GloSub
                  </Button>
                </Box>
              </Tooltip>
            ) : (
              <Button
                variant='outlined'
                disabled={!glosubButtonStatus()}
                sx={{ display: 'flex', alignItems: 'center' }}
                onClick={onClickGlosub}
              >
                <Image
                  src='/images/icons/job-icons/glosub.svg'
                  alt=''
                  width={16}
                  height={16}
                />
                &nbsp; Open GloSub
              </Button>
            )}

            <IconButton sx={{ padding: 0 }} onClick={onClickGlosubInfo}>
              <Icon icon='material-symbols:info-outline' fontSize={20}></Icon>
            </IconButton>
          </Box>
        ) : null}
      </Box>
      {jobDetail && jobPrices && statusList.length > 0 && jobDetailDots && (
        <TabContext value={value}>
          <TabList
            onChange={handleChange}
            aria-label='Order detail Tab menu'
            style={{ borderBottom: '1px solid rgba(76, 78, 100, 0.12)' }}
          >
            <CustomTab
              value='jobInfo'
              label={
                <>
                  Job info
                  {keysJobDetailDots.some(key =>
                    jobDetailDots.includes(key),
                  ) ? (
                    <Badge
                      variant='dot'
                      color='primary'
                      sx={{ marginLeft: '8px' }}
                    />
                  ) : null}
                </>
              }
              iconPosition='start'
              icon={<Icon icon='iconoir:large-suitcase' fontSize={'18px'} />}
              onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
            />
            {!excludedStatuses.includes(jobDetail.status) ? (
              <CustomTab
                value='feedback'
                label={
                  <>
                    Deliveries & Feedback
                    {jobDetailDots.includes('feedback') ? (
                      <Badge
                        variant='dot'
                        color='primary'
                        sx={{ marginLeft: '8px' }}
                      />
                    ) : null}
                  </>
                }
                iconPosition='start'
                icon={<Icon icon='ic:outline-send' fontSize={'18px'} />}
                onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
              />
            ) : null}
          </TabList>
          <TabPanel value='jobInfo' sx={{ p: 0, mt: '24px' }}>
            <Suspense>
              {jobDetail ? (
                <ProJobInfo
                  jobInfo={jobDetail}
                  jobPrices={jobPrices}
                  statusList={statusList}
                  jobDetailDots={jobDetailDots}
                  proPrevAndNextJob={proPrevAndNextJob}
                />
              ) : null}
            </Suspense>
          </TabPanel>
          <TabPanel value='feedback' sx={{ p: 0, mt: '24px' }}>
            <Suspense>
              <DeliveriesFeedback
                jobInfo={jobDetail}
                jobDetailDots={jobDetailDots}
                jobDetailRefetch={jobDetailRefetch}
              />
            </Suspense>
          </TabPanel>
        </TabContext>
      )}
    </Box>
  )
}

export default ProJobsDetail

ProJobsDetail.acl = {
  subject: 'job_list',
  action: 'read',
}

const CustomTab = styled(Tab)`
  text-transform: none;
  padding: 0px 27px;
  display: flex;
  gap: 1px;
`
