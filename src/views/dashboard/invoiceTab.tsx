// ** React Imports

import React, { SyntheticEvent, useEffect, useMemo, useState } from 'react'

// ** MUI Imports
import Tab from '@mui/material/Tab'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { CustomChart } from '@src/views/dashboard/chart/jobRequestBar'
import { useTheme } from '@mui/material/styles'
import { ApexOptions } from 'apexcharts'
import dayjs from 'dayjs'
import { useInvoiceOverview } from '@src/queries/dashnaord.query'
import { TotalAmountQuery } from '@src/types/dashboard'

type Invoice = {
  USD: Array<number>
  JPY: Array<number>
  KRW: Array<number>
  SGD: Array<number>
}

const InvoiceTab = (params: Omit<TotalAmountQuery, 'amountType'>) => {
  const { data } = useInvoiceOverview(params)
  const [tabIndex, setTabIndex] = useState<string>('1')

  const [tabData] = useState<Invoice>({
    USD: [],
    JPY: [],
    KRW: [],
    SGD: [],
  })

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setTabIndex(newValue)
  }

  useEffect(() => {
    if (!Array.isArray(data)) return

    data?.forEach((item, index) => {
      tabData['USD'].push(item.invoiceUSD || 0)
      tabData['JPY'].push(item.invoiceJPY || 0)
      tabData['KRW'].push(item.invoiceKRW || 0)
      tabData['SGD'].push(item.invoiceSGD || 0)
    })
  }, [params, data])

  const dateList = useMemo(() => {
    const _date = dayjs(`${params.year}-${params.month}`).set('date', 1)
    return Array(6)
      .fill(0)
      .map((i, index) => {
        return _date.add(-index, 'month').format('MMMM')
      })
  }, [params.month])

  const categories = useMemo(() => {
    const _date = dayjs(`${params.year}-${params.month}`).set('date', 1)
    return Array(6)
      .fill(0)
      .map((i, index) => {
        return _date.add(-index, 'month').format('MMM')
      })
  }, [params.month])

  return (
    <TabContext value={tabIndex}>
      <TabList onChange={handleChange} aria-label='Invoice overview Tabs'>
        <Tab
          value='1'
          label='$'
          sx={{ minWidth: 'calc(50% / 4) !important' }}
        />
        <Tab
          value='2'
          label='¥'
          sx={{ minWidth: 'calc(50% / 4) !important' }}
        />
        <Tab
          value='3'
          label='₩'
          sx={{ minWidth: 'calc(50% / 4) !important' }}
        />
        <Tab
          value='4'
          label='SGD'
          sx={{ minWidth: 'calc(50% / 4) !important' }}
        />
      </TabList>
      <TabPanel value='1' sx={{ height: '100%', padding: '0 !important' }}>
        <TabContent
          currency='$'
          categories={[...categories].reverse()}
          values={tabData.USD || []}
          dateList={[...dateList] || []}
        />
      </TabPanel>
      <TabPanel value='2' sx={{ height: '100%', padding: '0 !important' }}>
        <TabContent
          currency='¥'
          categories={[...categories].reverse()}
          values={tabData.JPY || []}
          dateList={[...dateList] || []}
        />
      </TabPanel>
      <TabPanel value='3' sx={{ height: '100%', padding: '0 !important' }}>
        <TabContent
          currency='₩'
          categories={[...categories].reverse()}
          values={tabData.KRW || []}
          dateList={[...dateList] || []}
        />
      </TabPanel>
      <TabPanel value='4' sx={{ height: '100%', padding: '0 !important' }}>
        <TabContent
          currency='$'
          categories={[...categories].reverse()}
          values={tabData.SGD || []}
          dateList={[...dateList] || []}
        />
      </TabPanel>
    </TabContext>
  )
}

interface TabContentProps {
  currency: string
  categories: Array<string>
  values: Array<number>
  dateList: Array<string>
}

const TabContent = ({
  categories,
  values,
  currency,
  dateList,
}: TabContentProps) => {
  const theme = useTheme()

  const series = [
    {
      name: 'Iovoice',
      data: values,
    },
  ]

  const options: ApexOptions = useMemo(() => {
    const max = Math.max(...values)
    const x = Number(max.toString(10)[0])
    const n = max.toString(10).slice(1).length
    const maxNumber = (x + 1) * Math.pow(10, n)
    return {
      chart: {
        type: 'bar',
        toolbar: {
          show: false,
        },
      },
      tooltip: {
        enabled: true,
        x: {
          show: true,
        },
        y: {
          formatter: (val, opts) => {
            const index =
              typeof opts.dataPointIndex === 'number'
                ? opts.dataPointIndex
                : Number(opts.dataPointIndex)
            return `${values[index]}`
          },
        },
      },
      plotOptions: {
        bar: {
          columnWidth: '24%',
          horizontal: false,
          borderRadius: 5,
          startingShape: 'rounded',
          dataLabels: {},
        },
      },
      xaxis: {
        tickAmount: 6,
        axisTicks: { show: false },
        axisBorder: { show: false },
        categories: categories,
        labels: {
          style: {
            colors: 'rgba(76, 78, 100, 0.38)',
          },
        },
      },
      yaxis: {
        tickAmount: 3,
        min: 0,
        max: maxNumber,
        labels: {
          style: {
            colors: 'rgba(76, 78, 100, 0.38)',
          },
          formatter: function (value) {
            return `${Math.round(value / 1000)}k`
          },
        },
        tooltip: {
          enabled: true,
          offsetX: 0,
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
  }, [categories, values])

  return (
    <Box display='flex' sx={{ height: '100%' }}>
      <Box sx={{ width: '50%', height: '100%', position: 'relative' }}>
        <div style={{ position: 'absolute', left: '-16px' }}>
          <CustomChart
            type='bar'
            height={240}
            options={options}
            series={series}
          />
        </div>
      </Box>
      <Box
        component='div'
        flexDirection='column'
        sx={{
          width: '50%',
          height: '100%',
          borderLeft: '1px solid #d9d9d9',
          padding: '20px 20px 0',
        }}
      >
        {dateList.map((val, index) => (
          <Box
            key={`values-${index}`}
            display='flex'
            justifyContent='space-between'
            sx={{ height: '34px' }}
          >
            <>
              <Typography
                fontSize='14px'
                fontWeight={600}
                color={
                  index === 0
                    ? 'rgba(102, 108, 255, 1)'
                    : 'rgba(76, 78, 100, 0.87)'
                }
              >
                {val}
              </Typography>
              <Typography
                fontSize='14px'
                fontWeight={600}
                color={
                  index === 0
                    ? 'rgba(102, 108, 255, 1)'
                    : 'rgba(76, 78, 100, 0.87)'
                }
              >
                {values[index] && currency}
                {values[index] ? values[index].toLocaleString() : '0'}
              </Typography>
            </>
          </Box>
        ))}
      </Box>
    </Box>
  )
}
export default InvoiceTab
