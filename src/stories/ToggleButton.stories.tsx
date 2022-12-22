import React from 'react'
import { ComponentMeta } from '@storybook/react'

import { ToggleButton } from './ToggleButton'

export default {
  title: 'Components/Button/Toggle',
  component: ToggleButton

  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof ToggleButton>

export const Toggle = (args: typeof ToggleButton) => (
  <div style={{ display: 'flex', gap: '45px' }}>
    <ToggleButton
      {...args}
      id='radio'
      onChange={e => {
        return null
      }}
    />
  </div>
)
