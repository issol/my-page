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
  DEFAULT_QUERY_NAME,
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
import React, { MouseEvent, useCallback, useEffect, useState } from 'react'
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
  ViewMode,
} from '@src/types/dashboard'
import StatusAndList from '@src/pages/dashboards/components/statusAndList'
import { useRecoilState, useRecoilValueLoadable } from 'recoil'
import { authState } from '@src/states/auth'
import { currentRoleSelector } from '@src/states/permission'
import { dashboardState } from '@src/states/dashboard'
import { useRouter } from 'next/router'
import { useQueryClient } from 'react-query'
import CopyOrdersList from '@src/pages/orders/order-list/components/copy-order-list'
import useModal from '@src/hooks/useModal'
import MemberSearchList from '@src/pages/dashboards/components/member-search'
import { PermissionChip } from '@src/@core/components/chips/chips'
import { LogoutOutlined } from '@mui/icons-material'
dayjs.extend(weekday)

type SelectedRangeDate = 'month' | 'week' | 'today'

interface DashboardForm {
  dateRange?: Array<Date | null>
  view: ViewMode
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
  const queryClient = useQueryClient()

  const { contents: auth, state: authFetchState } =
    useRecoilValueLoadable(authState)
  const { contents: role, state: roleFetchState } =
    useRecoilValueLoadable(currentRoleSelector)
  const [state, setState] = useRecoilState(dashboardState)

  const { control, setValue } = useForm<DashboardForm>({
    defaultValues: {
      viewSwitch: false, // true = company - false = personal
      dateRange: [DEFAULT_START_DATE, DEFAULT_LAST_DATE],
      userViewDate: getRangeDateTitle(DEFAULT_START_DATE, DEFAULT_LAST_DATE),
      selectedRangeDate: 'month',
    },
  })

  const [dateRange, selectedRangeDate, userViewDate] = useWatch({
    control,
    name: ['dateRange', 'selectedRangeDate', 'userViewDate'],
  })

  const { data: ReportData } = useDashboardReport({
    from: getDateFormat((Array.isArray(dateRange) && dateRange[0]) || null),
    to: getDateFormat((Array.isArray(dateRange) && dateRange[1]) || null),
  })

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [memberView, setMemberView] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)
  const open = Boolean(anchorEl)
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  useEffect(() => {
    if (authFetchState !== 'hasValue' || roleFetchState !== 'hasValue') return
    if (state.view !== null) return

    if (role?.type === 'Master' || role?.type === 'Manager') {
      setState({
        view: 'company',
        userId: auth?.user?.id || null,
        role: role?.type,
      })
      setValue('view', 'company')
      setValue('viewSwitch', true)
    } else {
      setState({
        view: 'personal',
        userId: auth?.user?.id || null,
        role: role?.type,
      })
      setValue('view', 'personal')
      setValue('viewSwitch', false)
    }
  }, [])

  useEffect(() => {
    if (state.userInfo) {
      setMemberView(true)
      return
    }

    setMemberView(false)
  }, [state.userInfo])

  const onChangeViewMode = async (val: boolean) => {
    if (val) {
      setState({ ...state, view: 'personal' })
    } else {
      setState({ ...state, view: 'company' })
    }
    await queryClient.invalidateQueries({
      queryKey: [DEFAULT_QUERY_NAME],
    })
  }

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

  const onChangeMemberView = () => {
    setOpenDialog(true)
    handleClose()
  }

  const onChangeMyDashboard = async () => {
    handleClose()
    setState({
      ...state,
      userId: auth?.user?.id || null || state.userId,
      userInfo: undefined,
    })

    await queryClient.invalidateQueries(DEFAULT_QUERY_NAME)
  }

  return (
    <ApexChartWrapper>
      <Grid
        container
        gap='24px'
        sx={{ minWidth: '1320px', overflowX: 'auto', padding: '10px' }}
      >
        <Grid container gap='24px'>
          {memberView ? (
            <GridItem width={420} height={76}>
              <Box sx={{ width: '100%' }}>
                <Box display='flex' gap='16px' alignItems='center'>
                  <Typography fontSize='24px' fontWeight={500}>
                    {`${state.userInfo?.firstName}`}
                    {state.userInfo?.middleName &&
                      `(${state.userInfo?.middleName})`}{' '}
                    {state.userInfo?.lastName}
                  </Typography>
                  {PermissionChip(state.userInfo?.type || 'General')}
                </Box>
                <Typography fontSize='14px' color='rgba(76, 78, 100, 0.6)'>
                  {`${state.userInfo?.department || '-'} | ${
                    state.userInfo?.jobTitle || '-'
                  }`}
                </Typography>
              </Box>
            </GridItem>
          ) : (
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
                    color:
                      state.view === 'company'
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
                          onChangeViewMode(val)
                          onChange(val)
                        }}
                      />
                    )}
                  />
                </div>
                <Typography
                  sx={{
                    fontSize: '14px',
                    fontWeight: 600,
                    color:
                      state.view === 'personal'
                        ? 'rgba(102, 108, 255, 1)'
                        : 'rgba(189, 189, 189, 1)',
                  }}
                >
                  Personal view
                </Typography>
              </Box>
            </GridItem>
          )}
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
                  onClick={() => onChangeMemberView()}
                  sx={{
                    display:
                      role?.type === 'Master' || role?.type === 'Manager'
                        ? 'flex'
                        : 'none',
                    color: 'rgba(76, 78, 100, 0.87)',
                  }}
                >
                  <ListItemIcon
                    sx={{ color: 'rgba(76, 78, 100, 0.87)', margin: 0 }}
                  >
                    <RemoveRedEyeIcon fontSize='small' />
                  </ListItemIcon>
                  <ListItemText>
                    {memberView ? 'Change Member' : 'View member dashboard'}
                  </ListItemText>
                </MenuItem>
                {memberView && (
                  <MenuItem
                    onClick={() => onChangeMyDashboard()}
                    sx={{
                      display: 'flex',
                      color: 'rgba(76, 78, 100, 0.87)',
                    }}
                  >
                    <ListItemIcon
                      sx={{ color: 'rgba(76, 78, 100, 0.87)', margin: 0 }}
                    >
                      <LogoutOutlined fontSize='small' />
                    </ListItemIcon>
                    <ListItemText>Back to my dashboard</ListItemText>
                  </MenuItem>
                )}
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
              </Box>
              <DashboardDataGrid />
            </Box>
          </GridItem>
        </Grid>
        <StatusAndList
          type='order'
          from={getDateFormat(
            (Array.isArray(dateRange) && dateRange[0]) || null,
          )}
          to={getDateFormat((Array.isArray(dateRange) && dateRange[1]) || null)}
        />
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
      <MemberSearchList
        open={openDialog}
        onClose={() => setOpenDialog(false)}
      />
    </ApexChartWrapper>
  )
}

export default Dashboards

Dashboards.acl = {
  action: 'read',
  subject: 'members',
}
