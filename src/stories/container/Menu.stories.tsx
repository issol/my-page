import React from 'react'
import { ComponentMeta } from '@storybook/react'
import Menus from 'src/pages/components/menu'

export default {
  title: 'Box/Menus',
  component: Menus,
} as ComponentMeta<typeof Menus>

export const Default = () => {
  return (
    <div>
      <Menus />
    </div>
  )
}
