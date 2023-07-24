import { Icon } from '@iconify/react'
import { Box, Button, Card, Grid, List, Typography } from '@mui/material'
import AlertModal from '@src/@core/components/common-modal/alert-modal'
import FileItem from '@src/@core/components/fileItem'
import useModal from '@src/hooks/useModal'
import { FILE_SIZE } from '@src/shared/const/maximumFileSize'
import { FileType } from '@src/types/common/file.type'
import { ProjectInfoType } from '@src/types/orders/order-detail'
import { useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'

type Props = {
  onClickDeliverToClient: () => void
  onClickCancelDeliver: () => void
  project: ProjectInfoType
  isSubmittable: boolean
}

const DeliveriesFeedback = ({
  onClickDeliverToClient,
  onClickCancelDeliver,
  project,
  isSubmittable,
}: Props) => {
  const MAXIMUM_FILE_SIZE = FILE_SIZE.DELIVERY_FILE
  const { openModal, closeModal } = useModal()

  const [fileSize, setFileSize] = useState(0)
  const [files, setFiles] = useState<File[]>([])
  const [savedFiles, setSavedFiles] = useState<
    Array<{ name: string; size: number }> | []
  >([])
  const [deletedFiles, setDeletedFiles] = useState<Array<FileType> | []>([])
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg'],
      'text/csv': ['.cvs'],
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt'],
      'application/vnd.ms-powerpoint': ['.ppt'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        ['.docx'],
      'video/*': ['.avi', '.mp4', '.mkv', '.wmv', '.mov'],
    },
    onDrop: (acceptedFiles: File[]) => {
      const uniqueFiles = files
        .concat(acceptedFiles)
        .reduce((acc: File[], file: File) => {
          let result = fileSize
          acc.concat(file).forEach((file: FileType) => (result += file.size))
          if (result > MAXIMUM_FILE_SIZE) {
            openModal({
              type: 'AlertMaximumFileSizeModal',
              children: (
                <AlertModal
                  title='The maximum file size you can upload is 2gb.'
                  onClick={() => closeModal('AlertMaximumFileSizeModal')}
                  vary='error'
                  buttonText='Okay'
                />
              ),
            })

            return acc
          } else {
            const found = acc.find(f => f.name === file.name)
            if (!found) acc.push(file)
            return acc
          }
        }, [])
      setFiles(uniqueFiles)
    },
  })

  const handleRemoveFile = (file: FileType) => {
    const uploadedFiles = files
    const filtered = uploadedFiles.filter((i: FileType) => i.name !== file.name)
    setFiles([...filtered])
  }

  const handleRemoveSavedFile = (file: FileType) => {
    setSavedFiles(savedFiles.filter(item => item.name !== file.name))
    setDeletedFiles([...deletedFiles, file])
  }

  const fileList = files.map((file: FileType) => (
    <FileItem key={file.name} file={file} onClear={handleRemoveFile} />
  ))

  const savedFileList = savedFiles?.map((file: any) => (
    <FileItem key={file.name} file={file} onClear={handleRemoveSavedFile} />
  ))

  useEffect(() => {
    // setValue('file', files, { shouldDirty: true, shouldValidate: true })

    let result = 0
    files.forEach((file: FileType) => (result += file.size))

    savedFiles.forEach(
      (file: { name: string; size: number }) => (result += file.size),
    )
    setFileSize(result)
  }, [files, savedFiles])
  return (
    <Grid container xs={12} spacing={4}>
      <Grid item xs={9}>
        <Card sx={{ padding: '24px' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <Box sx={{ display: 'flex', gap: '20px' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant='body1' fontWeight={600}>
                  Deliveries
                </Typography>
                <Typography variant='caption'>0 kb/2 gb</Typography>
              </Box>
              {isSubmittable ? (
                <Box sx={{ display: 'flex', gap: '16px' }}>
                  <div {...getRootProps({ className: 'dropzone' })}>
                    <Button
                      variant='contained'
                      sx={{ height: '34px' }}
                      disabled={
                        project.status !== 'In progress' &&
                        project.status !== 'Partially delivered' &&
                        project.status !== 'Redelivery requested' &&
                        project.status !== 'Order sent'
                      }
                    >
                      <input {...getInputProps()} />
                      <Icon icon='ic:outline-upload-file' fontSize={18} />
                      &nbsp;Upload
                    </Button>
                  </div>

                  <Button
                    variant='contained'
                    sx={{ height: '34px' }}
                    disabled={
                      project.status !== 'In progress' &&
                      project.status !== 'Partially delivered' &&
                      project.status !== 'Redelivery requested'
                    }
                  >
                    <Icon icon='mdi:import' fontSize={18} />
                    &nbsp;Import from job
                  </Button>
                </Box>
              ) : null}
            </Box>
            {files.length ? (
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3,1fr)',
                  gridGap: '16px',
                }}
              >
                {fileList}
              </Box>
            ) : (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  minHeight: '60px',
                  alignItems: 'center',
                }}
              >
                <Typography variant='body2' fontWeight={400}>
                  No files uploaded
                </Typography>
              </Box>
            )}
          </Box>
        </Card>
      </Grid>
      <Grid item xs={3}>
        <Card sx={{ padding: '24px' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Button
              variant='contained'
              color='success'
              onClick={onClickDeliverToClient}
            >
              <Icon icon='ic:outline-send' fontSize={18} />
              &nbsp;Deliver to client
            </Button>
            <Button variant='outlined' onClick={onClickCancelDeliver}>
              Cancel
            </Button>
          </Box>
        </Card>
      </Grid>
    </Grid>
  )
}

export default DeliveriesFeedback
