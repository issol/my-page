import Grid from '@mui/material/Grid'
import {
  GridItem,
  ReportItem,
  SectionTitle,
  SubDateDescription,
} from '@src/pages/dashboards/components/dashboardItem'
import {
  Box,
  ButtonGroup,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from '@mui/material'
import dayjs from 'dayjs'
import {
  useDashboardReport,
  useDashboardRequest,
} from '@src/queries/dashboard/dashnaord-lpm'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import Switch from '@mui/material/Switch'
import Typography from '@mui/material/Typography'
import { Controller, useForm, useWatch } from 'react-hook-form'
import Button from '@mui/material/Button'
import DatePickerWrapper from '@src/@core/styles/libs/react-datepicker'
import DatePicker, { ReactDatePickerProps } from 'react-datepicker'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import React, { MouseEvent, useCallback, useState } from 'react'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'
import DownloadIcon from '@mui/icons-material/Download'
import DashboardDataGrid from '@src/pages/dashboards/components/dataGrid'
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'

// ** Custom Components Imports
import { useTheme } from '@mui/material/styles'
import DoughnutChart from '@src/pages/dashboards/components/doughnutChart'
import weekday from 'dayjs/plugin/weekday'
import {
  Colors,
  SecondColors,
  Status,
  StatusColor,
} from '@src/shared/const/dashboard/chart'
import {
  CategoryRatioItem,
  ExpertiseRatioItem,
  PairRatioItem,
  ServiceRatioItem,
} from '@src/types/dashboard'
dayjs.extend(weekday)

type SelectedRangeDate = 'month' | 'week' | 'today'
interface DashboardForm {
  dateRange?: Array<Date | null>
  view: 'company' | 'mine'
  viewSwitch: boolean
  userViewDate: string
  selectedRangeDate: SelectedRangeDate
}

const DEFAULT_START_DATE = dayjs().set('date', 1).toDate()
const DEFAULT_LAST_DATE = dayjs().set('date', dayjs().daysInMonth()).toDate()

const getRangeDateTitle = (date1: Date, date2: Date | null) => {
  const title = date2
    ? dayjs(date2).set('date', dayjs(date1).daysInMonth()).format('DD, YYYY ')
    : '-'
  return `${dayjs(date1).format('MMMM D')} - ${title}`
}

const getDateFormatter = (date1: Date, date2: Date | null) => {
  if (!date1) return

  if (date1 && !date2) {
    return `${dayjs(date1).format('MMMM D, YYYY')}`
  }

  if (!dayjs(date1).isSame(dayjs(date2), 'year')) {
    const title = date2 ? dayjs(date2).format('MMMM D, YYYY') : '-'
    return `${dayjs(date1).format('MMMM D, YYYY')} - ${title}`
  }

  if (!dayjs(date1).isSame(dayjs(date2), 'month')) {
    const title = date2 ? dayjs(date2).format('MMMM D, YYYY') : '-'
    return `${dayjs(date1).format('MMMM D')} - ${title}`
  }

  return `${dayjs(date1).format('MMMM D')} - ${dayjs(date2).format('D, YYYY')}`
}

const getDateFormat = (date: Date | null) => {
  if (!date) return dayjs().format('YYYY-MM-DD')
  return dayjs(date).format('YYYY-MM-DD')
}

const toCapitalize = (str: string) => {
  return str.replace(/\b\w/g, match => match.toUpperCase())
}

const Dashboards = () => {
  const theme = useTheme()
  const { control, setValue } = useForm<DashboardForm>({
    defaultValues: {
      view: 'mine',
      viewSwitch: false,
      dateRange: [DEFAULT_START_DATE, DEFAULT_LAST_DATE],
      userViewDate: getRangeDateTitle(DEFAULT_START_DATE, DEFAULT_LAST_DATE),
      selectedRangeDate: 'month',
    },
  })

  const [viewSwitch, dateRange, selectedRangeDate, userViewDate] = useWatch({
    control,
    name: ['viewSwitch', 'dateRange', 'selectedRangeDate', 'userViewDate'],
  })

  const { data: ReportData } = useDashboardReport({
    from: getDateFormat((Array.isArray(dateRange) && dateRange[0]) || null),
    to: getDateFormat((Array.isArray(dateRange) && dateRange[1]) || null),
  })

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const onChangeDateRange = useCallback(
    (type: SelectedRangeDate) => {
      setValue('selectedRangeDate', type)
      console.log('week', dayjs().weekday(-7).toDate())

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
    <ApexChartWrapper>
      <Grid
        container
        gap='24px'
        sx={{ minWidth: '1320px', overflowX: 'auto', padding: '10px' }}
      >
        <Grid container gap='24px'>
          <GridItem width={290} height={76}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Typography
                sx={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: !viewSwitch
                    ? 'rgba(102, 108, 255, 1)'
                    : 'rgba(189, 189, 189, 1)',
                }}
              >
                Company view
              </Typography>
              <div style={{ width: '40px' }}>
                <Controller
                  control={control}
                  name='viewSwitch'
                  defaultValue={false}
                  render={({ field: { onChange, value } }) => (
                    <Switch
                      size='small'
                      value={value}
                      inputProps={{ 'aria-label': 'controlled' }}
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
                      onChange={(event, val) => {
                        if (val) {
                          setValue('view', 'mine')
                        }
                        return onChange(val)
                      }}
                    />
                  )}
                />
              </div>
              <Typography
                sx={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: viewSwitch
                    ? 'rgba(102, 108, 255, 1)'
                    : 'rgba(189, 189, 189, 1)',
                }}
              >
                Personal view
              </Typography>
            </Box>
          </GridItem>
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
              <ButtonGroup
                color='primary'
                aria-label='date selecor button group'
              >
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
          <GridItem width={76} height={76}>
            <Box>
              <Button onClick={handleClick}>
                <MoreVertIcon
                  sx={{ width: '36px', color: 'rgba(76, 78, 100, 0.54)' }}
                />
              </Button>
              <Menu
                id='dashboard-menu'
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  'aria-labelledby': 'basic-button',
                }}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              >
                <MenuItem
                  onClick={handleClose}
                  sx={{
                    color: 'rgba(76, 78, 100, 0.87)',
                  }}
                >
                  <ListItemIcon
                    sx={{ color: 'rgba(76, 78, 100, 0.87)', margin: 0 }}
                  >
                    <DownloadIcon fontSize='small' />
                  </ListItemIcon>
                  <ListItemText>Download csv</ListItemText>
                </MenuItem>
                <MenuItem
                  onClick={handleClose}
                  sx={{
                    display: 'flex',
                    color: 'rgba(76, 78, 100, 0.87)',
                  }}
                >
                  <ListItemIcon
                    sx={{ color: 'rgba(76, 78, 100, 0.87)', margin: 0 }}
                  >
                    <RemoveRedEyeIcon fontSize='small' />
                  </ListItemIcon>
                  <ListItemText>View member dashboard</ListItemText>
                </MenuItem>
              </Menu>
            </Box>
          </GridItem>
        </Grid>
        <Grid container gap='24px'>
          <GridItem width={290} height={362}>
            <Box
              display='flex'
              flexDirection='column'
              sx={{ width: '100%', height: '100%' }}
            >
              <Box marginBottom='20px'>
                <SectionTitle>
                  <span className='title'>Report</span>
                  <ErrorOutlineIcon className='info_icon' />
                </SectionTitle>
                <SubDateDescription textAlign='left'>
                  {dayjs('2023-01-24').format('MMMM D, YYYY')}
                </SubDateDescription>
                <Box
                  component='ul'
                  display='flex'
                  flexDirection='column'
                  sx={{ padding: 0 }}
                >
                  {ReportData &&
                    Object.entries(ReportData).map(([key, value], index) => (
                      <ReportItem
                        key={`${key}-${index}`}
                        label={toCapitalize(Status[index])}
                        value={value}
                        color={StatusColor[index]}
                        isHidden={[
                          Object.entries(ReportData).length - 1,
                          3,
                        ].includes(index)}
                      />
                    ))}
                </Box>
              </Box>
            </Box>
          </GridItem>
          <GridItem height={362} sm padding='0'>
            <Box sx={{ width: '100%' }}>
              <Box marginBottom='20px' sx={{ padding: '10px 20px 0' }}>
                <SectionTitle>
                  <span className='title'>New requests</span>
                  <ErrorOutlineIcon className='info_icon' />
                </SectionTitle>
                <SubDateDescription textAlign='left'>
                  {dayjs('2023-01-24').format('MMMM D, YYYY')}
                </SubDateDescription>
              </Box>
              <DashboardDataGrid />
            </Box>
          </GridItem>
        </Grid>
        <Grid container spacing={5}>
          <DoughnutChart
            title='Clients'
            from={getDateFormat(
              (Array.isArray(dateRange) && dateRange[0]) || null,
            )}
            to={getDateFormat(
              (Array.isArray(dateRange) && dateRange[1]) || null,
            )}
            type='client'
            colors={Colors}
          />
          <DoughnutChart<PairRatioItem>
            title='Language pairs'
            from={getDateFormat(
              (Array.isArray(dateRange) && dateRange[0]) || null,
            )}
            to={getDateFormat(
              (Array.isArray(dateRange) && dateRange[1]) || null,
            )}
            type='language-pair'
            colors={SecondColors}
            getName={item => {
              console.log(item)
              return `${item?.sourceLanguage}->${item?.targetLanguage}`.toUpperCase()
            }}
          />
        </Grid>
        <Grid container spacing={5}>
          <DoughnutChart<CategoryRatioItem>
            title='Main categories'
            from={getDateFormat(
              (Array.isArray(dateRange) && dateRange[0]) || null,
            )}
            to={getDateFormat(
              (Array.isArray(dateRange) && dateRange[1]) || null,
            )}
            type='category'
            colors={Colors}
            getName={item => {
              return `${item?.category || '-'}`
            }}
          />
          <DoughnutChart<ServiceRatioItem>
            title='Service types'
            from={getDateFormat(
              (Array.isArray(dateRange) && dateRange[0]) || null,
            )}
            to={getDateFormat(
              (Array.isArray(dateRange) && dateRange[1]) || null,
            )}
            type='service-type'
            colors={SecondColors}
            getName={item => {
              return `${item?.serviceType || '-'}`
            }}
          />
        </Grid>
        <Grid container spacing={5}>
          <DoughnutChart<ExpertiseRatioItem>
            title='Area of expertises'
            from={getDateFormat(
              (Array.isArray(dateRange) && dateRange[0]) || null,
            )}
            to={getDateFormat(
              (Array.isArray(dateRange) && dateRange[1]) || null,
            )}
            type='expertise'
            colors={Colors}
            getName={item => {
              return `${item?.expertise || '-'}`
            }}
          />
        </Grid>
      </Grid>
    </ApexChartWrapper>
  )
}

export default Dashboards

Dashboards.acl = {
  action: 'read',
  subject: 'members',
}
