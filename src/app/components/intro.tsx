'use client'

import Image from 'next/image'
import React from 'react'
import { Link } from 'react-scroll'
import Typewriter from 'typewriter-effect'

const DefaultIntro = () => {
  const scrollDuration = 300
  return (
    <section
      id='home'
      className='bg-primary d-flex fullscreen-with-header position-relative'
    >
      <div className='container my-auto py-5 py-lg-0'>
        <div className='row py-4'>
          <div className='col-lg-8 text-center text-lg-start align-self-center order-1 order-lg-0'>
            <h1 className='text-12 fw-300 mb-0 text-uppercase'>
              안녕하세요 저는
            </h1>
            <h2 className='text-20 fw-600 text-uppercase mb-0 ms-n1'>
              {/* <Typewriter
                options={{
                  strings: ['프론트엔드 개발자', '김민규 입니다.'],
                  autoStart: true,
                  loop: true,
                  delay: 100,
                  deleteSpeed: 100,
                }}
              />{' '} */}
            </h2>

            <Link
              className='btn btn-dark rounded-0 smooth-scroll mt-3'
              smooth='easeInOutQuint'
              duration={scrollDuration}
              style={{ cursor: 'pointer' }}
              to='portfolio'
            >
              View My Works
            </Link>
            <Link
              className='btn btn-link text-dark smooth-scroll mt-3'
              smooth='easeInOutQuint'
              duration={scrollDuration}
              style={{ cursor: 'pointer' }}
              to='contact'
            >
              Contact Me
              <span className='text-4 ms-2'>
                <i className='far fa-arrow-alt-circle-down' />
              </span>
            </Link>
          </div>
          <div className='col-lg-4 text-center align-self-center mb-4 mb-lg-0 order-0 order-lg-1'>
            <div className='bg-light rounded-pill d-inline-block p-3 shadow-lg zoomIn'>
              <Image
                className='img-fluid rounded-pill d-block'
                src='/profile.webp'
                alt='Profile'
                width={300}
                height={300}
              />
            </div>
          </div>
        </div>
      </div>
      <Link
        className='scroll-down-arrow text-dark smooth-scroll'
        smooth='easeInOutQuint'
        duration={scrollDuration}
        style={{ cursor: 'pointer' }}
        to='about'
      >
        <div className='animate__animated animate__slideInDown animate__infinite'>
          <i className='fas fa-arrow-down' />
        </div>
      </Link>
    </section>
  )
}

export default DefaultIntro
