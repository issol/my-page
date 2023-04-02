import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'

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
    type: 'column',
    name: 'Earning',
    data: [90, 52, 67, 45, 75, 55, 48],
  },
  {
    type: 'column',
    name: 'Expense',
    data: [-53, -29, -67, -84, -60, -40, -77],
  },
  {
    type: 'line',
    name: 'Expense',
    data: [73, 20, 50, -20, 58, 15, 31],
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
      borderRadius: 8,
      columnWidth: '57%',
      endingShape: 'flat',
      startingShape: 'rounded',
    },
  },
  markers: {
    size: 4,
    strokeWidth: 3,
    fillOpacity: 1,
    strokeOpacity: 1,
    colors: [palette.background.paper],
    strokeColors: hexToRGBA(palette.warning.main, 1),
  },
  stroke: {
    curve: 'smooth',
    width: [0, 0, 3],
    colors: [hexToRGBA(palette.warning.main, 1)],
  },
  colors: [
    hexToRGBA(palette.primary.main, 1),
    hexToRGBA(palette.primary.main, 0.12),
  ],
  dataLabels: { enabled: false },
  states: {
    hover: {
      filter: { type: 'none' },
    },
    active: {
      filter: { type: 'none' },
    },
  },
  legend: { show: false },
  grid: {
    yaxis: {
      lines: { show: false },
    },
    padding: {
      top: -28,
      left: -6,
      right: -8,
      bottom: -5,
    },
  },
  xaxis: {
    axisTicks: { show: false },
    axisBorder: { show: false },
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    labels: {
      style: { colors: palette.text.disabled },
    },
  },
  yaxis: {
    max: 100,
    min: -90,
    show: false,
  },
}

export default {
  title: 'Graphs/Line2',
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
      defaultValue: 'line',
    },
    series: {
      description: `display할 데이터를 전달. <code>Array<{type:string, name:string, data:Array<any>}></code>`,
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
      defaultValue: '251',
    },
    options: {
      description: '차트 설정을 위한 값으로 ApexOptions타입. default는 {}',
      defaultValue: options,
      control: { type: 'object' },
    },
  },
} as ComponentMeta<typeof ReactApexcharts>

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

const source = (
  <pre className='language-jsx'>
    <code className='language-jsx'>{`
// ** Custom Components Imports
// ** Custom Components Imports
import ReactApexcharts from 'src/@core/components/react-apexcharts'

import { ApexOptions } from 'apexcharts'
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'
import DefaultPalette from 'src/@core/theme/palette'

const palette = DefaultPalette('light', 'default')
const series = [
  {
    type: 'column',
    name: 'Earning',
    data: [90, 52, 67, 45, 75, 55, 48],
  },
  {
    type: 'column',
    name: 'Expense',
    data: [-53, -29, -67, -84, -60, -40, -77],
  },
  {
    type: 'line',
    name: 'Expense',
    data: [73, 20, 50, -20, 58, 15, 31],
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
      borderRadius: 8,
      columnWidth: '57%',
      endingShape: 'flat',
      startingShape: 'rounded',
    },
  },
  markers: {
    size: 4,
    strokeWidth: 3,
    fillOpacity: 1,
    strokeOpacity: 1,
    colors: [palette.background.paper],
    strokeColors: hexToRGBA(palette.warning.main, 1),
  },
  stroke: {
    curve: 'smooth',
    width: [0, 0, 3],
    colors: [hexToRGBA(palette.warning.main, 1)],
  },
  colors: [
    hexToRGBA(palette.primary.main, 1),
    hexToRGBA(palette.primary.main, 0.12),
  ],
  dataLabels: { enabled: false },
  states: {
    hover: {
      filter: { type: 'none' },
    },
    active: {
      filter: { type: 'none' },
    },
  },
  legend: { show: false },
  grid: {
    yaxis: {
      lines: { show: false },
    },
    padding: {
      top: -28,
      left: -6,
      right: -8,
      bottom: -5,
    },
  },
  xaxis: {
    axisTicks: { show: false },
    axisBorder: { show: false },
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    labels: {
      style: { colors: palette.text.disabled },
    },
  },
  yaxis: {
    max: 100,
    min: -90,
    show: false,
  },
}


const Example = () => {
  return <ReactApexcharts type='line' height={251} series={series} options={options} />
}

export default BarExample;
`}</code>
  </pre>
)
