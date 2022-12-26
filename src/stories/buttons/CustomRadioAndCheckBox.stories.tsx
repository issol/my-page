import React from 'react'
import { ComponentMeta } from '@storybook/react'

import CustomInputs from 'src/pages/forms/form-elements/custom-inputs'

export default {
  title: 'Button/Custom Radio & CheckBox',
  component: CustomInputs,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof CustomInputs>

export const Default = () => <CustomInputs />
