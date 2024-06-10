import React, { useEffect, useState } from 'react'
import { Element } from 'react-scroll'

const AboutMe = () => {
  const [enableAnimation, setEnableAnimation] = useState(false)

  useEffect(() => {
    const about = document.getElementById('about')
    console.log(about.getBoundingClientRect().top)

    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', () => {
        if (window.innerHeight > about.getBoundingClientRect().top) {
          setEnableAnimation(true)
        } else {
          setEnableAnimation(false)
        }
      })
    }
  }, [])

  return (
    <section id='about' className='section'>
      <div className='container'>
        {/* Heading */}
        <p
          className={`text-center mb-2 ${
            enableAnimation ? 'animate__animated animate__fadeInUp' : ''
          }`}
        >
          <span className='bg-primary text-dark px-2'>About Me</span>
        </p>
        <h2
          className={`text-10 fw-600 text-center mb-5 ${
            enableAnimation ? 'animate__animated animate__fadeInUp' : ''
          }`}
        >
          Know Me More
        </h2>
        {/* Heading end*/}
        <div className='row'>
          <div
            className={`col-lg-8 text-center text-lg-start ${
              enableAnimation ? 'animate__animated animate__fadeInUp' : ''
            }`}
          >
            <h2 className='text-8 fw-400 mb-3'>
              안녕하세요, 저는&nbsp;
              <span className='fw-700 border-bottom border-3 border-primary'>
                김민규입니다.
              </span>
            </h2>
            <p className='text-5'>
              안녕하세요! 저는 3년차 프론트엔드 개발자로, "Why"를 중요하게
              생각하고 그 이유를 이해하며 개발하는 것을 가치로 삼고 있습니다.
              팀원과의 협업을 강조하며 기능 개발 뿐만 아니라 그 배후에 있는
              의미와 목적을 이해하고 설명하는 것을 중요시합니다.
              <br />
              <br /> 번역 프로젝트 관리 서비스부터 영상 파일 업로드 및 변환
              서비스, 그리고 웹툰 번역가를 위한 도구까지 다양한 영역에서
              개발하고 있습니다. 이러한 경험을 바탕으로 현재는 Git, AWS
              Codebuild, ArgoCD 등을 이용한 CI/CD 개념에 익숙하며, React를
              기반으로 한 CSR, Next.js를 기반으로 한 SSG 개발을 하고 있습니다.
            </p>
          </div>
          <div
            className={`col-lg-4 mt-4 mt-lg-0 ${
              enableAnimation
                ? 'animate__animated animate__fadeInUp animate__delay-0.2s'
                : ''
            } `}
          >
            <div className='featured-box style-4'>
              <div className='featured-box-icon text-25 fw-500 bg-primary rounded-circle'>
                <span
                  className={`${
                    enableAnimation
                      ? 'animate__animated animate__heartBeat animate__delay-1s'
                      : ''
                  }`}
                >
                  3
                </span>
              </div>
              <h3
                className={`text-7 ${
                  enableAnimation
                    ? 'animate__animated animate__rubberBand animate__delay-2s'
                    : ''
                }`}
              >
                Years of <span className='fw-700'>Experience</span>
              </h3>
            </div>
          </div>
        </div>
        <div className='row gy-3 mt-4'>
          <div
            className={`col-6 col-lg-3 ${
              enableAnimation ? 'animate__animated animate__fadeInUp' : ''
            }`}
          >
            <p className='text-muted fw-500 mb-0'>Name:</p>
            <p className='text-4 text-dark fw-600 mb-0'>김민규</p>
          </div>
          <div
            className={`col-6 col-lg-3 ${
              enableAnimation
                ? 'animate__animated animate__fadeInUp animate__delay-0.2s'
                : ''
            }`}
          >
            <p className='text-muted fw-500 mb-0'>Email:</p>
            <p className='text-4 fw-600 mb-0'>
              <a className='link-dark' href='mailto:isolatorv@gmail.com'>
                isolatorv@gmail.com
              </a>
            </p>
          </div>
          <div
            className={`col-6 col-lg-3 ${
              enableAnimation
                ? 'animate__animated animate__fadeInUp animate__delay-0.3s'
                : ''
            }`}
          >
            <p className='text-muted fw-500 mb-0'>Date of birth:</p>
            <p className='text-4 text-dark fw-600 mb-0'>1996년 02월 21일</p>
          </div>
          <div
            className={`col-6 col-lg-3 ${
              enableAnimation
                ? 'animate__animated animate__fadeInUp animate__delay-0.4s'
                : ''
            }`}
          >
            <p className='text-muted fw-500 mb-0'>From:</p>
            <p className='text-4 text-dark fw-600 mb-0'>서울, 한국</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutMe
