import { Box, Tab, Typography } from '@mui/material'
import JobFilters from './requested-ongoing-list/filters'
import JobList from './requested-ongoing-list/list'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import { Suspense, SyntheticEvent, useState, MouseEvent } from 'react'
import styled from 'styled-components'
import TabPanel from '@mui/lab/TabPanel'
import { Icon } from '@iconify/react'
import { useForm } from 'react-hook-form'
import { getProJobColumns } from '@src/shared/const/columns/pro-jobs'
import { useGetProJobList } from '@src/queries/jobs/jobs.query'
import RequestedOngoingList from './requested-ongoing-list'
import DeliveredInactiveList from './delivered-inactive-list'

type MenuType = 'requested' | 'completed'

export type FilterType = {
  jobDueDate: Date[]

  client: Array<{ label: string; value: number }>

  search: string
}

const Jobs = () => {
  const [value, setValue] = useState<MenuType>('requested')
  const handleChange = (event: SyntheticEvent, newValue: MenuType) => {
    setValue(newValue)
  }

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
            label='Requested & Ongoing'
            iconPosition='start'
            icon={<Icon icon='ic:outline-list-alt' fontSize={'18px'} />}
            onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
          />

          <CustomTab
            value='completed'
            label='Completed & Inactive'
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
  subject: 'jobs',
  action: 'read',
}

const CustomTab = styled(Tab)`
  text-transform: none;
  padding: 0px 27px;
  display: flex;
  gap: 1px;
`
