import React from 'react'
import { ComponentMeta } from '@storybook/react'
import Pagination from 'src/pages/components/badges'

export default {
  title: 'Icons/Badge',
  component: Pagination,
} as ComponentMeta<typeof Pagination>

export const Default = () => {
  return <Pagination />
}