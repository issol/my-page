'use client'

import { ReactElement } from 'react'

const Providers = ({
  children,
}: {
  children: React.ReactNode
}): ReactElement => {
  return <>{children}</>
}

export default Providers
