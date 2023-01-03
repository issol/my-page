import React from 'react'
import { ComponentMeta } from '@storybook/react'
import ButtonGroup from 'src/pages/components/button-group'

export default {
  title: 'Button/ButtonGroup',
  component: ButtonGroup,
} as ComponentMeta<typeof ButtonGroup>

export const Default = () => {
  return <ButtonGroup />
}
