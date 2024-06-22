'use client'

import Image from 'next/image'
import React, { useEffect, useState } from 'react'

const Resume = () => {
  const educationDetails = [
    {
      yearRange: '2016.03 - 2020.08',
      title: '컴퓨터공학과',
      place: '학점은행제',
      desc: '컴퓨터 공학 학사',
    },
  ]

  const experienceDetails = [
    {
      yearRange: '2021.06 - 현재까지',
      title: '프론트엔드 개발자',
      place: 'GloZ Inc',
      desc: '번역 프로젝트 관리 플랫폼 개발 및 유지보수',
    },
  ]

  const skills = [
    {
      name: 'icon_javascript.svg',
      percent: 65,
    },
    {
      name: 'icon_html.svg',
      percent: 95,
    },
    {
      name: 'icon_css.svg',
      percent: 80,
    },
    {
      name: 'icon_react.svg',
      percent: 70,
    },
    {
      name: 'icon_nextjs.svg',
      percent: 60,
    },
    {
      name: 'icon_aws.svg',
      percent: 99,
    },
  ]

  const [enableAnimation, setEnableAnimation] = useState(false)

  useEffect(() => {
    const resume = document.getElementById('resume')

    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', () => {
        if (window.innerHeight > resume.getBoundingClientRect().top) {
          setEnableAnimation(true)
        } else {
          setEnableAnimation(false)
        }
      })
    }
  }, [])

  return (
    <section id='resume' className='section bg-light'>
      <div className='container'>
        {/* Heading */}
        <p
          className={`text-center mb-2 ${
            enableAnimation ? 'animate__animated animate__fadeInUp' : ''
          }`}
        >
          <span className='bg-primary text-dark px-2'>Resume</span>
        </p>
        <h2
          className={`text-10 fw-600 text-center mb-5 ${
            enableAnimation ? 'animate__animated animate__fadeInUp' : ''
          }`}
        >
          A summary of My Resume
        </h2>
        {/* Heading end*/}
        <div className='row g-5 mt-5'>
          {/* My Education */}
          <div
            className={`col-lg-6 ${
              enableAnimation ? 'animate__animated animate__fadeInUp' : ''
            }`}
          >
            <h2 className='text-7 fw-600 mb-4 pb-2'>학력</h2>
            <div className='border-start border-2 border-primary ps-3'>
              {educationDetails.length > 0 &&
                educationDetails.map((value, index) => (
                  <div key={index}>
                    <h3 className='text-5'>{value.title}</h3>
                    <p className='mb-2'>
                      {value.place} / {value.yearRange}
                    </p>
                    <p className='text-muted'>{value.desc}</p>
                    <hr className='my-4' />
                  </div>
                ))}
            </div>
          </div>
          {/* My Experience */}
          <div
            className={`col-lg-6 ${
              enableAnimation
                ? 'animate__animated animate__fadeInUp animate__delay-0.2s'
                : ''
            }`}
          >
            <div className='d-flex align-items-center mb-4 gap-2'>
              <h2 className='text-7 fw-600'>경력</h2>
              <h6 className='text-2 fw-400'>(Last updated : 2024-06-10)</h6>
            </div>

            <div className='border-start border-2 border-primary ps-3'>
              {experienceDetails.length > 0 &&
                experienceDetails.map((value, index) => (
                  <div key={index}>
                    <h3 className='text-5'>{value.title}</h3>
                    <p className='mb-2'>
                      {value.place} / {value.yearRange}
                    </p>
                    <p className='text-muted'>{value.desc}</p>
                    <hr className='my-4' />
                  </div>
                ))}
            </div>
          </div>
        </div>
        {/* My Skills */}
        <h2
          className={`text-7 fw-600 mb-4 pb-2 mt-5 ${
            enableAnimation ? 'animate__animated animate__fadeInUp' : ''
          }`}
        >
          My Skills
        </h2>
        <div className='d-flex gap-3'>
          {skills.length > 0 &&
            skills.map((skill, index) => (
              <div
                className={`${
                  enableAnimation ? 'animate__animated animate__fadeInUp' : ''
                }`}
                key={index}
              >
                <div
                  className='d-flex justify-content-center bg-muted border border-primary rounded-3'
                  style={{ width: '60px', height: '60px', padding: '4px' }}
                >
                  <Image
                    src={`/${skill.name}`}
                    width='48'
                    height='48'
                    alt='icon'
                  />
                </div>
              </div>
            ))}
        </div>
        <p
          className={`text-center mt-5 ${
            enableAnimation ? 'animate__animated animate__fadeInUp' : ''
          }`}
        >
          <a
            className='btn btn-outline-dark shadow-none rounded-0'
            href={'/resume.pdf'}
            download
          >
            Download CV
          </a>
        </p>
      </div>
    </section>
  )
}

export default Resume
