import { Badge, Box, Tab, Typography } from '@mui/material'

import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import {
  Suspense,
  SyntheticEvent,
  useState,
  MouseEvent,
  useEffect,
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

type MenuType = 'requested' | 'completed'

export type FilterType = {
  jobDueDate: Date[]

  client: { name: string; id: number } | null

  search: string
}

const Jobs = () => {
  const { data: completedJob } = useGetProJobList(completedDefaultFilters)

  const { data: ongoingJob } = useGetProJobList(ongoingDefaultFilters)

  const [completedDot, setCompletedDot] = useState(false)
  const [ongoingDot, setOngoingDot] = useState(false)

  const [value, setValue] = useState<MenuType>('requested')
  const handleChange = (event: SyntheticEvent, newValue: MenuType) => {
    setValue(newValue)
  }

  useEffect(() => {
    if (completedJob && ongoingJob) {
      const completedDot = completedJob?.data?.some(job => job?.lightUpDot)
      const ongoingDot = ongoingJob?.data?.some(job => job?.lightUpDot)

      setCompletedDot(completedDot)
      setOngoingDot(ongoingDot)
    }
  }, [completedJob, ongoingJob])

  return (
    <>
      <Typography variant='h5'>Jobs</Typography>
      <TabContext value={value}>
        <TabList
          onChange={handleChange}
          aria-label='Order detail Tab menu'
          style={{ borderBottom: '1px solid rgba(76, 78, 100, 0.12)' }}
        >
          <CustomTab
            value='requested'
            label={
              <>
                {ongoingDot ? (
                  <Badge
                    variant='dot'
                    color='primary'
                    sx={{ marginLeft: '4px' }}
                  ></Badge>
                ) : null}{' '}
                Requested & Ongoing
              </>
            }
            iconPosition='start'
            icon={<Icon icon='ic:outline-list-alt' fontSize={'18px'} />}
            onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
          />

          <CustomTab
            value='completed'
            label={
              <>
                {completedDot ? (
                  <Badge
                    variant='dot'
                    color='primary'
                    sx={{ marginLeft: '4px' }}
                  ></Badge>
                ) : null}{' '}
                Completed & Inactive
              </>
            }
            iconPosition='start'
            icon={<Icon icon='iconoir:large-suitcase' fontSize={'18px'} />}
            onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
          />
        </TabList>
        <TabPanel value='requested' sx={{ pt: '24px' }}>
          <Suspense>
            <RequestedOngoingList />
          </Suspense>
        </TabPanel>
        <TabPanel value='completed' sx={{ pt: '24px' }}>
          <Suspense>
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
