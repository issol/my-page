import styled from '@emotion/styled'
import { Box, Typography } from '@mui/material'
import React from 'react'
import { ExpectedIncome } from '@src/types/dashboard'
import { CurrencyUnit } from '@src/views/dashboard/dashboardItem'
import dayjs from 'dayjs'

export interface CurrencyByDateListProps {
  report: Array<ExpectedIncome>
}

export const getProDateFormat = (year: number, month: number) => {
  const date = dayjs(`${year}-${month}`)
  const lastDate = dayjs(date).set('date', date.daysInMonth())
  return lastDate.format('MMMM 1 - DD, YYYY')
}

const CurrencyByDateList = ({ report }: CurrencyByDateListProps) => {
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
      {report.map((item, index) => (
        <Box
          key={`${item.month}`}
          sx={{
            height: '100%',
          }}
        >
          <Typography
            fontSize='14px'
            color='#4C4E64DE'
            fontWeight={600}
            sx={{
              marginBottom: '5px',
              color: index === 0 ? 'rgba(102, 108, 255)' : 'inherit',
            }}
          >
            {item.month}
          </Typography>
          <CurrencyItemList
            style={{ height: 'fit-content', padding: 0, margin: 0 }}
          >
            <li style={{ display: item.incomeUSD ? 'flex' : 'none' }}>
              <span className='currency_box'>{CurrencyUnit['USD']}</span>
              <span className='price'>
                {item.incomeUSD.toLocaleString() || 0}
              </span>
            </li>
            <li style={{ display: item.incomeKRW ? 'flex' : 'none' }}>
              <span className='currency_box'>{CurrencyUnit['KRW']}</span>
              <span className='price'>
                {item.incomeKRW.toLocaleString() || 0}
              </span>
            </li>
            <li style={{ display: item.incomeJPY ? 'flex' : 'none' }}>
              <span className='currency_box'>{CurrencyUnit['JPY']}</span>
              <span className='price'>
                {item.incomeJPY.toLocaleString() || 0}
              </span>
            </li>
            <li style={{ display: item.incomeSGD ? 'flex' : 'none' }}>
              <span className='currency_box'>{CurrencyUnit['SGD']}</span>
              <span className='price'>
                {item.incomeSGD.toLocaleString() || 0}
              </span>
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
