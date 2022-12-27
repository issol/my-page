import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'
// ** Custom Components Imports
import ReactApexcharts from 'src/@core/components/react-apexcharts'

import { ApexOptions } from 'apexcharts'
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'
import DefaultPalette from 'src/@core/theme/palette'
import AnalyticsTotalTransactions from 'src/views/dashboards/analytics/AnalyticsTotalTransactions'

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
    },
    series: {
      description: `display할 데이터를 전달. <code>Array<{name:string, data:Array<any>}></code>`,
      defaultValue: series,
      control: { type: 'object' },
    },
    width: {
      description: '차트의 너비. string|number 타입. default는 100%',
      control: { type: 'text' },
    },
    height: {
      description: 'width와 동일. default는 auto',
      control: { type: 'text' },
    },
    options: {
      description: '차트 설정을 위한 값으로 Object타입. default는 {}',
      defaultValue: options,
      control: { type: 'object' },
    },
  },
} as ComponentMeta<typeof ReactApexcharts>

const Template: ComponentStory<typeof ReactApexcharts> = args => (
  <ReactApexcharts {...args} type='bar' height={278} />
)
// export const BarDefault = Template.bind({})
export const BarDefault = (args: typeof ReactApexcharts) => {
  return <ReactApexcharts {...args} type='bar' height={278} />
}

export const BarExample = () => {
  return <AnalyticsTotalTransactions />
}
