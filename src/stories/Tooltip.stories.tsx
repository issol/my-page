import React from 'react'
import { ComponentMeta } from '@storybook/react'
import { Tooltip, TooltipProps, Typography } from '@mui/material'

export default {
  title: 'Typography/Tooltip',
  component: Tooltip,
  argTypes: {
    title: {
      defaultValue: 'This is tooltip!!',
      control: { type: 'text' },
      type: { name: 'string', required: true },
    },
    arrow: {
      description: 'true이면 툴팁에 화살표가 표시됨',
      defaultValue: false,
      control: { type: 'boolean' },
    },
    children: {
      description: 'children은 ReactElement타입으로 null이면 안 됨.',
      defaultValue: (
        <Typography component='button' variant='h3' sx={{ mx: 2 }}>
          Hover here!
        </Typography>
      ),
      control: { type: 'object' },
      type: { name: 'string', required: true },
    },
    describeChild: {
      description:
        'screen reader와 관련된 값으로, false일 경우 aria-label=title 이 들어가서 스크린 리더가 이것만 읽어주고, false일 경우 tooltip의 title과, 그 안에 감싸져 있는 child의 text까지 읽어주는 차이가 있음.',
      defaultValue: false,
      control: { type: 'boolean' },
    },
    open: {
      description: '툴팁의 보여줌 여부를 컨트롤 할 수 있는 값.',
      control: { type: 'boolean' },
    },
    onClose: {
      description: '툴팁이 닫힐 때의 액션',
    },
    onOpen: {
      description: '툴팁이 열릴 때의 액션',
    },

    placement: {
      description: '툴팁의 위치',
      defaultValue: 'bottom',
      control: { type: 'select' },
      options: [
        'bottom-end',
        'bottom-start',
        'bottom',
        'left-end',
        'left-start',
        'left',
        'right-end',
        'right-start',
        'right',
        'top-end',
        'top-start',
        'top',
      ],
    },
  },
} as ComponentMeta<typeof Tooltip>

export const Default = (args: TooltipProps) => {
  return <Tooltip {...args}>{args.children}</Tooltip>
}
