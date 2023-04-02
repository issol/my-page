import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import { Alert, Grid } from '@mui/material'
import CardSnippet from 'src/@core/components/card-snippet'
// ** Custom Components Imports
import ReactApexcharts from 'src/@core/components/react-apexcharts'

import { ApexOptions } from 'apexcharts'
import DefaultPalette from 'src/@core/theme/palette'

const palette = DefaultPalette('light', 'default')
const series = [
  {
    name: 'Income',
    data: [70, 90, 80, 95, 75, 90],
  },
  {
    name: 'Net Worth',
    data: [110, 72, 62, 65, 100, 75],
  },
]
const options: ApexOptions = {
  chart: {
    parentHeightOffset: 0,
    toolbar: { show: false },
  },
  legend: {
    markers: { offsetX: -2 },
    itemMargin: { horizontal: 10 },
    labels: { colors: palette.text.secondary },
  },
  plotOptions: {
    radar: {
      size: 100,
      polygons: {
        strokeColors: palette.divider,
        connectorColors: palette.divider,
      },
    },
  },
  fill: {
    type: 'gradient',
    gradient: {
      shade: 'dark',
      gradientToColors: [palette.warning.main, palette.primary.main],
      shadeIntensity: 1,
      type: 'vertical',
      opacityFrom: 1,
      opacityTo: 0.9,
      stops: [0, 100],
    },
  },
  colors: [palette.warning.main, palette.primary.main],
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  markers: { size: 0 },
  xaxis: {
    labels: {
      show: true,
      style: {
        fontSize: '14px',
        colors: [
          palette.text.disabled,
          palette.text.disabled,
          palette.text.disabled,
          palette.text.disabled,
          palette.text.disabled,
          palette.text.disabled,
        ],
      },
    },
  },
  yaxis: { show: false },
  grid: { show: false },
}

export default {
  title: 'Graphs/Radar',
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
      defaultValue: 'radar',
    },
    width: {
      description: '차트의 너비. string|number 타입.',
      control: { type: 'text' },
      defaultValue: '100%',
    },
    height: {
      description: 'width와 동일.',
      control: { type: 'text' },
      defaultValue: '278',
    },
    series: {
      description: `display할 데이터를 전달. <code>number[]</code>`,
      defaultValue: series,
      control: { type: 'object' },
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
        title='Radar Graph'
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
    import ReactApexcharts from 'src/@core/components/react-apexcharts'
    
    import { ApexOptions } from 'apexcharts'
    import DefaultPalette from 'src/@core/theme/palette'
    
    const palette = DefaultPalette('light', 'default')
    const series = [
      {
        name: 'Income',
        data: [70, 90, 80, 95, 75, 90],
      },
      {
        name: 'Net Worth',
        data: [110, 72, 62, 65, 100, 75],
      },
    ]
    const options: ApexOptions = {
      chart: {
        parentHeightOffset: 0,
        toolbar: { show: false },
      },
      legend: {
        markers: { offsetX: -2 },
        itemMargin: { horizontal: 10 },
        labels: { colors: palette.text.secondary },
      },
      plotOptions: {
        radar: {
          size: 100,
          polygons: {
            strokeColors: palette.divider,
            connectorColors: palette.divider,
          },
        },
      },
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'dark',
          gradientToColors: [palette.warning.main, palette.primary.main],
          shadeIntensity: 1,
          type: 'vertical',
          opacityFrom: 1,
          opacityTo: 0.9,
          stops: [0, 100],
        },
      },
      colors: [palette.warning.main, palette.primary.main],
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      markers: { size: 0 },
      xaxis: {
        labels: {
          show: true,
          style: {
            fontSize: '14px',
            colors: [
              palette.text.disabled,
              palette.text.disabled,
              palette.text.disabled,
              palette.text.disabled,
              palette.text.disabled,
              palette.text.disabled,
            ],
          },
        },
      },
      yaxis: { show: false },
      grid: { show: false },
    }

    export default function RadarGraph() {
        return (
          <ReactApexcharts
            type='radar'
            height={278}
            series={series}
            options={options}
          />
        )
      }
    
    `}</code>
  </pre>
)
