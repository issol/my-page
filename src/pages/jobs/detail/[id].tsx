import { Icon } from '@iconify/react'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import {
  Badge,
  Box,
  Card,
  Grid,
  IconButton,
  Tab,
  Typography,
} from '@mui/material'
import {
  useGetProJobDetail,
  useGetProJobDots,
} from '@src/queries/jobs/jobs.query'
import { useRouter } from 'next/router'
import {
  SyntheticEvent,
  useState,
  MouseEvent,
  Suspense,
  useEffect,
} from 'react'
import { useQueryClient } from 'react-query'
import { styled } from '@mui/system'

import DeliveriesFeedback from './deliveries-feedback'
import ProJobInfo from './job-info'
import { useGetJobInfo, useGetJobPrices } from '@src/queries/order/job.query'
import { useGetStatusList } from '@src/queries/common.query'
import { statusType } from '@src/types/common/status.type'
import { JobListFilterType } from '../requested-ongoing-list'
type MenuType = 'jobInfo' | 'feedback'

const ProJobsDetail = () => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { id, assigned } = router.query
  const [value, setValue] = useState<MenuType>('jobInfo')
  const handleChange = (event: SyntheticEvent, newValue: MenuType) => {
    setValue(newValue)
  }

  // assigned이 false이면 히스토리를 조회한다.
  const { data: jobDetail, isLoading } = useGetProJobDetail(
    Number(id),
    assigned && assigned === 'false' ? true : false,
  )
  useEffect(() => {
    if (!isLoading && Number(jobDetail?.id) !== Number(id)) {
      router.push(`/jobs/detail/${jobDetail?.id}/`)
    }
  }, [jobDetail, isLoading, id])

  const { data: jobPrices } = useGetJobPrices(
    Number(id),
    assigned && assigned === 'false' ? true : false,
  )
  const { data: jobStatusList, isLoading: statusListLoading } =
    useGetStatusList('Job')
  const {
    data: assignmentJobStatusList,
    isLoading: assignmentStatusListLoading,
  } = useGetStatusList('JobAssignment')

  const [statusList, setStatusList] = useState<Array<statusType>>([])

  const { data: jobDetailDots } = useGetProJobDots(Number(id))

  const onClickBack = () => {
    const filter: JobListFilterType = {
      take: 10,
      skip: 0,
      search: '',
      client: null,
      dueDateFrom: '',
      dueDateTo: '',
      listType: 'requested-ongoing',
    }
    queryClient.invalidateQueries(['proJobList', filter])
    router.push('/jobs')
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

  return (
    <Box>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          background: '#ffffff',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px',
        }}
      >
        <Box sx={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <IconButton
            sx={{ padding: '0 !important', height: '24px' }}
            onClick={() => onClickBack()}
          >
            <Icon icon='mdi:chevron-left' width={24} height={24} />
          </IconButton>
          <img src='/images/icons/job-icons/job-detail.svg' alt='' />
          <Typography variant='h5'>{jobDetail?.corporationId}</Typography>
        </Box>
      </Box>
      {jobDetail && jobPrices && statusList && jobDetailDots && (
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
                  {jobDetailDots.includes('download') ||
                  jobDetailDots.includes('name') ||
                  jobDetailDots.includes('status') ||
                  jobDetailDots.includes('contactPersonId') ||
                  jobDetailDots.includes('dueAt') ||
                  jobDetailDots.includes('dueAtTimezone') ||
                  jobDetailDots.includes('prices') ||
                  jobDetailDots.includes('description') ? (
                    <Badge
                      variant='dot'
                      color='primary'
                      sx={{ marginLeft: '8px' }}
                    ></Badge>
                  ) : null}
                </>
              }
              iconPosition='start'
              icon={<Icon icon='iconoir:large-suitcase' fontSize={'18px'} />}
              onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
            />
            {jobDetail.status !== 60100 &&
            jobDetail.status !== 601000 &&
            jobDetail.status !== 70000 &&
            jobDetail.status !== 70100 &&
            jobDetail.status !== 70200 &&
            // jobDetail.status !== 70300 &&
            jobDetail.status !== 70400 &&
            jobDetail.status !== 70500 ? (
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
                      ></Badge>
                    ) : null}
                  </>
                }
                iconPosition='start'
                icon={<Icon icon='ic:outline-send' fontSize={'18px'} />}
                onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
              />
            ) : null}
          </TabList>
          <TabPanel value='jobInfo' sx={{ pt: '24px' }}>
            <Suspense>
              <ProJobInfo
                jobInfo={jobDetail}
                jobPrices={jobPrices}
                statusList={statusList}
                jobDetailDots={jobDetailDots}
              />
            </Suspense>
          </TabPanel>
          <TabPanel value='feedback' sx={{ pt: '24px' }}>
            <Suspense>
              <DeliveriesFeedback
                jobInfo={jobDetail}
                jobDetailDots={jobDetailDots}
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
