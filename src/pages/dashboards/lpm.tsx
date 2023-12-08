import Grid from '@mui/material/Grid'
import {
  ConvertButtonGroup,
  GridItem,
  ReportItem,
  SectionTitle,
  SubDateDescription,
  Title,
  TotalValueView,
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
import { Controller, FormProvider, useForm, useWatch } from 'react-hook-form'
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
  Currency,
  ExpertiseRatioItem,
  PairRatioItem,
  ServiceRatioItem,
  ViewMode,
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
  Archive,
  KeyboardArrowRight,
  LogoutOutlined,
  MonetizationOn,
} from '@mui/icons-material'
import {
  RequestColumns,
  StatusJobColumns,
  StatusOrderColumns,
} from '@src/shared/const/columns/dashboard'
import Image from 'next/image'
import { useRouter } from 'next/router'
import useInfoDialog from '@src/hooks/useInfoDialog'
import InfoDialog from '@src/views/dashboard/infoDialog'
import TotalChart from '@src/views/dashboard/totalChart'
import ChartDateHeader from '@src/views/dashboard/chartDateHeader'

dayjs.extend(weekday)

export const DEFAULT_START_DATE = dayjs().set('date', 1).toDate()
export const DEFAULT_LAST_DATE = dayjs()
  .set('date', dayjs().daysInMonth())
  .toDate()

export const getRangeDateTitle = (date1: Date, date2: Date | null) => {
  const title = date2
    ? dayjs(date2).set('date', dayjs(date1).daysInMonth()).format('DD, YYYY ')
    : '-'
  return `${dayjs(date1).format('MMMM D')} - ${title}`
}

export const getDateFormatter = (date1: Date, date2: Date | null) => {
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

export const getDateFormat = (date: Date | null) => {
  if (!date) return dayjs().format('YYYY-MM-DD')
  return dayjs(date).format('YYYY-MM-DD')
}

export const toCapitalize = (str: string) => {
  return str.replace(/\b\w/g, match => match.toUpperCase())
}

export type SelectedRangeDate = 'month' | 'week' | 'today'

export interface DashboardForm {
  dateRange?: Array<Date | null>
  view: ViewMode
  viewSwitch: boolean
  userViewDate: string
  selectedRangeDate: SelectedRangeDate
}

const LPMDashboards = () => {
  const queryClient = useQueryClient()
  const router = useRouter()

  const { contents: auth, state: authFetchState } =
    useRecoilValueLoadable(authState)
  const { contents: role, state: roleFetchState } =
    useRecoilValueLoadable(currentRoleSelector)
  const [state, setState] = useRecoilState(dashboardState)

  const { control, setValue, ...props } = useForm<DashboardForm>({
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
  const [currency, setCurrency] = useState<Currency>('convertedToUSD')
  const [infoOpen, key, setOpenInfoDialog, close] = useInfoDialog()
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

  const isPermissionMemberView = () => {
    if (role?.name !== 'LPM') return false
    return role?.type === 'Master' || role?.type === 'Manager'
  }

  const onChangeCurrency = (type: Currency) => {
    setCurrency(type)
  }

  return (
    <FormProvider {...props} setValue={setValue} control={control}>
      <ApexChartWrapper>
        <Grid
          container
          gap='24px'
          sx={{
            padding: '10px',
          }}
        >
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
                    defaultValue={viewSwitch}
                    render={({ field: { onChange, value } }) => (
                      <Switch
                        size='small'
                        inputProps={{ 'aria-label': 'controlled' }}
                        checked={value}
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
                          onChange(val)
                          onChangeViewMode(val)
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
          <ChartDateHeader />
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
                    display: isPermissionMemberView() ? 'flex' : 'none',
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
          <Grid container gap='24px'>
            {!memberView && (
              <GridItem width={290} height={362}>
                <Box
                  display='flex'
                  flexDirection='column'
                  sx={{ width: '100%', height: '100%' }}
                >
                  <Box marginBottom='20px'>
                    <Title
                      title='Report'
                      openDialog={() => setOpenInfoDialog(true, 'Report')}
                    />

                    <Box
                      component='ul'
                      display='flex'
                      flexDirection='column'
                      sx={{ padding: 0 }}
                    >
                      {ReportData &&
                        Object.entries(ReportData).map(
                          ([key, value], index) => (
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
                          ),
                        )}
                    </Box>
                  </Box>
                </Box>
              </GridItem>
            )}
            {!memberView && (
              <GridItem height={362} sm padding='0'>
                <Box sx={{ width: '100%' }}>
                  <Title
                    title='New requests'
                    padding='10px 20px 0'
                    marginBottom='20px'
                    handleClick={() => router.push('/quotes/lpm/requests/')}
                    openDialog={setOpenInfoDialog}
                  />
                  <DashboardDataGrid
                    type='new'
                    pageNumber={4}
                    movePage={(id: number) => ''}
                    columns={RequestColumns}
                  />
                </Box>
              </GridItem>
            )}

            {/*{memberView && (*/}
            {/*  <GridItem width='269px' height={362} padding='0'>*/}
            {/*    <img*/}
            {/*      src='/images/dashboard/img_member_view.png'*/}
            {/*      alt='img'*/}
            {/*      style={{ width: '110%' }}*/}
            {/*    />*/}
            {/*  </GridItem>*/}
            {/*)}*/}
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
            to={getDateFormat(
              (Array.isArray(dateRange) && dateRange[1]) || null,
            )}
          />
          <StatusAndList
            userViewDate={userViewDate}
            type='job'
            statusColumn={StatusJobColumns}
            initSort={[
              {
                field: 'proName',
                sort: 'desc',
              },
            ]}
            from={getDateFormat(
              (Array.isArray(dateRange) && dateRange[0]) || null,
            )}
            to={getDateFormat(
              (Array.isArray(dateRange) && dateRange[1]) || null,
            )}
          />
          <Grid container gap='24px'>
            <GridItem height={229} xs={6}>
              <Box sx={{ width: '100%', height: '100%' }}>
                <Box>
                  <Title
                    title='Receivables - Paid this month'
                    handleClick={() => router.push('/quotes/lpm/requests/')}
                    openDialog={setOpenInfoDialog}
                  />
                  <Box display='flex' justifyContent='flex-end'>
                    <ConvertButtonGroup onChangeCurrency={onChangeCurrency} />
                  </Box>
                </Box>
                <TotalValueView
                  label='Paid this month'
                  amountLabel='Receivable amount'
                  countLabel='Counts'
                />
              </Box>
            </GridItem>
            <GridItem height={229} sm>
              <Box sx={{ width: '100%', height: '100%' }}>
                <Box>
                  <Title
                    title='Payables - Paid this month'
                    openDialog={setOpenInfoDialog}
                  />
                  <Box display='flex' justifyContent='flex-end'>
                    <ConvertButtonGroup onChangeCurrency={onChangeCurrency} />
                  </Box>
                </Box>
                <TotalValueView
                  label='Paid this month'
                  amountLabel='Receivable amount'
                  countLabel='Counts'
                />
              </Box>
            </GridItem>
          </Grid>
          <Grid container gap='24px'>
            <GridItem height={525} xs={6}>
              <TotalChart
                title='Receivables - Total'
                iconColor='114, 225, 40'
                icon={Archive}
                setOpenInfoDialog={setOpenInfoDialog}
              />
            </GridItem>
            <GridItem height={525} sm>
              <TotalChart
                title='Payables - Total'
                icon={MonetizationOn}
                iconColor='102, 108, 255'
                setOpenInfoDialog={setOpenInfoDialog}
              />
            </GridItem>
          </Grid>
          <Grid container>
            <GridItem height={362} sm padding='0px'>
              <Box sx={{ width: '100%', height: '100%' }}>
                <Title
                  marginBottom='20px'
                  padding='20px'
                  title='Long-standing receivables - Action required'
                  prefix='🚨 '
                  postfix=' (32)'
                  openDialog={setOpenInfoDialog}
                />
                <Box>sd</Box>
              </Box>
            </GridItem>
          </Grid>
          <Grid container>
            <GridItem height={362} sm padding='0px'>
              <Box sx={{ width: '100%', height: '100%' }}>
                <Title
                  marginBottom='20px'
                  padding='20px'
                  title='Long-standing payables - Action required'
                  prefix='🚨 '
                  postfix=' (22)'
                  openDialog={setOpenInfoDialog}
                />
                <Box>sd</Box>
              </Box>
            </GridItem>
          </Grid>
          <Grid container spacing={5}>
            <DoughnutChart
              userViewDate={userViewDate}
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
              userViewDate={userViewDate}
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
                return `${item?.sourceLanguage}->${item?.targetLanguage}`.toUpperCase()
              }}
            />
          </Grid>
          <Grid container spacing={5}>
            <DoughnutChart<CategoryRatioItem>
              userViewDate={userViewDate}
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
              userViewDate={userViewDate}
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
              userViewDate={userViewDate}
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
        <InfoDialog
          open={infoOpen}
          keyName={key}
          infoType='LPM'
          close={close}
        />
      </ApexChartWrapper>
    </FormProvider>
  )
}

export default LPMDashboards

LPMDashboards.acl = {
  action: 'read',
  subject: 'client',
}
