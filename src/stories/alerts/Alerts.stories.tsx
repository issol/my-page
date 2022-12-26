import React from 'react'
import { ComponentMeta } from '@storybook/react'
import Alerts from 'src/pages/components/alerts'

export default {
  title: 'Alerts/Alerts',
  component: Alerts,
} as ComponentMeta<typeof Alerts>

export const Default = () => {
  return <Alerts />
}
