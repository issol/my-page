import React, { ReactNode } from 'react'
import { ComponentMeta } from '@storybook/react'
import { Card, CardContent, CardHeader } from '@mui/material'
import OptionsMenu from 'src/@core/components/option-menu'
import TypographyPage from 'src/pages/ui/typography'

export default {
  title: 'Layout/Card',
  component: Card,
  argTypes: {
    headerTitle: {
      control: { type: 'text' },
      defaultValue: 'Card title',
    },
    content: {
      control: { type: 'text' },
      defaultValue: 'content',
    },
    subheader: {
      description: '부제목으로 optional',
      control: { type: 'text' },
      defaultValue: 'subheader',
    },
    action: {
      description: '컨테이너 오른쪽 상단에 케밥메뉴를 넣을 수 있음. optional',
      control: { type: 'object' },
      defaultValue: (
        <OptionsMenu
          options={['Refresh', 'Edit', 'Share']}
          iconButtonProps={{ size: 'small', className: 'card-more-options' }}
        />
      ),
    },
  },
} as ComponentMeta<typeof Card>

type Args = {
  headerTitle: string
  content: string
  subheader?: string
  action?: ReactNode
}
export const Default = (args: Args) => {
  return (
    <Card>
      <CardHeader
        title={args.headerTitle}
        subheader={args?.subheader}
        action={args?.action}
      />
      <CardContent>{args.content}</CardContent>
    </Card>
  )
}

export const test = () => {
  return (
    <>
      <TypographyPage />
    </>
  )
}
