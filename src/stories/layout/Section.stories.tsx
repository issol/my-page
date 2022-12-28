import React from 'react'
import { ComponentMeta } from '@storybook/react'
import { Card, CardContent, CardHeader } from '@mui/material'
import OptionsMenu from 'src/@core/components/option-menu'

export default {
  title: 'Layout/SectionContainer',
  component: Card,
} as ComponentMeta<typeof Card>

export const Default = () => {
  return (
    <Card>
      <CardHeader
        title='Section title here'
        subheader='simple description for this section here'
      />
      <CardContent>Any contents here</CardContent>
    </Card>
  )
}

export const WithKebabMenu = () => {
  return (
    <Card>
      <CardHeader
        title='Card With Menu.'
        subheader='simple description for this section here'
        action={
          <OptionsMenu
            options={['Refresh', 'Edit', 'Share']}
            iconButtonProps={{ size: 'small', className: 'card-more-options' }}
          />
        }
      />
      <CardContent>
        Look at the top right of this card. There's Kebab Menu.
      </CardContent>
    </Card>
  )
}
