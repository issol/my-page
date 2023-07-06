// ** style components
import styled from 'styled-components'
import Tab from '@mui/material/Tab'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import { Grid } from '@mui/material'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** nextJS
import { useRouter } from 'next/router'
import { useContext, useState } from 'react'
import { AuthContext } from '@src/context/AuthContext'

// ** components
import Header from '../components/header'

// ** types
import { RoleType } from '@src/context/types'
import MyPageOverview from './components/overview'

type MenuType = 'overview' | 'paymentInfo' | 'myAccount'
export default function ProMyPage() {
  const router = useRouter()

  const { user } = useContext(AuthContext)

  const userInfo = {
    legalNamePronunciation: user?.legalNamePronunciation,
    firstName: user?.firstName!,
    lastName: user?.lastName!,
    role: 'PRO' as RoleType,
    email: user?.email!,
  }

  const [value, setValue] = useState<MenuType>('overview')

  const handleChange = (_: any, value: MenuType) => {
    setValue(value)
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Header userInfo={userInfo!} />
      </Grid>
      <Grid item xs={12}>
        <TabContext value={value}>
          <TabList
            onChange={handleChange}
            aria-label='Pro detail Tab menu'
            style={{ borderBottom: '1px solid rgba(76, 78, 100, 0.12)' }}
          >
            <CustomTap
              value='overview'
              label='Overview'
              iconPosition='start'
              icon={<Icon icon='material-symbols:person-outline' />}
              onClick={e => e.preventDefault()}
            />
            <CustomTap
              value='paymentInfo'
              label='Payment info'
              iconPosition='start'
              icon={<Icon icon='carbon:currency-dollar' />}
              onClick={e => e.preventDefault()}
            />
            <CustomTap
              value='myAccount'
              label='My account'
              iconPosition='start'
              icon={<Icon icon='material-symbols:security' />}
              onClick={e => e.preventDefault()}
            />
          </TabList>
          <TabPanel value='overview'>
            <MyPageOverview userInfo={user!} />
          </TabPanel>
          <TabPanel value='paymentInfo'>payment info</TabPanel>
          <TabPanel value='myAccount'>my account</TabPanel>
        </TabContext>
      </Grid>
    </Grid>
  )
}

ProMyPage.acl = {
  subject: 'pro_mypage',
  action: 'read',
}

const CustomTap = styled(Tab)`
  text-transform: none;
  padding: 0px 27px;
`
