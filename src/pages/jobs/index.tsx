import { Badge, Box, Tab, Typography } from '@mui/material'

import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import {
  MouseEvent,
  Suspense,
  SyntheticEvent,
  useEffect,
  useState,
} from 'react'
import { styled } from '@mui/system'
import TabPanel from '@mui/lab/TabPanel'
import { Icon } from '@iconify/react'

import RequestedOngoingList, {
  ongoingDefaultFilters,
} from './requested-ongoing-list'
import DeliveredInactiveList, {
  completedDefaultFilters,
} from './delivered-inactive-list'
import {
  useGetProJobClientList,
  useGetProJobList,
} from '@src/queries/jobs/jobs.query'
import { useRecoilStateLoadable, useRecoilValueLoadable } from 'recoil'
import { useRouter } from 'next/router'
import OverlaySpinner from '@src/@core/components/spinner/overlay-spinner'
import { getProJobList } from '@src/apis/jobs/jobs.api'

type MenuType = 'requested' | 'completed'

export type FilterType = {
  jobDueDate: Date[]

  client: { name: string; id: number } | null

  search: string
}

const Jobs = () => {
  const router = useRouter()
  const tabQuery = router.query.tab as MenuType

  // const { data: completedJob } = useGetProJobList(completedDefaultFilters)

  // const { data: ongoingJob } = useGetProJobList(ongoingDefaultFilters)

  const [completedDot, setCompletedDot] = useState(false)
  const [ongoingDot, setOngoingDot] = useState(false)

  const [value, setValue] = useState<MenuType>('requested')
  const handleChange = (event: SyntheticEvent, newValue: MenuType) => {
    setValue(newValue)
    router.push({ pathname: '/jobs/', query: { tab: newValue } })
  }

  // useEffect(() => {
  //   if (completedJob && ongoingJob) {
  //     const completedDot = completedJob?.data?.some(job => job?.lightUpDot)
  //     const ongoingDot = ongoingJob?.data?.some(job => job?.lightUpDot)

  //     setCompletedDot(completedDot)
  //     setOngoingDot(ongoingDot)
  //   }
  // }, [completedJob, ongoingJob])

  useEffect(() => {
    getProJobList(ongoingDefaultFilters).then(res => {
      const ongoingDot = res.data.some(job => job.lightUpDot)
      setOngoingDot(ongoingDot)
    })
    getProJobList(completedDefaultFilters).then(res => {
      const completedDot = res.data.some(job => job.lightUpDot)
      setCompletedDot(completedDot)
    })
  }, [])

  useEffect(() => {
    if (tabQuery && (tabQuery === 'requested' || tabQuery === 'completed'))
      setValue(tabQuery)
  }, [tabQuery])

  return (
    <>
      <Typography variant='h5' marginBottom='24px'>
        Jobs
      </Typography>
      <TabContext value={value}>
        <TabList
          onChange={handleChange}
          aria-label='Order detail Tab menu'
          style={{ borderBottom: '1px solid rgba(76, 78, 100, 0.12)' }}
        >
          <CustomTab
            value='requested'
            label={
              <Box display='flex' alignItems='center' gap='8px'>
                Requested & Ongoing
                {ongoingDot ? (
                  <Badge
                    variant='dot'
                    color='primary'
                    sx={{ marginLeft: '4px' }}
                  />
                ) : null}
              </Box>
            }
            iconPosition='start'
            icon={
              <Icon
                icon='material-symbols:progress-activity-sharp'
                fontSize={18}
                style={{ transform: 'rotate(225deg)' }}
              />
            }
            onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
          />

          <CustomTab
            value='completed'
            label={
              <Box sx={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                Completed & Inactive
                {completedDot ? (
                  <Badge
                    variant='dot'
                    color='primary'
                    sx={{ marginLeft: '4px' }}
                  />
                ) : null}
              </Box>
            }
            iconPosition='start'
            icon={<Icon icon='ic:sharp-file-download-done' fontSize={18} />}
            onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
          />
        </TabList>
        <TabPanel value='requested' sx={{ p: 0, pt: '24px' }}>
          <Suspense>
            <RequestedOngoingList />
          </Suspense>
        </TabPanel>
        <TabPanel value='completed' sx={{ p: 0, pt: '24px' }}>
          <Suspense fallback={<OverlaySpinner />}>
            <DeliveredInactiveList />
          </Suspense>
        </TabPanel>
      </TabContext>
    </>
  )
}

export default Jobs

Jobs.acl = {
  subject: 'job_list',
  action: 'read',
}

const CustomTab = styled(Tab)`
  text-transform: none;
  padding: 0px 27px;
  display: flex;
  gap: 1px;
`
