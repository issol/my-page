'use client'

import Image from 'next/image'
import styles from './page.module.css'
import { Box } from '@mui/material'
import Main from './main/page'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import WOW from 'wowjs'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    router.push('/main')
  })
  return <Box></Box>
}
