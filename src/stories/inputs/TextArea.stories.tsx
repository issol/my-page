import React from 'react'
import { ComponentMeta } from '@storybook/react'

import Textarea from 'src/pages/forms/form-elements/textarea'

export default {
  title: 'Input Fields/Textarea',
  component: Textarea,
} as ComponentMeta<typeof Textarea>

export const Default = () => <Textarea />
