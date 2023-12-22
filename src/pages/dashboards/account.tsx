import Grid from '@mui/material/Grid'
import { GridItem, Title } from '@src/views/dashboard/dashboardItem'
import { Box } from '@mui/material'
import dayjs from 'dayjs'
import { FormProvider, useWatch } from 'react-hook-form'
import React, { useEffect, useMemo, useState } from 'react'
import ApexChartWrapper from '@src/@core/styles/libs/react-apexcharts'
import weekday from 'dayjs/plugin/weekday'
import { CSVDataType, Office, RatioItem } from '@src/types/dashboard'
import { useRouter } from 'next/router'
import { getDateFormat } from '@src/pages/dashboards/lpm'

import ChartDate from '@src/views/dashboard/header/chartDate'
import UseDashboardControl from '@src/hooks/useDashboardControl'
import Information from '@src/views/dashboard/dialog/information'
import { CSVDownload } from '@src/views/dashboard/csvDownload'
import {
  useAccountCount,
  useAccountRatio,
} from '@src/queries/dashboard/dashnaord-lpm'
import Notice from '@src/views/dashboard/notice'
import AccountTable from '@src/views/dashboard/accountTable'
import AccountDoughnut from '@src/views/dashboard/chart/accountDoughnut'
import OptionsMenu from '@src/@core/components/option-menu'
import sortBy from 'lodash/sortBy'

dayjs.extend(weekday)

const ClientData = [
  { count: 0, name: 'Direct deposit', type: '', ratio: 0 },
  { count: 0, name: 'PayPal', type: '', ratio: 0 },
  { count: 0, name: 'Check', type: '', ratio: 0 },
  { count: 0, name: 'Wise', type: '', ratio: 0 },
]

const ProData = [
  { count: 0, name: 'Korea domestic transfer', type: '', ratio: 0 },
  { count: 0, name: 'US ACH (US residents only)', type: '', ratio: 0 },
  { count: 0, name: 'PayPal', type: '', ratio: 0 },
  { count: 0, name: 'Transferwise (Wise)', type: '', ratio: 0 },
  { count: 0, name: 'International wire', type: '', ratio: 0 },
]

export const mergeData = (array1: Array<Object>, array2: Array<Object>) => {
  let tempArray1 = array1
  let tempArray2 = array2
  if (array1.length === 0) {
    tempArray1 = array2
    tempArray2 = array1
  }
  return tempArray1.reduce<Array<Record<string, any>>>(
    (acc, element, index) => [...acc, { ...element, ...tempArray2[index] }],
    [],
  )
}

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

  const { data: Sales } = useAccountCount('sales-recognition', {
    from: getDateFormat((Array.isArray(dateRange) && dateRange[0]) || null),
    to: getDateFormat((Array.isArray(dateRange) && dateRange[1]) || null),
  })

  const { data: Receivable } = useAccountCount(
    'invoice/receivable/paid/count',
    {
      from: getDateFormat((Array.isArray(dateRange) && dateRange[0]) || null),
      to: getDateFormat((Array.isArray(dateRange) && dateRange[1]) || null),
    },
  )
  const { data: Payable } = useAccountCount('invoice/payable/paid/count', {
    from: getDateFormat((Array.isArray(dateRange) && dateRange[0]) || null),
    to: getDateFormat((Array.isArray(dateRange) && dateRange[1]) || null),
  })

  const { data: Client } = useAccountRatio({ userType: 'client', office })
  const { data: Pro } = useAccountRatio({ userType: 'pro' })

  useEffect(() => {
    const filterSales =
      Sales?.report.map(item => ({
        'Sales Currency': item?.currency || '-',
        'Sales Prices': item?.prices || '-',
        ' ': '',
      })) || []
    const filterReceivable =
      Receivable?.report.map(item => ({
        'Receivable Currency': item?.currency || '-',
        'Receivable Count': item?.count || 0,
        'Receivable Prices': item?.prices || '-',
        '  ': '',
      })) || []
    const filterPayable =
      Payable?.report.map(item => ({
        'Payable Currency': item?.currency || '-',
        'Payable Count': item?.count || 0,
        'Payable Prices': item?.prices || '-',
        '   ': '',
      })) || []
    const filterClient =
      Client?.report.map(item => ({
        'Client Payment Method': item?.paymentMethod || '-',
        'Client Number': item?.count || 0,
        'Client Percent': item?.ratio || 0,
        '    ': '',
      })) || []
    const filterPro =
      Pro?.report.map(item => ({
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
  }, [Sales, Receivable, Payable, Client, Pro])

  const getFileTitle = () => {
    const from = getDateFormat(
      (Array.isArray(dateRange) && dateRange[0]) || null,
    )
    const to = getDateFormat((Array.isArray(dateRange) && dateRange[1]) || null)
    return `account-data-${from}-${to}`
  }

  const clientData = useMemo(() => {
    if (Client?.report.length === 0) {
      return ClientData
    }

    return sortBy(
      Client?.report.map(item => ({
        ...item,
        name: item?.paymentMethod || '',
      })),
      ['count', 'name'],
    ).reverse()
  }, [Client])

  const proData = useMemo(() => {
    if (Pro?.report.length === 0) {
      return ProData
    }

    console.log(
      sortBy(
        Pro?.report.map(item => ({
          ...item,
          name: item?.type || '',
        })),
        ['count', 'name'],
      ),
    )

    return sortBy(
      Pro?.report.map(item => ({
        ...item,
        name: item?.type || '',
      })),
      ['count', 'name'],
    ).reverse()
  }, [Pro])

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
          <GridItem width={207} height={76}>
            <Box>
              <CSVDownload title={`${getFileTitle()}`} data={CSVData || []} />
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
                data={Sales?.report || []}
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
                data={Receivable?.report || []}
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
                data={Payable?.report || []}
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
                data={clientData || []}
                totalCount={Client?.totalCount || 0}
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
              <AccountDoughnut
                data={proData || []}
                totalCount={Pro?.totalCount || 0}
              />
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