// ** style components
import { Icon } from '@iconify/react'
import { Box, Button, Grid, Typography } from '@mui/material'
import KeenSliderWrapper from '@src/@core/styles/libs/keen-slider'

// ** components
import FileSwiper, {
  FileItemType,
} from '@src/@core/components/swiper/file-swiper'
import FilePreviewDownloadModal from '@src/pages/components/pro-detail-modal/modal/file-preview-download-modal'
import SimpleAlertModal from '@src/pages/client/components/modals/simple-alert-modal'

// ** apis
import { getDownloadUrlforCommon } from '@src/apis/common.api'

// ** hooks
import useModal from '@src/hooks/useModal'
import { useMemo } from 'react'
import { useDropzone } from 'react-dropzone'

type Props = {
  title?: string
  fileList: FileItemType[]
  accept: { [key: string]: string[] }
  maximumFileSize?: number
  onFileDrop: (files: File[]) => void //file upload
  onDeleteFile: (file: FileItemType) => void
  onDownloadAll: (files: FileItemType[] | null) => void
  fileType: string //one of S3FileType
}

export default function FileInfo({
  title,
  fileList,
  accept,
  maximumFileSize = 50000000,
  onFileDrop,
  onDeleteFile,
  onDownloadAll,
  fileType,
}: Props) {
  const { openModal, closeModal } = useModal()

  const MAXIMUM_FILE_SIZE = maximumFileSize
  const fileSize = useMemo(
    () => fileList.reduce((res, file) => (res += file?.fileSize || 0), 0),
    [fileList],
  )

  function onReject() {
    openModal({
      type: 'dropReject',
      children: (
        <SimpleAlertModal
          message={`The maximum file size you can upload is ${
            Math.round(MAXIMUM_FILE_SIZE / 100) / 10000
          }mb.`}
          onClose={() => closeModal('dropReject')}
        />
      ),
    })
  }

  // ** Hooks
  const { getRootProps, getInputProps } = useDropzone({
    accept,
    maxSize: MAXIMUM_FILE_SIZE,
    onDrop: (acceptedFiles: File[]) => {
      const totalFileSize =
        acceptedFiles.reduce((res, file) => (res += file.size), 0) + fileSize
      if (totalFileSize > MAXIMUM_FILE_SIZE) {
        onReject()
      } else {
        onFileDrop(acceptedFiles)
      }
    },
    onDropRejected: () => onReject(),
  })

  const onFileClick = (file: FileItemType) => {
    getDownloadUrlforCommon(fileType, file.filePath).then(res => {
      file.url = res.url
      openModal({
        type: 'filePreview',
        children: (
          <FilePreviewDownloadModal
            open={true}
            onClose={() => closeModal('filePreview')}
            docs={[file]}
          />
        ),
      })
    })
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Box display='flex' alignItems='center' justifyContent='space-between'>
          <Box display='flex' alignItems='center' gap='10px'>
            <Typography variant='h6'>{title ?? 'Files'}</Typography>
            <Typography variant='body2'>
              {fileSize === 0
                ? 0
                : Math.round(fileSize / 100) / 10 > 1000
                ? `${(Math.round(fileSize / 100) / 10000).toFixed(1)} mb`
                : `${(Math.round(fileSize / 100) / 10).toFixed(1)} kb`}
              /50mb
            </Typography>
          </Box>
          <Box display='flex' alignItems='center' gap='10px'>
            <div {...getRootProps({ className: 'dropzone' })}>
              <Button variant='contained'>
                <input {...getInputProps()} />
                Upload
              </Button>
            </div>
            <Button
              variant='outlined'
              sx={{ p: 2, minWidth: 38 }}
              onClick={() => onDownloadAll(fileList)}
            >
              <Icon icon='ic:baseline-download' fontSize={20} />
            </Button>
          </Box>
        </Box>
      </Grid>

      <Grid item xs={12}>
        {fileList.length ? (
          <KeenSliderWrapper>
            <FileSwiper
              direction='ltr'
              files={fileList}
              onFileClick={onFileClick}
              onDelete={onDeleteFile}
            />
          </KeenSliderWrapper>
        ) : (
          <Typography variant='body2' textAlign='center' sx={{ p: 3 }}>
            No files uploaded
          </Typography>
        )}
      </Grid>
    </Grid>
  )
}
