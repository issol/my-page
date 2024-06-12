import React from 'react'
import { Controller, useFormContext, useWatch } from 'react-hook-form'
import {
  DashboardForm,
  getDateFormatter,
} from 'src/pages/[companyName]/dashboards/lpm'
import dayjs from 'dayjs'
import { GridItem } from '@src/views/dashboard/dashboardItem'
import { Box } from '@mui/material'
import DatePickerWrapper from '@src/@core/styles/libs/react-datepicker'
import DatePicker from 'react-datepicker'
import Typography from '@mui/material/Typography'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'

const ProChartDate = () => {
  const { control, setValue } = useFormContext<DashboardForm>()

  const [date, userViewDate] = useWatch({
    control,
    name: ['date', 'userViewDate'],
  })

  const onChangeDatePicker = (
    date: Date | null,
    onChange: (date: Date) => void,
  ) => {
    const last = dayjs(date || new Date())
      .set('date', dayjs(date).daysInMonth())
      .toDate()
    const title = getDateFormatter(date || new Date(), last) || '-'
    setValue('userViewDate', title)

    onChange(date || new Date())
  }

  return (
    <GridItem height={76} sm>
      <Box display='flex' justifyContent='space-between' sx={{ width: '100%' }}>
        <DatePickerWrapper>
          <Controller
            control={control}
            name='date'
            render={({ field: { onChange, value } }) => (
              <DatePicker
                aria-label='date picker button'
                onChange={date => onChangeDatePicker(date, onChange)}
                showMonthYearPicker
                minDate={dayjs().add(-5, 'year').toDate()}
                maxDate={dayjs().add(2, 'month').toDate()}
                selected={value || dayjs(date).toDate()}
                customInput={
                  <Box display='flex' alignItems='center'>
                    <Typography fontSize='24px' fontWeight={500}>
                      {userViewDate}
                    </Typography>
                    <CalendarTodayIcon sx={{ width: '45px' }} color='primary' />
                  </Box>
                }
              />
            )}
          />
        </DatePickerWrapper>
      </Box>
    </GridItem>
  )
}

export default ProChartDate
