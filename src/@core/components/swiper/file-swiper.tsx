// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import { Button, Direction, IconButton, Typography } from '@mui/material'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Components
import clsx from 'clsx'
import { useKeenSlider } from 'keen-slider/react'

import styled from 'styled-components'

export type FileItemType = {
  id?: number
  url: string
  filePath: string
  fileName: string
  fileExtension: string
  fileSize?: number
}

type Props = {
  files: Array<FileItemType>
  direction: Direction
  onDelete?: (file: FileItemType) => void
  onFileClick: (file: FileItemType) => void
  isDeletable?: boolean
}

const FileSwiper = ({
  files,
  direction,
  onDelete,
  onFileClick,
  isDeletable = true,
}: Props) => {
  // ** States
  const [loaded, setLoaded] = useState<boolean>(false)
  const [currentSlide, setCurrentSlide] = useState<number>(0)

  // ** Hook
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    rtl: direction === 'rtl',
    slides: {
      perView: 5,
    },

    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel)
    },
    created() {
      setLoaded(true)
    },
  })

  return (
    <>
      <Box className='navigation-wrapper'>
        <Box ref={sliderRef} className='keen-slider'>
          {files?.map((value, idx) => (
            <FileContainer key={value.filePath} className='keen-slider__slide'>
              {isDeletable && (
                <IconButton
                  className='delete-button'
                  onClick={() => {
                    if (onDelete) onDelete(value)
                  }}
                >
                  <Icon
                    icon='mdi:trash-outline'
                    color='#666CFF'
                    fontSize={16}
                  />
                </IconButton>
              )}

              <Box
                display='flex'
                flexDirection='column'
                alignItems='center'
                className=''
              >
                <img
                  src={`/images/icons/file-icons/${value?.fileExtension}-file.svg`}
                  alt='file'
                  width={60}
                />
                <FileName
                  onClick={() => onFileClick(value)}
                  title='download file'
                >
                  {value?.fileName}
                </FileName>
              </Box>
            </FileContainer>
          ))}
        </Box>
        {loaded && instanceRef.current && (
          <>
            <Icon
              icon='mdi:chevron-left'
              className={clsx('arrow arrow-left', {
                'arrow-disabled': currentSlide === 0,
              })}
              onClick={(e: any) =>
                e.stopPropagation() || instanceRef.current?.prev()
              }
            />

            <Icon
              icon='mdi:chevron-right'
              className={clsx('arrow arrow-right', {
                'arrow-disabled':
                  currentSlide ===
                  instanceRef.current.track.details.slides.length - 1,
              })}
              onClick={(e: any) =>
                e.stopPropagation() || instanceRef.current?.next()
              }
            />
          </>
        )}
      </Box>
    </>
  )
}

export default FileSwiper

const FileContainer = styled(Box)`
  /* position: relative; */
  height: 100%;

  .delete-button {
    display: none;
    position: absolute;
    top: 0px;
    right: 15px;
    padding: 0;
    width: 24px;
    height: 24px;
    background: rgba(255, 255, 255, 0.8);
    box-shadow: 0px 1.35714px 6.78571px rgba(76, 78, 100, 0.22);
    border-radius: 32.5714px;
  }
  :hover {
    .delete-button {
      display: block;
    }
  }
`

const FileName = styled(Button)`
  width: 100%;
  cursor: pointer;
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
  :hover {
    text-decoration: underline;
  }
`
