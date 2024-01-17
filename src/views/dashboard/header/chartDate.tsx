import React, { useCallback, useState } from 'react'
import { GridItem } from '@src/views/dashboard/dashboardItem'
import { Box, ButtonGroup } from '@mui/material'
import DatePickerWrapper from '@src/@core/styles/libs/react-datepicker'
import { Controller, useFormContext, useWatch } from 'react-hook-form'
import DatePicker from 'react-datepicker'
import dayjs from 'dayjs'
import Typography from '@mui/material/Typography'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import Button from '@mui/material/Button'
import {
  DashboardForm,
  getDateFormatter,
  SelectedRangeDate,
} from '@src/pages/dashboards/lpm'
import styled from '@emotion/styled'

const ChartDate = () => {
  const { control, setValue } = useFormContext<DashboardForm>()

  const [dateRange, selectedRangeDate, userViewDate] = useWatch({
    control,
    name: ['dateRange', 'selectedRangeDate', 'userViewDate'],
  })

  const [startDate, setStartDate] = useState(
    (dateRange && dateRange[0]) || new Date(),
  )
  const [endDate, setEndDate] = useState(dateRange ? dateRange[1] : null)

  const onChangeDateRange = useCallback(
    (type: SelectedRangeDate) => {
      setValue('selectedRangeDate', type)

      switch (type) {
        case 'month':
          const dates = [
            dayjs().set('date', 1).toDate(),
            dayjs().set('date', dayjs().daysInMonth()).toDate(),
          ]

          const title1 = getDateFormatter(dates[0], dates[1]) || '-'
          setValue('userViewDate', title1)
          setValue('dateRange', dates)
          break
        case 'today':
          const title2 = getDateFormatter(new Date(), new Date()) || '-'

          setValue('userViewDate', title2)
          setValue('dateRange', [new Date(), new Date()])
          break
        case 'week':
          const title3 =
            getDateFormatter(
              dayjs().day(0).toDate(),
              dayjs().day(6).toDate(),
            ) || '-'
          setValue('userViewDate', title3)
          setValue('dateRange', [
            dayjs().day(0).toDate(),
            dayjs().day(6).toDate(),
          ])
          break
        default:
          break
      }
    },
    [dateRange, selectedRangeDate],
  )

  const onChangeDatePicker = (date: Array<Date | null> | null) => {
    if (!date || !date[0]) return

    const title = getDateFormatter(date[0], date[1]) || '-'
    setValue('userViewDate', title)

    setStartDate(date[0])
    setEndDate(date[1])

    if (date[0] && date[1]) {
      setValue('dateRange', date)
    }
  }

  return (
    <GridItem height={76} sm>
      <Box display='flex' justifyContent='space-between' sx={{ width: '100%' }}>
        <DatePickerWrapper display='flex' alignItems='center'>
          <DatePicker
            aria-label='date picker button'
            onChange={date => onChangeDatePicker(date)}
            startDate={startDate}
            endDate={endDate}
            selectsRange
            minDate={dayjs().add(-5, 'year').toDate()}
            maxDate={dayjs().add(2, 'month').toDate()}
            customInput={
              <Box display='flex' alignItems='center'>
                <Typography fontSize='20px' fontWeight={500}>
                  {userViewDate}
                </Typography>
                <CalendarTodayIcon sx={{ width: '45px' }} color='primary' />
              </Box>
            }
          />
        </DatePickerWrapper>
        <ButtonGroup disableElevation aria-label='date selecor button group'>
          <DateButton
            disableElevation
            variant={selectedRangeDate === 'month' ? 'contained' : 'outlined'}
            key='month'
            onClick={() => onChangeDateRange('month')}
          >
            Month
          </DateButton>
          <DateButton
            disableElevation
            key='week'
            variant={selectedRangeDate === 'week' ? 'contained' : 'outlined'}
            onClick={() => onChangeDateRange('week')}
          >
            Week
          </DateButton>
          <DateButton
            disableElevation
            key='today'
            variant={selectedRangeDate === 'today' ? 'contained' : 'outlined'}
            onClick={() => onChangeDateRange('today')}
          >
            Today
          </DateButton>
        </ButtonGroup>
      </Box>
    </GridItem>
  )
}

const DateButton = styled(Button)(() => {
  return {
    '&.MuiButton-contained': {
      color: 'rgba(102, 108, 255, 1)',
      backgroundColor: 'rgba(102, 108, 255, 0.2)',
      border: '1px solid rgba(102, 108, 255, 0.4)',
      boxShadow: 'none',
      boxSizing: 'border-box',
    },
  }
})
export default ChartDate
