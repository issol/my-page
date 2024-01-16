import React, { Suspense, useMemo } from 'react'
import { CustomChart, List } from '@src/views/dashboard/chart/doughnut'
import { ApexOptions } from 'apexcharts'
import { renderToString } from 'react-dom/server'
import { StatusSquare } from '@src/views/dashboard/dashboardItem'
import { FourthColors } from '@src/shared/const/dashboard/chart'
import Box from '@mui/material/Box'
import { toCapitalize } from '@src/pages/dashboards/lpm'
import NoRatio from '@src/views/dashboard/noRatio'

interface AccountDoughnutProps {
  data: Array<{
    count: number
    name: string
    ratio: number
  }>
  totalCount: number
}

const AccountDoughnut = ({ data, totalCount }: AccountDoughnutProps) => {
  const isNoRatio = data.every(item => item.ratio === 0)

  const options: ApexOptions = useMemo(() => {
    return {
      legend: { show: false },
      colors: isNoRatio ? ['#F1F1F3'] : FourthColors,
      labels: [],
      stroke: {
        width: isNoRatio ? 0 : 5,
      },
      tooltip: {
        enabled: !isNoRatio,
        custom: function ({ series, seriesIndex, dataPointIndex, w }) {
          return renderToString(
            <div
              className='flex-center'
              style={{ alignItems: 'flex-start', paddingTop: '10px' }}
            >
              <StatusSquare color={FourthColors[seriesIndex]} />
              <div className='tooltip_container'>
                <div className='flex-center'>
                  <span className='tooltip_text_bold'>
                    {data[seriesIndex]?.name || '-'}
                  </span>
                  <span className='tooltip__count'>{`(${data[seriesIndex]?.count})`}</span>
                </div>
                <div className='flex-center' style={{ marginTop: '10px' }}>
                  <span className='tooltip__sum'></span>
                  <span className='tooltip__ratio'>{`${data[seriesIndex]?.ratio}%`}</span>
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
          offsetX: 0,
          offsetY: 62,
          customScale: isNoRatio ? 1.4 : 1.5,
          donut: {
            size: isNoRatio ? '60%' : '45%',
            expandOnClick: false,
            labels: {
              show: true,
              name: { show: false },
              value: {
                fontSize: '13px',
                color: '#4C4E6499',
                offsetY: 5,
              },
              total: {
                label: '',
                show: true,
                showAlways: true,
                fontWeight: 600,
                fontSize: '32px',
                color: '#4C4E6499',
                formatter: val =>
                  `(${Number(totalCount || 0).toLocaleString()})`,
              },
            },
          },
        },
      },
    }
  }, [data, totalCount, isNoRatio])

  return (
    <Box display='flex' alignItems='center' sx={{ width: '100%' }}>
      {data.length === 0 && <NoRatio title='' />}
      <Suspense fallback={<div>로딩 중</div>}>
        <Box>
          <CustomChart
            type='donut'
            options={options}
            width={192}
            heigt={176}
            series={isNoRatio ? [100] : data.map(item => item.ratio)}
          />
        </Box>
      </Suspense>
      <Box sx={{ width: '100%', marginRight: '20px' }}>
        <List>
          {data.map((item, index) => (
            <li key={`{item.name}-${index}`}>
              <Box display='flex' alignItems='center'>
                <StatusSquare color={FourthColors[index]} />
                <span className='name'>
                  {toCapitalize(item.name || '-')}
                  <span className='item-count'>
                    ({(item.count || 0).toLocaleString()})
                  </span>
                </span>
              </Box>
              <Box display='flex'>
                <span style={{ width: '80px' }} />
                <span className='ratio'>{item.ratio || '0.0'}%</span>
              </Box>
            </li>
          ))}
        </List>
      </Box>
    </Box>
  )
}

export default AccountDoughnut
