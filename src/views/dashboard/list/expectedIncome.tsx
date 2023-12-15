import React, { useState } from 'react'
import { Box } from '@mui/material'
import {
  SectionTitle,
  SubDateDescription,
} from '@src/views/dashboard/dashboardItem'
import Typography from '@mui/material/Typography'
import Switch from '@mui/material/Switch'
import CurrencyByDateList from '@src/views/dashboard/list/currencyByDate'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import ProJobRequestBarChart from '@src/views/dashboard/chart/jobRequestBar'
import dayjs from 'dayjs'
import { useExpectedIncome } from '@src/queries/dashboard/dashnaord-lpm'
import { ExpectedIncomeSort } from '@src/types/dashboard'
import { ExpectedIncome } from '@src/types/dashboard'

const TEMP: { report: Array<ExpectedIncome> } = {
  report: [
    {
      month: 'Jul',
      incomeKRW: 1123123,
      incomeUSD: 0,
      incomeJPY: 0,
      incomeSGD: 0,
      acceptedCount: 20,
      rejectedCount: 20,
    },
    {
      month: 'Aug',
      incomeKRW: 23423423,
      incomeUSD: 0,
      incomeJPY: 0,
      incomeSGD: 0,
      acceptedCount: 3,
      rejectedCount: 10,
    },
    {
      month: 'Sep',
      incomeKRW: 270000,
      incomeUSD: 0,
      incomeJPY: 0,
      incomeSGD: 0,
      acceptedCount: 10,
      rejectedCount: 10,
    },
    {
      month: 'Oct',
      incomeKRW: 189662,
      incomeUSD: 0,
      incomeJPY: 0,
      incomeSGD: 1,
      acceptedCount: 3,
      rejectedCount: 0,
    },
    {
      month: 'Nov',
      incomeKRW: 4710000,
      incomeUSD: 0,
      incomeJPY: 3,
      incomeSGD: 0,
      acceptedCount: 6,
      rejectedCount: 0,
    },
    {
      month: 'Dec',
      incomeKRW: 0,
      incomeUSD: 0,
      incomeJPY: 0,
      incomeSGD: 0,
      acceptedCount: 0,
      rejectedCount: 0,
    },
  ],
}
interface ExpectedIncomeProps {
  dateRange: Array<Date | null>
}
const ExpectedIncome = ({ dateRange }: ExpectedIncomeProps) => {
  const lastDay = dayjs(dateRange[0]).daysInMonth()
  const firstDate = dayjs(dateRange[0]).set('date', 1)
  const lastDate = dayjs(dateRange[0]).set('date', lastDay)

  const [checked, setChecked] = useState(false)
  const [sort, setSort] = useState<ExpectedIncomeSort>('requestDate')
  const { data } = useExpectedIncome({
    month: firstDate.get('month'),
    sort,
  })

  console.log('STST', sort)
  const getDate = () => {
    return `Based On ${firstDate.format('MMM D')} - ${lastDate.format(
      'D, YYYY',
    )}`
  }

  return (
    <Box display='flex' sx={{ width: '100%', height: '100%' }}>
      <Box sx={{ width: '50%', padding: '20px' }}>
        <SectionTitle>
          <span className='title'>Job requests</span>
          <ErrorOutlineIcon className='info_icon' />
        </SectionTitle>
        <SubDateDescription textAlign='left'>{getDate()}</SubDateDescription>
        <ProJobRequestBarChart data={TEMP || []} />
      </Box>
      <Box
        sx={{
          width: '50%',
          borderLeft: '1px solid #d9d9d9',
          padding: '20px',
        }}
      >
        <SectionTitle>
          <span className='title'>Expected income</span>
        </SectionTitle>
        <Box
          display='flex'
          alignItems='center'
          justifyContent='flex-end'
          gap='4px'
        >
          <Typography fontSize='14px' color='#4C4E6499'>
            Request date
          </Typography>
          <Switch
            size='small'
            inputProps={{ 'aria-label': 'controlled' }}
            checked={checked}
            onChange={(event, state) => {
              if (event.target.checked) setSort('dueDate')
              else setSort('requestDate')
              setChecked(event.target.checked)
            }}
            sx={{
              '.MuiSwitch-switchBase:not(.Mui-checked)': {
                color: '#666CFF',
                '.MuiSwitch-thumb': {
                  color: '#666CFF',
                },
              },
              '.MuiSwitch-track': {
                backgroundColor: '#666CFF',
              },
            }}
          />
          <Typography fontSize='14px' color='#4C4E6499'>
            Due date
          </Typography>
        </Box>
        <CurrencyByDateList data={TEMP} />
      </Box>
    </Box>
  )
}

export default ExpectedIncome
