import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'
// ** Custom Components Imports

import Icon from 'src/@core/components/icon'

import CardStatsHorizontal from 'src/@core/components/card-statistics/card-stats-horizontal'

export default {
  title: 'Graphs/Dashboard/HorizontalStats',
  component: CardStatsHorizontal,
  argTypes: {
    title: {
      control: { type: 'text' },
      defaultValue: 'Total Orders',
    },
    stats: {
      control: { type: 'text' },
      defaultValue: '155k',
    },
    trendNumber: {
      control: { type: 'text' },
      defaultValue: '+22%',
    },
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
} as ComponentMeta<typeof CardStatsHorizontal>

const Template: ComponentStory<typeof CardStatsHorizontal> = args => (
  <CardStatsHorizontal {...args} />
)

export const Default = Template.bind({})
Default.args = {
  title: 'Total Orders',
  icon: <Icon icon='mdi:cart-plus' />,
  stats: '155k',
  trendNumber: '+22%',
  color: 'primary',
  trend: 'positive',
}
