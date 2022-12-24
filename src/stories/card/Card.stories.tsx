import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { within, userEvent } from '@storybook/testing-library'
import PageHeader from 'src/@core/components/page-header'
import { Typography } from '@mui/material'
import CardSnippet from 'src/@core/components/card-snippet'

export default {
  title: 'Card/CardSnippet',
  component: CardSnippet,
  parameters: {
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof CardSnippet>

// id?: string
// title: string
// children: ReactNode
// code: {
//   tsx: ReactElement | null
//   jsx: ReactElement | null
// }
// className?: string
const Template: ComponentStory<typeof CardSnippet> = args => (
  <CardSnippet {...args} />
)
//const { id, sx, code, title, children, className } = props
export const Default = Template.bind({})
Default.args = {
  id: '1',
  title: 'This is title',
  code: {
    tsx: (
      <div>
        hi<p>hi</p>
      </div>
    ),
    jsx: null,
  },
  className: 'class',
}
