import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import Sliders from 'src/pages/forms/form-elements/slider'

export default {
  title: 'Input Fields/Slider',
  component: Sliders,
} as ComponentMeta<typeof Sliders>

export const Default = () => <Sliders />
