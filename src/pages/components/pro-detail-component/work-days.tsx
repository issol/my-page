import DatePicker, { CalendarContainer } from 'react-datepicker'
import { Box, Card, CardHeader, TextField, Typography } from '@mui/material'
import { DateType } from '@src/types/forms/reactDatepickerTypes'
import { addMonths, format, intlFormat, subDays, subMonths } from 'date-fns'
import {
  Dispatch,
  forwardRef,
  ReactNode,
  SetStateAction,
  useState,
} from 'react'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { CountryType } from '@src/types/sign/personalInfoTypes'
import { getGmtTime, getGmtTimeEng } from '@src/shared/helpers/timezone.helper'
import ProDatePickerWrapper from '../pro-date-picker'
import TimelineDot from '@src/@core/components/mui/timeline-dot'

/* eslint-enable */

type Props = {
  timezone: CountryType
  available: Array<Date>
  setYear: Dispatch<SetStateAction<number>>
  off: Array<Date>
}

const WorkDays = ({ timezone, available, off, setYear }: Props) => {
  const [startDate, setStartDate] = useState<Date | null>(new Date())
  const currentYear = new Date().getFullYear()
  const excludeWeekends = (date: Date) => {
    const day = date.getDay()
    return day !== 0 && day !== 6
  }
  // console.log('off', off)
  return (
    <Card sx={{ padding: '20px' }}>
      <CardHeader title='Available work days' sx={{ padding: 0 }}></CardHeader>
      <Typography variant='caption'>{getGmtTimeEng(timezone?.code)}</Typography>
      <ProDatePickerWrapper
        sx={{ display: 'flex', justifyContent: 'center', margin: '24px 0' }}
      >
        <DatePicker
          // selected={startDate}
          // onYearChange={}
          onMonthChange={(date: Date) => {
            if (currentYear !== date.getFullYear()) {
              setYear(date.getFullYear())
            }
          }}
          // onYearChange={(date: Date) => // console.log('hi')}
          onChange={(date: Date) => setStartDate(date)}
          inline
          readOnly
          disabledKeyboardNavigation
          minDate={subMonths(new Date(), 12)}
          maxDate={addMonths(new Date(), 12)}
          excludeDates={off}
          // includeDates={available}
          filterDate={excludeWeekends}
          // calendarContainer={CustomCalendarContainer}
          // customInput={<CustomInput />}
          // popperContainer={props => <CalendarContainer {...props} />}
        />
      </ProDatePickerWrapper>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
        <Box sx={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <TimelineDot color='success' />
          <Typography
            variant='caption'
            sx={{ lineHeight: '14px', color: 'rgba(76, 78, 100, 0.87)' }}
          >
            Available
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <TimelineDot color='grey' />
          <Typography
            variant='caption'
            sx={{ lineHeight: '14px', color: 'rgba(76, 78, 100, 0.87)' }}
          >
            Off
          </Typography>
        </Box>
      </Box>
    </Card>
  )
}

export default WorkDays
