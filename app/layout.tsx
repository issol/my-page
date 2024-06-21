'use client'

import { Inter } from 'next/font/google'
import './globals.css'

import FullScreenHeader from './header/page'
import { Tooltip } from './components/Tooltip'

import 'bootstrap/dist/css/bootstrap.min.css'

// import "bootstrap/dist/css/bootstrap.rtl.min.css";

import 'bootstrap/dist/js/bootstrap.bundle.min.js'

import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

import './sass/stylesheet.scss'
import AboutMe from './about/page'
import Intro from './intro/page'
import 'animate.css'

import { use, useEffect, useState } from 'react'
import Script from 'next/script'
import Resume from './resume/page'
import Portfolio from './portfolio/page'
import Contact from './contact/page'
import Footer from './footer/page'
import { Metadata } from 'next'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const handleNavClick = (section: any) => {
    document.getElementById(section).scrollIntoView({ behavior: 'smooth' })
  }

  const [scrollTopVisible, setScrollTopVisible] = useState(false)

  const checkScrollTop = () => {
    let scrollTopBtn = document.getElementById('back-to-top')

    if (scrollTopBtn) {
      if (
        document.body.scrollTop > 400 ||
        document.documentElement.scrollTop > 400
      ) {
        setScrollTopVisible(true)
      } else {
        setScrollTopVisible(false)
      }
    }
  }

  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', checkScrollTop)
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
            style={{ display: scrollTopVisible ? 'inline' : 'none' }}
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
          >
            <i className='fas fa-arrow-up'></i>
          </span>
        </Tooltip>
      </body>
    </html>
  )
}
