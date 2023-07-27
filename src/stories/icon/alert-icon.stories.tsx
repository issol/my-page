import React from 'react'
import { ComponentMeta } from '@storybook/react'
import AlertIcon, { AlertType } from '@src/@core/components/alert-icon'
export default {
  title: 'Icon/AlertIcon',
  component: AlertIcon,
  args: { type: 'error' },
  argTypes: {
    type: {
      defaultValue: 'error',
      control: { type: 'select' },
      options: [
        'error',
        'info',
        'error-report',
        'progress',
        'successful',
        'question-info',
      ],
    },
  },
} as ComponentMeta<typeof AlertIcon>

export const Default = ({ type }: { type: AlertType }) => {
  return <AlertIcon type={type} />
}
