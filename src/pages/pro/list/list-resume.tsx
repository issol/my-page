import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Icon from '@src/@core/components/icon'

import { useState } from 'react'
import Slider from 'react-slick'
import { v4 as uuidv4 } from 'uuid'
import { FileType } from 'src/shared/const/signedURLFileType'

type Props = {
  resume: Array<{
    id: number
    fileName: string
    filePath: string
    url: string
    fileExtension: string
  }>
  onClickFile: (file: {
    id: number
    url: string
    filePath: string
    fileName: string
    fileExtension: string
  }, fileType: string) => void
}

const ListResume = ({ resume, onClickFile }: Props) => {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(3)

  const handleChangePage = (direction: string) => {
    // window.scrollTo({ top: 0, left: 0, behavior: 'auto' })

    const changedPage =
      direction === 'prev'
        ? Math.max(page - 1, 0)
        : direction === 'next'
        ? page + 1
        : 0

    setPage(changedPage)
  }
  const NextArrow = (props: any) => {
    const { onClick, slideCount } = props

    return !(Math.min(3 * (page + 1), slideCount) === slideCount) ? (
      <IconButton
        sx={{
          fontSize: 0,
          lineHeight: 0,

          width: '24px',
          height: '24px',
          padding: 0,
          transform: 'translate(0, -50%)',
        }}
        onClick={() => {
          // onClick()
          setPage(prevState => prevState + 1)
        }}
      >
        <Icon icon='mdi:chevron-right' color='blue' />
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
    dots: false,

    speed: 500,
    slidesToShow:
      resume && resume.length && resume.length < 3
        ? resume.length
        : resume?.length === 0
        ? 1
        : 3,
    slidesToScroll: 3,
    nextArrow: <NextArrow />,
    prevArrow: <PrevButton />,
  }
  return (
    <Box
      sx={{
        width: '100%',

        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <Box sx={{ display: 'flex', flex: 1 }}>
        {page ? (
          <IconButton
            sx={{
              width: '24px',
              height: '24px',
              padding: 0,
            }}
            onClick={() => {
              // onClick()
              handleChangePage('prev')
            }}
          >
            <Icon icon='mdi:chevron-left' color='blue' opacity={0.5} />
          </IconButton>
        ) : null}
      </Box>

      <Box
        sx={{
          flex: 3,
          display: 'flex',

          overflow: 'hidden',
          justifyContent: 'center',
        }}
      >
        {resume && resume.length ? (
          resume?.slice(page, page + rowsPerPage).map(value => {
            return (
              <Tooltip
                key={uuidv4()}
                title={`${value.fileName}.${value.fileExtension}`}
              >
                <Box
                  sx={{
                    width: '24px',
                    maxWidth: '24px',
                    cursor: 'pointer',
                  }}
                  onClick={() => onClickFile(value, FileType.RESUME)}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',

                      width: '24px',
                      height: '24px',
                    }}
                  >
                    <img
                      src={`/images/icons/file-icons/list-resume.svg`}
                      style={{
                        width: '24px',
                        height: '24px',
                      }}
                      alt='file'
                    ></img>
                  </Box>
                </Box>
              </Tooltip>
            )
          })
        ) : (
          <Box>-</Box>
        )}
      </Box>
      <Box sx={{ display: 'flex', flex: 1 }}>
        {!(Math.min(3 * (page + 1), resume?.length) === resume?.length) ? (
          <IconButton
            sx={{
              fontSize: 0,
              lineHeight: 0,

              width: '24px',
              height: '24px',
              padding: 0,
            }}
            onClick={() => {
              // onClick()
              handleChangePage('next')
            }}
          >
            <Icon icon='mdi:chevron-right' color='blue' opacity={0.5} />
          </IconButton>
        ) : null}
      </Box>
    </Box>
  )
}

export default ListResume
