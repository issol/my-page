import { SyntheticEvent, useEffect, useState } from 'react'

// ** hooks
import useModal from '@src/hooks/useModal'

// ** style components
import { styled } from '@mui/system'
import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'
import MuiTabList, { TabListProps } from '@mui/lab/TabList'
import {
  Box,
  Dialog,
  DialogContent,
  Grid,
  Tab,
  Typography,
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

import { Icon } from '@iconify/react'
import TabPanel from '@mui/lab/TabPanel'
import JobTemplateView from './job-template'

type tabMenu = 'list' | 'tracker' | 'template'

export default function JobList() {
  const { openModal, closeModal } = useModal()
  const router = useRouter()
  const { data: statusList } = useGetStatusList('Job')
  const tabQuery = router.query.tab as tabMenu

  const [value, setValue] = useState<tabMenu>('list')
  const handleChange = (event: SyntheticEvent, newValue: string) => {
    // setValue(newValue
    router.push({ pathname: '/orders/job-list/', query: { tab: newValue } })
  }

  const { data: clients } = useGetClientList({ take: 1000, skip: 0 })

  const TabList = styled(MuiTabList)<TabListProps>(({ theme }) => ({
    marginBottom: '24px',
    '& .MuiTabs-indicator': {
      display: 'none',
    },
    '& .Mui-selected': {
      backgroundColor: theme.palette.primary.main,
      color: `${theme.palette.common.white} !important`,
    },
    '& .MuiTab-root': {
      minHeight: 38,
      minWidth: 110,
      borderRadius: 8,
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(2),
      textTransform: 'none',
    },
  }))

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

  console.log(statusList)

  return (
    // <Grid container spacing={6} className='match-height'>
    <Box display='flex' flexDirection='column' sx={{ pb: '64px' }}>
      <PageHeader title={<Typography variant='h5'>Job list</Typography>} />
      <Box sx={{ mt: 4 }}>
        <TabContext value={value}>
          <TabList onChange={handleChange} aria-label='Company price menu'>
            <Tab value='list' label='List' />
            <Tab value='tracker' label='Job tracker' />
            <Tab value='template' label='Job Template' />
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
