import React from 'react'
import { ComponentMeta } from '@storybook/react'
import Menus from 'src/pages/components/menu'
import Misc from 'src/pages/components/more'

export default {
  title: 'Box/Menus',
  component: Menus,
} as ComponentMeta<typeof Menus>

export const Default = () => {
  return (
    <div>
      <Menus />
      <h2>To see more options and demos, check out below.</h2>
      <Misc />
    </div>
  )
}
