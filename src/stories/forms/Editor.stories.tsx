import React from 'react'
import { ComponentMeta } from '@storybook/react'
import Editors from 'src/pages/forms/form-elements/editor'

export default {
  title: 'Form/Editor',
  component: Editors,
} as ComponentMeta<typeof Editors>

export const Default = () => {
  return <Editors />
}
