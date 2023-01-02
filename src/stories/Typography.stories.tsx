import React, { ReactNode } from 'react'
import { ComponentMeta } from '@storybook/react'
import { Typography } from '@mui/material'

export default {
  title: 'Typography/Typography',
  component: Typography,
  argTypes: {
    align: {
      control: { type: 'select' },
      defaultValue: 'h1',
      options: ['inherit', 'left', 'center', 'right', 'justify'],
    },
    children: {
      control: { type: 'text' },
      defaultValue: 'Typography',
    },
    noWrap: {
      description:
        'true이면 텍스트가 wrap되지 않고 텍스트 오버플로 줄임표로 잘립니다.',
      defaultValue: true,
      control: { type: 'boolean' },
    },
    paragraph: {
      description: 'true이면 이 요소는 paragraph 엘리먼트가 됩니다.',
      defaultValue: false,
      control: { type: 'boolean' },
    },
    variant: {
      description: 'true이면 이 요소는 paragraph 엘리먼트가 됩니다.',
      defaultValue: 'h1',
      control: { type: 'select' },
      options: [
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'subtitle1',
        'subtitle2',
        'body1',
        'body2',
        'inherit',
      ],
    },
    sx: {
      description: `시스템 오버라이드와 추가 css 스타일 정의 할수 있음. ex: sx={{ display: 'flex', alignItems: 'center' }}`,
      defaultValue: { mb: 2 },
      control: { type: 'object' },
    },
  },
} as ComponentMeta<typeof Typography>

export const Default = (args: typeof Typography) => {
  /* @ts-ignore */
  return <Typography {...args}>{args?.children}</Typography>
}
