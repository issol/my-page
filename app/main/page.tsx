'use client'

import { Box, Divider, Typography } from '@mui/material'
import Link from 'next/link'

const Main = () => {
  return (
    <Box
      sx={{
        padding: '0 50px',
        width: '100%',
        overflowY: 'scroll',
        height: '100%',
      }}
    >
      <Box
        sx={{
          background: '#FFF',
          padding: '0 60px',
          display: 'flex',
          width: '100%',
        }}
      >
        <Box
          sx={{
            width: '60%',
            display: 'flex',
            flexDirection: 'column',

            gap: '20px',
            padding: '80px 0',
          }}
        >
          <Box>
            <Typography fontSize={48} fontWeight={600} color='#FFB400'>
              프론트엔드&nbsp;
              <Typography
                fontSize={48}
                fontWeight={600}
                color='#000000'
                component={'span'}
              >
                개발자
              </Typography>
            </Typography>
            <Typography fontSize={48} fontWeight={600}>
              김민규입니다
            </Typography>
          </Box>
          <Typography color='#767676'>
            안녕하세요! 저는 3년차 프론트엔드 개발자로, "Why"를 중요하게
            생각하고 그 이유를 이해하며 개발하는 것을 가치로 삼고 있습니다.
            팀원과의 협업을 강조하며 기능 개발 뿐만 아니라 그 배후에 있는 의미와
            목적을 이해하고 설명하는 것을 중요시합니다.
            <br />
            <br /> 번역 프로젝트 관리 서비스부터 영상 파일 업로드 및 변환
            서비스, 그리고 웹툰 번역가를 위한 도구까지 다양한 영역에서 개발하고
            있습니다. 이러한 경험을 바탕으로 현재는 Git, AWS Codebuild, ArgoCD
            등을 이용한 CI/CD 개념에 익숙하며, React를 기반으로 한 CSR,
            Next.js를 기반으로 한 SSG 개발을 하고 있습니다.
          </Typography>
        </Box>
        <Box sx={{ width: '40%' }}></Box>
      </Box>
      <Box
        sx={{
          width: '100%',
          display: 'flex',

          flexDirection: 'column',
          alignItems: 'center',
          mt: '70px',
          gap: '25px',
        }}
      >
        <Typography fontWeight={600} fontSize={32} color='#2B2B2B'>
          경력
        </Typography>
        <Box sx={{ padding: '40px', background: '#FFF', width: '100%' }}>
          <Box
            sx={{
              display: 'flex',
              gap: '8px',
              alignItems: 'baseline',
              borderBottom: '2px solid #F0F0F6',
              width: 'fit-content',
              pb: '8px',
            }}
          >
            <Typography fontSize={20} fontWeight={500}>
              글로지 주식회사 (GloZ Inc.)
            </Typography>
            <Typography fontSize={14} color='#767676'>
              ( 2021.06.14 ~ ){' '}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', width: '100%', mt: '32px', gap: '48px' }}>
            <Box
              sx={{
                width: '40%',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Link
                    href=''
                    target='_blank'
                    style={{
                      color: '#FFB400',
                      textDecoration: 'underline #FFB400',
                    }}
                  >
                    <Typography
                      fontSize={18}
                      color='#2B2B2B'
                      fontWeight={500}
                      sx={{ ':hover': { background: '#FFB40033' } }}
                    >
                      번역 프로젝트 관리 서비스(E'nuff)
                    </Typography>
                  </Link>
                </Box>

                <Box
                  sx={{
                    background: '#FFB400',
                    width: 'fit-content',
                    padding: '4px 7px',
                  }}
                >
                  <Typography color='#FFF' fontSize={10}>
                    2022.10 - 2024.04
                  </Typography>
                </Box>
              </Box>
              <Typography fontSize={14} color='#767676'>
                플랫폼 내에서 번역가 관리, 고객사 관리, 프로젝트 생성 및 배정,
                견적서 및 송장 관리까지 전반적인 번역 프로젝트 관리 SaaS
              </Typography>
            </Box>
            <Box sx={{ width: '60%' }}>
              <ul
                style={{
                  color: '#767676',
                  display: 'flex',
                  gap: '10px',
                  flexDirection: 'column',
                }}
              >
                <li>
                  복잡한 사용자 역할, 권한 관리, 백엔드와의 교차 검증을 위한
                  @casl 라이브러리 사용
                </li>
                <li>재사용 가능한 공통 컴포넌트 개발을 위한 StoryBook 적용</li>
                <li>이벤트, 에러 로그를 추적, 분석, 관리를 위한 Sentry 적용</li>
                <li>
                  서버와 클라이언트 상태값 분리 및 호출 최소화를 위한 React
                  query , Recoil 로 전환 적용
                </li>
                <li>
                  보안이 필요한 파일 업로드 / 다운로드를 위한 s3 pre-signed url
                  적용
                </li>
              </ul>
              {/* 개발 스택 : Next.js, React query, Recoil, aws s3, aws lambda,
              typescript, @casl, MUI 역할 : - - - - - 참고: https://enuff.space */}
            </Box>
          </Box>

          <Divider sx={{ my: '30px' }} />
          <Box sx={{ display: 'flex', width: '100%', mt: '16px', gap: '48px' }}>
            <Box
              sx={{
                width: '40%',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Link
                    href=''
                    target='_blank'
                    style={{
                      color: '#FFB400',
                      textDecoration: 'underline #FFB400',
                    }}
                  >
                    <Typography
                      fontSize={18}
                      color='#2B2B2B'
                      fontWeight={500}
                      sx={{ ':hover': { background: '#FFB40033' } }}
                    >
                      PSD 파일 번역 지원 서비스 개발
                    </Typography>
                  </Link>
                </Box>

                <Box
                  sx={{
                    background: '#FFB400',
                    width: 'fit-content',
                    padding: '4px 7px',
                  }}
                >
                  <Typography color='#FFF' fontSize={10}>
                    2024.02 - 2024.02
                  </Typography>
                </Box>
              </Box>
              <Typography fontSize={14} color='#767676'>
                PSD, PSB 등의 웹툰 파일들을 업로드하고 말풍선을 이미지 위에
                작업하여 번역 작업을 수행할 수 있는 툴
              </Typography>
            </Box>
            <Box sx={{ width: '60%' }}>
              <ul
                style={{
                  color: '#767676',
                  display: 'flex',
                  gap: '10px',
                  flexDirection: 'column',
                }}
              >
                <li>
                  웹툰 번역 작업 및 납품까지의 과정을 간소화 하여 사내 웹툰
                  번역가들의 업무 효율 증대(번역부터 디자인에서의 작업 시간 평균
                  42% 감소)
                </li>
                <li>
                  대용량 파일인 .psd, .psb 파일을 메인 쓰레드 차단 없이 읽고 쓸
                  수 있게, Web worker 사용하여 안정적인 FPS 유지
                </li>
                <li>
                  라이브러리 의존성, 패키지 용량을 줄이기 위해 말풍선 DnD 이벤트
                  순수 구현
                </li>
                <li>
                  대용량 파일의 이미지 변환 및 브라우저에 빠르게 노출 시키기
                  위해 Canvas 활용
                </li>
                <li>
                  작업 완료된 파일을 포토샵에 맞게 그룹핑 및 수정 가능한
                  레이어를 추가하여 export 지원
                </li>
              </ul>
              {/* 개발 스택 : Next.js, React query, Recoil, aws s3, aws lambda,
              typescript, @casl, MUI 역할 : - - - - - 참고: https://enuff.space */}
            </Box>
          </Box>
          <Divider sx={{ my: '30px' }} />
          <Box sx={{ display: 'flex', width: '100%', mt: '16px', gap: '48px' }}>
            <Box
              sx={{
                width: '40%',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Link
                    href=''
                    target='_blank'
                    style={{
                      color: '#FFB400',
                      textDecoration: 'underline #FFB400',
                    }}
                  >
                    <Typography
                      fontSize={18}
                      color='#2B2B2B'
                      fontWeight={500}
                      sx={{ ':hover': { background: '#FFB40033' } }}
                    >
                      미디어 컨텐츠의 특화된 현지화 서비스 플랫폼 GloHub 서비스
                      개발 및 고도화
                    </Typography>
                  </Link>
                </Box>

                <Box
                  sx={{
                    background: '#FFB400',
                    width: 'fit-content',
                    padding: '4px 7px',
                  }}
                >
                  <Typography color='#FFF' fontSize={10}>
                    2021.09 - 2022.10
                  </Typography>
                </Box>
              </Box>
              <Typography fontSize={14} color='#767676'>
                번역가, 고객사, 프로젝트 관리, 견적서 및 송장 관리까지 전반적인
                번역 프로세스를 한 곳에서 진행할 수 있는 종합 서비스 플랫폼
              </Typography>
            </Box>
            <Box sx={{ width: '60%' }}>
              <ul
                style={{
                  color: '#767676',
                  display: 'flex',
                  gap: '10px',
                  flexDirection: 'column',
                }}
              >
                <li>
                  서버와 클라이언트 상태값 분리 및 호출 최소화를 위한 React
                  query 적용
                </li>
                <li>
                  React에서 Next.js 전환, SEO 설정 및 접근성, 성능 개선(Google
                  lighthouse 기준 32퍼 상승)
                </li>
                <li>
                  파일 업로드 보안 설정
                  <ul
                    style={{
                      paddingLeft: '16px',
                      display: 'flex',
                      gap: '10px',
                      flexDirection: 'column',
                    }}
                  >
                    <li>aws s3, signed url 활용</li>
                    <li>
                      프론트에서 api 호출 시 aws lambda에서 url 검증 후 다운로드
                      가능한 s3 bucket url 반환
                    </li>
                  </ul>
                </li>
                <li>
                  영상 파일 음성 추출, 압축 및 변환 기능 추가
                  <ul
                    style={{
                      paddingLeft: '16px',
                      display: 'flex',
                      gap: '10px',
                      flexDirection: 'column',
                    }}
                  >
                    <li>
                      s3에 업로드 된 파일을 aws media convert에서 압축 및 추출
                      과정을 거쳐서 다시 s3 새로운 폴더에 저장
                    </li>
                  </ul>
                </li>
                <li>
                  작업 완료된 파일을 포토샵에 맞게 그룹핑 및 수정 가능한
                  레이어를 추가하여 export 지원
                </li>
              </ul>
              {/* 개발 스택 : Next.js, React query, Recoil, aws s3, aws lambda,
              typescript, @casl, MUI 역할 : - - - - - 참고: https://enuff.space */}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default Main
