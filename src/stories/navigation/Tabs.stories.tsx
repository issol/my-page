import React from 'react'
import { ComponentMeta } from '@storybook/react'
import Tabs from 'src/pages/components/tabs'
import TreeViewBasic from 'src/pages/components/tree-view'

export default {
  title: 'Navigation/Menu',
  component: Tabs,
} as ComponentMeta<typeof Tabs>

export const Tab = () => {
  return <Tabs />
}

export const TreeMenu = () => {
  return <TreeViewBasic />
}
