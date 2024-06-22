import dynamic from 'next/dynamic'
import { Suspense } from 'react'

import 'bootstrap/dist/css/bootstrap.min.css'

// import "bootstrap/dist/css/bootstrap.rtl.min.css";

import 'bootstrap/dist/js/bootstrap.bundle.min.js'

import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

import '../sass/stylesheet.scss'

const FullScreenHeader = dynamic(() => import('./header'), {
  ssr: false,
})

const AboutMe = dynamic(() => import('./about'), {
  ssr: false,
})

const Intro = dynamic(() => import('./intro'), {
  ssr: false,
})

const Resume = dynamic(() => import('./resume'), {
  ssr: false,
})

const Portfolio = dynamic(() => import('./portfolio'), {
  ssr: false,
})

const Contact = dynamic(() => import('./contact'), {
  ssr: false,
})

const Footer = dynamic(() => import('./footer'), {
  ssr: false,
})

const Tooltip = dynamic(() => import('./tooltip'), {
  ssr: false,
})

const Home = () => {
  function Loading() {
    return <h2>🌀 Loading...</h2>
  }

  return (
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
  )
}

export default Home
