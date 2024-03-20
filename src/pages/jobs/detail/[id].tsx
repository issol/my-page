import { Icon } from '@iconify/react'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import { Badge, Box, IconButton, Tab, Typography } from '@mui/material'
import {
  useGetProJobDetail,
  useGetProJobDots,
} from '@src/queries/jobs/jobs.query'
import { useRouter } from 'next/router'
import {
  MouseEvent,
  Suspense,
  SyntheticEvent,
  useEffect,
  useState,
} from 'react'
import { useQueryClient } from 'react-query'
import { styled } from '@mui/system'

import DeliveriesFeedback from './deliveries-feedback'
import ProJobInfo from './job-info'
import { useGetJobPrices } from '@src/queries/order/job.query'
import { useGetStatusList } from '@src/queries/common.query'
import { statusType } from '@src/types/common/status.type'
import useModal from '@src/hooks/useModal'
import InfoDialogButton from '@src/views/pro/infoDialog'

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
  60100, 601000, 70000, 70100, 70200, /* 70300, */ 70400, 70500,
]

const ProJobsDetail = () => {
  const router = useRouter()
  const queryClient = useQueryClient()

  const { id, assigned, tab } = router.query

  const [value, setValue] = useState<MenuType>('jobInfo')
  const [statusList, setStatusList] = useState<Array<statusType>>([])
  const { openModal, closeModal } = useModal()

  const { data: jobDetailDots, isFetched } = useGetProJobDots(Number(id))
  // assigned이 false이면 히스토리를 조회한다.
  const { data: jobDetail, isLoading } = useGetProJobDetail(
    Number(id),
    !!(assigned && assigned === 'false'),
    isFetched,
  )
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
          <Box display='flex' position='relative'>
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
              <ProJobInfo
                jobInfo={jobDetail}
                jobPrices={jobPrices}
                statusList={statusList}
                jobDetailDots={jobDetailDots}
              />
            </Suspense>
          </TabPanel>
          <TabPanel value='feedback' sx={{ p: 0, mt: '24px' }}>
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
