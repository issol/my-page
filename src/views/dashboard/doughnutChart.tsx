import React, { Suspense, useCallback, useMemo, useState } from 'react'
import {
  ConvertButtonGroup,
  CurrencyUnit,
  GridItem,
  SectionTitle,
  StatusSquare,
  SubDateDescription,
  Title,
} from '@src/views/dashboard/dashboardItem'
import { Box } from '@mui/material'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import dayjs from 'dayjs'
import { CustomChart } from '@src/views/dashboard/chart'
import { ApexOptions } from 'apexcharts'
import { Colors } from '@src/shared/const/dashboard/chart'
import { useTheme } from '@mui/material/styles'
import styled from '@emotion/styled'
import { useDashboardRatio } from '@src/queries/dashboard/dashnaord-lpm'
import { renderToString } from 'react-dom/server'
import { APIType, Currency, RatioItem } from '@src/types/dashboard'
import Typography from '@mui/material/Typography'
import NoRatio from '@src/views/dashboard/noRatio'
import { KeyboardArrowRight } from '@mui/icons-material'
import { useRouter } from 'next/router'

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
  apiType?: APIType
  colors: Array<string>
  getName?: (row?: T) => string
  userViewDate: string
  setOpenInfoDialog: (open: boolean, key: string) => void
}

const DoughnutChart = <T extends RatioItem>({
  title,
  from,
  to,
  type,
  apiType = 'u',
  colors,
  getName,
  userViewDate,
  setOpenInfoDialog,
}: DoughnutChartProps<T>) => {
  const theme = useTheme()

  const [currency, setCurrency] = useState<Currency>('convertedToUSD')
  const { data, isSuccess } = useDashboardRatio<T>({
    from,
    to,
    type,
    currency,
    apiType,
  })

  const charData = useMemo(() => {
    const sortData = data?.report.sort((item1, item2) => item2.sum - item1.sum)
    const sliceData = sortData?.slice(0, 6) || []
    const tempData = sortData?.slice(6) || []

    if (sliceData.length === 0) return []
    if (tempData.length === 0) return sliceData

    const filter = ['count', 'sum', 'ratio', 'sortingOrder']
    const key =
      sliceData[0] &&
      Object.keys(sliceData[0]).filter(str => !filter.includes(str))[0]

    // @ts-ignore
    const obj = { count: 0, ratio: 0, sortingOrder: 0, sum: 0, [key]: 'etc.' }

    tempData?.forEach(item => {
      obj.count = obj.count + item.count
      obj.sum += item.sum
      obj.ratio += item.ratio
    })

    return [...sliceData, obj]
  }, [data?.report])

  const options: ApexOptions = useMemo(() => {
    return {
      legend: { show: false },
      colors: colors,
      labels: [],
      stroke: {
        width: 5,
      },
      tooltip: {
        custom: function ({ series, seriesIndex, dataPointIndex, w }) {
          const price = charData[seriesIndex]?.sum || 0

          return renderToString(
            <div
              className='flex-center'
              style={{ alignItems: 'flex-start', paddingTop: '10px' }}
            >
              <StatusSquare color={colors[seriesIndex]} />
              <div className='tooltip_container'>
                <div className='flex-center'>
                  <span className='tooltip_text_bold'>
                    {(getName && getName(charData[seriesIndex] as T)) ||
                      charData[seriesIndex].name}
                  </span>
                  <span className='tooltip__count'>{`(${charData[seriesIndex].count})`}</span>
                </div>
                <div className='flex-center' style={{ marginTop: '10px' }}>
                  <span className='tooltip__sum'>{`${Number(
                    price,
                  ).toLocaleString()}`}</span>
                  <span className='tooltip__ratio'>{`${charData[seriesIndex].ratio}%`}</span>
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
                  `${Number(
                    (data?.totalOrderPrice || 0).toFixed(0),
                  ).toLocaleString()}`,
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
  }, [charData])

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
        <Title
          marginBottom='30px'
          title={title}
          subTitle={userViewDate}
          openDialog={setOpenInfoDialog}
        />

        <Box display='flex' justifyContent='flex-end'>
          <ConvertButtonGroup onChangeCurrency={onChangeCurrency} />
        </Box>
        {!data && <NoRatio title={title} />}
        {data && (
          <Box
            display='flex'
            sx={{
              width: '100%',
              height: '100%',
              paddingBottom: '20px',
              position: 'relative',
            }}
          >
            <Suspense fallback={<div>로딩 중</div>}>
              <Box sx={{ position: 'absolute', left: '-40px' }}>
                <CustomChart
                  type='donut'
                  options={options}
                  width={276}
                  heigt={176}
                  series={charData.map(item => item.ratio) || []}
                />
                <Typography
                  fontSize='20px'
                  fontWeight={500}
                  sx={{ textAlign: 'center' }}
                >
                  {data?.totalOrderPrice && CurrencyUnit[currency]}
                  {(data?.totalOrderPrice || 0).toLocaleString()}
                </Typography>
              </Box>
            </Suspense>
            <Box sx={{ position: 'absolute', right: 0 }}>
              <List>
                {charData.map((item, index) => (
                  <li key={`{item.name}-${index}`}>
                    <Box display='flex' alignItems='center'>
                      <StatusSquare color={colors[index]} />
                      <span className='company-name'>
                        {(getName && getName(charData[index] as T)) ||
                          charData[index].name}
                      </span>
                    </Box>
                    <Box
                      display='flex'
                      justifyContent='space-between'
                      sx={{ width: '100%' }}
                    >
                      <span className='item-count'>({item.count})</span>
                      <span className='money'>
                        {CurrencyUnit[currency]}
                        {Number(item.sum).toLocaleString()}
                      </span>
                      <span className='ratio'>{item.ratio || 0}%</span>
                    </Box>
                  </li>
                ))}
              </List>
            </Box>
          </Box>
        )}
      </Box>
    </GridItem>
  )
}

export default DoughnutChart
