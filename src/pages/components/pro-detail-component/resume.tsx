import Card from '@mui/material/Card'

import { styled } from '@mui/system'
import Divider from '@mui/material/Divider'

import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { OnboardingUserType } from '@src/types/onboarding/list'
import IconButton from '@mui/material/IconButton'
import Icon from '@src/@core/components/icon'
import TypoGraphy from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { v4 as uuidv4 } from 'uuid'
import { OnboardingProDetailsType } from '@src/types/onboarding/details'

import Slider from 'react-slick'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { S3FileType } from '@src/shared/const/signedURLFileType'
import { getDownloadUrlforCommon } from '@src/apis/common.api'

type Props = {
  userInfo: OnboardingProDetailsType
  onClickResume: (
    file: {
      url: string
      filePath: string
      fileName: string
      fileExtension: string
    },
    fileType: string,
  ) => void
}

export default function Resume({ userInfo, onClickResume }: Props) {
  const [page, setPage] = useState(0)
  const [resumeObj, setResumeObj] = useState<
    {
      url: string
      filePath: string
      fileName: string
      fileExtension: string
    }[]
  >([])

  useEffect(() => {
    const resumeData: {
      url: string
      filePath: string
      fileName: string
      fileExtension: string
    }[] = []
    if (!userInfo) return
    if (userInfo.resume && userInfo.resume.length) {
      userInfo.resume.map(value => {
        if (typeof value === 'string') {
          resumeData.push({
            url: value,
            filePath: value,
            fileName: extractFileName(value),
            fileExtension: extractFileExtension(value),
          })
        } else {
          resumeData.push(value)
        }
      })
    }
    setResumeObj(resumeData)
  }, [userInfo])

  const DownloadAllFile = (
    file:
      | {
          url: string
          filePath: string
          fileName: string
          fileExtension: string
        }[]
      | null,
  ) => {
    if (file) {
      file.map(value => {
        getDownloadUrlforCommon(S3FileType.RESUME, value.filePath).then(res => {
          const previewFile = {
            url: res,
            fileName: value.fileName,
            fileExtension: value.fileExtension,
          }
          // console.log("previewFile",previewFile)
          fetch(previewFile.url, { method: 'GET' })
            .then(res => {
              return res.blob()
            })
            .then(blob => {
              const url = window.URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = `${value.fileName}.${value.fileExtension}`
              document.body.appendChild(a)
              a.click()
              setTimeout((_: any) => {
                window.URL.revokeObjectURL(url)
              }, 60000)
              a.remove()
              // onClose()
            })
            .catch(error =>
              toast.error(
                'Something went wrong while uploading files. Please try again.',
                {
                  position: 'bottom-left',
                },
              ),
            )
        })
      })
    }
  }

  const NextArrow = (props: any) => {
    const { onClick, slideCount } = props

    return !(Math.min(6 * (page + 1), slideCount) === slideCount) ? (
      <IconButton
        sx={{
          fontSize: 0,
          lineHeight: 0,

          position: 'absolute',
          top: '50%',
          right: '-17px',
          display: 'block',

          width: '24px',
          height: '24px',
          padding: 0,
          transform: 'translate(0, -50%)',
        }}
        onClick={() => {
          onClick()
          setPage(prevState => prevState + 1)
        }}
      >
        <Icon icon='mdi:chevron-right' color='black' />
      </IconButton>
    ) : null
  }
  const PrevButton = (props: any) => {
    const { onClick } = props

    return page ? (
      <IconButton
        sx={{
          fontSize: 0,
          lineHeight: 0,

          position: 'absolute',
          top: '50%',
          left: '-22px',
          display: 'block',

          width: '24px',
          height: '24px',
          padding: 0,
          transform: 'translate(0, -50%)',
        }}
        onClick={() => {
          onClick()
          setPage(prevState => prevState - 1)
        }}
      >
        <Icon icon='mdi:chevron-left' color='black' />
      </IconButton>
    ) : null
  }
  const settings = {
    dots: true,
    speed: 500,
    slidesToShow:
      resumeObj && resumeObj.length && resumeObj.length < 6
        ? resumeObj.length
        : resumeObj?.length === 0
          ? 1
          : 6,
    slidesToScroll: 6,
    nextArrow: <NextArrow />,
    prevArrow: <PrevButton />,
  }

  const extractFileName = (path: string) => {
    console.log('extractFileName', path)
    if (!path) return ''
    return path.split('/').pop() ?? ''
  }

  const extractFileExtension = (path: string) => {
    const fileName = extractFileName(path)
    const fileExtension = fileName
      ? fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase()
      : 'default'

    switch (fileExtension) {
      case 'doc':
      case 'docx':
        return 'doc'
      case 'xls':
      case 'xlsx':
      case 'csv':
        return 'excel'
      case 'pdf':
        return 'pdf'
      case 'ppt':
      case 'pptx':
        return 'ppt'
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'gif':
        return 'img'
      case 'mp4':
      case 'mov':
      case 'avi':
        return 'video'
      default:
        return 'default'
    }
  }

  return (
    <Card sx={{ padding: '20px 20px 0 20px', height: '100%' }}>
      <TypoGraphy
        variant='h6'
        sx={{
          padding: 0,
          paddingBottom: '24px',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        Resume
        <IconButton
          sx={{ padding: 0 }}
          onClick={() =>
            DownloadAllFile(
              resumeObj && resumeObj.length
                ? resumeObj.map(value => value)
                : null,
            )
          }
        >
          <img src='/images/icons/file-icons/download.svg' alt='download'></img>
        </IconButton>
      </TypoGraphy>
      <CardContent sx={{ padding: 0 }}>
        <Box sx={{ margin: 1 }}>
          <Slider {...settings}>
            {resumeObj && resumeObj.length ? (
              resumeObj?.map(value => {
                return (
                  <Box
                    key={uuidv4()}
                    sx={{
                      width: '53px',
                      maxWidth: '53px',
                      display: 'flex',
                      flexDirection: 'column',

                      alignItems: 'center',
                      gap: '5px',
                      cursor: 'pointer',
                    }}
                    onClick={() => onClickResume(value, S3FileType.RESUME)}
                  >
                    <Box
                      sx={{
                        display: 'flex',

                        justifyContent: 'center',
                      }}
                    >
                      <img
                        src={`/images/icons/file-icons/${value.fileExtension}.svg`}
                        style={{
                          width: '40px',
                          height: '40px',
                        }}
                        alt='file'
                      ></img>
                    </Box>

                    <ResumeFileName>{value.fileName}</ResumeFileName>
                  </Box>
                )
              })
            ) : (
              <Box>-</Box>
            )}
          </Slider>
        </Box>
      </CardContent>
    </Card>
  )
}

const ResumeFileName = styled('div')`
  width: 100%;
  // height: 51px;
  font-family: Inter;
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  // line-height: 14px;

  text-align: center;
  letter-spacing: 0.4px;

  color: rgba(76, 78, 100, 0.6);

  overflow: hidden;
  word-break: break-all;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`
