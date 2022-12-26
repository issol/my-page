import React from 'react'
import { ComponentMeta } from '@storybook/react'
import Snackbar from 'src/pages/components/snackbar'

export default {
  title: 'Alerts/Snackbar',
  component: Snackbar,
} as ComponentMeta<typeof Snackbar>

export const Default = () => {
  return <Snackbar />
}
