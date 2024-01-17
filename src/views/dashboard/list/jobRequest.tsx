import React, { useMemo, useState } from 'react'
import { Box } from '@mui/material'
import { SectionTitle, Title } from '@src/views/dashboard/dashboardItem'
import Typography from '@mui/material/Typography'
import Switch from '@mui/material/Switch'
import CurrencyByDateList, {
  getProDateFormat,
} from '@src/views/dashboard/list/currencyByDate'
import ProJobRequestBarChart from '@src/views/dashboard/chart/jobRequestBar'
import dayjs from 'dayjs'
import { useExpectedIncome } from '@src/queries/dashnaord.query'
import { ExpectedIncome, ExpectedIncomeSort } from '@src/types/dashboard'
import find from 'lodash/find'
import DashboardForSuspense, {
  DashboardErrorFallback,
} from '@src/views/dashboard/suspense'

const getSubTitle = (date: Date) => {
  return `Based On ${getProDateFormat(
    dayjs(date).get('year'),
    dayjs(date).get('month') + 1,
  )}`
}

interface ExpectedIncomeProps {
  date: Date | null
  setOpenInfoDialog: (open: boolean, key: string) => void
}

const JobRequestContent = ({
  date: calendarDate,
  setOpenInfoDialog,
}: ExpectedIncomeProps) => {
  const date = dayjs(calendarDate)

  const [checked, setChecked] = useState(false)
  const [sort, setSort] = useState<ExpectedIncomeSort>('requestDate')
  const { data, isSuccess } = useExpectedIncome({
    year: date.get('year'),
    month: date.get('month') - 1,
    sort,
  })

  const CalendarList: Array<ExpectedIncome> = useMemo(() => {
    const _date = dayjs(date).set('date', 1)

    return Array(6)
      .fill(0)
      .map((i, index) => {
        const dateItem = _date.add(-index, 'month').format('MMM')
        const item = find(data?.report, { month: dateItem })
        if (item) return { ...item }
        return {
          incomeJPY: 0,
          incomeKRW: 0,
          incomeSGD: 0,
          incomeUSD: 0,
          month: dateItem,
          acceptedCount: 0,
          rejectedCount: 0,
        }
      })
  }, [data, calendarDate])

  return (
    <Box display='flex' sx={{ width: '100%', height: '100%' }}>
      <Box sx={{ width: '50%', padding: '20px' }}>
        <Title
          title='Job requests'
          subTitle={getSubTitle(date.toDate())}
          openDialog={setOpenInfoDialog}
        />
        <ProJobRequestBarChart report={[...CalendarList].reverse() || []} />
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
        <CurrencyByDateList report={CalendarList || []} />
      </Box>
    </Box>
  )
}

const JobRequest = (props: ExpectedIncomeProps) => {
  return (
    <DashboardForSuspense
      {...props}
      refreshDataQueryKey='ExpectedIncome'
      sectionTitle='Job requests'
      titleProps={{
        subTitle: getSubTitle(dayjs(props.date).toDate()),
        padding: '20px',
      }}
    >
      <JobRequestContent {...props} />
    </DashboardForSuspense>
  )
}
export default JobRequest
