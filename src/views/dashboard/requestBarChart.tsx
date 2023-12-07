import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import ReactApexcharts from '@src/@core/components/react-apexcharts'
import { ApexOptions } from 'apexcharts'
import styled from '@emotion/styled'
import { Box, Typography } from '@mui/material'

import dayjs from 'dayjs'
import { useTheme } from '@mui/material/styles'

const series = [
  {
    name: 'PRODUCT A',
    data: [44, 55, 41, 67, 22, 43],
  },
  {
    name: 'PRODUCT B',
    data: [13, 23, 20, 8, 13, 27],
  },
]

const RequestBarChart = () => {
  const theme = useTheme()

  const options: ApexOptions = {
    chart: {
      type: 'bar',
      stacked: true,
      toolbar: {
        show: false,
      },
    },

    plotOptions: {
      bar: {
        columnWidth: '24%',
        horizontal: false,
        borderRadius: 30,
        dataLabels: {},
      },
    },
    xaxis: {
      tickAmount: 8,
      axisTicks: { show: false },
      axisBorder: { show: false },
      categories: [
        '2023-06',
        '2023-07',
        '2023-08',
        '2023-09',
        '2023-10',
        '2023-11',
      ],
      labels: {
        formatter: (value: string, timestamp?: number, opts?: any) => {
          return `${dayjs(value).format('MMM')}`
        },
        style: {
          colors: 'rgba(76, 78, 100, 0.38)',
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    colors: ['#666CFF', '#FDB528'],
    grid: {
      strokeDashArray: 8,
      borderColor: theme.palette.divider,
      yaxis: {
        lines: { show: true },
      },
    },
    legend: { show: false },
  }
  return (
    <Box sx={{ marginTop: '50px' }}>
      <CustomChart type='bar' height={280} options={options} series={series} />
      <Box display='flex' justifyContent='flex-end' gap='30px'>
        <Typography
          display='flex'
          alignItems='center'
          gap='5px'
          fontSize='14px'
          color='#4C4E6499'
        >
          <span
            style={{
              display: 'block',
              width: '7px',
              height: '7px',
              borderRadius: '10px',
              backgroundColor: '#FDB528',
            }}
          />
          Total
        </Typography>
        <Typography
          display='flex'
          alignItems='center'
          fontSize='14px'
          gap='5px'
          color='#4C4E6499'
        >
          <span
            style={{
              display: 'block',
              width: '7px',
              height: '7px',
              borderRadius: '10px',
              backgroundColor: '#666CFF',
            }}
          />
          Assigned
        </Typography>
      </Box>
    </Box>
  )
}

export const CustomChart = styled(ReactApexcharts)(() => {
  return {
    '.apexcharts-series:nth-of-type(1) > path': {
      clipPath: 'inset(-10px 0% 0% 0% round 10px)',
    },
    '.apexcharts-series:nth-of-type(2) > path': {
      clipPath: 'inset(0% 0% -10px 0% round 10px)',
    },
  }
})
export default RequestBarChart
