//PageHeader

import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import PageHeader from 'src/@core/components/page-header'
import { Typography } from '@mui/material'

export default {
  title: 'Pages/Header',
  component: PageHeader,
  argTypes: {
    title: {
      description:
        'title prop에는 string이나 ReactNode를 전달 할 수 있음. 예시에는 "Typography" 컴포넌트를 넣었음. children형태로 넣어도 됨',
    },
    subtitle: {
      description:
        'subtitle prop에는 string이나 ReactNode를 전달 할 수 있음. 예시에는 "Typography" 컴포넌트를 넣었음. children형태로 넣어도 됨',
    },
  },
} as ComponentMeta<typeof PageHeader>

const Template: ComponentStory<typeof PageHeader> = args => (
  <PageHeader {...args} />
)

export const Default = Template.bind({})
Default.args = {
  title: <Typography variant='h5'>Enough is for Everyone</Typography>,
  subtitle: (
    <Typography variant='body2'>
      GloZ provides localization services specialized in media content.
    </Typography>
  ),
}
