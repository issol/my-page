import Grid from '@mui/material/Grid'
import {
  GridItem,
  Title,
  TotalValueView,
} from '@src/views/dashboard/dashboardItem'
import { Box } from '@mui/material'
import dayjs from 'dayjs'
import { useDashboardReport } from '@src/queries/dashboard/dashnaord-lpm'
import { FormProvider, useWatch } from 'react-hook-form'
import React from 'react'
import ApexChartWrapper from '@src/@core/styles/libs/react-apexcharts'

import Doughnut from '@src/views/dashboard/chart/doughnut'
import weekday from 'dayjs/plugin/weekday'
import { Colors, SecondColors } from '@src/shared/const/dashboard/chart'
import {
  CategoryRatioItem,
  ExpertiseRatioItem,
  PairRatioItem,
  ServiceRatioItem,
} from '@src/types/dashboard'
import StatusAndDataGrid from '@src/views/dashboard/dataGrid/status'
import { StatusOrderColumns } from '@src/shared/const/columns/dashboard'
import { getDateFormat } from '@src/pages/dashboards/lpm'
import UseDashboardControl from '@src/hooks/useDashboardControl'
import SwitchTypeHeader from '@src/views/dashboard/header/SwitchType'
import Total, { ReceivableColors } from '@src/views/dashboard/chart/total'
import { ReceiptLong } from '@mui/icons-material'
import ClientReport from '@src/views/dashboard/list/clientReport'
import Notice from '@src/views/dashboard/notice'
import Information from '@src/views/dashboard/dialog/information'

dayjs.extend(weekday)

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

  return (
    <FormProvider {...props} setValue={setValue} control={control}>
      <ApexChartWrapper>
        <Grid
          container
          gap='24px'
          sx={{ minWidth: '1320px', overflowX: 'auto', padding: '10px' }}
        >
          <Notice />
          <SwitchTypeHeader
            isShowMemberView={isShowMemberView}
            hiddenMemberView={hiddenMemberView}
            showMemberView={showMemberView}
          />
          <Grid container gap='24px'>
            <Grid item display='flex' flexDirection='column' gap='24px' xs={6}>
              {!isShowMemberView && (
                <>
                  <GridItem height={219} sm>
                    <Box sx={{ width: '100%', height: '100%' }}>
                      <Box>
                        <Title
                          title='Invoices - Paid this month'
                          openDialog={setOpenInfoDialog}
                        />
                      </Box>
                      <TotalValueView
                        type='receivable'
                        label='Paid this month'
                        amountLabel='Receivable amount'
                        countLabel='Counts'
                      />
                    </Box>
                  </GridItem>
                  <ClientReport
                    reportData={
                      ReportData || {
                        canceled: 0,
                        invoicePayables: 0,
                        invoiceReceivables: 0,
                        orders: 0,
                        quotes: 0,
                        requests: 0,
                      }
                    }
                    userViewDate={userViewDate}
                    setOpenInfoDialog={setOpenInfoDialog}
                  />
                </>
              )}
              {isShowMemberView && (
                <GridItem height={532} sm padding='0px'>
                  <Box display='flex' flexDirection='column'>
                    <Box
                      sx={{
                        width: '100%',
                        height: '320px',
                        overflow: 'hidden',
                      }}
                    >
                      <img
                        src='/images/dashboard/img_client.png'
                        alt='dashboard_img'
                        style={{ width: '100%' }}
                      />
                    </Box>
                    <Box
                      sx={{
                        width: '100%',
                        height: '220px',
                        padding: '20px 20px 0',
                      }}
                    >
                      <Box>
                        <Title
                          title='Invoices - Paid this month'
                          openDialog={setOpenInfoDialog}
                        />
                      </Box>
                      <TotalValueView
                        type='receivable'
                        label='Paid this month'
                        amountLabel='Receivable amount'
                        countLabel='Counts'
                      />
                    </Box>
                  </Box>
                </GridItem>
              )}
            </Grid>
            <GridItem sm height={532}>
              <Total
                // TODO : Invoice 상태로 보여져야하는데 작업이 안됨
                type='receivable'
                title='Invoices - Total'
                iconColor='114, 225, 40'
                icon={ReceiptLong}
                setOpenInfoDialog={setOpenInfoDialog}
                statusList={['Invoiced', 'Paid', 'Overdue', 'Canceled']}
                colors={ReceivableColors}
              />
            </GridItem>
          </Grid>
          <StatusAndDataGrid
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
            setOpenInfoDialog={setOpenInfoDialog}
          />
          <Grid container spacing={5}>
            <Doughnut<PairRatioItem>
              userViewDate={userViewDate}
              title='Language pairs@client'
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
              setOpenInfoDialog={setOpenInfoDialog}
            />
            <Doughnut<CategoryRatioItem>
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
              setOpenInfoDialog={setOpenInfoDialog}
            />
          </Grid>
          <Grid container spacing={5}>
            <Doughnut<ServiceRatioItem>
              userViewDate={userViewDate}
              title='Service types@client'
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
              setOpenInfoDialog={setOpenInfoDialog}
            />
            <Doughnut<ExpertiseRatioItem>
              userViewDate={userViewDate}
              title='Area of expertises@client'
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
              setOpenInfoDialog={setOpenInfoDialog}
            />
          </Grid>
        </Grid>
        <Information
          open={isShowInfoDialog}
          keyName={infoDialogKey}
          infoType='CLIENT'
          close={close}
        />
      </ApexChartWrapper>
    </FormProvider>
  )
}

export default ClientDashboards

ClientDashboards.acl = {
  action: 'read',
  subject: 'client',
}
