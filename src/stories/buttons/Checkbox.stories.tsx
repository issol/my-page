import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { Checkbox, FormControlLabel } from '@mui/material'

export default {
  title: 'Components/Button/Checkbox',
  component: Checkbox,
  argTypes: {
    checked: {
      description: 'boolean',
    },
    defaultChecked: {
      description: 'boolean',
    },
    checkedIcon: {
      description: 'ReactNode타입으로 전달',
    },
    color: {
      options: [
        'primary',
        'secondary',
        'error',
        'info',
        'success',
        'warning',
        'default',
      ],
      control: { type: 'select' },
    },
    disabled: {
      control: { type: 'boolean' },
    },
    indeterminate: {
      description: '불확실한 값에 대해 - 표시 할 수 있음',
      control: { type: 'boolean' },
    },
    required: {
      control: { type: 'boolean' },
    },
    size: {
      options: ['small', 'medium'],
      control: { type: 'select' },
    },
    value: {
      description: 'value',
    },
  },
} as ComponentMeta<typeof Checkbox>

const Template: ComponentStory<typeof Checkbox> = args => <Checkbox {...args} />

export const Default = Template.bind({})
Default.args = {
  color: 'primary',
  checked: true,
}

export const WithLabel = (args: typeof Checkbox) => {
  return (
    <FormControlLabel label='With Label' control={<Checkbox {...args} />} />
  )
}
