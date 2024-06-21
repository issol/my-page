'use client'

import Image from 'next/image'
import React, { useState } from 'react'
import { Link } from 'react-scroll'
// import { scrollDuration } from '../../../config/commonConfig'
// import { Tooltip } from '../../Tooltip'

const StandardMenuHeader = () => {
  const [isNavModalClose, setIsNavModalClose] = useState(true)

  const scrollDuration = 1000

  return (
    <header id='header' className='sticky-top'>
      {/* Navbar */}
      <nav className='primary-menu navbar navbar-expand-lg text-uppercase navbar-line-under-text fw-600 border-1'>
        <div className='container'>
          <div className='col-auto col-lg-2 d-inline-flex ps-lg-0'>
            {/* Logo */}

            <Link
              className='logo'
              title='Callum'
              smooth='easeInOutQuint'
              duration={scrollDuration}
              style={{
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              offset={-72}
              to='home'
              onClick={() => {
                // e.preventDefault()
                setIsNavModalClose(true)
              }}
            >
              <p className='fs-4 fw-600 m-auto text-capitalize'>Issol</p>
            </Link>

            {/* Logo End */}
          </div>
          <div className='col col-lg-8 navbar-accordion px-0'>
            <button
              className={
                'navbar-toggler ms-auto collapsed ' +
                (isNavModalClose ? '' : 'show')
              }
              type='button'
              onClick={() => setIsNavModalClose(!isNavModalClose)}
            >
              <span />
              <span />
              <span />
            </button>
            <div
              id='header-nav'
              className={
                'collapse navbar-collapse justify-content-center ' +
                (isNavModalClose ? '' : 'show')
              }
            >
              <ul className='navbar-nav'>
                <li className='nav-item'>
                  <Link
                    className='nav-link '
                    smooth='easeInOutQuint'
                    duration={scrollDuration}
                    style={{ cursor: 'pointer' }}
                    activeClass='active'
                    spy
                    to='home'
                    offset={-71}
                    onClick={() => {
                      // e.preventDefault()
                      setIsNavModalClose(true)
                    }}
                  >
                    Home
                  </Link>
                </li>
                <li className='nav-item'>
                  <Link
                    className='nav-link '
                    smooth='easeInOutQuint'
                    duration={scrollDuration}
                    style={{ cursor: 'pointer' }}
                    activeClass='active'
                    spy
                    to='about'
                    onClick={() => {
                      // e.preventDefault()
                      setIsNavModalClose(true)
                    }}
                  >
                    About
                  </Link>
                </li>
                <li className='nav-item'>
                  <Link
                    className='nav-link '
                    smooth='easeInOutQuint'
                    duration={scrollDuration}
                    style={{ cursor: 'pointer' }}
                    activeClass='active'
                    spy
                    to='resume'
                    onClick={() => {
                      // e.preventDefault()
                      setIsNavModalClose(true)
                    }}
                  >
                    Resume
                  </Link>
                </li>
                <li className='nav-item'>
                  <Link
                    className='nav-link '
                    smooth='easeInOutQuint'
                    duration={scrollDuration}
                    style={{ cursor: 'pointer' }}
                    activeClass='active'
                    spy
                    to='portfolio'
                    onClick={() => {
                      // e.preventDefault()
                      setIsNavModalClose(true)
                    }}
                  >
                    Portfolio
                  </Link>
                </li>

                <li className='nav-item'>
                  <Link
                    className='nav-link '
                    smooth='easeInOutQuint'
                    duration={scrollDuration}
                    style={{ cursor: 'pointer' }}
                    activeClass='active'
                    spy
                    to='contact'
                    onClick={() => {
                      // e.preventDefault()
                      setIsNavModalClose(true)
                    }}
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className='col-auto col-lg-2 d-flex justify-content-end ps-0'>
            <ul className='social-icons'>
              <li className='social-icons-facebook'>
                {/* <Tooltip text='Twitter' placement='bottom'>
                  <a
                    href='http://www.facebook.com/'
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    <i className='fab fa-facebook' />
                  </a>
                </Tooltip> */}
              </li>
              <li className='social-icons-twitter'>
                {/* <Tooltip text='Twitter' placement='bottom'>
                  <a
                    href='http://www.twitter.com/'
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    <i className='fab fa-twitter' />
                  </a>
                </Tooltip> */}
              </li>
              <li className='social-icons-instagram'>
                {/* <Tooltip text='Twitter' placement='bottom'>
                  <a
                    href='http://www.instagram.com/'
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    <i className='fab fa-instagram' />
                  </a>
                </Tooltip> */}
              </li>
            </ul>
          </div>
        </div>
      </nav>
      {/* Navbar End */}
    </header>
  )
}

export default StandardMenuHeader
