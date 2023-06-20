import { Icon } from '@iconify/react'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import { Box, Card, Tab, Typography, styled } from '@mui/material'
import Chip from '@src/@core/components/mui/chip'
import { RoleType } from '@src/context/types'
import { useGetCompanyInfo } from '@src/queries/company/company-info.query'
import { getLegalName } from '@src/shared/helpers/legalname.helper'
import { Suspense, MouseEvent, useState, SyntheticEvent } from 'react'
import CompanyInfoCard from './info-card'

const CompanyInfo = () => {
  const [value, setValue] = useState<string>('overview')

  const { data: companyInfo } = useGetCompanyInfo()

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }
  return (
    <Suspense>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <CompanyInfoCard companyInfo={companyInfo!} />
        <TabContext value={value}>
          <TabList
            onChange={handleChange}
            aria-label='Pro detail Tab menu'
            style={{ borderBottom: '1px solid rgba(76, 78, 100, 0.12)' }}
          >
            <CustomTab
              value='overview'
              label='Overview'
              iconPosition='start'
              icon={<Icon icon='iconoir:large-suitcase' />}
              onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
            />

            <CustomTab
              value='billingPlan'
              label='Billing Plan'
              iconPosition='start'
              icon={<Icon icon='mdi:dollar' />}
              onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
            />
          </TabList>
          <TabPanel value='overview'></TabPanel>

          <TabPanel value='billingPlan'></TabPanel>
        </TabContext>
      </Box>
    </Suspense>
  )
}

export default CompanyInfo

const CustomTab = styled(Tab)`
  text-transform: none;
  padding: 0px 27px;
`

CompanyInfo.acl = {
  subject: 'company_info',
  action: 'read',
}
