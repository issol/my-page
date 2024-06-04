import { Icon } from '@iconify/react'
import {
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material'
import {
  StyledEditor,
  StyledViewer,
} from '@src/@core/components/editor/customEditor'
import ReactDraftWysiwyg from '@src/@core/components/react-draft-wysiwyg'
import { getDownloadUrlforCommon } from '@src/apis/common.api'
import { S3FileType } from '@src/shared/const/signedURLFileType'
import { formatFileSize } from '@src/shared/helpers/file-size.helper'
import languageHelper from '@src/shared/helpers/language.helper'
import { getFilePath } from '@src/shared/transformer/filePath.transformer'
import { CurrentTestType } from '@src/types/certification-test/detail'
import { FileType } from '@src/types/common/file.type'
import { EditorState, convertFromRaw } from 'draft-js'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import CustomChip from '@src/@core/components/mui/chip'
import { v4 as uuidv4 } from 'uuid'

type Props = {
  onClose: any
  guideline: CurrentTestType
}

const TestGuidelineModal = ({ onClose, guideline }: Props) => {
  const [mainContent, setMainContent] = useState(EditorState.createEmpty())

  function fetchFile(fileName: string) {
    const language =
      guideline?.testType === 'basic'
        ? `${guideline?.target}`
        : `${guideline?.source}-${guideline?.target}`
    const path = getFilePath(
      [
        'testPaper',
        guideline?.testType === 'basic' ? 'basic' : 'skill',
        guideline?.jobType!,
        guideline?.role!,
        language,
        `V${guideline?.version!}`,
      ],
      fileName,
    )
    getDownloadUrlforCommon(S3FileType.TEST_GUIDELINE, path).then(res => {
      fetch(res, { method: 'GET' })
        .then(res => {
          return res.blob()
        })
        .then(blob => {
          const url = window.URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = `${fileName}`
          document.body.appendChild(a)
          a.click()
          setTimeout((_: any) => {
            window.URL.revokeObjectURL(url)
          }, 60000)
          a.remove()
        })
        .catch(err =>
          toast.error(
            'Something went wrong while uploading files. Please try again.',
            {
              position: 'bottom-left',
            },
          ),
        )
    })
  }

  function downloadAllFiles(files: Array<FileType> | [] | undefined) {
    if (!files || !files.length) return

    files.forEach(file => {
      fetchFile(file.name)
    })
  }

  useEffect(() => {
    const content = convertFromRaw(guideline.content as any)

    const editorState = EditorState.createWithContent(content)
    setMainContent(editorState)
  }, [guideline])

  return (
    <Box
      sx={{
        maxWidth: '900px',
        width: '100%',
        background: '#ffffff',
        boxShadow: '0px 0px 20px rgba(76, 78, 100, 0.4)',
        borderRadius: '10px',
        position: 'relative',
      }}
    >
      <IconButton
        sx={{ position: 'absolute', top: '10px', right: '10px' }}
        onClick={onClose}
      >
        <Icon icon='mdi:close'></Icon>
      </IconButton>
      <Box
        sx={{
          padding: '50px 60px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: '20px',
        }}
      >
        <Box sx={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <Image
            src='/images/icons/certification-test-icons/guideline.svg'
            width={28}
            height={28}
            alt=''
          />
          <Typography variant='h5'>Test guideline</Typography>
        </Box>
        <Divider />
        <Box sx={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <Typography sx={{ width: '180px' }} variant='body1' fontWeight={600}>
            Test type
          </Typography>
          <Box>
            <CustomChip
              label={
                guideline.testType === 'basic' ? 'Basic test' : 'Skill test'
              }
              skin='light'
              sx={{
                background: `linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), ${
                  guideline.testType === 'basic' ? '#FDB528' : '#666CFF'
                }`,
                color: guideline.testType === 'basic' ? '#FDB528' : '#666CFF',
              }}
              size='small'
            />
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <Typography sx={{ width: '180px' }} variant='body1' fontWeight={600}>
            Language pair
          </Typography>
          <Typography variant='body2'>
            {guideline.testType === 'basic' ? (
              <>
                {guideline.target.toUpperCase()}(
                {languageHelper(guideline.target)})
              </>
            ) : (
              <>
                {guideline.source.toUpperCase()}(
                {languageHelper(guideline.source)}) &rarr;{' '}
                {guideline.target.toUpperCase()}(
                {languageHelper(guideline.target)})
              </>
            )}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: '10px', alignItems: 'start' }}>
          <Typography
            sx={{ width: '180px', minWidth: '180px' }}
            variant='body1'
            fontWeight={600}
          >
            Test Guideline
          </Typography>

          <StyledViewer noPadding>
            <ReactDraftWysiwyg editorState={mainContent} readOnly={true} />
          </StyledViewer>
        </Box>
        {guideline.files.length > 0 ? (
          <>
            <Divider />
            <Box display='flex' gap='20px' alignItems='center'>
              <Box display='flex' flexDirection='column'>
                <Typography variant='body1' fontWeight={600}>
                  Guideline files
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', gap: '16px' }}>
                <Button
                  variant='outlined'
                  sx={{
                    height: '30px',
                  }}
                  startIcon={<Icon icon='mdi:download' fontSize={18} />}
                  onClick={() => downloadAllFiles(guideline.files)}
                >
                  Download all
                </Button>
              </Box>
            </Box>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3,1fr)',
                gridGap: '16px',
              }}
            >
              {guideline.files.map((file, index) => (
                <Box
                  key={uuidv4()}
                  sx={{
                    display: 'flex',
                    marginBottom: '8px',
                    width: '100%',
                    justifyContent: 'space-between',
                    borderRadius: '8px',
                    padding: '10px 12px',
                    border: '1px solid rgba(76, 78, 100, 0.22)',
                    background: '#f9f8f9',
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <Box
                      sx={{
                        marginRight: '8px',
                        display: 'flex',
                      }}
                    >
                      <Icon
                        icon='material-symbols:file-present-outline'
                        style={{
                          color: 'rgba(76, 78, 100, 0.54)',
                        }}
                        fontSize={24}
                      />
                    </Box>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >
                      <Tooltip title={file.name}>
                        <Typography
                          variant='body1'
                          fontSize={14}
                          fontWeight={600}
                          lineHeight={'20px'}
                          sx={{
                            overflow: 'hidden',
                            wordBreak: 'break-all',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 1,
                            WebkitBoxOrient: 'vertical',
                          }}
                        >
                          {file.name}
                        </Typography>
                      </Tooltip>

                      <Typography variant='caption' lineHeight={'14px'}>
                        {formatFileSize(file.size)}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
          </>
        ) : null}
      </Box>
    </Box>
  )
}

export default TestGuidelineModal
