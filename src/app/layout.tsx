// import AboutMe from './about/page'

// import 'animate.css'
import './globals.css'

import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Metadata } from 'next'
import Providers from './provider'

// export const dynamic = 'force-dynamic'

// const inter = Inter({ subsets: ['latin'] })

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // const checkScrollTop = () => {
  //   let scrollTopBtn = document.getElementById('back-to-top')

  //   if (scrollTopBtn) {
  //     if (
  //       document.body.scrollTop > 400 ||
  //       document.documentElement.scrollTop > 400
  //     ) {
  //       // setScrollTopVisible(true)
  //     } else {
  //       // setScrollTopVisible(false)
  //     }
  //   }
  // }

  // useEffect(() => {
  //   if (typeof window !== 'undefined') {
  //     window.addEventListener('scroll', checkScrollTop)
  //   }
  // }, [])

  return (
    <html lang='en'>
      <head>
        <link
          rel='stylesheet'
          href='https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css'
        />
        {/* <link
          rel='stylesheet'
          type='text/css'
          href='vendor/font-awesome/css/all.min.css'
        /> */}
        <link
          rel='stylesheet'
          href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.8.2/css/all.min.css'
        />
      </head>
      <body>
        <Providers>{children}</Providers>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  )
}
