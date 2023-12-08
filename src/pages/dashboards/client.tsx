import Grid from '@mui/material/Grid'
import {
  ConvertButtonGroup,
  GridItem,
  ReportItem,
  SectionTitle,
  SubDateDescription,
  TableStatusCircle,
} from '@src/views/dashboard/dashboardItem'
import { Box } from '@mui/material'
import dayjs from 'dayjs'
import { useDashboardReport } from '@src/queries/dashboard/dashnaord-lpm'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import Typography from '@mui/material/Typography'
import { FormProvider, useWatch } from 'react-hook-form'
import React, { useState } from 'react'
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
import { StatusOrderColumns } from '@src/shared/const/columns/dashboard'
import styled from '@emotion/styled'
import { getDateFormat, toCapitalize } from '@src/pages/dashboards/lpm'
import UseDashboardControl from '@src/hooks/useDashboardControl'
import SwitchTypeHeader from '@src/views/dashboard/header/SwitchType'

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
  const { formHook, infoDialog, memberView } = UseDashboardControl()
  const { control, setValue, ...props } = formHook
  const { isShowMemberView, showMemberView, hiddenMemberView } = memberView
  const { isShowInfoDialog, infoDialogKey, setOpenInfoDialog, close } =
    infoDialog

  const [dateRange, userViewDate] = useWatch({
    control,
    name: ['dateRange', 'userViewDate'],
  })

  const { data: ReportData } = useDashboardReport({
    from: getDateFormat((Array.isArray(dateRange) && dateRange[0]) || null),
    to: getDateFormat((Array.isArray(dateRange) && dateRange[1]) || null),
  })

  const [currency, setCurrency] = useState<Currency>('convertedToUSD')

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
          <SwitchTypeHeader
            isShowMemberView={isShowMemberView}
            hiddenMemberView={hiddenMemberView}
            showMemberView={showMemberView}
          />
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
      </ApexChartWrapper>
    </FormProvider>
  )
}

export default ClientDashboards

ClientDashboards.acl = {
  action: 'read',
  subject: 'members',
}
