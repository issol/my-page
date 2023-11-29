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
import { Currency } from '@src/types/dashboard'

const List = styled('ul')(() => {
  return {
    minWidth: '378px',
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
      width: '48px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '20px',
      fontWeight: 600,
      color: '#fff',
      borderRadius: '64px',
      fontSize: '12px',
      backgroundColor: '#4C4E64DE',
    },
  }
})

const DoughnutChart = () => {
  const theme = useTheme()

  const [currency, setCurrency] = useState<Currency>('USD')
  const { data } = useDashboardRatio(
    {
      from: '2021-01-01',
      to: '2023-12-01',
      type: 'client',
    },
    currency,
  )

  const options: ApexOptions = {
    legend: { show: false },
    colors: Colors,
    labels: [],
    stroke: {
      width: 10,
    },
    tooltip: {
      custom: function ({ series, seriesIndex, dataPointIndex, w }) {
        const price = data?.reportByClient[seriesIndex].sum.toFixed(0)

        return renderToString(
          <div className='tooltip_container'>
            <StatusSquare color='#FF9E90' />
            <span className='tooltip_text_bold'>
              {data?.reportByClient[seriesIndex].name}
            </span>
            <span className='tooltip__count'>{`(${data?.reportByClient[seriesIndex].count})`}</span>
            <span className='tooltip__sum'>{`${Number(
              price,
            ).toLocaleString()}`}</span>
            <span className='tooltip__ratio'>{`${data?.reportByClient[seriesIndex].ratio}%`}</span>
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
          labels: {
            show: true,
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
    console.log(type)
    setCurrency('SGD')
  }

  return (
    <GridItem height={416} sm>
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
            <span className='title'>Clients</span>
            <ErrorOutlineIcon className='info_icon' />
          </SectionTitle>
          <SubDateDescription textAlign='left'>
            {dayjs('2023-01-24').format('MMMM D, YYYY')}
          </SubDateDescription>
        </Box>
        <Box display='flex' justifyContent='flex-end'>
          <ConvertButtonGroup onChangeCurrency={onChangeCurrency} />
        </Box>
        <Box display='flex' sx={{ height: '100%', paddingBottom: '20px' }}>
          <CustomChart
            type='donut'
            options={options}
            series={data?.reportByClient.map(item => item.ratio)}
          />
          <Box
            sx={{
              borderLeft:
                '1px solid var(--light-other-divider, rgba(76, 78, 100, 0.12))',
            }}
          >
            <List>
              {data?.reportByClient.map((item, index) => (
                <li key={`{item.name}-${index}`}>
                  <Box display='flex' alignItems='center'>
                    <StatusSquare color={Colors[index]} />
                    <span className='company-name'>{item.name}</span>
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
