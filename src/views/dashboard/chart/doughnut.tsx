import React, { Suspense, useEffect, useMemo, useState } from 'react'
import {
  ConvertButtonGroup,
  CurrencyUnit,
  GridItem,
  StatusSquare,
  Title,
} from '@src/views/dashboard/dashboardItem'
import Box from '@mui/material/Box'

import { ApexOptions } from 'apexcharts'
import { styled } from '@mui/system'
import { useDashboardRatio } from '@src/queries/dashnaord.query'
import { renderToString } from 'react-dom/server'
import {
  APIType,
  CSVDataRecordProps,
  Currency,
  RatioItem,
} from '@src/types/dashboard'
import Typography from '@mui/material/Typography'
import NoRatio from '@src/views/dashboard/noRatio'
import ReactApexcharts from '@src/@core/components/react-apexcharts'
import OptionsMenu from '@src/@core/components/option-menu'
import { OptionType } from '@src/@core/components/option-menu/types'
import DashboardForSuspense from '@src/views/dashboard/suspense'

interface DoughnutChartProps<T> extends Partial<CSVDataRecordProps> {
  title: string
  userViewDate?: string
  subTitle?: string
  from: string
  to: string
  type: string
  apiType?: APIType
  path?: string
  colors: Array<string>
  getName?: (row?: T) => string
  setOpenInfoDialog: (open: boolean, key: string) => void
  isHiddenValue?: boolean
  menuOptions?: Array<{ key: string; text: string }>
  height?: number
  overlayTitle?: string
}

const DoughnutChart = <T extends RatioItem>(props: DoughnutChartProps<T>) => {
  const {
    title,
    userViewDate,
    subTitle,
    path,
    from,
    to,
    type,
    apiType = 'u',
    colors,
    getName,
    setOpenInfoDialog,
    menuOptions,
    isHiddenValue = false,
    overlayTitle,
    setDataRecord,
  } = props
  const [currency, setCurrency] = useState<Currency>('convertedToUSD')
  const [filter, setFilter] = useState('')
  const { data, isSuccess } = useDashboardRatio<T>({
    title,
    from,
    to,
    type,
    filter,
    currency,
    apiType,
    path,
  })

  const onChangeCurrency = (type: Currency) => {
    setCurrency(type)
  }

  const getTitle = () => {
    if (filter) {
      return menuOptions?.find(item => item.key === filter)?.text || title
    }
    return title
  }

  useEffect(() => {
    const title = getTitle()
    const arr = new Array(title.length + type.length).join(' ')

    const filterList = data?.report.map((item, index) => {
      const name = (getName && getName(item)) || item.name
      return {
        //@ts-ignore
        [`${title}`]: name === 'NULL' ? '-' : name || '-',
        [`${title} Number`]: item.count || 0,
        [`${title} Percent`]: item.ratio || 0,
        [arr]: ' ',
      }
    })

    if (setDataRecord) setDataRecord(filterList || [])
  }, [data, filter])

  const getTotalPrice = () => {
    return data?.totalPrice ? data?.totalPrice : data?.totalOrderPrice
  }

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

  const filterMenuOptions: Array<OptionType> = useMemo(() => {
    if (!menuOptions) return []
    return menuOptions.map(item => {
      return {
        text: item.text,
        menuItemProps: {
          onClick: () => {
            setFilter(item.key)
          },
        },
      } as OptionType
    })
  }, [menuOptions])

  const options: ApexOptions = useMemo(() => {
    return {
      legend: { show: false },
      colors: colors,
      labels: [],
      stroke: {
        width: 5,
      },
      tooltip: {
        enabled: true,
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
                  {!isHiddenValue && (
                    <span className='tooltip__sum'>{`${Number(
                      price,
                    ).toLocaleString()}`}</span>
                  )}
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
              show: true,
              name: { show: false },
              total: {
                label: '',
                show: true,
                showAlways: true,
                fontWeight: 600,
                fontSize: '32px',
                color: '#4C4E6499',
                formatter: val => {
                  const total = data?.totalCount
                    ? data?.totalCount
                    : data?.totalOrderCount
                  return `(${Number(total || 0).toLocaleString()})`
                },
              },
            },
          },
        },
      },
    }
  }, [charData])

  return (
    <Box
      display='flex'
      flexDirection='column'
      sx={{
        width: '100%',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      <Box
        display='flex'
        alignItems='center'
        justifyContent='space-between'
        sx={{ position: 'relative' }}
      >
        <Title
          marginBottom='30px'
          title={getTitle()}
          subTitle={userViewDate || subTitle}
          openDialog={setOpenInfoDialog}
        />

        {menuOptions && (
          <Box sx={{ position: 'absolute', right: 0, top: 0 }}>
            <OptionsMenu
              iconButtonProps={{
                size: 'small',
              }}
              options={filterMenuOptions}
            />
          </Box>
        )}
      </Box>
      <Box
        display='flex'
        justifyContent='flex-end'
        sx={{ visibility: isHiddenValue ? 'hidden' : 'visible' }}
      >
        <ConvertButtonGroup onChangeCurrency={onChangeCurrency} />
      </Box>
      {!data && <NoRatio title={overlayTitle || title} />}
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
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '-45px',
              transform: 'translateY(-50%)',
            }}
          >
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
              sx={{
                textAlign: 'center',
                visibility: isHiddenValue ? 'hidden' : 'visible',
              }}
            >
              {getTotalPrice() && CurrencyUnit[currency]}
              {(getTotalPrice() || 0).toLocaleString()}
            </Typography>
          </Box>
          <Box sx={{ position: 'absolute', right: 0 }}>
            <List>
              {charData.map((item, index) => (
                <li key={`${item.name}-${index}`}>
                  <Box display='flex' alignItems='center'>
                    <StatusSquare color={colors[index]} />
                    <span className='name'>
                      {(getName && getName(charData[index] as T)) ||
                        charData[index].name}
                      <span className='item-count'>({item.count})</span>
                    </span>
                  </Box>
                  <Box display='flex' justifyContent='space-between'>
                    <span
                      className='money'
                      style={{
                        visibility: isHiddenValue ? 'hidden' : 'visible',
                      }}
                    >
                      {CurrencyUnit[currency]}
                      {Number(item.sum).toLocaleString()}
                    </span>
                    <span className='ratio'>
                      {(item.ratio || 0).toFixed(2)}%
                    </span>
                  </Box>
                </li>
              ))}
            </List>
          </Box>
        </Box>
      )}
    </Box>
  )
}

const Doughnut = <T extends RatioItem>(props: DoughnutChartProps<T>) => {
  return (
    <GridItem xs={6} height={props?.height || 416}>
      <DashboardForSuspense
        {...props}
        sectionTitle={props.title}
        refreshDataQueryKey={['ratio', props.title]}
        titleProps={{
          subTitle: props.userViewDate || props.subTitle,
        }}
      >
        <DoughnutChart {...props} />
      </DashboardForSuspense>
    </GridItem>
  )
}

export const List = styled('ul')(() => {
  return {
    width: '100%',
    listStyle: 'none',
    padding: '0 0 0 16px',

    '& > li': {
      height: '35px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      fontSize: '14px',
      color: '#4C4E64DE',
    },

    '& > li  .name': {
      display: 'block',
      fontWeight: 600,
      width: '220px',
    },

    '& > li  .left__items': {
      width: '100%',
      display: 'flex',
    },

    '& > li  .item-count': {
      marginLeft: '3px',
      color: 'rgba(76, 78, 100, 0.6)',
      fontWeight: 400,
    },

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

export const CustomChart = styled(ReactApexcharts)(() => {
  return {
    '& .apexcharts-tooltip': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '80px',
      padding: '0 20px',
      color: '#4C4E64DE !important',
      boxShadow: '0px 2px 10px 0px rgba(76, 78, 100, 0.22)',

      '& > .apexcharts-tooltip-series-group ': {},

      '& svg': {
        overflow: 'visible !important',
      },

      '& .tooltip_container': {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      },

      '& .flex-center': {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
      },

      '& .tooltip_text_bold': {
        fontWeight: 600,
      },

      '& .tooltip': {
        '&__count': {
          color: '#4C4E6499',
          margin: '0 5px 0 10px',
        },
        '&__sum': {
          fontWeight: 600,
          marginRight: '5px',
        },
        '&__ratio': {
          display: 'block',
          padding: '0 6px',
          borderRadius: '20px',
          backgroundColor: '#6D788D',
          color: '#fff',
          fontWeight: 500,
        },
      },
    },
  }
})
export default Doughnut
