import React from 'react'
import styled from '@emotion/styled'

import { ComponentStory, ComponentMeta } from '@storybook/react'
import { CustomCheckBox } from './Checkbox'

export default {
  title: 'Components/Button/Checkbox',
  component: CustomCheckBox,

  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof CustomCheckBox>
const Template: ComponentStory<typeof CustomCheckBox> = args => (
  <CustomCheckBox {...args} />
)

export const Default = Template.bind({})
Default.args = {
  id: '1',
}

export const CheckboxExamples = (args: typeof CustomCheckBox) => (
  <div>
    <Box>
      <CustomCheckBox {...args} id='1' />
      <label htmlFor='1'>Default</label>
    </Box>
    <Box>
      <CustomCheckBox {...args} id='2' disabled={true} />
      <label htmlFor='2'>Disabled</label>
    </Box>
    <Box>
      <CustomCheckBox {...args} id='3' checked={true} />
      <label htmlFor='3'>Checked</label>
    </Box>
    <Box>
      <CustomCheckBox {...args} id='4' reverse={true} />
      <label htmlFor='4'>Reverse</label>
    </Box>
  </div>
)

const Box = styled.div`
  display: flex;
  gap: 4px;
`
