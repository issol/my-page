import React from 'react'
import { ComponentMeta } from '@storybook/react'
import Lists from 'src/pages/components/list'

export default {
  title: 'Box/Lists',
  component: Lists,
} as ComponentMeta<typeof Lists>

export const Default = () => {
  return <Lists />
}
