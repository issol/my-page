import { Icon } from '@iconify/react'
import {
  Box,
  Button,
  Card,
  Divider,
  Grid,
  IconButton,
  Typography,
} from '@mui/material'

import { useGetClientRequestDetail } from '@src/queries/requests/client-request.query'
import { useRouter } from 'next/router'
import styled from 'styled-components'
import RequestDetailCard from './components/detail/request-detail'
import FileItem from '@src/@core/components/fileItem'
import { S3FileType } from '@src/shared/const/signedURLFileType'
import { getDownloadUrlforCommon } from '@src/apis/common.api'
import { toast } from 'react-hot-toast'

export default function RequestDetail() {
  const router = useRouter()
  const { id } = router.query

  const { data } = useGetClientRequestDetail(Number(id))

  const downloadFile = (name: string) => {
    // const language =
    //     currentVersion?.testType === 'basic'
    //       ? `${currentVersion?.target}`
    //       : `${currentVersion?.source}-${currentVersion?.target}`
    //   const path = getFilePath(
    //     [
    //       'testPaper',
    //       currentVersion?.testType === 'basic' ? 'basic' : 'skill',
    //       currentVersion?.jobType!,
    //       currentVersion?.role!,
    //       language,
    //       `V${currentVersion?.version!}`,
    //     ],
    //     fileName,
    //   )
    //     getDownloadUrlforCommon(S3FileType.TEST_GUIDELINE, path)
    //     .then(res => {
    //       fetch(res.url, { method: 'GET' })
    //       .then(res => {
    //         return res.blob()
    //       })
    //       .then(blob => {
    //         const url = window.URL.createObjectURL(blob)
    //         const a = document.createElement('a')
    //         a.href = url
    //         a.download = `${name}`
    //         document.body.appendChild(a)
    //         a.click()
    //         setTimeout((_: any) => {
    //           window.URL.revokeObjectURL(url)
    //         }, 60000)
    //         a.remove()
    //       })
    //       .catch(err =>
    //         toast.error(
    //           'Something went wrong while uploading files. Please try again.',
    //           {
    //             position: 'bottom-left',
    //           },
    //         ),
    //       )
    //   })
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Box sx={{ background: '#fff', borderRadius: '8px', padding: '16px' }}>
          <Box display='flex' alignItems='center' gap='8px'>
            <IconButton onClick={() => router.back()}>
              <Icon icon='material-symbols:arrow-back-ios-new-rounded' />
            </IconButton>
            <img
              src='/images/icons/request-icons/airplane.png'
              aria-hidden
              alt='request detail'
            />
            <Typography variant='h6'>{data?.corporationId}</Typography>
          </Box>
        </Box>
      </Grid>
      <Grid item xs={9}>
        <Card sx={{ padding: '24px' }}>
          <RequestDetailCard data={data} />
        </Card>
        <Grid item xs={4} mt='24px'>
          <Card sx={{ padding: '24px' }}>
            <Button fullWidth variant='outlined' color='error'>
              Cancel this request
            </Button>
          </Card>
        </Grid>
      </Grid>
      <Grid item xs={3}>
        <Box display='flex' flexDirection='column' gap='24px'>
          <Box sx={{ width: '100%' }}>
            <Card>
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
                    Sample files
                  </Typography>
                  <Typography variant='body2'>
                    {/* {Math.round(fileSize / 100) / 10 > 1000
                  ? `${(Math.round(fileSize / 100) / 10000).toFixed(1)} mb`
                  : `${(Math.round(fileSize / 100) / 10).toFixed(1)} kb`}
                /2 gb */}
                  </Typography>
                </Box>

                <Button
                  variant='outlined'
                  fullWidth
                  startIcon={<Icon icon='mdi:download' />}
                  // onClick={() => downloadAllFiles(currentRow?.files)}
                >
                  Download all
                </Button>
              </Box>
              <Box
                sx={{
                  padding: '0 20px',
                  overflow: 'scroll',
                  marginBottom: '12px',
                  height: '454px',

                  '&::-webkit-scrollbar': { display: 'none' },
                }}
              >
                {data?.sampleFiles?.map(
                  (file: {
                    id?: number
                    filePath: string
                    fileName: string
                    fileExtension: string
                    fileSize: number
                  }) => {
                    return (
                      <Box key={file.id}>
                        <FileItem
                          file={{ name: file.fileName, size: file?.fileSize }}
                          onClick={downloadFile}
                        />
                      </Box>
                    )
                  },
                )}
              </Box>
            </Card>
          </Box>
          <Card sx={{ padding: '24px' }}>
            <Typography fontWeight='bold'>Notes</Typography>
            <Typography variant='body2' mt='24px'>
              {data?.notes ? data?.notes : '-'}
            </Typography>
          </Card>
        </Box>
      </Grid>
    </Grid>
  )
}

const LabelContainer = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 2fr;
`
const CustomTypo = styled(Typography)`
  font-size: 14px;
`

const ItemBox = styled(Box)`
  padding: 20px;
  border-radius: 10px;
  background: #f5f5f5;
`

RequestDetail.acl = {
  subject: 'client_request',
  action: 'read',
}
