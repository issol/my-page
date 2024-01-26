import React, { useMemo } from 'react'
import ReactApexcharts from '@src/@core/components/react-apexcharts'
import { ApexOptions } from 'apexcharts'
import { styled } from '@mui/system'
import { Box, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { CurrencyByDateListProps } from '@src/views/dashboard/list/currencyByDate'

const ProJobRequestBarChart = ({ report }: CurrencyByDateListProps) => {
  const theme = useTheme()

  const [series, categories, values] = useMemo(() => {
    const total: Array<number> = []
    const assigned: Array<number> = []
    const _sameValueIndex: Array<number> = []
    const _categories: Array<string> = []

    for (const item of report) {
    }

    report.forEach((item, index) => {
      const _total = (item.acceptedCount || 0) + (item.rejectedCount || 0)
      const _assigned = item.acceptedCount || 0

      if (_total == _assigned) {
        _sameValueIndex.push(index)
        total.push((item.acceptedCount || 0) + (item.rejectedCount || 0))
      } else {
        total.push((item.acceptedCount || 0) + (item.rejectedCount || 0))
        assigned.push(item.acceptedCount || 0)
      }
      _categories.push(item.month)
    })

    const _series = [
      {
        name: 'Total',
        data: total,
      },
      {
        name: 'Assigned',
        data: assigned,
      },
    ]

    return [_series, _categories, _sameValueIndex]
  }, [report])

  const options: ApexOptions = useMemo(() => {
    const max = Math.max(
      ...report.map(item => item.rejectedCount + item.acceptedCount),
    )

    return {
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
        },
      },
      xaxis: {
        tickAmount: 8,
        axisTicks: { show: false },
        axisBorder: { show: false },
        categories: categories,
        labels: {
          formatter: (value, timestamp, opts) => {
            return value
          },
          style: {
            colors: 'rgba(76, 78, 100, 0.38)',
          },
        },
      },
      yaxis: {
        labels: {
          formatter: value => {
            return `${Math.abs(value).toFixed(1)}`
          },
          style: {
            colors: 'rgba(76, 78, 100, 0.38)',
          },
        },
        min: 0,
        max: max || 30,
        tickAmount: 3,
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
  }, [report])

  return (
    <Box sx={{ marginTop: '50px' }}>
      <CustomChart
        type='bar'
        height={280}
        options={options}
        series={series}
        values={values}
      />
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

export const CustomChart = styled(ReactApexcharts)<{
  values?: Array<number>
}>(({ values }) => {
  const obj: Record<string, any> = {}
  values?.forEach(index => {
    obj[`.apexcharts-series:nth-of-type(1) > path:nth-of-type(${index + 1})`] =
      {
        clipPath: 'inset(10px 0% 0px 0% round 10px)',
      }
  })

  return {
    '.apexcharts-series:nth-of-type(1) > path': {
      clipPath: 'inset(-10px 0% 0% 0% round 10px)',
    },
    '.apexcharts-series:nth-of-type(2) > path': {
      clipPath: 'inset(0% 0% -10px 0% round 10px)',
    },

    '.apexcharts-xaxis-texts-g text:last-of-type': {
      fill: 'rgba(102, 108, 255)',
    },
    ...obj,
  }
})
export default ProJobRequestBarChart
