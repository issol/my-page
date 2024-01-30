import { TotalAmountQuery } from '@src/types/dashboard'
import { useRouter } from 'next/router'
import { useTotalAmount } from '@src/queries/dashnaord.query'
import { Box, Typography } from '@mui/material'
import { Title } from '@src/views/dashboard/dashboardItem'
import React from 'react'
import { getProDateFormat } from '@src/views/dashboard/list/currencyByDate'
import DashboardForSuspense from '@src/views/dashboard/suspense'

interface CurrencyAmountProps extends TotalAmountQuery {
  title: string
  setOpenInfoDialog: (open: boolean, key: string) => void
}

const CurrencyAmountContent = ({
  title,
  setOpenInfoDialog,
  ...params
}: CurrencyAmountProps) => {
  const router = useRouter()
  const { data } = useTotalAmount(params)

  const CurrencyItems = [
    { path: '/images/dashboard/img_usd.png', currency: '$' },
    { path: '/images/dashboard/img_krw.png', currency: '₩' },
    { path: '/images/dashboard/img_jpy.png', currency: '¥' },
    { path: '/images/dashboard/img_sgd.png', currency: 'SGD' },
  ]

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <Box>
        <Title
          title={title}
          subTitle={getProDateFormat(params.year, params.month)}
          openDialog={setOpenInfoDialog}
          handleClick={() => router.push('/invoice/pro/')}
        />
      </Box>
      <Box
        display='flex'
        alignItems='center'
        justifyContent='space-between'
        sx={{ padding: '40px 0 ' }}
      >
        <Box display='flex' alignItems='center'>
          <img
            style={{ height: '32px' }}
            src={CurrencyItems[0].path}
            alt='us icon'
          />
          <span style={{ fontSize: '16px', padding: '0 3px' }}>
            {CurrencyItems[0].currency}
          </span>
          <Typography
            display='flex'
            alignItems='center'
            fontSize='16px'
            fontWeight={600}
          >
            {data?.totalAmountUSD.toLocaleString() || 0}
          </Typography>
        </Box>
        <Box display='flex' alignItems='center'>
          <img
            style={{ height: '32px' }}
            src={CurrencyItems[1].path}
            alt='us icon'
          />
          <span style={{ fontSize: '16px', padding: '0 3px' }}>
            {CurrencyItems[1].currency}
          </span>
          <Typography
            display='flex'
            alignItems='center'
            fontSize='16px'
            fontWeight={600}
          >
            {data?.totalAmountKRW.toLocaleString() || 0}
          </Typography>
        </Box>
        <Box display='flex' alignItems='center'>
          <img
            style={{ height: '32px' }}
            src={CurrencyItems[2].path}
            alt='us icon'
          />
          <span style={{ fontSize: '16px', padding: '0 3px' }}>
            {CurrencyItems[2].currency}
          </span>
          <Typography
            display='flex'
            alignItems='center'
            fontSize='16px'
            fontWeight={600}
          >
            {data?.totalAmountJPY.toLocaleString() || 0}
          </Typography>
        </Box>
        <Box display='flex' alignItems='center'>
          <img
            style={{ height: '32px' }}
            src={CurrencyItems[3].path}
            alt='us icon'
          />
          <span style={{ fontSize: '16px', padding: '0 3px' }}>
            {CurrencyItems[3].currency}
          </span>
          <Typography
            display='flex'
            alignItems='center'
            fontSize='16px'
            fontWeight={600}
            sx={{ width: ' 94px' }}
          >
            {data?.totalAmountSGD.toLocaleString() || 0}
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}

const CurrencyAmount = (props: CurrencyAmountProps) => {
  return (
    <DashboardForSuspense
      {...props}
      sectionTitle={props.title}
      refreshDataQueryKey={['TotalAmount', props.amountType]}
      titleProps={{
        subTitle: getProDateFormat(props.year, props.month),
      }}
      contentHeight='50%'
    >
      <CurrencyAmountContent {...props} />
    </DashboardForSuspense>
  )
}

export default CurrencyAmount
