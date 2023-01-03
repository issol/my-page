import React from 'react'
import { ComponentMeta } from '@storybook/react'

import TextFields from 'src/pages/forms/form-elements/text-field'

export default {
  title: 'Input Fields/TextFields',
  component: TextFields,
} as ComponentMeta<typeof TextFields>

export const Default = () => <TextFields />
