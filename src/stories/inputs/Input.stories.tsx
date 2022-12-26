import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import InputMask from 'src/pages/forms/form-elements/input-mask'

export default {
  title: 'Input Fields/InputField',
  component: InputMask,
} as ComponentMeta<typeof InputMask>

export const Default = () => <InputMask />
