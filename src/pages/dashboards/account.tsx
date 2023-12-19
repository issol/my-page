import Grid from '@mui/material/Grid'
import { GridItem, Title } from '@src/views/dashboard/dashboardItem'
import { Box } from '@mui/material'
import dayjs from 'dayjs'
import { FormProvider, useWatch } from 'react-hook-form'
import React, { useState } from 'react'
import ApexChartWrapper from '@src/@core/styles/libs/react-apexcharts'
import weekday from 'dayjs/plugin/weekday'
import { Office } from '@src/types/dashboard'
import { useRouter } from 'next/router'
import { getDateFormat } from '@src/pages/dashboards/lpm'

import ChartDateHeader from '@src/views/dashboard/header/chartDateHeader'
import UseDashboardControl from '@src/hooks/useDashboardControl'
import Information from '@src/views/dashboard/dialog/information'
import { CSVDownload } from '@src/views/dashboard/csvDownload'
import { useQueryClient } from 'react-query'
import {
  DEFAULT_QUERY_NAME,
  useAccountCount,
  useAccountRatio,
} from '@src/queries/dashboard/dashnaord-lpm'
import Notice from '@src/views/dashboard/notice'
import AccountTable from '@src/views/dashboard/accountTable'
import AccountDoughnut from '@src/views/dashboard/chart/accountDoughnut'
import OptionsMenu from '@src/@core/components/option-menu'

dayjs.extend(weekday)

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

const AccountDashboards = () => {
  const router = useRouter()
  const cache = useQueryClient()
  const data = cache.getQueriesData([DEFAULT_QUERY_NAME])

  const { formHook, infoDialog } = UseDashboardControl()
  const { control, setValue, ...props } = formHook
  const { isShowInfoDialog, infoDialogKey, setOpenInfoDialog, close } =
    infoDialog

  const [dateRange, userViewDate] = useWatch({
    control,
    name: ['dateRange', 'userViewDate'],
  })
  const [office, setOffice] = useState<Office>('Japan')

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
            <ChartDateHeader />
          </Grid>
          <GridItem width={207} height={76}>
            <Box>
              <CSVDownload data={[]} />
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
                        text: 'Korea',
                        menuItemProps: {
                          onClick: () => {
                            setOffice('Korea')
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
                      {
                        text: 'Singapore',
                        menuItemProps: {
                          onClick: () => {
                            setOffice('Singapore')
                          },
                        },
                      },
                      {
                        text: 'Japan',
                        menuItemProps: {
                          onClick: () => {
                            setOffice('Japan')
                          },
                        },
                      },
                    ]}
                  />
                </Box>
              </Box>
              <AccountDoughnut
                data={
                  Client?.report.map(item => ({
                    ...item,
                    name: item?.paymentMethod || '',
                  })) || []
                }
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
                data={
                  Pro?.report.map(item => ({
                    ...item,
                    name: item?.type || '',
                  })) || []
                }
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
  subject: 'client',
}
