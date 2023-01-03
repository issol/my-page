import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import Buttons from 'src/pages/components/buttons'

//Buttons
export default {
  title: 'Button',
  component: Buttons,

  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof Buttons>
const Template: ComponentStory<typeof Buttons> = args => <Buttons />

export const AllBasicButtons = Template.bind({})
AllBasicButtons.args = {}
