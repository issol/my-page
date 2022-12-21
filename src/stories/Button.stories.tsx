import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { CtaButton } from './Button'

export default {
  title: 'Components/Button',
  component: CtaButton

  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof CtaButton>
const Template: ComponentStory<typeof CtaButton> = args => <CtaButton {...args} />

export const Primary = Template.bind({})
Primary.args = {
  children: 'Button',
  color: 'primary'
}
export const Secondary = Template.bind({})
Secondary.args = {
  children: 'Button',
  color: 'secondary'
}
export const Round = Template.bind({})
Round.args = {
  children: 'Button',
  color: 'primary',
  shape: 'round'
}
export const Disabled = Template.bind({})
Disabled.args = {
  children: 'Button',
  color: 'primary',
  disabled: true
}
