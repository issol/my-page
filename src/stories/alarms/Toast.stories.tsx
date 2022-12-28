import React from 'react'
import { ComponentMeta } from '@storybook/react'
import ReactHotToasts from 'src/pages/components/toast'

export default {
  title: 'Alarms/Pop Notification',
  component: ReactHotToasts,
} as ComponentMeta<typeof ReactHotToasts>

export const Default = () => {
  return <ReactHotToasts />
}
