import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import FallbackSpinner from 'src/@core/components/spinner'

export default {
  title: 'Spinner/FallbackSpinner',
  component: FallbackSpinner,
} as ComponentMeta<typeof FallbackSpinner>

const Template: ComponentStory<typeof FallbackSpinner> = args => (
  <FallbackSpinner {...args} />
)

export const Default = Template.bind({})
Default.args = {}
