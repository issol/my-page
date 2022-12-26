import React from 'react'
import { ComponentMeta } from '@storybook/react'
import Avatars from 'src/pages/components/avatars'

export default {
  title: 'Icons/Avatars',
  component: Avatars,
} as ComponentMeta<typeof Avatars>

export const Default = () => {
  return <Avatars />
}
