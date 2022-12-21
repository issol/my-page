import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { Cta } from './Button'

export default {
  title: 'Components/Button',
  component: Cta

  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof Cta>
const Template: ComponentStory<typeof Cta> = args => <Cta {...args} />

export const Outlined = Template.bind({})
Outlined.args = {
  children: 'Button',
  color: 'primary'
}
