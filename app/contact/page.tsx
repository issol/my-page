'use client'

import React, { useEffect, useRef, useState } from 'react'
import emailjs from '@emailjs/browser'
import { ToastContainer, toast } from 'react-toastify'

import 'react-toastify/dist/ReactToastify.css'

import dynamic from 'next/dynamic'

const Tooltip = dynamic(() => import('../components/tooltip'), {
  ssr: false,
})

const Contact = () => {
  const form = useRef()
  const [sendingMail, setSendingMail] = useState(false)
  const [enableAnimation, setEnableAnimation] = useState(false)

  const sendEmail = e => {
    e.preventDefault()
    setSendingMail(true)
    console.log(form.current)

    emailjs
      .sendForm(
        'service_h7erqmb',
        'template_nbzlnnc',
        form.current,
        'sIfnqCxymfeZ2SkHe',
      )
      .then(
        result => {
          ;(document.getElementById('contact-form') as HTMLFormElement).reset()
          toast.success('Message sent successfully!', {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'light',
          })

          setSendingMail(false)
        },
        error => {
          toast.error('Something went wrong!', {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'light',
          })

          setSendingMail(false)
        },
      )
  }

  useEffect(() => {
    const contact = document.getElementById('contact')

    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', () => {
        if (window.innerHeight > contact.getBoundingClientRect().top) {
          setEnableAnimation(true)
        } else {
          setEnableAnimation(false)
        }
      })
    }
  }, [])

  return (
    <section id='contact' className='section bg-primary'>
      <div className='container'>
        <div className='row'>
          <div
            className={`col-lg-5 text-center text-lg-start ${
              enableAnimation ? 'animate__animated animate__fadeInUp' : ''
            }`}
          >
            <h2 className='text-10 fw-600 mb-5'>감사합니다!</h2>
            <p className='text-5 mb-5'>
              성장하기 위해 익숙한 것은 되돌아보고, 낯설고 새로운 것에 도전하는
              것을 즐기려고 합니다. <br />
              항상 사용자의 시각에서 좋은 서비스, 제품을 만들기 위해 노력하는
              개발자가 되겠습니다.
            </p>

            <ul className='social-icons social-icons-lg justify-content-center justify-content-lg-start mt-2'>
              <li className='social-icons-github'>
                <Tooltip text='Github' placement='top'>
                  <a
                    href='http://www.github.com/issol'
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    <i className='fab fa-github' />
                  </a>
                </Tooltip>
              </li>
              <li className='social-icons-dribbble'>
                <Tooltip text='Tistory' placement='top'>
                  <a
                    href='https://issol96.tistory.com/'
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    <i className='fa fa-globe' />
                  </a>
                </Tooltip>
              </li>
            </ul>
          </div>
          <div
            className={`col-lg-6 ms-auto mt-5 mt-lg-0 ${
              enableAnimation
                ? 'animate__animated animate__fadeInUp animate animate__delay-0.3s'
                : ''
            }`}
          >
            <h2 className='text-10 fw-600 text-center text-lg-start mb-5'>
              연락 주실 일이 생기신다면?
            </h2>

            <form
              id='contact-form'
              className='form-border'
              method='post'
              ref={form}
              onSubmit={sendEmail}
            >
              <div className='row g-4'>
                <div className='col-12'>
                  <label className='form-label' htmlFor='name'>
                    이름을 입력해주세요:
                  </label>
                  <input
                    id='name'
                    name='user_name'
                    type='text'
                    className='form-control py-1'
                    required
                  />
                </div>
                <div className='col-12'>
                  <label className='form-label' htmlFor='email'>
                    이메일 주소를 입력해주세요:
                  </label>
                  <input
                    id='email'
                    name='user_email'
                    type='email'
                    className='form-control py-1'
                    required
                  />
                </div>
                <div className='col-12'>
                  <label className='form-label' htmlFor='form-message'>
                    메일 내용을 입력해주세요:
                  </label>
                  <textarea
                    id='form-message'
                    name='message'
                    className='form-control py-1'
                    rows={4}
                    required
                    defaultValue={''}
                  />
                </div>
                <div className='col-12 text-center text-lg-start'>
                  <button
                    id='submit-btn'
                    className='btn btn-dark rounded-0'
                    type='submit'
                  >
                    {sendingMail ? (
                      <>
                        <span
                          role='status'
                          aria-hidden='true'
                          className='spinner-border spinner-border-sm align-self-center me-2'
                        ></span>
                        Sending......
                      </>
                    ) : (
                      <>
                        Send{' '}
                        <span className='ms-3'>
                          <i className='fas fa-arrow-right' />
                        </span>
                      </>
                    )}
                  </button>
                </div>
                <ToastContainer />
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Contact
