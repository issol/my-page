import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'
// ** Custom Components Imports
import ReactApexcharts from 'src/@core/components/react-apexcharts'

import { Grid } from '@mui/material'
import { ApexOptions } from 'apexcharts'
import AnalyticsSessions from 'src/views/dashboards/analytics/AnalyticsSessions'

const series = [{ data: [50, 20, 5, 30, 15, 45] }]
const options: ApexOptions = {
  chart: {
    parentHeightOffset: 0,
    toolbar: { show: false }, //그래프를 조작할 툴바
  },
  tooltip: { enabled: false }, //그래프 클릭 시 Description 보여줄 툴팁 여부
  grid: {
    strokeDashArray: 6, //배경의 눈금 점선 폭 조절
    borderColor: '#E0E0E0',
    xaxis: {
      lines: { show: true }, //x축 눈금
    },
    yaxis: {
      lines: { show: false }, //y축 눈금
    },
    padding: {
      //padding은 그래프 내부 박스의 Padding
      top: -15,
      left: -7,
      right: 7,
      bottom: -15,
    },
  },
  stroke: { width: 3 }, //Line그래프 두께
  colors: ['#26C6F9'],
  markers: {
    size: 6,
    offsetY: 2,
    offsetX: -1,
    strokeWidth: 3,
    colors: ['transparent'], //line그래프 꺾임 포인트에 강조를 줄 동그라미의 컬러
    strokeColors: 'transparent', //line그래프의 꺾임 포인트에 강조를 줄 포인터의 컬러
    discrete: [
      {
        size: 6,
        seriesIndex: 0,
        strokeColor: '#26C6F9',
        fillColor: '#ffffff',
        dataPointIndex: series[0].data.length - 1,
      },
    ],
    hover: { size: 7 },
  },
  xaxis: {
    labels: { show: false },
    axisTicks: { show: false },
    axisBorder: { show: false },
  },
  yaxis: {
    labels: { show: false },
  },
}

export default {
  title: 'Graphs/Line',
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
      defaultValue: { data: [50, 20, 5, 30, 15, 45] },
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

export const LineDefault = (args: typeof ReactApexcharts) => {
  return (
    <Grid item xs={6} md={2}>
      <ReactApexcharts
        {...args}
        type='line'
        series={series}
        options={options}
      />
    </Grid>
  )
}

export const LineExample = () => {
  return <AnalyticsSessions />
}
