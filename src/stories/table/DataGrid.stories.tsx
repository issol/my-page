import React from 'react'
import { ComponentMeta } from '@storybook/react'

import { DataGrid } from '@mui/x-data-grid'
import DataGrids from 'src/views/components/dataGrid'

export default {
  title: 'Table/DataGrid',
  component: DataGrid,
} as ComponentMeta<typeof DataGrid>

export const Default = () => {
  return <DataGrids />
}
