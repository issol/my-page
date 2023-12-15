import styled from '@emotion/styled'
import { Box, Typography } from '@mui/material'
import dayjs from 'dayjs'
import React from 'react'
import { ExpectedIncome } from '@src/types/dashboard'
import { CurrencyUnit } from '@src/views/dashboard/dashboardItem'

export interface CurrencyByDateListProps {
  data: { report: Array<ExpectedIncome> }
}

const CurrencyByDateList = ({ data }: CurrencyByDateListProps) => {
  const isItemValues = (item: ExpectedIncome) => {
    return !!(
      item.incomeUSD ||
      item.incomeKRW ||
      item.incomeJPY ||
      item.incomeSGD
    )
  }

  return (
    <Box className='scroll_bar' sx={{ maxHeight: '364px', overflowY: 'auto' }}>
      {data.report.map(item => (
        <Box key={`${item.month}`} sx={{ height: '100%' }}>
          <Typography
            fontSize='14px'
            color='#4C4E64DE'
            fontWeight={600}
            sx={{ marginBottom: '5px' }}
          >
            {item.month}
          </Typography>
          <CurrencyItemList
            style={{ height: 'fit-content', padding: 0, margin: 0 }}
          >
            <li style={{ display: item.incomeUSD ? 'flex' : 'none' }}>
              <span className='currency_box'>{CurrencyUnit['USD']}</span>
              <span className='price'>{item.incomeUSD.toLocaleString()}</span>
            </li>
            <li style={{ display: item.incomeKRW ? 'flex' : 'none' }}>
              <span className='currency_box'>{CurrencyUnit['KRW']}</span>
              <span className='price'>{item.incomeKRW.toLocaleString()}</span>
            </li>
            <li style={{ display: item.incomeJPY ? 'flex' : 'none' }}>
              <span className='currency_box'>{CurrencyUnit['JPY']}</span>
              <span className='price'>{item.incomeJPY.toLocaleString()}</span>
            </li>
            <li style={{ display: item.incomeSGD ? 'flex' : 'none' }}>
              <span className='currency_box'>{CurrencyUnit['SGD']}</span>
              <span className='price'>{item.incomeSGD.toLocaleString()}</span>
            </li>
            {!isItemValues(item) && (
              <li>
                <span className='currency_box'>-</span>
                <span className='price'></span>
              </li>
            )}
          </CurrencyItemList>
        </Box>
      ))}
    </Box>
  )
}

export const CurrencyAmount = ({ amounts }: { amounts: Array<number> }) => {
  const CurrencyItems = [
    { path: '/images/dashboard/img_usd.png', currency: '$' },
    { path: '/images/dashboard/img_krw.png', currency: '₩' },
    { path: '/images/dashboard/img_jpy.png', currency: '¥' },
    { path: '/images/dashboard/img_sgd.png', currency: 'SGD' },
  ]
  return (
    <>
      {amounts.map((amount, index) => (
        <Box key={`amount-${index}`} display='flex' alignItems='center'>
          <img
            style={{ height: '32px' }}
            src={CurrencyItems[index].path}
            alt='us icon'
          />
          <span style={{ fontSize: '16px', padding: '0 3px' }}>
            {CurrencyItems[index].currency}
          </span>
          <Typography
            display='flex'
            alignItems='center'
            fontSize='20px'
            fontWeight={500}
            sx={{ width: '96px' }}
          >
            {amount.toLocaleString()}
          </Typography>
        </Box>
      ))}
    </>
  )
}

const CurrencyItemList = styled.ul(() => {
  return {
    display: 'flex',
    justifyContent: 'space-between',
    listStyle: 'none',
    padding: 0,
    flexWrap: 'wrap',

    '& > li': {
      display: 'flex',
      width: '50%',
      gap: '8px',
      marginBottom: '10px',
    },

    '& .currency_box': {
      width: '38px',
      height: '24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(109, 120, 141, 0.2)',
      borderRadius: '5px',
      fontSize: '13px',
    },

    '& .price': { color: 'rgba(76, 78, 100, 0.87)', fontWeight: 600 },
  }
})

export default CurrencyByDateList
