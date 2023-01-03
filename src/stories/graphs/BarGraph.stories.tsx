import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import AnalyticsTotalTransactions from 'src/views/dashboards/analytics/AnalyticsTotalTransactions'
import { Alert, Grid } from '@mui/material'
import CardSnippet from 'src/@core/components/card-snippet'

// ** Custom Components Imports
import ReactApexcharts from 'src/@core/components/react-apexcharts'

import { ApexOptions } from 'apexcharts'
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'
import DefaultPalette from 'src/@core/theme/palette'

const palette = DefaultPalette('light', 'default')
const series = [
  {
    name: 'Last Week',
    data: [83, 153, 213, 279, 213, 153, 83],
  },
  {
    name: 'This Week',
    data: [-84, -156, -216, -282, -216, -156, -84],
  },
]
const options: ApexOptions = {
  chart: {
    stacked: true,
    parentHeightOffset: 0,
    toolbar: { show: false },
  },
  plotOptions: {
    bar: {
      borderRadius: 5,
      barHeight: '30%',
      horizontal: true,
      endingShape: 'flat',
      startingShape: 'rounded',
    },
  },
  tooltip: {
    y: {
      formatter: val => `${Math.abs(val)}`,
    },
  },
  xaxis: {
    position: 'top',
    axisTicks: { show: false },
    axisBorder: { show: false },
    categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    labels: {
      formatter: val => `${Math.abs(Number(val))}`,
      style: { colors: palette.text.disabled },
    },
  },
  yaxis: {
    labels: { show: false },
  },
  colors: [
    hexToRGBA(palette.primary.main, 1),
    hexToRGBA(palette.success.main, 1),
  ],
  grid: {
    borderColor: palette.divider,
    xaxis: {
      lines: { show: true },
    },
    yaxis: {
      lines: { show: false },
    },
    padding: {
      top: 5,
      bottom: -25,
    },
  },
  legend: { show: false },
  dataLabels: { enabled: false },
  states: {
    hover: {
      filter: { type: 'none' },
    },
    active: {
      filter: { type: 'none' },
    },
  },
}

export default {
  title: 'Graphs/Bar',
  component: ReactApexcharts,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    type: {
      description: '그래프의 형태',
      options: [
        'area',
        'line',
        'bar',
        'histogram',
        'pie',
        'donut',
        'radialBar',
        'scatter',
        'bubble',
        'heatmap',
        'treemap',
        'boxPlot',
        'candlestick',
        'radar',
        'polarArea',
        'rangeBar',
      ],
      control: { type: 'select' },
      type: { name: 'string', required: true },
      defaultValue: 'bar',
    },
    series: {
      description: `display할 데이터를 전달. <code>Array<{name:string, data:Array<any>}></code>`,
      defaultValue: series,
      control: { type: 'object' },
    },
    width: {
      description: '차트의 너비. string|number 타입. default는 100%',
      control: { type: 'text' },
      defaultValue: '100%',
    },
    height: {
      description: 'width와 동일.',
      control: { type: 'text' },
      defaultValue: '278',
    },
    options: {
      description: '차트 설정을 위한 값으로 ApexOptions타입. default는 {}',
      defaultValue: options,
      control: { type: 'object' },
    },
  },
} as ComponentMeta<typeof ReactApexcharts>

// const Template: ComponentStory<typeof ReactApexcharts> = args => (
//   <ReactApexcharts {...args} type='bar' height={278} />
// )

export const Default = (args: typeof ReactApexcharts) => {
  return (
    <Grid item xs={12}>
      <CardSnippet
        title='Bar Graph'
        code={{
          tsx: source,
          jsx: source,
        }}
      >
        <Alert severity='info'>
          하단의 코드는 예시입니다. 컴포넌트 명과 데이터, 컬럼의 값은 필요한
          값으로 대체하여 사용해주세요.
        </Alert>
        <div style={{ marginTop: '14px' }}>
          <ReactApexcharts {...args} />
        </div>
      </CardSnippet>
    </Grid>
  )
}

export const Example = () => {
  return <AnalyticsTotalTransactions />
}

const source = (
  <pre className='language-jsx'>
    <code className='language-jsx'>{`
// ** Custom Components Imports
import ReactApexcharts from 'src/@core/components/react-apexcharts'

import { ApexOptions } from 'apexcharts'
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'
import DefaultPalette from 'src/@core/theme/palette'

const palette = DefaultPalette('light', 'default')
const series = [
  {
    name: 'Last Week',
    data: [83, 153, 213, 279, 213, 153, 83],
  },
  {
    name: 'This Week',
    data: [-84, -156, -216, -282, -216, -156, -84],
  },
]
const options: ApexOptions = {
  chart: {
    stacked: true,
    parentHeightOffset: 0,
    toolbar: { show: false },
  },
  plotOptions: {
    bar: {
      borderRadius: 5,
      barHeight: '30%',
      horizontal: true,
      endingShape: 'flat',
      startingShape: 'rounded',
    },
  },
  tooltip: {
    y: {
      formatter: val => {Math.abs(val)},
    },
  },
  xaxis: {
    position: 'top',
    axisTicks: { show: false },
    axisBorder: { show: false },
    categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    labels: {
      formatter: val => {Math.abs(Number(val))},
      style: { colors: palette.text.disabled },
    },
  },
  yaxis: {
    labels: { show: false },
  },
  colors: [
    hexToRGBA(palette.primary.main, 1),
    hexToRGBA(palette.success.main, 1),
  ],
  grid: {
    borderColor: palette.divider,
    xaxis: {
      lines: { show: true },
    },
    yaxis: {
      lines: { show: false },
    },
    padding: {
      top: 5,
      bottom: -25,
    },
  },
  legend: { show: false },
  dataLabels: { enabled: false },
  states: {
    hover: {
      filter: { type: 'none' },
    },
    active: {
      filter: { type: 'none' },
    },
  },
}

const BarExample = () => {
  return <ReactApexcharts options={options} series={series} type='bar' height={278} />
}

export default BarExample;
`}</code>
  </pre>
)
