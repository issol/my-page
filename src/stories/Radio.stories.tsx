import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import { RadioButton as Radio } from './Radio'

export default {
  title: 'Components/Button/Radio',
  component: Radio,

  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof Radio>

const Template: ComponentStory<typeof Radio> = args => <Radio {...args} />

export const Default = Template.bind({})
Default.args = {
  name: 'default',
  htmlFor: 'id_1',
  labelName: 'Default Radio Button',
}

export const RadioButton = (args: typeof Radio) => (
  <div style={{ display: 'flex', gap: '45px' }}>
    <div>
      <h3>Single Radio Button Example</h3>
      <Radio
        {...args}
        name='single'
        htmlFor='id_2'
        labelName='single item'
        onChange={e => {
          return null
        }}
      />
    </div>

    <div>
      <h3>Multiple Radio Buttons Example</h3>
      {['multiple item1', 'multiple item2', 'multiple item3'].map(
        (item, idx) => (
          <Radio
            {...args}
            key={idx}
            name='color'
            htmlFor='id_2'
            labelName={item}
            onChange={e => {
              return null
            }}
          />
        ),
      )}
    </div>
  </div>
)
