// ** style components
import { Icon } from '@iconify/react'
import { Box, Button, Grid, Typography } from '@mui/material'
import KeenSliderWrapper from '@src/@core/styles/libs/keen-slider'

// ** components
import FileSwiper, {
  FileItemType,
} from '@src/@core/components/swiper/file-swiper-s3'
import FilePreviewDownloadModal from '@src/pages/components/pro-detail-modal/modal/file-preview-download-modal'
import SimpleAlertModal from '@src/pages/client/components/modals/simple-alert-modal'

// ** apis
import { getDownloadUrlforCommon } from '@src/apis/common.api'

// ** hooks
import useModal from '@src/hooks/useModal'
import { useMemo } from 'react'
import { useDropzone } from 'react-dropzone'

// ** helpers
import { FILE_SIZE } from '@src/shared/const/maximumFileSize'
import { byteToMB, formatFileSize } from '@src/shared/helpers/file-size.helper'

type Props = {
  title?: string
  fileList: FileItemType[]
  accept: { [key: string]: string[] }
  maximumFileSize?: number
  onFileDrop: (files: File[]) => void //file upload
  onFileClick?: (file: FileItemType) => void
  onDeleteFile: (file: FileItemType) => void
  onDownloadAll: (files: FileItemType[] | null) => void
  fileType?: string //one of S3FileType
  isUpdatable: boolean
  isDeletable: boolean
  isReadable?: boolean
}

const FileInfo = ({
  title,
  fileList,
  accept,
  maximumFileSize = FILE_SIZE.DEFAULT,
  onFileDrop,
  onFileClick,
  onDeleteFile,
  onDownloadAll,
  fileType,
  isUpdatable,
  isDeletable,
  isReadable = true,
}: Props) => {
  const { openModal, closeModal } = useModal()
  const MAXIMUM_FILE_SIZE = maximumFileSize

  const fileSize = useMemo(
    () => fileList.reduce((res, file) => (res += file?.fileSize || 0), 0),
    [fileList],
  )

  const onReject = () => {
    openModal({
      type: 'dropReject',
      children: (
        <SimpleAlertModal
          message={`The maximum file size you can upload is ${byteToMB(
            MAXIMUM_FILE_SIZE,
          )}.`}
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

  const onFileClickForPreview = (file: FileItemType) => {
    console.log('file', file)
    if (fileType) {
      getDownloadUrlforCommon(fileType, file.filePath).then(res => {
        file.url = res
        openModal({
          type: 'filePreview',
          children: (
            <FilePreviewDownloadModal
              onClose={() => closeModal('filePreview')}
              docs={[file]}
            />
          ),
        })
      })
    } else {
      alert('Please provide fileType props to FileInfo component.')
    }
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Box display='flex' alignItems='center' justifyContent='space-between'>
          <Box display='flex' gap='10px' flexDirection='column'>
            <Typography variant='h6'>{title ?? 'Files'}</Typography>
            <Typography variant='body2'>
              {formatFileSize(fileSize)}/ {byteToMB(MAXIMUM_FILE_SIZE)}
            </Typography>
          </Box>
          {isUpdatable ? (
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
                disabled={!isReadable}
              >
                <Icon icon='ic:baseline-download' fontSize={20} />
              </Button>
            </Box>
          ) : null}
        </Box>
      </Grid>

      <Grid item xs={12}>
        {fileList.length ? (
          <KeenSliderWrapper>
            <FileSwiper
              direction='ltr'
              files={fileList}
              onFileClick={file => {
                if (!isReadable) return
                if (onFileClick !== undefined) {
                  isUpdatable && onFileClick(file)
                } else {
                  isUpdatable && onFileClickForPreview(file)
                }
              }}
              onDelete={onDeleteFile}
              isDeletable={isDeletable}
            />
          </KeenSliderWrapper>
        ) : (
          <Box
            sx={{
              width: '100%',
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Typography variant='subtitle2' fontWeight={400}>
              No files uploaded
            </Typography>
          </Box>
        )}
      </Grid>
    </Grid>
  )
}

export default FileInfo
