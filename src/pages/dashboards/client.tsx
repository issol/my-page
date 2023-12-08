import Grid from '@mui/material/Grid'
import {
  ConvertButtonGroup,
  GridItem,
  LinearMultiProgress,
  ReportItem,
  SectionTitle,
  SubDateDescription,
  TableStatusCircle,
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
import { Controller, FormProvider, useForm, useWatch } from 'react-hook-form'
import Button from '@mui/material/Button'
import DatePickerWrapper from '@src/@core/styles/libs/react-datepicker'
import DatePicker from 'react-datepicker'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import React, { MouseEvent, useCallback, useEffect, useState } from 'react'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'
import DownloadIcon from '@mui/icons-material/Download'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'

// ** Custom Components Imports
import DoughnutChart from '@src/views/dashboard/doughnutChart'
import weekday from 'dayjs/plugin/weekday'
import {
  Colors,
  SecondColors,
  StatusColor,
} from '@src/shared/const/dashboard/chart'
import {
  CategoryRatioItem,
  Currency,
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
import { LogoutOutlined, ReceiptLong } from '@mui/icons-material'
import { StatusOrderColumns } from '@src/shared/const/columns/dashboard'
import styled from '@emotion/styled'
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
import ChartDateHeader from '@src/views/dashboard/chartDateHeader'

dayjs.extend(weekday)

const StyledTableRow = styled(TableRow)(() => ({
  '&': {
    height: '44px',
  },
}))

const StyledTableCell = styled(TableCell)(() => {
  return {
    padding: '0 !important',
    border: 'none',
    fontSize: '14px',
    fontWeight: '600 !important',

    '& > span': {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    },

    '& .ratio': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '48px',
      height: '20px',
      borderRadius: '64px',
      color: '#fff',
      backgroundColor: 'rgba(109, 120, 141, 1)',
    },
  }
})

const HeaderTableCell = styled(TableCell)(() => {
  return {
    padding: '0 !important',
    fontWeight: '500 !important',
    fontSize: '12px',
    textTransform: 'capitalize',
  }
})

const TableStatusColor = [
  'rgba(60, 61, 91, 1)',
  'rgba(114, 225, 40, 1)',
  'rgba(224, 68, 64, 1)',
  'rgba(224, 224, 224, 1)',
]

const rows = [
  {
    name: 'Invoiced',
    count: 123,
    sum: 123,
    sortingOrder: 1,
  },
  {
    name: 'Paid',
    count: 123,
    sum: 123,
    sortingOrder: 2,
  },
  {
    name: 'Overdue',
    count: 123,
    sum: 123,
    sortingOrder: 3,
  },
  {
    name: 'Canceled',
    count: 123,
    sum: 123,
    sortingOrder: 4,
  },
]

const ClientDashboards = () => {
  const queryClient = useQueryClient()
  const [currency, setCurrency] = useState<Currency>('convertedToUSD')

  const { contents: auth, state: authFetchState } =
    useRecoilValueLoadable(authState)
  const { contents: role, state: roleFetchState } =
    useRecoilValueLoadable(currentRoleSelector)
  const [state, setState] = useRecoilState(dashboardState)

  const { control, setValue, ...props } = useForm<DashboardForm>({
    defaultValues: {
      viewSwitch: false, // true = company - false = personal
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

  const onChangeCurrency = (type: Currency) => {
    setCurrency(type)
  }

  return (
    <FormProvider {...props} setValue={setValue} control={control}>
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
                          checked={value}
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
            {!memberView && (
              <GridItem width={290} height={375}>
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
                      {userViewDate}
                    </SubDateDescription>
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
                              label={toCapitalize(key)}
                              value={value}
                              color={StatusColor[index]}
                              isHidden={[
                                Object.entries(ReportData).length - 1,
                              ].includes(index)}
                            />
                          ),
                        )}
                    </Box>
                  </Box>
                </Box>
              </GridItem>
            )}
            <GridItem height={375} sm padding='20px'>
              <Box sx={{ width: '100%', height: '100%' }}>
                <Box>
                  <SectionTitle>
                    <span className='title'>Invoices</span>
                    <ErrorOutlineIcon className='info_icon' />
                  </SectionTitle>
                  <SubDateDescription textAlign='left'>
                    {userViewDate}
                  </SubDateDescription>
                  <Box display='flex' justifyContent='flex-end'>
                    <ConvertButtonGroup onChangeCurrency={onChangeCurrency} />
                  </Box>
                </Box>
                <Box display='flex'>
                  <Box sx={{ width: '50%', padding: '40px 20px 40px 0' }}>
                    <Box display='flex' alignItems='center' gap='16px'>
                      {/*<TitleIcon>*/}
                      {/*  <ReceiptLong className='icon' />*/}
                      {/*</TitleIcon>*/}
                      <Box display='flex' flexDirection='column'>
                        <Typography
                          fontWeight={500}
                          fontSize='34px'
                          letterSpacing='0.25px'
                          lineHeight='40px'
                        >{`5,200`}</Typography>
                        <Typography
                          fontSize='12px'
                          color='rgba(76, 78, 100, 0.6)'
                        >
                          In total
                        </Typography>
                      </Box>
                    </Box>
                    {/*<LinearMultiProgress />*/}
                  </Box>
                  <Box sx={{ width: '50%', marginLeft: '40px' }}>
                    <Table sx={{ height: '240px' }} aria-label='invoices table'>
                      <TableHead>
                        <StyledTableRow>
                          <HeaderTableCell>Status</HeaderTableCell>
                          <HeaderTableCell align='center'>
                            Count
                          </HeaderTableCell>
                          <HeaderTableCell align='right'>
                            Prices
                          </HeaderTableCell>
                        </StyledTableRow>
                      </TableHead>
                      <TableBody>
                        {rows.map((row, index) => (
                          <StyledTableRow key={row.name}>
                            <StyledTableCell>
                              <span>
                                <TableStatusCircle
                                  color={TableStatusColor[index]}
                                />
                                {row.name}
                              </span>
                            </StyledTableCell>
                            <StyledTableCell align='center' scope='row'>
                              {row.count}
                            </StyledTableCell>
                            <StyledTableCell>
                              <span style={{ justifyContent: 'flex-end' }}>
                                {row.sum}
                                <span className='ratio'>{`${
                                  row.sum / 3000
                                }%`}</span>
                              </span>
                            </StyledTableCell>
                          </StyledTableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Box>
                </Box>
              </Box>
            </GridItem>
            {memberView && (
              <GridItem width='269px' height={375} padding='0'>
                <img
                  src='/images/dashboard/img_member_view.png'
                  alt='img'
                  style={{ width: '110%' }}
                />
              </GridItem>
            )}
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
          <Grid container spacing={5}>
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
                console.log(item)
                return `${item?.sourceLanguage}->${item?.targetLanguage}`.toUpperCase()
              }}
            />
            <DoughnutChart<CategoryRatioItem>
              userViewDate={userViewDate}
              title='Categories'
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
          </Grid>
          <Grid container spacing={5}>
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
      </ApexChartWrapper>
    </FormProvider>
  )
}

export default ClientDashboards

ClientDashboards.acl = {
  action: 'read',
  subject: 'members',
}
