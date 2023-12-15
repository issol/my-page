// ** React Imports

import { SyntheticEvent, useState } from 'react'

// ** MUI Imports
import Tab from '@mui/material/Tab'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { CustomChart } from '@src/views/dashboard/chart/jobRequestBar'
import { useTheme } from '@mui/material/styles'
import { ApexOptions } from 'apexcharts'
import dayjs from 'dayjs'
import { useExpectedIncome } from '@src/queries/dashboard/dashnaord-lpm'
import { ExpectedIncomeSort } from '@src/types/dashboard'

const series = [
  {
    name: 'PRODUCT A',
    data: [44, 55, 41, 67, 22, 43],
  },
]
const InvoiceTab = () => {
  const theme = useTheme()
  const [sort, setSort] = useState<ExpectedIncomeSort>('requestDate')
  // const {} = useExpectedIncome()

  const options: ApexOptions = {
    chart: {
      type: 'bar',
      toolbar: {
        show: false,
      },
    },

    plotOptions: {
      bar: {
        columnWidth: '24%',
        horizontal: false,
        borderRadius: 5,
        startingShape: 'rounded',
        dataLabels: {},
      },
    },
    xaxis: {
      tickAmount: 8,
      axisTicks: { show: false },
      axisBorder: { show: false },
      categories: [
        '2023-06',
        '2023-07',
        '2023-08',
        '2023-09',
        '2023-10',
        '2023-11',
      ],
      labels: {
        formatter: (value: string, timestamp?: number, opts?: any) => {
          return `${dayjs(value).format('MMM')}`
        },
        style: {
          colors: 'rgba(76, 78, 100, 0.38)',
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    colors: ['#666CFF', '#FDB528'],
    grid: {
      strokeDashArray: 8,
      borderColor: theme.palette.divider,
      yaxis: {
        lines: { show: true },
      },
    },
    legend: { show: false },
  }

  const [value, setValue] = useState<string>('1')

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }

  return (
    <TabContext value={value}>
      <TabList onChange={handleChange} aria-label='simple tabs example'>
        <Tab value='1' label='$' />
        <Tab value='2' label='$' />
        <Tab value='3' label='₩' />
        <Tab value='4' label='SGD' />
      </TabList>
      <TabPanel value='1' sx={{ height: '100%', padding: '0 !important' }}>
        <Box display='flex' sx={{ height: '100%' }}>
          <Box sx={{ width: '50%', height: '100%', position: 'relative' }}>
            <div style={{ position: 'absolute', left: '-16px' }}>
              <CustomChart
                type='bar'
                height={240}
                options={options}
                series={series}
              />
            </div>
          </Box>
          <Box
            sx={{
              width: '50%',
              height: '100%',
              borderLeft: '1px solid #d9d9d9',
              padding: '20px',
            }}
          >
            <Box
              display='flex'
              justifyContent='space-between'
              sx={{ height: '242px' }}
            >
              <Typography
                fontSize='14px'
                fontWeight={600}
                color='rgba(76, 78, 100, 0.87)'
              >
                August
              </Typography>
              <Typography
                fontSize='14px'
                fontWeight={600}
                color='rgba(76, 78, 100, 0.87)'
              >
                $5,200
              </Typography>
            </Box>
          </Box>
        </Box>
      </TabPanel>
      <TabPanel value='2'>
        <Typography>
          Chocolate bar carrot cake candy canes sesame snaps. Cupcake pie gummi
          bears jujubes candy canes. Chupa chups sesame snaps halvah.
        </Typography>
      </TabPanel>
      <TabPanel value='3'>
        <Typography>
          Danish tiramisu jujubes cupcake chocolate bar cake cheesecake chupa
          chups. Macaroon ice cream tootsie roll carrot cake gummi bears.
        </Typography>
      </TabPanel>
      <TabPanel value='4'>
        <Typography>
          Danish tiramisu jujubes cupcake chocolate bar cake cheesecake chupa
          chups. Macaroon ice cream tootsie roll carrot cake gummi bears.
        </Typography>
      </TabPanel>
    </TabContext>
  )
}

export default InvoiceTab
