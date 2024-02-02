import React, { Dispatch, Suspense, useEffect, useMemo } from 'react'
import { CustomChart, List } from '@src/views/dashboard/chart/doughnut'
import { ApexOptions } from 'apexcharts'
import { renderToString } from 'react-dom/server'
import { StatusSquare } from '@src/views/dashboard/dashboardItem'
import { FourthColors } from '@src/shared/const/dashboard/chart'
import Box from '@mui/material/Box'
import { toCapitalize } from '@src/pages/dashboards/lpm'
import {
  AccountRatio,
  DEFAULT_QUERY_NAME,
  useAccountRatio,
} from '@src/queries/dashnaord.query'
import { Office } from '@src/types/dashboard'
import sortBy from 'lodash/sortBy'
import { TryAgain } from '@src/views/dashboard/suspense'
import FallbackSpinner from '@src/@core/components/spinner'
import { ErrorBoundary } from 'react-error-boundary'

const ClientData = [
  { count: 0, name: 'Direct deposit', type: '', ratio: 0 },
  { count: 0, name: 'PayPal', type: '', ratio: 0 },
  { count: 0, name: 'Check', type: '', ratio: 0 },
  { count: 0, name: 'Wise', type: '', ratio: 0 },
]

const ProData = [
  { count: 0, name: 'Korea domestic transfer', type: '', ratio: 0 },
  { count: 0, name: 'US ACH (US residents only)', type: '', ratio: 0 },
  { count: 0, name: 'PayPal', type: '', ratio: 0 },
  { count: 0, name: 'Transferwise (Wise)', type: '', ratio: 0 },
  { count: 0, name: 'International wire', type: '', ratio: 0 },
]

interface AccountDoughnutProps {
  userType: 'client' | 'pro'
  office?: Office
  setItemData: Dispatch<Array<AccountRatio>>
}

const Doughnut = ({ userType, office, setItemData }: AccountDoughnutProps) => {
  const { data } = useAccountRatio({ userType, office })

  useEffect(() => {
    setItemData(data?.report || [])
  }, [data])

  const ratioData = useMemo(() => {
    if (!data || data?.totalCount === 0) {
      if (userType === 'client') return ClientData
      return ProData
    }

    const keyName = userType === 'client' ? 'paymentMethod' : 'type'

    return sortBy(
      data?.report.map(item => ({
        ...item,
        name: item?.[keyName] || '',
      })),
      ['count', 'name'],
    ).reverse()
  }, [data])

  const isNoRatio = useMemo(
    () => ratioData.every(item => item.ratio === 0) || false,
    [ratioData],
  )

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
                    {ratioData[seriesIndex]?.name || '-'}
                  </span>
                  <span className='tooltip__count'>{`(${ratioData[seriesIndex]?.count})`}</span>
                </div>
                <div className='flex-center' style={{ marginTop: '10px' }}>
                  <span className='tooltip__sum'></span>
                  <span className='tooltip__ratio'>{`${ratioData[seriesIndex]?.ratio}%`}</span>
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
          offsetY: 3,
          customScale: isNoRatio ? 1.1 : 1.2,
          donut: {
            size: '45%',
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
                  `(${Number(data?.totalCount || 0).toLocaleString()})`,
              },
            },
          },
        },
      },
    }
  }, [ratioData, isNoRatio])

  return (
    <Box
      display='flex'
      alignItems='center'
      sx={{ width: '100%', height: '70%' }}
    >
      <Box>
        <CustomChart
          type='donut'
          options={options}
          width={220}
          heigt={352}
          series={isNoRatio ? [100] : ratioData?.map(item => item.ratio)}
        />
      </Box>

      <Box sx={{ width: '100%', marginRight: '20px' }}>
        <List>
          {ratioData?.map((item, index) => (
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

const AccountDoughnut = (props: AccountDoughnutProps) => {
  return (
    <Suspense fallback={<FallbackSpinner />}>
      <ErrorBoundary
        fallback={
          <TryAgain
            refreshDataQueryKey={[
              DEFAULT_QUERY_NAME,
              'AccountRatio',
              props.userType,
            ]}
          />
        }
      >
        <Doughnut {...props} />
      </ErrorBoundary>
    </Suspense>
  )
}

export default AccountDoughnut
