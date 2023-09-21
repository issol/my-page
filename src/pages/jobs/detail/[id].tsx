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
import { SyntheticEvent, useState, MouseEvent, Suspense } from 'react'
import styled from 'styled-components'

import DeliveriesFeedback from './deliveries-feedback'
import ProJobInfo from './job-info'
import { useGetJobInfo, useGetJobPrices } from '@src/queries/order/job.query'
import { useGetStatusList } from '@src/queries/common.query'
type MenuType = 'jobInfo' | 'feedback'

const ProJobsDetail = () => {
  const router = useRouter()
  const { id } = router.query
  const [value, setValue] = useState<MenuType>('jobInfo')
  const handleChange = (event: SyntheticEvent, newValue: MenuType) => {
    setValue(newValue)
  }

  const { data: jobDetail, isLoading } = useGetProJobDetail(Number(id))
  const { data: jobPrices } = useGetJobPrices(Number(id), false)
  const { data: statusList, isLoading: statusListLoading } =
    useGetStatusList('Job')

  const { data: jobDetailDots } = useGetProJobDots(Number(id))

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
            onClick={() => router.push('/jobs')}
          >
            <Icon icon='mdi:chevron-left' width={24} height={24} />
          </IconButton>
          <img src='/images/icons/order-icons/book.svg' alt='' />
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
              label='Job info'
              iconPosition='start'
              icon={<Icon icon='iconoir:large-suitcase' fontSize={'18px'} />}
              onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
            />
            {jobDetail.status !== 60100 &&
            jobDetail.status !== 60400 &&
            jobDetail.status !== 60600 &&
            jobDetail.status !== 60200 &&
            jobDetail.status !== 60300 ? (
              <CustomTab
                value='feedback'
                label={
                  <>
                    Deliveries & Feedback
                    {jobDetailDots.includes('feedback') ||
                    jobDetailDots.includes('sourceFile') ? (
                      <Badge
                        variant='dot'
                        color='primary'
                        sx={{ marginLeft: '4px' }}
                      ></Badge>
                    ) : null}
                  </>
                }
                iconPosition='start'
                icon={<Icon icon='pajamas:earth' fontSize={'18px'} />}
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
  subject: 'jobs',
  action: 'read',
}

const CustomTab = styled(Tab)`
  text-transform: none;
  padding: 0px 27px;
  display: flex;
  gap: 1px;
`
