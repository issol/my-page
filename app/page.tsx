import { Box } from '@mui/material'

import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '김민규 | 프론트엔드 개발자 포트폴리오',
  description: '프론트엔드 개발자 포트폴리오입니다.',
  keywords: [
    '프론트엔드',
    '프론트',
    '포트폴리오',
    '프론트엔드 개발자',
    '개발자',
  ],
  openGraph: {
    title: '김민규 | 프론트엔드 개발자 포트폴리오',
    description: '프론트엔드 개발자 김민규 포트폴리오입니다.',
    siteName: '김민규 | 프론트엔드 개발자 포트폴리오',
    locale: 'ko_KR',
    type: 'website',
    // url: PAGE_URL,
    images: {
      url: '/og-image.webp',
    },
  },
}

export default function Home() {
  return <Box></Box>
}
