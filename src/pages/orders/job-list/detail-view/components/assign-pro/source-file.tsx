import { Icon } from '@iconify/react'
import { Box, Button, Divider, IconButton, Typography } from '@mui/material'
import FileItem from '@src/@core/components/fileItem'
import useModal from '@src/hooks/useModal'
import { FileType } from '@src/types/common/file.type'
import { AssignProListType } from '@src/types/orders/job-detail'
import { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { v4 as uuidv4 } from 'uuid'
import JobInfoDetailView from '../..'
import { JobItemType, JobType } from '@src/types/common/item.type'
import { getLegalName } from '@src/shared/helpers/legalname.helper'
import { AssignmentStatusChip } from '@src/@core/components/chips/chips'
import { ProjectInfoType } from '@src/types/orders/order-detail'

type Props = {
  info: AssignProListType
  row: JobType
  orderDetail: ProjectInfoType
  item: JobItemType
}
const SourceFileUpload = ({ info, row, orderDetail, item }: Props) => {
  const { openModal, closeModal } = useModal()
  const MAXIMUM_FILE_SIZE = 20000000

  const [fileSize, setFileSize] = useState<number>(0)
  const [files, setFiles] = useState<File[]>([])

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
          setFileSize(result)
          if (result > MAXIMUM_FILE_SIZE) {
            //  TODO : show exceed file size modal
            return acc
          } else {
            const found = acc.find(f => f.name === file.name)
            if (!found) acc.push(file)
            console.log(acc)

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
  const fileList = files.map((file: FileType, index: number) => {
    console.log(file)

    return (
      <Box key={uuidv4()}>
        <FileItem key={file.name} file={file} onClear={handleRemoveFile} />
      </Box>
    )
  })

  return (
    <Box sx={{ padding: '50px 60px', position: 'relative' }}>
      <IconButton
        sx={{ position: 'absolute', top: '20px', right: '20px' }}
        onClick={() => {
          closeModal('SourceFileUploadModal')
          closeModal('JobDetailViewModal')
        }}
      >
        <Icon icon='mdi:close' />
      </IconButton>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '15px',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            width: '100%',
            gap: '8px',
            alignItems: 'center',
          }}
        >
          <IconButton
            sx={{ padding: '0 !important', height: '24px' }}
            onClick={() => {
              closeModal('AssignProMessageModal')
              openModal({
                type: 'JobDetailViewModal',
                children: (
                  <Box
                    sx={{
                      maxWidth: '1180px',
                      width: '100%',
                      maxHeight: '90vh',
                      background: '#ffffff',
                      boxShadow: '0px 0px 20px rgba(76, 78, 100, 0.4)',
                      borderRadius: '10px',
                      overflow: 'scroll',
                      '&::-webkit-scrollbar': {
                        display: 'none',
                      },
                    }}
                  >
                    <JobInfoDetailView
                      tab={'assignPro'}
                      row={row}
                      orderDetail={orderDetail}
                      item={item}
                    />
                  </Box>
                ),
              })
            }}
          >
            <Icon icon='mdi:chevron-left' width={24} height={24} />
          </IconButton>
          <img src='/images/icons/order-icons/source-file-pro.svg' alt='' />
          <Typography variant='h5'>
            {getLegalName({
              firstName: info.firstName,
              middleName: info.middleName,
              lastName: info.lastName,
            })}
          </Typography>
          <AssignmentStatusChip
            label={info.assignmentStatus}
            status={info.assignmentStatus!}
          />
        </Box>
        <Divider />
        <Box sx={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <Typography variant='subtitle1' fontWeight={600}>
            Source file to Pro
          </Typography>
          <Typography variant='subtitle2'>
            {fileSize === 0
              ? 0
              : Math.round(fileSize / 100) / 10 > 1000
              ? `${(Math.round(fileSize / 100) / 10000).toFixed(1)} mb`
              : `${(Math.round(fileSize / 100) / 10).toFixed(1)} kb`}
            /2gb
          </Typography>
        </Box>
        <Divider />

        <Box
          sx={{
            width: '100%',
            border: '1px dashed #666CFF',
            borderRadius: '10px',
            padding: '20px',
          }}
        >
          <div {...getRootProps({ className: 'dropzone' })}>
            <Button variant='outlined'>
              <input {...getInputProps()} />
              <Icon
                icon='ic:baseline-attachment'
                color='#666CFF'
                fontSize={18}
              ></Icon>
              &nbsp; Upload files
            </Button>
          </div>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              mt: '20px',
            }}
          >
            {fileList.length > 0 && (
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',

                  width: '100%',
                  gap: '20px',
                }}
              >
                {fileList}
              </Box>
            )}
          </Box>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: '9px' }}>
        <Button variant='contained' disabled={files.length === 0}>
          Send
        </Button>
      </Box>
    </Box>
  )
}

export default SourceFileUpload
