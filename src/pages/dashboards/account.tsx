import Grid from '@mui/material/Grid'
import { GridItem, Title } from '@src/views/dashboard/dashboardItem'
import { Box } from '@mui/material'
import dayjs from 'dayjs'
import { FormProvider, useWatch } from 'react-hook-form'
import React, { useEffect, useState } from 'react'
import ApexChartWrapper from '@src/@core/styles/libs/react-apexcharts'
import weekday from 'dayjs/plugin/weekday'
import { CSVDataType, Office } from '@src/types/dashboard'
import { useRouter } from 'next/router'

import { getDateFormat } from '@src/pages/dashboards/lpm'

import ChartDate from '@src/views/dashboard/header/chartDate'
import UseDashboardControl from '@src/hooks/useDashboardControl'
import Information from '@src/views/dashboard/dialog/information'
import { CSVDownload } from '@src/views/dashboard/csvDownload'
import Notice from '@src/views/dashboard/notice'
import AccountTable from '@src/views/dashboard/accountTable'
import AccountDoughnut from '@src/views/dashboard/chart/accountDoughnut'
import OptionsMenu from '@src/@core/components/option-menu'
import { AccountItem, AccountRatio } from '@src/queries/dashnaord.query'
import { mergeData } from '@src/pages/dashboards/tad'
import { AccountingDownload } from '@src/views/dashboard/accountDownload'

dayjs.extend(weekday)

// NOTE : 데이터가 많아지는 경우 Suspense 단위로 분리
const AccountDashboards = () => {
  const router = useRouter()

  const { formHook, infoDialog } = UseDashboardControl()
  const { control, setValue, ...props } = formHook
  const { isShowInfoDialog, infoDialogKey, setOpenInfoDialog, close } =
    infoDialog

  const [dateRange, userViewDate] = useWatch({
    control,
    name: ['dateRange', 'userViewDate'],
  })

  const [office, setOffice] = useState<Office>('Japan')
  const [CSVData, setCSVData] = useState<CSVDataType>([])

  //  Sales, Receivable, Payable, Client, Pro
  const [salesData, setSalesData] = useState<Array<AccountItem>>([])
  const [receivableData, setReceivableData] = useState<Array<AccountItem>>([])
  const [payableData, setPayableData] = useState<Array<AccountItem>>([])
  const [clientData, setClientData] = useState<Array<AccountRatio>>([])
  const [proData, setProData] = useState<Array<AccountRatio>>([])

  useEffect(() => {
    const filterSales =
      salesData.map(item => ({
        'Sales Currency': item?.currency || '-',
        'Sales Prices': item?.prices || '-',
        ' ': '',
      })) || []
    const filterReceivable =
      receivableData.map(item => ({
        'Receivable Currency': item?.currency || '-',
        'Receivable Count': item?.count || 0,
        'Receivable Prices': item?.prices || '-',
        '  ': '',
      })) || []
    const filterPayable =
      payableData.map(item => ({
        'Payable Currency': item?.currency || '-',
        'Payable Count': item?.count || 0,
        'Payable Prices': item?.prices || '-',
        '   ': '',
      })) || []

    const filterClient =
      clientData.map(item => ({
        'Client Payment Method': item?.paymentMethod || '-',
        'Client Number': item?.count || 0,
        'Client Percent': item?.ratio || 0,
        '    ': '',
      })) || []
    const filterPro =
      proData.map(item => ({
        'Pro Payment Method': item?.type || '-',
        'Pro Number': item?.count || 0,
        'Pro Percent': item?.ratio || 0,
        '     ': '',
      })) || []

    const mergeData1 = mergeData(filterSales, filterReceivable)
    const mergeData2 = mergeData(mergeData1, filterPayable)
    const mergeData3 = mergeData(mergeData2, filterClient)
    const mergeData4 = mergeData(mergeData3, filterPro)

    setCSVData(mergeData4)
  }, [salesData, receivableData, payableData, clientData, proData])

  const getFileTitle = (type: 'DASHBOARD' | 'ACCOUNTING') => {
    const from = getDateFormat(
      (Array.isArray(dateRange) && dateRange[0]) || null,
    )
    const to = getDateFormat((Array.isArray(dateRange) && dateRange[1]) || null)
    return type === 'DASHBOARD'
      ? `account-data-${from}-${to}`
      : `accounting-report-${from}-${to}`
  }

  return (
    <FormProvider {...props} setValue={setValue} control={control}>
      <ApexChartWrapper>
        <Grid container gap='24px' sx={{ padding: '10px' }}>
          <Notice />
          <Grid
            item
            sm
            sx={{
              position: 'sticky',
              left: 0,
              top: '148px',
              zIndex: 10,
              backgroundColor: '#fff',
            }}
          >
            <ChartDate />
          </Grid>
          <GridItem width={450} height={76}>
            <Box sx={{ display: 'flex', gap: '8px' }}>
              <CSVDownload title={`${getFileTitle('DASHBOARD')}`} data={CSVData || []} />
              <AccountingDownload title={`${getFileTitle('ACCOUNTING')}`} />
            </Box>
          </GridItem>
        </Grid>
        <Grid container gap='24px' sx={{ padding: '10px' }}>
          <GridItem sm height={336} padding='0px'>
            <Box sx={{ width: '100%', height: '100%' }}>
              <Title
                title='Sales recognition'
                openDialog={setOpenInfoDialog}
                subTitle={userViewDate}
                padding='20px'
              />
              <AccountTable
                headers={[
                  { label: 'Currency' },
                  { label: 'Prices', align: 'right' },
                ]}
                path='sales-recognition'
                from={getDateFormat(
                  (Array.isArray(dateRange) && dateRange[0]) || null,
                )}
                to={getDateFormat(
                  (Array.isArray(dateRange) && dateRange[1]) || null,
                )}
                setItemData={setSalesData}
              />
            </Box>
          </GridItem>
          <GridItem sm height={336} padding='0px'>
            <Box sx={{ width: '100%', height: '100%' }}>
              <Title
                title='Paid Receivables'
                openDialog={setOpenInfoDialog}
                subTitle={userViewDate}
                padding='20px'
                handleClick={() => router.push('/invoice/receivable/')}
              />
              <AccountTable
                headers={[
                  { label: 'Currency' },
                  { label: 'Count', align: 'center' },
                  { label: 'Prices', align: 'right' },
                ]}
                path='invoice/receivable/paid/count'
                from={getDateFormat(
                  (Array.isArray(dateRange) && dateRange[0]) || null,
                )}
                to={getDateFormat(
                  (Array.isArray(dateRange) && dateRange[1]) || null,
                )}
                setItemData={setReceivableData}
              />
            </Box>
          </GridItem>
          <GridItem sm height={336} padding='0px'>
            <Box sx={{ width: '100%', height: '100%' }}>
              <Title
                title='Paid Payables'
                openDialog={setOpenInfoDialog}
                subTitle={userViewDate}
                padding='20px'
                handleClick={() => router.push('/invoice/payable/')}
              />
              <AccountTable
                headers={[
                  { label: 'Currency' },
                  { label: 'Count', align: 'center' },
                  { label: 'Prices', align: 'right' },
                ]}
                path='invoice/payable/paid/count'
                from={getDateFormat(
                  (Array.isArray(dateRange) && dateRange[0]) || null,
                )}
                to={getDateFormat(
                  (Array.isArray(dateRange) && dateRange[1]) || null,
                )}
                setItemData={setPayableData}
              />
            </Box>
          </GridItem>
        </Grid>
        <Grid container gap='24px' sx={{ padding: '10px' }}>
          <GridItem sm height={381}>
            <Box sx={{ width: '100%', height: '100%' }}>
              <Box
                display='flex'
                alignItems='center'
                justifyContent='space-between'
                sx={{ position: 'relative' }}
              >
                <Title
                  marginBottom='30px'
                  title='Clients’ payment method per office'
                  subTitle={`${office} office`}
                  openDialog={setOpenInfoDialog}
                />
                <Box sx={{ position: 'absolute', right: 0, top: 0 }}>
                  <OptionsMenu
                    iconButtonProps={{
                      size: 'small',
                    }}
                    options={[
                      {
                        text: 'Japan',
                        menuItemProps: {
                          onClick: () => {
                            setOffice('Japan')
                          },
                        },
                      },
                      {
                        text: 'Korea',
                        menuItemProps: {
                          onClick: () => {
                            setOffice('Korea')
                          },
                        },
                      },
                      {
                        text: 'Singapore',
                        menuItemProps: {
                          onClick: () => {
                            setOffice('Singapore')
                          },
                        },
                      },
                      {
                        text: 'US',
                        menuItemProps: {
                          onClick: () => {
                            setOffice('US')
                          },
                        },
                      },
                    ]}
                  />
                </Box>
              </Box>
              <AccountDoughnut
                userType='client'
                office={office}
                setItemData={setClientData}
              />
            </Box>
          </GridItem>
          <GridItem sm height={381}>
            <Box sx={{ width: '100%', height: '100%' }}>
              <Box
                display='flex'
                alignItems='center'
                justifyContent='space-between'
                sx={{ position: 'relative' }}
              >
                <Title
                  marginBottom='30px'
                  title='Pros’ payment method'
                  openDialog={setOpenInfoDialog}
                />
              </Box>
              <AccountDoughnut userType='pro' setItemData={setProData} />
            </Box>
          </GridItem>
        </Grid>

        <Information
          open={isShowInfoDialog}
          keyName={infoDialogKey}
          infoType='ACCOUNT'
          close={close}
        />
      </ApexChartWrapper>
    </FormProvider>
  )
}

export default AccountDashboards

AccountDashboards.acl = {
  action: 'read',
  subject: 'dashboard_ACCOUNT',
}
