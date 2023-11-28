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
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material'
import dayjs from 'dayjs'
import { useDashboardReport } from '@src/queries/dashboard/dashnaord-lpm'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import Switch from '@mui/material/Switch'
import Typography from '@mui/material/Typography'
import { Controller, useForm, useWatch } from 'react-hook-form'
import Button from '@mui/material/Button'
import DatePickerWrapper from '@src/@core/styles/libs/react-datepicker'
import DatePicker, { ReactDatePickerProps } from 'react-datepicker'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { useState, MouseEvent } from 'react'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'
import DownloadIcon from '@mui/icons-material/Download'

type SelectedRangeDate = 'month' | 'week' | 'today'
interface DashboardForm {
  dateRange?: Array<Date>
  view: 'company' | 'mine'
  viewSwitch: boolean
  userViewDate: string
  selectedRangeDate: SelectedRangeDate
}

const DEFAULT_START_DATE = dayjs().set('date', 1).toDate()
const DEFAULT_LAST_DATE = dayjs().set('date', dayjs().daysInMonth()).toDate()
const Dashboards = () => {
  const { control, setValue } = useForm<DashboardForm>({
    defaultValues: {
      view: 'mine',
      viewSwitch: false,
      dateRange: [DEFAULT_START_DATE, DEFAULT_LAST_DATE],
      userViewDate: `${dayjs(DEFAULT_START_DATE).format('MMMM D - ')}${dayjs(
        DEFAULT_LAST_DATE,
      )
        .set('date', dayjs().daysInMonth())
        .format('DD, YYYY ')}`,
      selectedRangeDate: 'month',
    },
  })

  const [calendarOptions, setCalendarOptions] = useState({
    selectsRange: true,
    showMonthYearPicker: true,
  })

  const [viewSwitch, dateRange, selectedRangeDate, userViewDate] = useWatch({
    control,
    name: ['viewSwitch', 'dateRange', 'selectedRangeDate', 'userViewDate'],
  })

  const { data } = useDashboardReport({ from: '2023-01-01', to: '2023-01-05' })

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  const onChangeDateRange = (type: SelectedRangeDate) => {
    setValue('selectedRangeDate', type)

    switch (type) {
      case 'month':
        setCalendarOptions({
          selectsRange: false,
          showMonthYearPicker: true,
        })
        break
      case 'today':
        setCalendarOptions({
          selectsRange: false,
          showMonthYearPicker: false,
        })
        break
      case 'week':
        setCalendarOptions({
          selectsRange: true,
          showMonthYearPicker: false,
        })
        break
      default:
        setCalendarOptions({
          selectsRange: true,
          showMonthYearPicker: true,
        })
        break
    }
  }

  const onChangeDatePicker = (
    date: Date | Array<Date | null> | null,
    onChange: (date: Date | Array<Date | null> | null) => void,
  ) => {
    if (Array.isArray(date)) {
      onChange(date)
    } else {
      onChange([date, date])
    }
  }

  return (
    <Grid container gap='24px' sx={{ minWidth: '1280px', overflowX: 'scroll' }}>
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
                color: viewSwitch
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
                color: !viewSwitch
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
                    {...calendarOptions}
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
                {data &&
                  Object.entries(data).map(([key, value], index) => (
                    <ReportItem
                      key={`${key}-${index}`}
                      label={key}
                      value={value}
                      color='#FDB528'
                      isHidden={[Object.entries(data).length - 1, 3].includes(
                        index,
                      )}
                    />
                  ))}
              </Box>
            </Box>
          </Box>
        </GridItem>
        <GridItem height={362} sm>
          <div>sdfd</div>
        </GridItem>
      </Grid>
    </Grid>
  )
}

export default Dashboards

Dashboards.acl = {
  action: 'read',
  subject: 'members',
}
