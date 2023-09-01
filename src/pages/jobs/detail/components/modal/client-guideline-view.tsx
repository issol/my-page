import { Icon } from '@iconify/react'
import {
  Box,
  Button,
  Card,
  Divider,
  Grid,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material'
import { StyledViewer } from '@src/@core/components/editor/customEditor'
import { ModalButtonGroup } from '@src/@core/components/modal'
import ReactDraftWysiwyg from '@src/@core/components/react-draft-wysiwyg'
import { byteToMB, formatFileSize } from '@src/shared/helpers/file-size.helper'
import { FileType } from '@src/types/common/file.type'
import { useEffect, useState } from 'react'

import CustomChip from 'src/@core/components/mui/chip'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import { EditorState, convertFromRaw } from 'draft-js'
import { CurrentGuidelineType } from '@src/apis/client-guideline.api'
import { FILE_SIZE } from '@src/shared/const/maximumFileSize'
import { v4 as uuidv4 } from 'uuid'
import {
  FileBox,
  FileName,
} from '@src/pages/invoice/receivable/detail/components/invoice-info'
import { JobsFileType, ProGuidelineType } from '@src/types/jobs/jobs.type'

type Props = {
  onClose: any
  downloadAllFiles: (
    files: JobsFileType[] | [] | undefined | FileType[],
  ) => void
  downloadOneFile: (file: JobsFileType | FileType) => void
  guideLines: ProGuidelineType
}

const ClientGuidelineView = ({
  onClose,
  downloadAllFiles,
  guideLines,
  downloadOneFile,
}: // downloadOneFile,
Props) => {
  console.log(guideLines)

  const [historyContent, setHistoryContent] = useState(
    EditorState.createEmpty(),
  )

  const MAXIMUM_FILE_SIZE = FILE_SIZE.CLIENT_GUIDELINE
  function getFileSize(files: Array<FileType> | [] | undefined) {
    if (!files || !files.length) return 0
    /* @ts-ignore */
    return files.reduce((acc: number, file: FileType) => acc + file.size, 0)
  }

  const savedFileList = guideLines.files?.map((file: FileType) => (
    <Box key={uuidv4()}>
      <FileBox>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ marginRight: '8px', display: 'flex' }}>
            <Icon
              icon='material-symbols:file-present-outline'
              style={{ color: 'rgba(76, 78, 100, 0.54)' }}
              fontSize={24}
            />
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Tooltip title={file.name}>
              <FileName variant='body1'>{file.name}</FileName>
            </Tooltip>

            <Typography variant='caption' lineHeight={'14px'}>
              {formatFileSize(file.size)}
            </Typography>
          </Box>
        </Box>

        <IconButton onClick={() => downloadOneFile(file)}>
          <Icon icon='mdi:download' fontSize={24} />
        </IconButton>
      </FileBox>
    </Box>
  ))

  useEffect(() => {
    if (guideLines?.content) {
      const content = convertFromRaw(guideLines.content as any)
      const editorState = EditorState.createWithContent(content)
      setHistoryContent(editorState)
    }
  }, [guideLines])

  return (
    <Box
      sx={{
        maxWidth: '1266px',
        width: '100%',
        background: '#ffffff',
        boxShadow: '0px 0px 20px rgba(76, 78, 100, 0.4)',
        borderRadius: '10px',
        position: 'relative',
        padding: '50px 60px',
      }}
    >
      <IconButton
        sx={{ position: 'absolute', top: '10px', right: '10px' }}
        onClick={onClose}
      >
        <Icon icon='mdi:close' />
      </IconButton>

      <StyledViewer maxHeight={true}>
        <Grid container justifyContent='center'>
          <Grid container xs={12} spacing={4}>
            <Grid item xs={12} mb='10px'>
              <Box sx={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <Icon
                  icon='fluent:book-information-20-regular'
                  fontSize={32}
                ></Icon>
                <Typography variant='h5'>Client guidelines</Typography>
              </Box>
            </Grid>
            <Grid item xs={9}>
              <Card sx={{ padding: '20px', width: '100%', height: '565px' }}>
                <Box
                  display='flex'
                  justifyContent='space-between'
                  alignItems='center'
                  mb='26px'
                  mt='10px'
                >
                  <Typography variant='h6'>Naver webtoon guide</Typography>
                  <Button
                    startIcon={<Icon icon='mdi:download' />}
                    variant='outlined'
                    size='small'
                  >
                    PDF Download
                  </Button>
                </Box>
                <Grid container>
                  <Grid item xs={2} mb='10px'>
                    <Typography sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
                      Client
                    </Typography>
                  </Grid>
                  <Grid item xs={2} mb='10px'>
                    <Typography variant='body2'>Naver</Typography>
                  </Grid>
                </Grid>
                <Grid container mb='10px'>
                  <Grid item xs={2}>
                    <Typography sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
                      Category
                    </Typography>
                  </Grid>
                  <Grid item xs={2}>
                    <Typography variant='body2'>Webcomics</Typography>
                  </Grid>
                </Grid>
                <Grid container mb='10px'>
                  <Grid item xs={2}>
                    <Typography sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
                      Service type
                    </Typography>
                  </Grid>
                  <Grid item xs={2}>
                    <Typography variant='body2'>Translation</Typography>
                  </Grid>
                </Grid>
                <Divider />
                <ReactDraftWysiwyg
                  editorState={historyContent}
                  readOnly={true}
                />
              </Card>
            </Grid>
            <Grid item xs={3}>
              <Card style={{ height: '100%', overflow: 'scroll' }}>
                <Box
                  sx={{
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                  }}
                >
                  <Box display='flex' justifyContent='space-between'>
                    <Typography sx={{ fontWeight: 600, fontSize: '14px' }}>
                      Attached file
                    </Typography>
                    <Typography variant='body2'>
                      {formatFileSize(getFileSize(guideLines.files))}/{' '}
                      {byteToMB(MAXIMUM_FILE_SIZE)}
                    </Typography>
                  </Box>
                  <Button
                    variant='outlined'
                    startIcon={<Icon icon='mdi:download' />}
                    size='small'
                    // onClick={() => downloadAllFiles(currentRow?.files)}
                  >
                    Download all
                  </Button>
                  <Box
                    sx={{
                      overflow: 'scroll',
                      marginBottom: '12px',
                      maxHeight: '565px',
                      '&::-webkit-scrollbar': { display: 'none' },
                    }}
                  >
                    {savedFileList}
                  </Box>
                  {/* {currentRow?.files?.length ? (
                    <Fragment>
                      <List>{fileList(currentRow?.files)}</List>
                    </Fragment>
                  ) : null} */}
                </Box>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </StyledViewer>
    </Box>
  )
}

export default ClientGuidelineView
