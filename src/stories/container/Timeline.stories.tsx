import React from 'react'
import { ComponentMeta } from '@storybook/react'
import TreeView from 'src/pages/components/timeline'

export default {
  title: 'Box/Timeline',
  component: TreeView,
} as ComponentMeta<typeof TreeView>

export const Default = () => {
  return <TreeView />
}
