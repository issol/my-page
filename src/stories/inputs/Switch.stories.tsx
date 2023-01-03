import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import Switches from 'src/pages/forms/form-elements/switch'

export default {
  title: 'Input Fields/Switch',
  component: Switches,
} as ComponentMeta<typeof Switches>

export const Default = () => <Switches />
