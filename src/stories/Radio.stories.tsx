import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { Radio } from '@mui/material'

export default {
  title: 'Components/Button/Radio',
  component: Radio,
  argTypes: {
    name: {
      description:
        'radio의 name이 같으면 한 그룹으로 간주되어, 같은 name의 radio버튼은 중복 선택이 안 됨',
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
    size: {
      options: ['small', 'medium'],
      control: { type: 'select' },
    },
  },
} as ComponentMeta<typeof Radio>

const Template: ComponentStory<typeof Radio> = args => <Radio {...args} />

export const Default = Template.bind({})
Default.args = {
  name: 'color',
  size: 'small',
  color: 'primary',
  onChange: e => console.log(e),
  checked: true,
  value: null,
}
