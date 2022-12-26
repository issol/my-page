import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import Pagination from 'src/pages/components/chips'

export default {
  title: 'Icons/Chip',
  component: Pagination,
} as ComponentMeta<typeof Pagination>

export const Default = () => {
  return <Pagination />
}
