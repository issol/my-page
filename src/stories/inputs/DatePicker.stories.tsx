import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { DatePicker } from './DatePicker'

export default {
  title: 'Input Fields/DatePicker',
  component: DatePicker,

  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof DatePicker>
const Template: ComponentStory<typeof DatePicker> = args => (
  <DatePicker {...args} />
)

export const Primary = Template.bind({})
Primary.args = {}
