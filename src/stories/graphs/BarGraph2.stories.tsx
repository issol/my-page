import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import { Alert, Grid } from '@mui/material'
import CardSnippet from '@src/@core/components/card-snippet'

// ** Custom Components Imports
import ReactApexcharts from '@src/@core/components/react-apexcharts'

import { ApexOptions } from 'apexcharts'
import { hexToRGBA } from '@src/@core/utils/hex-to-rgba'
import DefaultPalette from '@src/@core/theme/palette'

const palette = DefaultPalette('light', 'default')
const series = [
  {
    name: 'Sales',
    data: [17165, 13850, 12375, 9567, 7880],
  },
]

const options: ApexOptions = {
  chart: {
    parentHeightOffset: 0,
    toolbar: { show: false },
  },
  plotOptions: {
    bar: {
      borderRadius: 8,
      barHeight: '60%',
      horizontal: true,
      distributed: true,
      startingShape: 'rounded',
    },
  },
  dataLabels: {
    offsetY: 8,
    style: {
      fontWeight: 500,
      fontSize: '0.875rem',
    },
  },
  grid: {
    strokeDashArray: 8,
    borderColor: palette.divider,
    xaxis: {
      lines: { show: true },
    },
    yaxis: {
      lines: { show: false },
    },
    padding: {
      top: -18,
      left: 21,
      right: 33,
      bottom: 10,
    },
  },
  colors: [
    hexToRGBA(palette.primary.light, 1),
    hexToRGBA(palette.success.light, 1),
    hexToRGBA(palette.warning.light, 1),
    hexToRGBA(palette.info.light, 1),
    hexToRGBA(palette.error.light, 1),
  ],
  legend: { show: false },
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
    categories: ['US', 'IN', 'JA', 'CA', 'AU'],
    labels: {
      formatter: val => `${Number(val) / 1000}k`,
      style: {
        fontSize: '0.875rem',
        colors: palette.text.disabled,
      },
    },
  },
  yaxis: {
    labels: {
      align: 'right',
      style: {
        fontWeight: 600,
        fontSize: '0.875rem',
        colors: palette.text.primary,
      },
    },
  },
}

export default {
  title: 'Graphs/Bar2',
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
      defaultValue: '332',
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
import ReactApexcharts from '@src/@core/components/react-apexcharts'

import { ApexOptions } from 'apexcharts'
import { hexToRGBA } from '@src/@core/utils/hex-to-rgba'
import DefaultPalette from '@src/@core/theme/palette'

const palette = DefaultPalette('light', 'default')
const series = [
  {
    name: 'Sales',
    data: [17165, 13850, 12375, 9567, 7880],
  },
]

const options: ApexOptions = {
  chart: {
    parentHeightOffset: 0,
    toolbar: { show: false },
  },
  plotOptions: {
    bar: {
      borderRadius: 8,
      barHeight: '60%',
      horizontal: true,
      distributed: true,
      startingShape: 'rounded',
    },
  },
  dataLabels: {
    offsetY: 8,
    style: {
      fontWeight: 500,
      fontSize: '0.875rem',
    },
  },
  grid: {
    strokeDashArray: 8,
    borderColor: palette.divider,
    xaxis: {
      lines: { show: true },
    },
    yaxis: {
      lines: { show: false },
    },
    padding: {
      top: -18,
      left: 21,
      right: 33,
      bottom: 10,
    },
  },
  colors: [
    hexToRGBA(palette.primary.light, 1),
    hexToRGBA(palette.success.light, 1),
    hexToRGBA(palette.warning.light, 1),
    hexToRGBA(palette.info.light, 1),
    hexToRGBA(palette.error.light, 1),
  ],
  legend: { show: false },
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
    categories: ['US', 'IN', 'JA', 'CA', 'AU'],
    labels: {
      formatter: val => {Number(val) / 1000}k,
      style: {
        fontSize: '0.875rem',
        colors: palette.text.disabled,
      },
    },
  },
  yaxis: {
    labels: {
      align: 'right',
      style: {
        fontWeight: 600,
        fontSize: '0.875rem',
        colors: palette.text.primary,
      },
    },
  },
}


const BarExample = () => {
  return <ReactApexcharts type='bar' height={332} series={series} options={options} />
}

export default BarExample;
`}</code>
  </pre>
)
