import React from 'react'
import { ComponentMeta } from '@storybook/react'
import Select from '@mui/material/Select'
import Selects from 'src/pages/forms/form-elements/select'

export default {
  title: 'Input Fields/DropDownField',
  component: Select,
} as ComponentMeta<typeof Select>

export const Default = () => {
  return <Selects />
}
