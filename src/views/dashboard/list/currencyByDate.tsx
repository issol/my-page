import styled from '@emotion/styled'
import { Box, Typography } from '@mui/material'
import dayjs from 'dayjs'
import React from 'react'

const CurrencyByDateList = () => {
  return (
    <Box>
      <Typography fontSize='14px' color='#4C4E64DE' fontWeight={600}>
        {dayjs().format('MMM')}
      </Typography>
      <CurrencyItemList>
        <li>
          <span className='currency_box'>$</span>
          <span className='price'>500</span>
        </li>
        <li>
          <span className='currency_box' color='#fff'>
            $
          </span>
          <span className='price'>500</span>
        </li>
        <li>
          <span className='currency_box' color='#fff'>
            $
          </span>
          <span className='price'>500</span>
        </li>
      </CurrencyItemList>
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
    listStyle: 'none',
    padding: 0,
    flexWrap: 'wrap',

    '& > li': {
      width: '50%',
      display: 'flex',
      gap: '8px',
      marginBottom: '5px',
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
