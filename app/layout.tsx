// 'use client'

import { Inter } from 'next/font/google'
import './globals.css'

import 'bootstrap/dist/css/bootstrap.min.css'

// import "bootstrap/dist/css/bootstrap.rtl.min.css";

import 'bootstrap/dist/js/bootstrap.bundle.min.js'

import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

import './sass/stylesheet.scss'
// import AboutMe from './about/page'

// import 'animate.css'

import { Suspense, useEffect, useState } from 'react'

import dynamic from 'next/dynamic'

// export const dynamic = 'force-dynamic'

const FullScreenHeader = dynamic(() => import('./header/page'), {
  ssr: false,
})

const AboutMe = dynamic(() => import('./about/page'), {
  ssr: false,
})

const Intro = dynamic(() => import('./intro/page'), {
  ssr: false,
})

const Resume = dynamic(() => import('./resume/page'), {
  ssr: false,
})

const Portfolio = dynamic(() => import('./portfolio/page'), {
  ssr: false,
})

const Contact = dynamic(() => import('./contact/page'), {
  ssr: false,
})

const Footer = dynamic(() => import('./footer/page'), {
  ssr: false,
})

const Tooltip = dynamic(() => import('./components/tooltip'), {
  ssr: false,
})

// const inter = Inter({ subsets: ['latin'] })

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

  function Loading() {
    return <h2>🌀 Loading...</h2>
  }

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
        {/* <Toaster /> */}
        <Suspense fallback={<Loading />}>
          <div style={{ position: 'relative' }}>
            <div id='main-wrapper'>
              <FullScreenHeader />
              <div id='content' role='main'>
                <Intro />
                <AboutMe />
                <Resume />
                <Portfolio />
                <Contact />
                <Footer />
              </div>
            </div>
          </div>
          <Tooltip text='Back to Top' placement='left'>
            <span
              id='back-to-top'
              className='rounded-circle'
              style={{ display: 'none' }}
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
            >
              <i className='fas fa-arrow-up'></i>
            </span>
          </Tooltip>
        </Suspense>
      </body>
    </html>
  )
}
