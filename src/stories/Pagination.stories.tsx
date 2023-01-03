import React from 'react'
import { ComponentMeta } from '@storybook/react'
import Pagination from 'src/pages/components/pagination'

export default {
  title: 'Pagination/Pagination',
  component: Pagination,
} as ComponentMeta<typeof Pagination>

export const Default = () => {
  return <Pagination />
}
