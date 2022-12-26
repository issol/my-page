import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'
// ** Custom Components Imports
import ReactApexcharts from 'src/@core/components/react-apexcharts'

import { Grid } from '@mui/material'
import { ApexOptions } from 'apexcharts'

export default {
  title: 'Graphs/Graph',
  component: ReactApexcharts,
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
      description: `display할 데이터를 전달. <code>{name:string, data:Array<any>}</code>`,
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
      // description: '차트 설정을 위한 값으로 Object타입. default는 {}',
      chart: {
        toolbar: { description: '그래프를 조작할 툴바. boolean' },
      },
    },
    label: {
      name: 'label',
      type: { name: 'string', required: true },
      defaultValue: 'Hello',
      description: 'demo description',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'Hello' },
      },
      control: {
        type: 'text',
      },
    },
  },
} as ComponentMeta<typeof ReactApexcharts>

const Template: ComponentStory<typeof ReactApexcharts> = args => {
  const series = [{ data: [50, 20, 5, 30, 15, 45] }]
  const options: ApexOptions = {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false }, //그래프를 조작할 툴바
    },
    tooltip: { enabled: false }, //그래프 클릭 시 Description 보여줄 툴팁 여부
    grid: {
      strokeDashArray: 6, //배경의 눈금 점선 폭 조절
      //   borderColor: theme.palette.divider,
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
    // colors: [hexToRGBA(theme.palette.info.main, 1)],
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
          //   strokeColor: theme.palette.info.main,
          //   fillColor: theme.palette.background.paper,
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
  return (
    <Grid item xs={6} md={2}>
      <ReactApexcharts {...args} series={series} options={options} />
    </Grid>
  )
}

export const Default = Template.bind({})
Default.args = {
  type: 'line',
}
// Default.args = {
//   name: 'color',
//   size: 'small',
//   color: 'primary',
//   onChange: e => console.log(e),
//   checked: true,
//   value: null,
// }
