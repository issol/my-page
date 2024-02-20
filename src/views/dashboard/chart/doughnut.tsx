import React, { useEffect, useMemo, useState } from 'react'
import {
  ConvertButtonGroup,
  CurrencyUnit,
  GridItem,
  StatusSquare,
  Title,
} from '@src/views/dashboard/dashboardItem'
import Box from '@mui/material/Box'
import { styled } from '@mui/system'
import { useDashboardRatio } from '@src/queries/dashnaord.query'
import {
  APIType,
  CSVDataRecordProps,
  Currency,
  RatioItem,
} from '@src/types/dashboard'
import { OptionType } from '@src/@core/components/option-menu/types'
import DashboardForSuspense from '@src/views/dashboard/suspense'
import {
  ArcElement,
  Chart as ChartJS,
  ChartOptions,
  Legend,
  Plugin,
  Tooltip,
} from 'chart.js'
import { Doughnut as Chart } from 'react-chartjs-2'
import OptionsMenu from '@src/@core/components/option-menu'
import {
  getStringCountTooltip,
  getStringPriceTooltip,
} from '@src/views/dashboard/chart/tooltip'

ChartJS.register(ArcElement, Tooltip, Legend)

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

  const datasets = useMemo(() => {
    const labels =
      charData.length !== 0 ? charData.map(item => item.name) : ['']
    const data =
      charData.length !== 0 ? charData.map(item => item.ratio) : [100]
    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor: charData.length === 0 ? '#F1F1F3' : colors,
        },
      ],
    }
  }, [charData])

  const options: ChartOptions<'doughnut'> = {
    cutout: '55%',
    spacing: charData.length === 0 ? 0 : 2,
    offset: charData.length === 0 ? 0 : 5,
    responsive: false,
    maintainAspectRatio: true,
    borderColor: charData.length === 0 ? '#F1F1F3' : 'transparent',
    hover: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
        position: 'average',
        external: ({ chart, tooltip }) => {
          if (!data) return
          let tooltipEl = chart.canvas.parentNode?.querySelector('div')

          if (!tooltipEl) {
            tooltipEl = document.createElement('div')
            tooltipEl.style.background = 'rgb(255, 255, 255)'
            tooltipEl.style.borderRadius = '3px'
            tooltipEl.style.color = '#4C4E64DE'
            tooltipEl.style.opacity = '1'
            tooltipEl.style.pointerEvents = 'none'
            tooltipEl.style.position = 'absolute'
            tooltipEl.style.transform = 'translate(-50%, 0)'
            tooltipEl.style.transition = 'all .1s ease'
            tooltipEl.style.padding = '0 12px'
            tooltipEl.style.boxShadow =
              '0px 2px 10px 0px rgba(76, 78, 100, 0.22)'
            tooltipEl.style.borderRadius = '10px'

            const table = document.createElement('table')
            table.style.margin = '0px'

            tooltipEl.appendChild(table)
            chart.canvas.parentNode?.appendChild(tooltipEl)
          }

          if (tooltip.opacity === 0) {
            tooltipEl.style.opacity = '0'
            return
          }

          const index = tooltip.dataPoints[0].dataIndex

          let renderViewToolTipContent = ''

          if ('price' in charData[index]) {
            renderViewToolTipContent = getStringPriceTooltip({
              color: colors[index],
              count: charData[index]?.count,
              name:
                (getName && getName(charData[index] as T)) ||
                charData[index]?.name,
              ratio: charData[index]?.ratio,
              price: `${CurrencyUnit[currency]}${charData[index]?.sum}`,
            })
          } else {
            renderViewToolTipContent = getStringCountTooltip({
              color: colors[index],
              count: charData[index]?.count,
              name:
                (getName && getName(charData[index] as T)) ||
                charData[index]?.name,
              ratio: charData[index]?.ratio,
            })
          }

          tooltipEl.innerHTML = renderViewToolTipContent
          const { offsetLeft: positionX, offsetTop: positionY } = chart.canvas
          tooltipEl.style.opacity = '1'
          tooltipEl.style.left = positionX + tooltip.caretX + 'px'
          tooltipEl.style.top = positionY + tooltip.caretY + 'px'
          tooltipEl.style.padding =
            tooltip.options.padding + 'px ' + tooltip.options.padding + 'px'
        },
      },
    },
  }

  const innerLabel: Plugin<'doughnut'>[] = useMemo(() => {
    return [
      {
        id: 'innerLabel',
        beforeDraw: chart => {
          const ctx = chart.ctx
          // @ts-ignore
          const index = chart._active[0]?.index

          const xCoor =
            chart.chartArea.left +
            (chart.chartArea.right - chart.chartArea.left) / 2
          const yCoor =
            chart.chartArea.top +
            (chart.chartArea.bottom - chart.chartArea.top) / 2
          ctx.save()
          ctx.font = '18px sans-serif'
          ctx.fillStyle = '#4C4E6499'
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.fillText(
            `(${charData[index]?.count || data?.totalCount || 0})`,
            xCoor,
            yCoor,
          )
          ctx.restore()
        },
      },
    ]
  }, [charData])

  return (
    <Box
      display='flex'
      flexDirection='column'
      sx={{
        width: '100%',
        height: '100%',
      }}
    >
      <Box
        display='flex'
        alignItems='center'
        justifyContent='space-between'
        sx={{ position: 'relative' }}
      >
        <Title
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

      <Box
        display='flex'
        alignItems='center'
        justifyContent='space-between'
        flexWrap='wrap'
        sx={{ width: '100%', height: '100%' }}
      >
        <div style={{ width: '210px' }}>
          <CustomChart
            data={datasets}
            options={options}
            plugins={innerLabel}
            width='200'
            height='200'
          />
        </div>
        <Box sx={{ width: 'calc(100% - 230px)' }}>
          {charData.length === 0 && (
            <span
              style={{ display: 'block', width: '100%', textAlign: 'center' }}
            >
              {overlayTitle}
            </span>
          )}
          <List>
            {charData.map((item, index) => (
              <li key={`${item.name}-${index}`}>
                <Box
                  display='flex'
                  alignItems='center'
                  justifyContent='flex-start'
                  flexShrink={1}
                  flexGrow={0}
                  overflow='hidden'
                  sx={{ minWidth: '120px', padding: '0 3px' }}
                >
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
                  <span className='ratio'>{(item.ratio || 0).toFixed(1)}%</span>
                </Box>
              </li>
            ))}
          </List>
        </Box>
      </Box>
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
    display: 'flex',
    flexDirection: 'column',
    listStyle: 'none',
    padding: '0 0 0 16px',

    '& > li': {
      flexGrow: 1,
      flexShrink: 1,
      minWidth: 0,
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: '35px',
      fontSize: '14px',
      color: '#4C4E64DE',
    },

    '& > li  .name': {
      minWidth: '100px',
      height: 'fit-content',
      display: 'block',
      fontWeight: 600,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },

    '& > li  .left__items': {
      display: 'flex',
    },

    '& > li  .item-count': {
      marginLeft: '3px',
      color: 'rgba(76, 78, 100, 0.6)',
      fontWeight: 400,
    },

    '& > li  .money': {
      fontWeight: 600,
      textAlign: 'right',
      marginRight: '16px',
    },

    '& > li  .ratio': {
      fontFamily: 'Inter',
      width: '46px',
      padding: '0 7px',
      height: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 500,
      color: '#fff',
      borderRadius: '64px',
      fontSize: '12px',
      letterSpacing: '0.14px',
      backgroundColor: '#4C4E64DE',
    },
  }
})

export const CustomChart = styled(Chart)(() => {
  return {
    '& .tooltip': {
      '&__count': {
        color: '#4C4E6499',
        margin: '0 5px 0 10px',
      },
      '&__sum': {
        fontWeight: 600,
        marginRight: '5px',
      },
      '&__ratio': {},
    },
  }
})
export default Doughnut
