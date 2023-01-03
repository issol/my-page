import React from 'react'
import { ComponentMeta } from '@storybook/react'
import { Link } from '@mui/material'
export default {
  title: 'Typography/Link',
  component: Link,
} as ComponentMeta<typeof Link>

export const Default = (args: typeof Link) => {
  /* @ts-ignore */
  return (
    <Link href='/'>
      import Link component from{' '}
      <code>{`import { Link } from '@mui/material`}</code>
      mui의 Link 컴포넌트를 사용하면 링크의 컬러로 theme이 사용됨
    </Link>
  )
}
