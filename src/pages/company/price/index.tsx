// ** React Imports
import { MouseEvent, SyntheticEvent, useState } from 'react'

// ** MUI Imports
import Tab from '@mui/material/Tab'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import MuiTabList, { TabListProps } from '@mui/lab/TabList'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import StandardPrices from '@src/pages/components/standard-prices'
import { useGetStandardPrices } from '@src/queries/company/standard-price'

// ** Components
import PriceUnits from '../components/price/price-units'

export default function Price() {
  // ** State
  const [value, setValue] = useState<string>('1')

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
    setValue(newValue)
  }
  return (
    <TabContext value={value}>
      <TabList onChange={handleChange} aria-label='Company price menu'>
        <Tab
          value='1'
          label='Standard client prices'
          iconPosition='start'
          icon={<Icon icon='material-symbols:person-outline' />}
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
        <StandardPrices />
      </TabPanel>
      <TabPanel value='2'>
        <Typography>
          Chocolate bar carrot cake candy canes sesame snaps. Cupcake pie gummi
          bears jujubes candy canes. Chupa chups sesame snaps halvah.
        </Typography>
      </TabPanel>
      <TabPanel value='3'>
        <PriceUnits />
      </TabPanel>
    </TabContext>
  )
}

Price.acl = {
  action: 'read',
  subject: 'company_price',
}
