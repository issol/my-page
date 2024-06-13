import { SyntheticEvent, useEffect, useState } from 'react'

// ** hooks
import useModal from '@src/hooks/useModal'

// ** style components

import {
  Box,
  Dialog,
  DialogContent,
  Grid,
  Tab,
  Typography,
  styled,
} from '@mui/material'
import PageHeader from '@src/@core/components/page-header'

// ** components
import JobListView from './list-view/list-view'
import JobTrackerView from './tracker-view/tracker-view'

// ** apis
import { useGetClientList } from '@src/queries/client.query'

// ** NextJs
import { useRouter } from 'next/router'
import OrderList from './components/order-list'
import { useGetStatusList } from '@src/queries/common.query'
import TabContext from '@mui/lab/TabContext'

import TabPanel from '@mui/lab/TabPanel'
import JobTemplateView from './job-template'
import TabList from '@mui/lab/TabList'

type tabMenu = 'list' | 'tracker' | 'template'

export default function JobList() {
  const { openModal, closeModal } = useModal()
  const router = useRouter()
  const { data: statusList, refetch: statusListRefetch } =
    useGetStatusList('Job')
  const tabQuery = router.query.tab as tabMenu

  const [value, setValue] = useState<tabMenu>('list')
  const handleChange = (event: SyntheticEvent, newValue: string) => {
    // setValue(newValue
    router.push({ pathname: '/orders/job-list/', query: { tab: newValue } })
  }

  const { data: clients, refetch: clientsRefetch } = useGetClientList({
    take: 1000,
    skip: 0,
  })

  // 페이지가 처음 로딩될때 필요한 데이터를 모두 리패치 한다
  useEffect(() => {
    statusListRefetch()
    clientsRefetch()
  }, [])

  useEffect(() => {
    if (tabQuery && ['list', 'tracker', 'template'].includes(tabQuery))
      setValue(tabQuery)
  }, [tabQuery])

  function onCreateNewJob() {
    openModal({
      type: 'order-list',
      children: (
        <Dialog
          open={true}
          onClose={() => closeModal('order-list')}
          maxWidth='lg'
        >
          <DialogContent sx={{ padding: '50px' }}>
            <OrderList onClose={() => closeModal('order-list')} />
          </DialogContent>
        </Dialog>
      ),
    })
  }

  return (
    // <Grid container spacing={6} className='match-height'>
    <Box display='flex' flexDirection='column' sx={{ pb: '64px' }}>
      <PageHeader title={<Typography variant='h5'>Job list</Typography>} />
      <Box sx={{ mt: 4 }}>
        <TabContext value={value}>
          <TabList
            onChange={handleChange}
            aria-label='Company price menu'
            style={{
              borderBottom: '1px solid rgba(76, 78, 100, 0.12)',
              marginBottom: '24px',
            }}
          >
            <CustomTab value='list' label='List' />
            <CustomTab value='tracker' label='Job tracker' />
            <CustomTab value='template' label='Job template' />
          </TabList>
          <TabPanel value='list' sx={{ padding: 0 }}>
            <JobListView
              clients={clients?.data || []}
              onCreateNewJob={onCreateNewJob}
              statusList={statusList!.filter(value => value.value !== 601100)}
            />
          </TabPanel>
          <TabPanel value='tracker'>
            <JobTrackerView
              clients={clients?.data || []}
              onCreateNewJob={onCreateNewJob}
            />
          </TabPanel>
          <TabPanel value='template'>
            <JobTemplateView />
          </TabPanel>
        </TabContext>
      </Box>
    </Box>
    // </Grid>
  )
}

JobList.acl = {
  subject: 'job_list',
  action: 'read',
}

const CustomTab = styled(Tab)`
  text-transform: none;
  padding: 5px 10px;
  width: fit-content;
  min-width: inherit;
  display: flex;
  gap: 1px;
`