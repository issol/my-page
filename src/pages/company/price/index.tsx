// ** React Imports
import { MouseEvent, SyntheticEvent, useState, useEffect } from 'react'

// ** MUI Imports
import Tab from '@mui/material/Tab'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import MuiTabList, { TabListProps } from '@mui/lab/TabList'

// ** Icon Imports
import Icon from '@src/@core/components/icon'
import StandardPrices from '@src/pages/components/standard-prices'

// ** fetches

import { useGetPriceUnitList } from '@src/queries/price-units.query'

// ** Components
import PriceUnits from '../components/price/price-units'

import { useRouter } from 'next/router'

type tabMenu = '1' | '2' | '3'

export default function Price() {
  const router = useRouter()
  const tabQuery = router.query.tab as tabMenu
  // ** State
  const [value, setValue] = useState<string>('1')

  const [skip, setSkip] = useState(0)
  const [pageSize, setPageSize] = useState(10)

  const { data: list, refetch: refetchPriceUnit } = useGetPriceUnitList({
    skip: skip * pageSize,
    take: pageSize,
  })

  useEffect(() => {
    if (tabQuery && ['1', '2', '3'].includes(tabQuery)) setValue(tabQuery)
  }, [tabQuery])

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

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    // setValue(newValue
    router.push({ pathname: '/company/price/', query: { tab: newValue } })
  }
  return (
    <TabContext value={value}>
      <TabList onChange={handleChange} aria-label='Company price menu'>
        <Tab
          value='1'
          label='Standard client prices'
          iconPosition='start'
          icon={<Icon icon='mdi:account-star-outline' />}
          sx={{ marginLeft: '24px' }}
        />
        <Tab
          value='2'
          label='Standard Pro prices'
          iconPosition='start'
          icon={<Icon icon='ic:baseline-people-outline' />}
          sx={{ marginLeft: '24px' }}
        />
        <Tab
          value='3'
          label='Price units'
          iconPosition='start'
          icon={<Icon icon='mdi:dollar' />}
          sx={{ marginLeft: '24px' }}
        />
      </TabList>
      <TabPanel value='1'>
        <StandardPrices title='Standard client prices' page='client' />
      </TabPanel>
      <TabPanel value='2'>
        <StandardPrices title='Standard pro prices' page='pro' />
      </TabPanel>
      <TabPanel value='3'>
        <PriceUnits
          list={list || { data: [], count: 0, totalCount: 0 }}
          refetch={refetchPriceUnit}
          skip={skip}
          setSkip={setSkip}
          pageSize={pageSize}
          setPageSize={setPageSize}
        />
      </TabPanel>
    </TabContext>
  )
}

Price.acl = {
  action: 'create',
  subject: 'company_price',
}
