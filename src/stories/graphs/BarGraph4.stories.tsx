import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import { Alert, Grid } from '@mui/material'
import CardSnippet from 'src/@core/components/card-snippet'

// ** Custom Components Imports
import ReactApexcharts from 'src/@core/components/react-apexcharts'

import { ApexOptions } from 'apexcharts'
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'
import DefaultPalette from 'src/@core/theme/palette'
import AnalyticsVisitsByDay from 'src/views/dashboards/analytics/AnalyticsVisitsByDay'

const palette = DefaultPalette('light', 'default')
const series = [{ data: [38, 55, 48, 65, 80, 38, 48] }]

const options: ApexOptions = {
  chart: {
    parentHeightOffset: 0,
    toolbar: { show: false },
  },
  plotOptions: {
    bar: {
      borderRadius: 8,
      distributed: true,
      columnWidth: '51%',
      endingShape: 'rounded',
      startingShape: 'rounded',
    },
  },
  legend: { show: false },
  dataLabels: { enabled: false },
  colors: [
    hexToRGBA(palette.warning.main, 0.1),
    hexToRGBA(palette.warning.main, 1),
    hexToRGBA(palette.warning.main, 0.1),
    hexToRGBA(palette.warning.main, 1),
    hexToRGBA(palette.warning.main, 1),
    hexToRGBA(palette.warning.main, 0.1),
    hexToRGBA(palette.warning.main, 0.1),
  ],
  states: {
    hover: {
      filter: { type: 'none' },
    },
    active: {
      filter: { type: 'none' },
    },
  },
  xaxis: {
    axisTicks: { show: false },
    axisBorder: { show: false },
    categories: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
    labels: {
      style: { colors: palette.text.disabled },
    },
  },
  yaxis: { show: false },
  grid: {
    show: false,
    padding: {
      top: -30,
      left: -7,
      right: -4,
    },
  },
}

export default {
  title: 'Graphs/Bar4',
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
      defaultValue: '215',
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

export const Example = () => {
  return <AnalyticsVisitsByDay />
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
const series = [{ data: [38, 55, 48, 65, 80, 38, 48] }]

const options: ApexOptions = {
  chart: {
    parentHeightOffset: 0,
    toolbar: { show: false },
  },
  plotOptions: {
    bar: {
      borderRadius: 8,
      distributed: true,
      columnWidth: '51%',
      endingShape: 'rounded',
      startingShape: 'rounded',
    },
  },
  legend: { show: false },
  dataLabels: { enabled: false },
  colors: [
    hexToRGBA(palette.warning.main, 0.1),
    hexToRGBA(palette.warning.main, 1),
    hexToRGBA(palette.warning.main, 0.1),
    hexToRGBA(palette.warning.main, 1),
    hexToRGBA(palette.warning.main, 1),
    hexToRGBA(palette.warning.main, 0.1),
    hexToRGBA(palette.warning.main, 0.1),
  ],
  states: {
    hover: {
      filter: { type: 'none' },
    },
    active: {
      filter: { type: 'none' },
    },
  },
  xaxis: {
    axisTicks: { show: false },
    axisBorder: { show: false },
    categories: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
    labels: {
      style: { colors: palette.text.disabled },
    },
  },
  yaxis: { show: false },
  grid: {
    show: false,
    padding: {
      top: -30,
      left: -7,
      right: -4,
    },
  },
}


const BarExample = () => {
  return <ReactApexcharts type='bar' height={215} options={options} series={series} />
}

export default BarExample;
`}</code>
  </pre>
)
