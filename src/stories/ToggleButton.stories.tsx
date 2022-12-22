import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import { ToggleButton } from './ToggleButton'

export default {
  title: 'Components/Button/Toggle',
  component: ToggleButton,

  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof ToggleButton>

const Template: ComponentStory<typeof ToggleButton> = args => (
  <ToggleButton {...args} />
)

export const Default = Template.bind({})
Default.args = {
  id: 'toggle',
}

export const Toggle = (args: typeof ToggleButton) => (
  <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
    <ToggleButton
      {...args}
      id='toggle'
      onChange={e => {
        return null
      }}
    />
    <label htmlFor='toggle'>Toggle</label>
  </div>
)
