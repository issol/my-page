import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import CardSnippet from 'src/@core/components/card-snippet'

export default {
  title: 'Card/CardSnippet',
  component: CardSnippet,
  parameters: {
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof CardSnippet>

const Template: ComponentStory<typeof CardSnippet> = args => (
  <CardSnippet {...args} />
)

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
