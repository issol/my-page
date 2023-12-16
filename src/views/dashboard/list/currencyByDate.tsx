import styled from '@emotion/styled'
import { Box, Typography } from '@mui/material'
import React, { useCallback } from 'react'
import { ExpectedIncome, TotalAmountQuery } from '@src/types/dashboard'
import {
  CurrencyUnit,
  SectionTitle,
  SubDateDescription,
} from '@src/views/dashboard/dashboardItem'
import { useTotalAmount } from '@src/queries/dashboard/dashnaord-lpm'
import dayjs, { Dayjs } from 'dayjs'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import { KeyboardArrowRight } from '@mui/icons-material'
import { useRouter } from 'next/router'

export interface CurrencyByDateListProps {
  date?: Date
  report: Array<ExpectedIncome>
}

export const getProDateFormat = (year: number, month: number) => {
  const date = dayjs(`${year}-${month}`)
  const lastDate = dayjs(date).set('date', date.daysInMonth())
  return lastDate.format('MMMM 1 - DD, YYYY')
}

const CurrencyByDateList = ({ report, date }: CurrencyByDateListProps) => {
  const isItemValues = (item: ExpectedIncome) => {
    return !!(
      item.incomeUSD ||
      item.incomeKRW ||
      item.incomeJPY ||
      item.incomeSGD
    )
  }

  const isEmptyList = useCallback(() => {
    if (report.length !== 0) return
    const _date = dayjs(date).set('date', 1)
    const monthList = Array(6)
      .fill(0)
      .map((i, index) => {
        return _date.add(index, 'month')
      })

    return monthList.map((date, index) => (
      <Box key={`${date}-index`} sx={{ height: '100%' }}>
        <Typography
          fontSize='14px'
          color='#4C4E64DE'
          fontWeight={600}
          sx={{ marginBottom: '5px' }}
        >
          {date.format('MMM')}
        </Typography>
        <CurrencyItemList
          style={{ height: 'fit-content', padding: 0, margin: 0 }}
        >
          <li>
            <span className='currency_box'>-</span>
            <span className='price'>0</span>
          </li>
        </CurrencyItemList>
      </Box>
    ))
  }, [date])

  return (
    <Box className='scroll_bar' sx={{ maxHeight: '364px', overflowY: 'auto' }}>
      {isEmptyList()}
      {report.map(item => (
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

interface CurrencyAmountProps extends TotalAmountQuery {
  title: string
}
export const CurrencyAmount = ({ title, ...params }: CurrencyAmountProps) => {
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
        <SectionTitle>
          <span
            role='button'
            className='title'
            onClick={() => router.push('/quotes/lpm/requests/')}
          >
            {title}
          </span>
          <ErrorOutlineIcon className='info_icon' />
          <KeyboardArrowRight className='arrow_icon' />
        </SectionTitle>
        <SubDateDescription textAlign='left'>
          {getProDateFormat(params.year, params.month)}
        </SubDateDescription>
      </Box>
      <Box display='flex' alignItems='center' sx={{ padding: '40px 0 ' }}>
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
            fontSize='20px'
            fontWeight={500}
            sx={{ width: '96px' }}
          >
            {data?.totalAmountUSD.toLocaleString()}
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
            fontSize='20px'
            fontWeight={500}
            sx={{ width: '96px' }}
          >
            {data?.totalAmountKRW.toLocaleString()}
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
            fontSize='20px'
            fontWeight={500}
            sx={{ width: '96px' }}
          >
            {data?.totalAmountJPY.toLocaleString()}
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
            fontSize='20px'
            fontWeight={500}
            sx={{ width: '96px' }}
          >
            {data?.totalAmountSGD.toLocaleString()}
          </Typography>
        </Box>
      </Box>
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
