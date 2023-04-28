import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import { Box, Button, Tab, Typography, styled } from '@mui/material'
import Icon from '@src/@core/components/icon'

import TabContext from '@mui/lab/TabContext'
import { MouseEvent, SyntheticEvent, useState } from 'react'
import ProjectInfo from '../project-info'
import OrderDetailClient from '../client'
import ProjectTeam from '../project-team'
import { HistoryType, VersionHistoryType } from '@src/types/orders/order-detail'
import { getProjectTeamColumns } from '@src/shared/const/columns/order-detail'

type Props = {
  history: VersionHistoryType
}

const VersionHistoryModal = ({ history }: Props) => {
  const [value, setValue] = useState<string>('1')
  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }

  const [pageSize, setPageSize] = useState<number>(10)
  const [page, setPage] = useState<number>(0)

  return (
    <Box
      sx={{
        maxWidth: '1266px',
        width: '100%',
        maxHeight: '900px',
        height: '100%',
        background: '#ffffff',
        boxShadow: '0px 0px 20px rgba(76, 78, 100, 0.4)',
        borderRadius: '10px',
      }}
    >
      <Box
        sx={{
          padding: '50px 60px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            gap: '8px',
            alignItems: 'center',
            padding: '20px',
          }}
        >
          <img src='/images/icons/order-icons/book.svg' alt='' />
          <Typography variant='h5'>{`[${'Ver. 1'}] O-000001`}</Typography>
        </Box>
        <TabContext value={value}>
          <TabList
            onChange={handleChange}
            aria-label='Order detail Tab menu'
            style={{ borderBottom: '1px solid rgba(76, 78, 100, 0.12)' }}
          >
            <CustomTap
              value='1'
              label='Project info'
              iconPosition='start'
              icon={<Icon icon='iconoir:large-suitcase' fontSize={'18px'} />}
              onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
            />
            <CustomTap
              value='2'
              label='Languages & Items'
              iconPosition='start'
              icon={<Icon icon='pajamas:earth' fontSize={'18px'} />}
              onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
            />
            <CustomTap
              value='3'
              label='Client'
              iconPosition='start'
              icon={<Icon icon='mdi:account-star-outline' fontSize={'18px'} />}
              onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
            />
            <CustomTap
              value='4'
              label='Project team'
              iconPosition='start'
              icon={
                <Icon icon='ic:baseline-people-outline' fontSize={'18px'} />
              }
              onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
            />
          </TabList>
          <TabPanel
            value='1'
            sx={{ height: '100%', maxHeight: '552px', minHeight: '552px' }}
          >
            {/* <ProjectInfo type='history' /> */}
          </TabPanel>
          <TabPanel
            value='2'
            sx={{ height: '100%', maxHeight: '552px', minHeight: '552px' }}
          ></TabPanel>
          <TabPanel
            value='3'
            sx={{ height: '100%', maxHeight: '552px', minHeight: '552px' }}
          >
            {/* <OrderDetailClient type='history' /> */}
          </TabPanel>
          <TabPanel
            value='4'
            sx={{ height: '100%', maxHeight: '552px', minHeight: '552px' }}
          >
            <ProjectTeam
              list={history.history.projectTeam}
              listCount={history.history.projectTeam.length}
              columns={getProjectTeamColumns()}
              page={page}
              pageSize={pageSize}
              setPage={setPage}
              setPageSize={setPageSize}
            />
          </TabPanel>
        </TabContext>
        <Box
          sx={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Button variant='outlined' color='secondary' sx={{ width: '226px' }}>
            Close
          </Button>
          <Button variant='contained' sx={{ width: '226px' }}>
            Restore this version
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

export default VersionHistoryModal

const CustomTap = styled(Tab)`
  text-transform: none;
  padding: 0px 27px;
  display: flex;
  gap: 1px;
`
