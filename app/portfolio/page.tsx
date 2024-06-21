import React, { useEffect, useRef, useState } from 'react'
import Isotope from 'isotope-layout'
import ProjectDetailsModal from './projectDetailsModal'

const Portfolio = () => {
  // init one ref to store the future isotope object
  const isotope = useRef()
  const [enableAnimation, setEnableAnimation] = useState(false)
  // store the filter keyword in a state
  const [filterKey, setFilterKey] = useState('*')
  const [imagesLoaded, setimagesLoaded] = useState(0)
  const [selectedProjectDetails, setSelectedProjectDetails] = useState<any>([])
  const [isOpen, setIsOpen] = useState(false)

  const htmlElement = document.getElementsByTagName('html')[0]
  const isRtl = htmlElement.getAttribute('dir') === 'rtl'

  const filters = {
    // DETAILED: 'Details',
    // MOCKUPS: 'Mockups',
    // YOUTUBE: 'Youtube Videos',
    // VIMEO: 'Vimeo Videos',
    TEAM: 'Team',
    SINGLE: 'Single',
  }

  const types = {
    IMAGE: 'image',
    VIDEO: 'video',
    DOCUMENT: 'document',
  }

  const projectsData = [
    {
      title: `번역 프로젝트 관리 서비스 - E'nuff`,
      type: types.DOCUMENT,
      document: {
        projectInfo:
          '플랫폼 내에서 번역가 관리, 고객사 관리, 프로젝트 생성 및 배정, 견적서 및 송장 관리까지 전반적인 번역 프로젝트 관리 SaaS 개발',
        technologies: 'Nextjs, React Query, Recoil, AWS S3, AWS Lambda, MUI',
        date: '2022-10 ~ ',
        role: [
          '복잡한 사용자 역할, 권한 관리, 백엔드와의 교차 검증을 위한 @casl 라이브러리 적용',
          '재사용 가능한 공통 컴포넌트 개발을 위한 StoryBook 적용',
          '이벤트, 에러 로그를 추적, 분석, 관리를 위한 Sentry 적용',
          '서버와 클라이언트 상태값 분리 및 호출 최소화를 위한 React query , Recoil 로 전환 적용',
          '보안이 필요한 파일 업로드 / 다운로드를 위한 s3 pre-signed url 적용',
          '파일 트랜스코딩을 위한 AWS Lambda, AWS Step-Functions 활용',
          'SaaS 전환을 위한 도메인 분리를 위한 Nextjs Middleware 적용',
        ],
        url: [
          {
            name: `E'nuff`,
            link: 'https://enuff.info/',
          },
        ],

        sliderImages: [
          'images/projects/Enuff.png',
          'images/projects/Enuff-2.png',
        ],
      },

      thumbImage: '/images/projects/Enuff-main.png',

      categories: [filters.TEAM],
    },
    {
      title: 'PSD 파일 번역 지원 서비스 - GloToon',
      type: types.DOCUMENT,
      document: {
        projectInfo:
          'PSD 파일 번역 지원 서비스 - 웹툰 번역 작업 및 납품까지의 과정을 간소화 하여 사내 웹툰 번역가들의 업무 효율 증대',
        technologies: 'Nextjs, agPsd, recoil, Web Worker',
        date: '2024-02 ~ 2024-02',
        role: [
          '대용량 파일의 이미지 변환 및 브라우저에 빠르게 노출 시키기 위해 Canvas 적용',
          '대용량 파일인 .psd, .psb 파일을 메인 쓰레드 차단 없이 읽고 쓸 수 있게, Web worker 사용하여 안정적인 FPS 유지',
          '라이브러리 의존성, 패키지 용량을 줄이기 위해 말풍선 DnD 이벤트 순수 구현',
        ],
        url: [
          {
            name: 'GloToon',
            link: 'https://psd-translation-tool.vercel.app/',
          },
          {
            name: 'Blog',
            link: 'https://issol96.tistory.com/5',
          },
        ],
      },

      thumbImage: '/images/projects/Glotoon.png',

      categories: [filters.TEAM, filters.SINGLE],
    },
    {
      title: '유튜브 영상 번역을 통한 개인수익 창출 플랫폼 - GloHub',
      type: types.DOCUMENT,
      document: {
        projectInfo: (
          <>
            PRO : 번역가들이 유튜브 영상 번역을 통한 개인 수익 창출, 플랫폼
            내에서 프로젝트 관리 및 인보이스 관리까지 한 프로세스 관리가 가능한
            플랫폼 개발
            <br /> Creator : 번역 작업 요청 및 결제 시스템 구현
          </>
        ),
        technologies:
          'Nextjs, React, React query, AWS S3, AWS Media Convert, MUI',
        date: '2021.09 ~ 2022.10',
        role: [
          'B2B로 방향 전환 및 카드 결제 시스템 추가',
          '기존 한 플랫폼에서 요청 - 번역 - 완료 플로우는 유지하며 프레임워크를 요청과 수행으로 분리',
          '효율적이고 효과적인 마케팅을 위해 SEO 강점이 있는 Next.js로 전환 - SEO 설정 및 접근성, 성능 개선 작업',
          '서버와 클라이언트 상태값 분리 및 호출 최소화를 위한 React query 적용',
          '영상 파일 음성 추출, 압축 및 변환 기능 추가 - s3에 업로드 된 파일을 aws media convert에서 압축 및 추출 과정을 거쳐서 다시 s3 새로운 폴더에 저장',
          '파일 보안을 위한 AWS Lambda에서 URL 검증 후, signed url 전달하는 로직 추가',
        ],
        sliderImages: ['images/projects/GloHub-Creator.png'],

        url: [
          {
            name: 'GloHub - PRO',
            link: 'https://pro.glo-hub.com/main',
          },
          {
            name: 'GloHub - CREATOR',
            link: 'https://pro.glo-hub.com/main',
          },
        ],
      },

      thumbImage: '/images/projects/GloHub.png',

      categories: [filters.TEAM],
    },
  ]

  // initialize an Isotope object with configs
  useEffect(() => {
    isotope.current = new Isotope('.portfolio-filter', {
      itemSelector: '.filter-item',
      layoutMode: 'masonry',
      originLeft: !isRtl,
    })

    // cleanup
    return () => {
      if (isotope.current) {
        ;(isotope.current as Isotope).destroy()
      }
    }
  }, [])

  // handling filter key change
  useEffect(() => {
    if (imagesLoaded && isotope.current) {
      filterKey === '*'
        ? (isotope.current as Isotope).arrange({ filter: `*` })
        : (isotope.current as Isotope).arrange({ filter: `.${filterKey}` })
    }
  }, [filterKey, imagesLoaded])

  const handleFilterKeyChange = key => () => setFilterKey(key)

  const getKeyByValue = value => {
    return Object.keys(filters).find(key => filters[key] === value)
  }

  const getFilterClasses = categories => {
    if (categories.length > 0) {
      let tempArray = []
      categories.forEach((category, index) => {
        tempArray.push(getKeyByValue(category))
      })
      return tempArray.join(' ')
    }
  }

  useEffect(() => {
    const portfolio = document.getElementById('portfolio')

    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', () => {
        if (window.innerHeight > portfolio.getBoundingClientRect().top) {
          setEnableAnimation(true)
        } else {
          setEnableAnimation(false)
        }
      })
    }
  }, [])

  return (
    <>
      <section id='portfolio' className={'section'}>
        <div className={'container'}>
          {/* Heading */}
          <p
            className={`text-center mb-2 ${
              enableAnimation ? 'animate__animated animate__fadeInUp' : ''
            }`}
          >
            <span className='bg-primary text-dark px-2'>Portfolio</span>
          </p>
          <h2
            className={`text-10 fw-600 text-center mb-5 ${
              enableAnimation ? 'animate__animated animate__fadeInUp' : ''
            }`}
          >
            Some of my most recent projects
          </h2>
          {/* Heading end*/}
          {/* Filter Menu */}
          <ul
            className={`portfolio-menu nav nav-tabs fw-600 justify-content-start justify-content-md-center border-bottom-0 mb-5 ${
              enableAnimation ? 'animate__animated animate__fadeInUp' : ''
            }`}
          >
            <li className='nav-item'>
              <button
                className={'nav-link ' + (filterKey === '*' ? 'active' : '')}
                onClick={handleFilterKeyChange('*')}
              >
                All
              </button>
            </li>
            {Object.keys(filters).map((oneKey, i) => (
              <li className='nav-item' key={i}>
                <button
                  className={
                    'nav-link ' + (filterKey === oneKey ? 'active' : '')
                  }
                  onClick={handleFilterKeyChange(oneKey)}
                >
                  {filters[oneKey]}
                </button>
              </li>
            ))}
          </ul>
          {/* Filter Menu end */}
          <div
            className={`portfolio ${
              enableAnimation ? 'animate__animated animate__fadeInUp' : ''
            }`}
          >
            <div className='row portfolio-filter filter-container g-4'>
              {projectsData.length > 0 &&
                projectsData.map((project, index) => (
                  <div
                    className={
                      'col-sm-6 col-lg-4 filter-item ' +
                      getFilterClasses(project.categories)
                    }
                    key={index}
                  >
                    <div className='portfolio-box'>
                      <div className='portfolio-img'>
                        <img
                          onLoad={() => {
                            setimagesLoaded(imagesLoaded + 1)
                          }}
                          className='img-fluid d-block portfolio-image'
                          src={project.thumbImage}
                          alt=''
                        />
                        <div
                          className='portfolio-overlay'
                          onClick={() => {
                            setSelectedProjectDetails(projectsData[index])
                            setIsOpen(true)
                          }}
                        >
                          <button className='popup-ajax stretched-link border-0 p-0 '>
                            {' '}
                          </button>
                          <div className='portfolio-overlay-details'>
                            <p className='text-primary text-8'>
                              {project.type === types.DOCUMENT && (
                                <i className='fas fa-file-alt'></i>
                              )}
                              {project.type === types.IMAGE && (
                                <i className='fas fa-image'></i>
                              )}
                              {project.type === types.VIDEO && (
                                <i className='fas fa-video'></i>
                              )}
                            </p>
                            <h5 className='text-white text-5'>
                              {project?.title}
                            </h5>
                            {/* <span className='text-light'>Category</span> */}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </section>
      {/* Modal */}
      {isOpen && (
        <ProjectDetailsModal
          projectDetails={selectedProjectDetails}
          setIsOpen={setIsOpen}
        ></ProjectDetailsModal>
      )}
    </>
  )
}

export default Portfolio
