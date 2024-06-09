'use client'

import Image from 'next/image'
import React from 'react'
import { Link } from 'react-scroll'
import Typewriter from 'typewriter-effect'

const DefaultIntro = () => {
  const scrollDuration = 100
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
              <Typewriter
                options={{
                  strings: ['프론트엔드 개발자', '김민규 입니다.'],
                  autoStart: true,
                  loop: true,
                  delay: 100,
                  deleteSpeed: 100,
                }}
              />{' '}
            </h2>
            {/* <p className='text-5'>based in Los Angeles, USA.</p> */}
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
              {/* <Image
                className='img-fluid rounded-pill d-block'
                src='/profile.webp'
                alt='Profile'
                width={300}
                height={300}
              /> */}
            </div>
          </div>
        </div>
      </div>
      <Link
        className='scroll-down-arrow text-dark smooth-scroll mb-5'
        smooth='easeInOutQuint'
        duration={scrollDuration}
        style={{ cursor: 'pointer' }}
        to='about'
      >
        <span className='animated'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='64'
            height='64'
            fill='currentColor'
            className='bi bi-arrow-down-circle'
            viewBox='0 0 16 16'
          >
            <path
              fill-rule='evenodd'
              d='M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v5.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293z'
            />
          </svg>
        </span>
      </Link>
    </section>
  )
}

export default DefaultIntro
