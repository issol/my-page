import Grid from '@mui/material/Grid'
import {
  GridItem,
  OnboardingList,
  ReportItem,
  SectionTitle,
  SubDateDescription,
  TitleIcon,
} from '@src/views/dashboard/dashboardItem'
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
} from '@src/queries/dashboard/dashnaord-lpm'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import Switch from '@mui/material/Switch'
import Typography from '@mui/material/Typography'
import { Controller, useForm, useWatch } from 'react-hook-form'
import Button from '@mui/material/Button'
import DatePickerWrapper from '@src/@core/styles/libs/react-datepicker'
import DatePicker from 'react-datepicker'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import React, { MouseEvent, useCallback, useEffect, useState } from 'react'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'
import DownloadIcon from '@mui/icons-material/Download'
import DashboardDataGrid from '@src/views/dashboard/dataGrid'
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'

// ** Custom Components Imports
import DoughnutChart from '@src/views/dashboard/doughnutChart'
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
import StatusAndList from '@src/views/dashboard/statusAndList'
import { useRecoilState, useRecoilValueLoadable } from 'recoil'
import { authState } from '@src/states/auth'
import { currentRoleSelector } from '@src/states/permission'
import { dashboardState } from '@src/states/dashboard'
import { useQueryClient } from 'react-query'
import MemberSearchList from '@src/views/dashboard/member-search'
import { PermissionChip } from '@src/@core/components/chips/chips'
import {
  KeyboardArrowRight,
  LogoutOutlined,
  ReceiptLong,
} from '@mui/icons-material'
import {
  RecruitingRequestColumns,
  StatusJobColumns,
  StatusOrderColumns,
} from '@src/shared/const/columns/dashboard'
import { useRouter } from 'next/router'
import {
  DashboardForm,
  DEFAULT_LAST_DATE,
  DEFAULT_START_DATE,
  getDateFormat,
  getDateFormatter,
  getRangeDateTitle,
  SelectedRangeDate,
  toCapitalize,
} from '@src/pages/dashboards/lpm'
import BarChart from '@src/views/dashboard/barChart'
import JobDataTable from '@src/views/dashboard/jobDataTable'

dayjs.extend(weekday)

const TADDashboards = () => {
  const queryClient = useQueryClient()
  const router = useRouter()

  const { contents: auth, state: authFetchState } =
    useRecoilValueLoadable(authState)
  const { contents: role, state: roleFetchState } =
    useRecoilValueLoadable(currentRoleSelector)
  const [state, setState] = useRecoilState(dashboardState)

  const { control, setValue } = useForm<DashboardForm>({
    defaultValues: {
      dateRange: [DEFAULT_START_DATE, DEFAULT_LAST_DATE],
      userViewDate: getRangeDateTitle(DEFAULT_START_DATE, DEFAULT_LAST_DATE),
      selectedRangeDate: 'month',
      viewSwitch: true,
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

    if (role?.type === 'Master' || role?.type === 'Manager') {
      setState({
        view: 'company',
        userId: auth?.user?.id || null,
        role: role?.type,
      })
      setValue('view', 'company')
      setValue('viewSwitch', false)
    } else {
      setState({
        view: 'personal',
        userId: auth?.user?.id || null,
        role: role?.type,
      })
      setValue('view', 'personal')
      setValue('viewSwitch', true)
    }
  }, [])

  useEffect(() => {
    if (state.userInfo) {
      setMemberView(true)
      return
    }

    setMemberView(false)
  }, [state.userInfo])

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
    <ApexChartWrapper>
      <Grid container gap='24px' sx={{ minWidth: '1320px', padding: '10px' }}>
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
        <GridItem width={207} height={76}>
          <Box>
            <Button
              variant='contained'
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              <DownloadIcon sx={{ width: '20px', marginRight: '4px' }} />{' '}
              Download csv
            </Button>
          </Box>
        </GridItem>
      </Grid>
      <Grid
        container
        gap='24px'
        sx={{
          minWidth: '1320px',
          height: 'calc(100vh - 220px)',
          overflowX: 'auto',
          overFlowY: 'scroll',
          padding: '10px',
        }}
      >
        <Grid container gap='24px'>
          <GridItem width={490} height={267}>
            <Box sx={{ width: '100%' }}>
              <Box sx={{ margin: '20px 0' }}>
                <SectionTitle>
                  <span
                    role='button'
                    className='title'
                    onClick={() => router.push('/quotes/lpm/requests/')}
                  >
                    Onboarding overview
                  </span>
                  <ErrorOutlineIcon className='info_icon' />
                  <KeyboardArrowRight className='arrow_icon' />
                </SectionTitle>
              </Box>
              <OnboardingList />
            </Box>
          </GridItem>
          <GridItem sm height={267} padding='0px'>
            <Box sx={{ width: '100%', marginTop: '20px' }}>
              <Box sx={{ padding: '0 20px' }}>
                <SectionTitle>
                  <span
                    role='button'
                    className='title'
                    onClick={() => router.push('/quotes/lpm/requests/')}
                  >
                    Recruiting requests
                  </span>
                  <ErrorOutlineIcon className='info_icon' />
                  <KeyboardArrowRight className='arrow_icon' />
                </SectionTitle>
              </Box>
              <DashboardDataGrid
                type='new'
                sectionHeight={210}
                pageNumber={3}
                movePage={(id: number) => ''}
                columns={RecruitingRequestColumns}
              />
            </Box>
          </GridItem>
        </Grid>
        <Grid container gap='24px'>
          <GridItem width={490} height={496}>
            <Box sx={{ width: '100%', height: '100%', marginTop: '20px' }}>
              <Box>
                <SectionTitle>
                  <span
                    role='button'
                    className='title'
                    onClick={() => router.push('/quotes/lpm/requests/')}
                  >
                    Language pool
                  </span>
                  <ErrorOutlineIcon className='info_icon' />
                  <KeyboardArrowRight className='arrow_icon' />
                </SectionTitle>
                <SubDateDescription textAlign='left'>
                  Total 210 Language pairs
                </SubDateDescription>
              </Box>
              <BarChart />
            </Box>
          </GridItem>
          <GridItem sm height={496} padding='0'>
            <Box sx={{ width: '100%', height: '100%', marginTop: '20px' }}>
              <Box sx={{ padding: '20px 20px 10px' }}>
                <SectionTitle>
                  <span
                    role='button'
                    className='title'
                    onClick={() => router.push('/quotes/lpm/requests/')}
                  >
                    Job type/Role pool
                  </span>
                  <ErrorOutlineIcon className='info_icon' />
                  <KeyboardArrowRight className='arrow_icon' />
                </SectionTitle>
                <SubDateDescription textAlign='left'>
                  Total 210 Job type/Role
                </SubDateDescription>
              </Box>
              <JobDataTable />
            </Box>
          </GridItem>
        </Grid>
        <StatusAndList
          userViewDate={userViewDate}
          type='order'
          statusColumn={StatusOrderColumns}
          initSort={[
            {
              field: 'category',
              sort: 'desc',
            },
          ]}
          from={getDateFormat(
            (Array.isArray(dateRange) && dateRange[0]) || null,
          )}
          to={getDateFormat((Array.isArray(dateRange) && dateRange[1]) || null)}
        />

        <Grid container spacing={5}>
          <DoughnutChart
            userViewDate={userViewDate}
            title='Applied job types'
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
            userViewDate={userViewDate}
            title='Applied roles'
            from={getDateFormat(
              (Array.isArray(dateRange) && dateRange[0]) || null,
            )}
            to={getDateFormat(
              (Array.isArray(dateRange) && dateRange[1]) || null,
            )}
            type='language-pair'
            colors={SecondColors}
            getName={item => {
              return `${item?.sourceLanguage}->${item?.targetLanguage}`.toUpperCase()
            }}
          />
        </Grid>
        <Grid container spacing={5}>
          <DoughnutChart<CategoryRatioItem>
            userViewDate={userViewDate}
            title='Applied source languages'
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
            userViewDate={userViewDate}
            title='Applied target languages'
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
      </Grid>
      <MemberSearchList
        open={openDialog}
        onClose={() => setOpenDialog(false)}
      />
    </ApexChartWrapper>
  )
}

export default TADDashboards

TADDashboards.acl = {
  action: 'read',
  subject: 'client',
}
