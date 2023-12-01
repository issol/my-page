import React, { useCallback, useMemo, useState } from 'react'
import {
  ConvertButtonGroup,
  GridItem,
  SectionTitle,
  StatusSquare,
  SubDateDescription,
} from '@src/pages/dashboards/components/dashboardItem'
import { Box } from '@mui/material'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import dayjs from 'dayjs'
import { CustomChart } from '@src/pages/dashboards/components/chart'
import { ApexOptions } from 'apexcharts'
import { Colors } from '@src/shared/const/dashboard/chart'
import { useTheme } from '@mui/material/styles'
import styled from '@emotion/styled'
import { useDashboardRatio } from '@src/queries/dashboard/dashnaord-lpm'
import { renderToString } from 'react-dom/server'
import { Currency, RatioItem } from '@src/types/dashboard'
import Typography from '@mui/material/Typography'

const List = styled('ul')(() => {
  return {
    width: '100%',
    listStyle: 'none',
    padding: '0 0 0 16px',

    '& > li': {
      width: '100%',
      height: '35px',
      display: 'flex',
      alignItems: 'center',
      fontSize: '14px',
      color: '#4C4E64DE',
    },

    '& > li  .company-name': {
      display: 'block',
      fontWeight: 600,
      width: '150px',
    },

    '& > li  .left__items': {
      width: '100%',
      display: 'flex',
    },

    '& > li  .item-count': {},

    '& > li  .money': {
      width: '120px',
      fontWeight: 600,
      textAlign: 'right',
      marginRight: '16px',
    },

    '& > li  .ratio': {
      width: '46px',
      padding: '0 7px',
      height: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 600,
      color: '#fff',
      borderRadius: '64px',
      fontSize: '11px',
      backgroundColor: '#4C4E64DE',
      letterSpacing: '-0.14px',
    },
  }
})

interface DoughnutChartProps<T> {
  title: string
  from: string
  to: string
  type: string
  colors: Array<string>
  getName?: (row?: T) => string
}

const DoughnutChart = <T extends RatioItem>({
  title,
  from,
  to,
  type,
  colors,
  getName,
}: DoughnutChartProps<T>) => {
  const theme = useTheme()

  const [currency, setCurrency] = useState<Currency>('convertedToUSD')
  const { data } = useDashboardRatio<T>(
    {
      from,
      to,
      type,
    },
    currency,
  )

  const options: ApexOptions = {
    legend: { show: false },
    colors: colors,
    labels: [],
    stroke: {
      width: 5,
    },
    tooltip: {
      custom: function ({ series, seriesIndex, dataPointIndex, w }) {
        const price = data?.report[seriesIndex].sum.toFixed(0)

        return renderToString(
          <div
            className='flex-center'
            style={{ alignItems: 'flex-start', paddingTop: '10px' }}
          >
            <StatusSquare color={colors[seriesIndex]} />
            <div className='tooltip_container'>
              <div className='flex-center'>
                <span className='tooltip_text_bold'>
                  {(getName && getName(data?.report[seriesIndex])) ||
                    data?.report[seriesIndex].name}
                </span>
                <span className='tooltip__count'>{`(${data?.report[seriesIndex].count})`}</span>
              </div>
              <div className='flex-center' style={{ marginTop: '10px' }}>
                <span className='tooltip__sum'>{`${Number(
                  price,
                ).toLocaleString()}`}</span>
                <span className='tooltip__ratio'>{`${data?.report[seriesIndex].ratio}%`}</span>
              </div>
            </div>{' '}
          </div>,
        )
      },
    },
    dataLabels: {
      enabled: false,
    },
    states: {
      hover: {
        filter: { type: 'none' },
      },
      active: {
        filter: { type: 'none' },
      },
    },
    chart: {
      redrawOnParentResize: true,
    },
    plotOptions: {
      pie: {
        donut: {
          size: '45%',
          labels: {
            show: false,
            name: { show: false },
            total: {
              label: '',
              show: true,
              fontWeight: 600,
              fontSize: '32px',
              color: theme.palette.text.primary,
              formatter: val =>
                `${Number(data?.totalOrderPrice.toFixed(0)).toLocaleString()}`,
            },
            value: {
              offsetY: 6,
              fontWeight: 600,
              fontSize: '1rem',
              color: theme.palette.text.secondary,
            },
          },
        },
      },
    },
  }

  const onChangeCurrency = (type: Currency) => {
    setCurrency(type)
  }

  return (
    <GridItem xs={6} height={416}>
      <Box
        display='flex'
        flexDirection='column'
        sx={{
          width: '100%',
          height: '100%',
          overflow: 'hidden',
        }}
      >
        <Box sx={{ marginBottom: '30px' }}>
          <SectionTitle>
            <span className='title'>{title}</span>
            <ErrorOutlineIcon className='info_icon' />
          </SectionTitle>
          <SubDateDescription textAlign='left'>
            {dayjs('2023-01-24').format('MMMM D, YYYY')}
          </SubDateDescription>
        </Box>
        <Box display='flex' justifyContent='flex-end'>
          <ConvertButtonGroup onChangeCurrency={onChangeCurrency} />
        </Box>
        <Box
          display='flex'
          sx={{
            width: '100%',
            height: '100%',
            paddingBottom: '20px',
            position: 'relative',
          }}
        >
          <Box sx={{ position: 'absolute', left: '-40px' }}>
            <CustomChart
              type='donut'
              options={options}
              width={276}
              heigt={176}
              series={data?.report.map(item => item.ratio) || []}
            />
            <Typography
              fontSize='20px'
              fontWeight={500}
              sx={{ textAlign: 'center' }}
            >
              {data?.totalOrderPrice.toLocaleString()}
            </Typography>
          </Box>
          <Box sx={{ position: 'absolute', right: 0 }}>
            <List>
              {data?.report.map((item, index) => (
                <li key={`{item.name}-${index}`}>
                  <Box display='flex' alignItems='center'>
                    <StatusSquare color={colors[index]} />
                    <span className='company-name'>
                      {(getName && getName(data?.report[index])) ||
                        data?.report[index].name}
                    </span>
                  </Box>
                  <Box
                    display='flex'
                    justifyContent='space-between'
                    sx={{ width: '100%' }}
                  >
                    <span className='item-count'>({item.count})</span>
                    <span className='money'>
                      {Number(item.sum.toFixed(0)).toLocaleString()}
                    </span>
                    <span className='ratio'>{item.ratio}%</span>
                  </Box>
                </li>
              ))}
            </List>
          </Box>
        </Box>
      </Box>
    </GridItem>
  )
}

export default DoughnutChart
