import React, { useState } from 'react'
import { Box } from '@mui/material'
import {
  SectionTitle,
  SubDateDescription,
} from '@src/views/dashboard/dashboardItem'
import Typography from '@mui/material/Typography'
import Switch from '@mui/material/Switch'
import CurrencyByDateList, {
  getProDateFormat,
} from '@src/views/dashboard/list/currencyByDate'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import ProJobRequestBarChart from '@src/views/dashboard/chart/jobRequestBar'
import dayjs from 'dayjs'
import { useExpectedIncome } from '@src/queries/dashboard/dashnaord-lpm'
import { ExpectedIncomeSort } from '@src/types/dashboard'

interface ExpectedIncomeProps {
  dateRange: Array<Date | null>
}
const ExpectedIncome = ({ dateRange }: ExpectedIncomeProps) => {
  const date = dayjs(dateRange[0])

  const [checked, setChecked] = useState(false)
  const [sort, setSort] = useState<ExpectedIncomeSort>('requestDate')
  const { data } = useExpectedIncome({
    month: date.get('month'),
    sort,
  })

  const getDate = () => {
    return `Based On ${getProDateFormat(date.get('year'), date.get('month'))}`
  }

  return (
    <Box display='flex' sx={{ width: '100%', height: '100%' }}>
      <Box sx={{ width: '50%', padding: '20px' }}>
        <SectionTitle>
          <span className='title'>Job requests</span>
          <ErrorOutlineIcon className='info_icon' />
        </SectionTitle>
        <SubDateDescription textAlign='left'>{getDate()}</SubDateDescription>
        <ProJobRequestBarChart report={data?.report || []} />
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
        <CurrencyByDateList date={date.toDate()} report={data?.report || []} />
      </Box>
    </Box>
  )
}

export default ExpectedIncome
