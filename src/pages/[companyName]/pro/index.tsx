import Box from '@mui/material/Box'

import Typography from '@mui/material/Typography'

import PageHeader from '@src/@core/components/page-header'

import { SyntheticEvent, useEffect, useState } from 'react'

import { useRouter } from 'next/router'

import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import { Button, ButtonGroup, Tab, styled } from '@mui/material'
import TabPanel from '@mui/lab/TabPanel'
import ProsList from './list'
import LinguistTeam from './linguist-team'

type tabMenu = 'proList' | 'linguistList'

const Pro = () => {
  const router = useRouter()
  const tabQuery = router.query.tab as tabMenu

  const [value, setValue] = useState<tabMenu>('proList')

  const handleTabChange = (event: SyntheticEvent, newValue: string) => {
    // setValue(newValue
    router.push({ pathname: '/pro', query: { tab: newValue } })
  }

  useEffect(() => {
    if (tabQuery && ['proList', 'linguistList'].includes(tabQuery))
      setValue(tabQuery)
  }, [tabQuery])

  return (
    <Box display='flex' flexDirection='column' sx={{ pb: '64px' }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* {value === 'linguistList' ? (
          <ButtonGroup variant='outlined'>
            <CustomBtn
              value='card'
              $focus={menu === 'card'}
              onClick={e => setMenu(e.currentTarget.value as MenuType)}
            >
              Card view
            </CustomBtn>
            <CustomBtn
              $focus={menu === 'list'}
              value='list'
              onClick={e => setMenu(e.currentTarget.value as MenuType)}
            >
              List view
            </CustomBtn>
          </ButtonGroup>
        ) : null} */}
      </Box>
      <Box>
        <TabContext value={value}>
          <TabList
            onChange={handleTabChange}
            aria-label='Pro list menu'
            style={{
              borderBottom: '1px solid rgba(76, 78, 100, 0.12)',
              marginBottom: '24px',
            }}
          >
            <CustomTab value='proList' label='Pros List' />
            <CustomTab value='linguistList' label='Linguist team' />
          </TabList>
          <TabPanel value='proList' sx={{ padding: 0 }}>
            <ProsList />
          </TabPanel>
          <TabPanel value='linguistList'>
            <LinguistTeam />
          </TabPanel>
        </TabContext>
      </Box>
    </Box>
  )
}

export default Pro

Pro.acl = {
  subject: 'pro',
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

const CustomBtn = styled(Button)<{ $focus: boolean }>`
  width: 145px;
  background: ${({ $focus }) => ($focus ? 'rgba(102, 108, 255, 0.08)' : '')};
`
