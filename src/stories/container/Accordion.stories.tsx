import React from 'react'
import { ComponentMeta } from '@storybook/react'
import Accordion from 'src/pages/components/accordion'

export default {
  title: 'Box/Accordion',
  component: Accordion,
} as ComponentMeta<typeof Accordion>

export const Default = () => {
  return <Accordion />
}
