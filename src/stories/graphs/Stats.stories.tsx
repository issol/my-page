CardStatsVertical

import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'
// ** Custom Components Imports

import Icon from 'src/@core/components/icon'

import CardStatsVertical from 'src/@core/components/card-statistics/card-stats-vertical'

export default {
  title: 'Graphs/Dashboard/Stats',
  component: CardStatsVertical,
  argTypes: {
    icon: {
      defaultValue: <Icon icon='mdi:cart-plus' />,
    },
    color: {
      options: ['primary', 'secondary', 'error', 'warning', 'info', 'success'],
      control: { type: 'select' },
    },
    trend: {
      options: ['positive', 'negative'],
      control: { type: 'select' },
    },
  },
} as ComponentMeta<typeof CardStatsVertical>

const Template: ComponentStory<typeof CardStatsVertical> = args => (
  <CardStatsVertical {...args} />
)

export const Default = Template.bind({})
Default.args = {
  stats: '155k',
  color: 'primary',
  trendNumber: '+22%',
  title: 'Total Orders',
  chipText: 'Last 4 Month',
  icon: <Icon icon='mdi:cart-plus' />,
}
