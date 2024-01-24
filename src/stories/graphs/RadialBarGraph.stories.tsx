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

const options: ApexOptions = {
  chart: {
    sparkline: { enabled: true },
  },
  stroke: { lineCap: 'round' },
  colors: [hexToRGBA(palette.primary.main, 1)],
  plotOptions: {
    radialBar: {
      hollow: { size: '55%' },
      track: {
        background: palette.customColors.trackBg,
      },
      dataLabels: {
        name: { show: false },
        value: {
          offsetY: 5,
          fontWeight: 600,
          fontSize: '1rem',
          color: palette.text.primary,
        },
      },
    },
  },
  grid: {
    padding: {
      bottom: -12,
    },
  },
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
  title: 'Graphs/RadialBar',
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
      defaultValue: 'radialBar',
    },
    width: {
      description: '차트의 너비. string|number 타입.',
      control: { type: 'text' },
      defaultValue: '100%',
    },
    height: {
      description: 'width와 동일.',
      control: { type: 'text' },
      defaultValue: '119',
    },
    series: {
      description: `display할 데이터를 전달. <code>number[]</code>`,
      defaultValue: [64],
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
        title='RadialBar Graph'
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
import ReactApexcharts from '@src/@core/components/react-apexcharts'

import { ApexOptions } from 'apexcharts'
import { hexToRGBA } from '@src/@core/utils/hex-to-rgba'
import DefaultPalette from '@src/@core/theme/palette'

const palette = DefaultPalette('light', 'default')
const options: ApexOptions = {
  chart: {
    sparkline: { enabled: true },
  },
  stroke: { lineCap: 'round' },
  colors: [hexToRGBA(palette.primary.main, 1)],
  plotOptions: {
    radialBar: {
      hollow: { size: '55%' },
      track: {
        background: palette.customColors.trackBg,
      },
      dataLabels: {
        name: { show: false },
        value: {
          offsetY: 5,
          fontWeight: 600,
          fontSize: '1rem',
          color: palette.text.primary,
        },
      },
    },
  },
  grid: {
    padding: {
      bottom: -12,
    },
  },
  states: {
    hover: {
      filter: { type: 'none' },
    },
    active: {
      filter: { type: 'none' },
    },
  },
}

export default function RadialBarDefault () {
    return (
        <ReactApexcharts
        type='radialBar'
        height={119}
        series={[64]}
        options={options}
      />
    )
  }

`}</code>
  </pre>
)
