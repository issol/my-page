import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { InputField } from './Input'

export default {
  title: 'Input Fields/InputField',
  component: InputField,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof InputField>

const Template: ComponentStory<typeof InputField> = args => (
  <InputField {...args} />
)

export const Default = Template.bind({})
Default.args = {
  label: 'test',
  onChange: e => e.target.value,
}

export const LoggedIn = Template.bind({})
