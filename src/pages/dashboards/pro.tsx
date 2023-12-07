import Grid from '@mui/material/Grid'
import {
  GridItem,
  JobList,
  SectionTitle,
  SubDateDescription,
  TitleIcon,
} from '@src/views/dashboard/dashboardItem'
import { Box, ButtonGroup, Stack } from '@mui/material'
import dayjs from 'dayjs'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import Typography from '@mui/material/Typography'
import { Controller, useForm, useWatch } from 'react-hook-form'
import Button from '@mui/material/Button'
import DatePickerWrapper from '@src/@core/styles/libs/react-datepicker'
import DatePicker from 'react-datepicker'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import React, { useCallback, useState } from 'react'
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'

// ** Custom Components Imports
import weekday from 'dayjs/plugin/weekday'
import {
  CheckCircleOutlined,
  CheckCircleSharp,
  KeyboardArrowRight,
  WatchLaterRounded,
} from '@mui/icons-material'
import { upcomingColumns } from '@src/shared/const/columns/dashboard'
import { useRouter } from 'next/router'
import {
  DashboardForm,
  DEFAULT_LAST_DATE,
  DEFAULT_START_DATE,
  getDateFormatter,
  getRangeDateTitle,
  SelectedRangeDate,
} from '@src/pages/dashboards/lpm'
import { DataGrid } from '@mui/x-data-grid'
import RequestBarChart from '@src/views/dashboard/requestBarChart'
import Switch from '@mui/material/Switch'
import CurrencyList from '@src/views/dashboard/currencyList'
import InvoiceTab from '@src/views/dashboard/invoiceTab'
import SwiperControls from '@src/views/dashboard/swiper'
import Chip from '@mui/material/Chip'

dayjs.extend(weekday)

const TADDashboards = () => {
  const router = useRouter()

  const { control, setValue } = useForm<DashboardForm>({
    defaultValues: {
      dateRange: [DEFAULT_START_DATE, DEFAULT_LAST_DATE],
      userViewDate: getRangeDateTitle(DEFAULT_START_DATE, DEFAULT_LAST_DATE),
      selectedRangeDate: 'month',
      viewSwitch: true,
    },
  })

  const [dateRange, selectedRangeDate, userViewDate] = useWatch({
    control,
    name: ['dateRange', 'selectedRangeDate', 'userViewDate'],
  })

  const [openDialog, setOpenDialog] = useState(false)

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
          const title2 = getDateFormatter(new Date(), null) || '-'

          setValue('userViewDate', title2)
          setValue('dateRange', [new Date(), null])
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

  const onChangeDatePicker = (
    date: Array<Date | null> | null,
    onChange: (date: Array<Date | null> | null) => void,
  ) => {
    if (!date || !date[0]) return

    const title = getDateFormatter(date[0], date[1]) || '-'
    setValue('userViewDate', title)
    onChange(date)
  }

  return (
    <ApexChartWrapper sx={{ overflow: 'scroll' }}>
      <Grid
        container
        gap='24px'
        sx={{ minWidth: '1320px', padding: '10px', overflow: 'auto' }}
      >
        <GridItem height={76} sm>
          <Box
            display='flex'
            justifyContent='space-between'
            sx={{ width: '100%' }}
          >
            <DatePickerWrapper>
              <Controller
                control={control}
                name='dateRange'
                render={({ field: { onChange } }) => (
                  <DatePicker
                    aria-label='date picker button'
                    onChange={date => onChangeDatePicker(date, onChange)}
                    startDate={(dateRange && dateRange[0]) || new Date()}
                    endDate={dateRange && dateRange[1]}
                    selectsRange
                    minDate={dayjs().add(-5, 'year').toDate()}
                    maxDate={dayjs().add(2, 'month').toDate()}
                    customInput={
                      <Box display='flex' alignItems='center'>
                        <Typography fontSize='24px' fontWeight={500}>
                          {userViewDate}
                        </Typography>
                        <CalendarTodayIcon
                          sx={{ width: '45px' }}
                          color='primary'
                        />
                      </Box>
                    }
                  />
                )}
              />
            </DatePickerWrapper>
            <ButtonGroup color='primary' aria-label='date selecor button group'>
              <Button
                variant={
                  selectedRangeDate === 'month' ? 'contained' : 'outlined'
                }
                key='month'
                onClick={() => onChangeDateRange('month')}
              >
                Month
              </Button>
              <Button
                key='week'
                variant={
                  selectedRangeDate === 'week' ? 'contained' : 'outlined'
                }
                onClick={() => onChangeDateRange('week')}
              >
                Week
              </Button>
              <Button
                key='today'
                variant={
                  selectedRangeDate === 'today' ? 'contained' : 'outlined'
                }
                onClick={() => onChangeDateRange('today')}
              >
                Today
              </Button>
            </ButtonGroup>
          </Box>
        </GridItem>
      </Grid>
      <Grid
        container
        gap='24px'
        sx={{
          minWidth: '1320px',
          overflowX: 'auto',
          overFlowY: 'scroll',
          padding: '10px',
        }}
      >
        <Grid container gap='24px'>
          <GridItem width={265} height={387}>
            <Box sx={{ width: '100%', height: '100%' }}>
              <Box>
                <SectionTitle>
                  <span
                    role='button'
                    className='title'
                    onClick={() => router.push('/quotes/lpm/requests/')}
                  >
                    Job overview
                  </span>
                  <ErrorOutlineIcon className='info_icon' />
                  <KeyboardArrowRight className='arrow_icon' />
                </SectionTitle>
              </Box>
              <JobList />
            </Box>
          </GridItem>
          <GridItem sm height={387} padding='0px'>
            <Box sx={{ width: '100%', height: '100%' }}>
              <Box sx={{ padding: '20px' }}>
                <SectionTitle>
                  <span role='button' className='title'>
                    Upcoming deadlines
                  </span>
                </SectionTitle>
              </Box>
              <DataGrid
                hideFooter
                components={{
                  NoRowsOverlay: () => (
                    <Stack
                      height='50%'
                      alignItems='center'
                      justifyContent='center'
                    >
                      No rows in DataGrid
                    </Stack>
                  ),
                }}
                rows={[
                  {
                    id: 206,
                    corporationId: 'O-000133-DTP-001',
                    orderId: 192,
                    jobName: 'test',
                    dueAt: '2023-11-02T15:00:00.000Z',
                  },
                  {
                    id: 207,
                    corporationId: 'O-000133-DTP-001',
                    orderId: 192,
                    jobName: 'test',
                    dueAt: '2023-11-02T15:00:00.000Z',
                  },
                  {
                    id: 208,
                    corporationId: 'O-000133-DTP-001',
                    orderId: 192,
                    jobName: 'test',
                    dueAt: '2023-11-02T15:00:00.000Z',
                  },
                  {
                    id: 209,
                    corporationId: 'O-000133-DTP-001',
                    orderId: 192,
                    jobName: 'test',
                    dueAt: '2023-11-02T15:00:00.000Z',
                  },
                  {
                    id: 2010,
                    corporationId: 'O-000133-DTP-001',
                    orderId: 192,
                    jobName: 'test',
                    dueAt: '2023-11-02T15:00:00.000Z',
                  },
                ]}
                columns={upcomingColumns}
                disableSelectionOnClick
                pagination={undefined}
              />
            </Box>
          </GridItem>
        </Grid>
        <Grid container gap='24px'>
          <GridItem xs={6} height={490} padding='0px'>
            <Box display='flex' sx={{ width: '100%', height: '100%' }}>
              <Box sx={{ width: '50%', padding: '20px' }}>
                <SectionTitle>
                  <span className='title'>Job requests</span>
                  <ErrorOutlineIcon className='info_icon' />
                </SectionTitle>
                <SubDateDescription textAlign='left'>
                  Based On March 1 - 31, 2023
                </SubDateDescription>
                <RequestBarChart />
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
                    checked={false}
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
                <CurrencyList />
              </Box>
            </Box>
          </GridItem>
          <GridItem sm height={490}>
            <Box sx={{ width: '100%', height: '100%' }}>
              <Box>
                <SectionTitle>
                  <span className='title'>Completed deliveries</span>
                  <ErrorOutlineIcon className='info_icon' />
                </SectionTitle>
                <SubDateDescription textAlign='left'>
                  Based On March 1 - 31, 2023
                </SubDateDescription>
              </Box>
            </Box>
          </GridItem>
        </Grid>
        <Grid container gap='24px'>
          <Grid container item xs={6} gap='24px'>
            <GridItem height={184}>
              <Box sx={{ width: '100%', height: '100%' }}>
                <Box>
                  <SectionTitle>
                    <span
                      role='button'
                      className='title'
                      onClick={() => router.push('/quotes/lpm/requests/')}
                    >
                      Invoiced amount
                    </span>
                    <ErrorOutlineIcon className='info_icon' />
                    <KeyboardArrowRight className='arrow_icon' />
                  </SectionTitle>
                  <SubDateDescription textAlign='left'>
                    March 1 - 31, 2023
                  </SubDateDescription>
                </Box>
                <Box
                  display='flex'
                  alignItems='center'
                  sx={{ padding: '40px 0 ' }}
                >
                  <CurrencyAmount amounts={[100, 2300, 500, 300]} />
                </Box>
              </Box>
            </GridItem>
            <GridItem height={184}>
              <Box sx={{ width: '100%', height: '100%' }}>
                <Box>
                  <SectionTitle>
                    <span
                      role='button'
                      className='title'
                      onClick={() => router.push('/quotes/lpm/requests/')}
                    >
                      Payment amount
                    </span>
                    <ErrorOutlineIcon className='info_icon' />
                    <KeyboardArrowRight className='arrow_icon' />
                  </SectionTitle>
                  <SubDateDescription textAlign='left'>
                    March 1 - 31, 2023
                  </SubDateDescription>
                </Box>
                <Box
                  display='flex'
                  alignItems='center'
                  sx={{ padding: '40px 0 ' }}
                >
                  <CurrencyAmount amounts={[100, 2300, 500, 300]} />
                </Box>
              </Box>
            </GridItem>
          </Grid>

          <GridItem sm height={392}>
            <Box sx={{ width: '100%', height: '100%' }}>
              <Box sx={{ marginBottom: '20p      x' }}>
                <SectionTitle>
                  <span
                    role='button'
                    className='title'
                    onClick={() => router.push('/quotes/lpm/requests/')}
                  >
                    Invoice overview
                  </span>
                  <ErrorOutlineIcon className='info_icon' />
                  <KeyboardArrowRight className='arrow_icon' />
                </SectionTitle>
                <SubDateDescription textAlign='left'>
                  March 1 - 31, 2023
                </SubDateDescription>
              </Box>
              <InvoiceTab />
            </Box>
          </GridItem>
        </Grid>
        <Grid container gap='24px'>
          <GridItem xs={6} height={223}>
            <Box sx={{ width: '100%', height: '100%' }}>
              <Box>
                <SectionTitle>
                  <span className='title'>Monthly task output (12)</span>
                </SectionTitle>
                <SubDateDescription textAlign='left'>
                  March 1 - 31, 2023
                </SubDateDescription>
              </Box>
            </Box>
          </GridItem>
          <GridItem sm height={223}>
            <Box sx={{ width: '100%', height: '100%' }}>
              <Box>
                <SectionTitle>
                  <span className='title'>Deadline compliance</span>
                </SectionTitle>
                <SubDateDescription textAlign='left'>
                  March 1 - 31, 2023
                </SubDateDescription>
              </Box>
              <Box
                display='flex'
                flexDirection='column'
                gap='20px'
                sx={{ marginTop: '20px' }}
              >
                <Box
                  display='flex'
                  alignItems='center'
                  justifyContent='space-between'
                >
                  <Box display='flex' alignItems='center' gap='16px'>
                    <TitleIcon
                      style={{
                        width: '40px',
                        height: '40px',
                        backgroundColor: 'rgba(114, 225, 40, 0.1)',
                      }}
                    >
                      <CheckCircleSharp
                        className='icon'
                        style={{
                          width: '24px',
                          height: '24px',
                          color: 'rgba(114, 225, 40, 1)',
                        }}
                      />
                    </TitleIcon>
                    <Box display='flex' flexDirection='column'>
                      <Typography
                        fontSize='12px'
                        color='rgba(76, 78, 100, 0.6)'
                      >
                        Timely delivery
                        <Chip
                          label='78%'
                          sx={{
                            height: '20px',
                            backgroundColor: 'rgba(114, 225, 40, 0.1)',
                            color: 'rgba(114, 225, 40, 1)',
                            marginLeft: '10px',
                            fontSize: '12px',
                          }}
                        />
                      </Typography>
                      <Typography
                        fontSize='16px'
                        fontWeight={600}
                        color='rgba(76, 78, 100, 0.87)'
                        sx={{ marginTop: '-2px' }}
                      >
                        13
                      </Typography>
                    </Box>
                  </Box>
                  <Box>
                    <Typography fontSize='12px'>
                      Average early submission time
                    </Typography>
                    <Typography fontSize='12px' color='rgba(100, 198, 35, 1)'>
                      01 day(s) 03 hour(s) 23 min(s)
                    </Typography>
                  </Box>
                </Box>
                <Box
                  display='flex'
                  alignItems='center'
                  justifyContent='space-between'
                >
                  <Box display='flex' alignItems='center' gap='16px'>
                    <TitleIcon
                      style={{
                        width: '40px',
                        height: '40px',
                        backgroundColor: 'rgba(224, 68, 64, 0.1)',
                      }}
                    >
                      <WatchLaterRounded
                        className='icon'
                        style={{
                          width: '24px',
                          height: '24px',
                          color: 'rgba(224, 68, 64, 1)',
                        }}
                      />
                    </TitleIcon>
                    <Box display='flex' flexDirection='column'>
                      <Typography
                        fontSize='12px'
                        color='rgba(76, 78, 100, 0.6)'
                      >
                        Late delivery
                        <Chip
                          label='21%'
                          sx={{
                            height: '20px',
                            backgroundColor: 'rgba(224, 68, 64, 0.1)',
                            color: 'rgba(224, 68, 64, 1)',
                            marginLeft: '10px',
                            fontSize: '12px',
                          }}
                        />
                      </Typography>
                      <Typography
                        fontSize='16px'
                        fontWeight={600}
                        color='rgba(76, 78, 100, 0.87)'
                        sx={{ marginTop: '-2px' }}
                      >
                        13
                      </Typography>
                    </Box>
                  </Box>
                  <Box>
                    <Typography fontSize='12px'>
                      Average late submission time
                    </Typography>
                    <Typography fontSize='12px' color='rgba(255, 77, 73, 1)'>
                      01 day(s) 03 hour(s) 23 min(s)
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </GridItem>
        </Grid>
      </Grid>
    </ApexChartWrapper>
  )
}

const CurrencyAmount = ({ amounts }: { amounts: Array<number> }) => {
  const CurrencyItems = [
    { path: '/images/dashboard/img_usd.png', currency: '$' },
    { path: '/images/dashboard/img_krw.png', currency: '₩' },
    { path: '/images/dashboard/img_jpy.png', currency: '¥' },
    { path: '/images/dashboard/img_sgd.png', currency: 'SGD' },
  ]
  return (
    <>
      {amounts.map((amount, index) => (
        <Box display='flex' alignItems='center'>
          <img
            style={{ height: '32px' }}
            src={CurrencyItems[index].path}
            alt='us icon'
          />
          <span style={{ fontSize: '16px', padding: '0 3px' }}>
            {CurrencyItems[index].currency}
          </span>
          <Typography
            display='flex'
            alignItems='center'
            fontSize='20px'
            fontWeight={500}
            sx={{ width: '96px' }}
          >
            {amount.toLocaleString()}
          </Typography>
        </Box>
      ))}
    </>
  )
}

export default TADDashboards

TADDashboards.acl = {
  action: 'read',
  subject: 'client',
}
