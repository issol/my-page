import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { Button } from './test'

export default {
  title: 'Pages/Button',
  component: Button
} as ComponentMeta<typeof Button>

const Template: ComponentStory<typeof Button> = args => {
  return <Button {...args} />
}

export const Basic = Template.bind({})
Basic.args = {
  label: '하이'
}
