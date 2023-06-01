import { Icon } from '@iconify/react'
import { Box, Button, Divider, IconButton, Typography } from '@mui/material'
import FileItem from '@src/@core/components/fileItem'
import useModal from '@src/hooks/useModal'
import { FileType } from '@src/types/common/file.type'
import { AssignProListType } from '@src/types/orders/job-detail'
import { useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { v4 as uuidv4 } from 'uuid'
import JobInfoDetailView from '../..'
import { JobItemType, JobType } from '@src/types/common/item.type'
import { getLegalName } from '@src/shared/helpers/legalname.helper'
import { AssignmentStatusChip } from '@src/@core/components/chips/chips'
import { ProjectInfoType } from '@src/types/orders/order-detail'
import {
  RefetchOptions,
  RefetchQueryFilters,
  QueryObserverResult,
  useMutation,
} from 'react-query'
import { uploadFile } from '@src/apis/job-detail.api'
import toast from 'react-hot-toast'
import {
  getDownloadUrlforCommon,
  getUploadUrlforCommon,
  uploadFileToS3,
} from '@src/apis/common.api'
import { useGetSourceFile } from '@src/queries/order/job.query'
import { S3FileType } from '@src/shared/const/signedURLFileType'

type Props = {
  info: AssignProListType
  row: JobType
  orderDetail: ProjectInfoType
  item: JobItemType
  refetch: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined,
  ) => Promise<
    QueryObserverResult<
      {
        id: number
        cooperationId: string
        items: JobItemType[]
      },
      unknown
    >
  >
}
const SourceFileUpload = ({ info, row, orderDetail, item, refetch }: Props) => {
  const { openModal, closeModal } = useModal()
  const MAXIMUM_FILE_SIZE = 20000000

  const [fileSize, setFileSize] = useState<number>(0)
  const [files, setFiles] = useState<File[]>([])

  console.log(row)

  const {
    data: sourceFileList,
    isLoading,
    refetch: refetchSourceFileList,
  } = useGetSourceFile(row.id)

  const uploadFileMutation = useMutation(
    (file: {
      jobId: number
      size: number
      name: string
      type: 'SAMPLE' | 'SOURCE' | 'TARGET'
    }) => uploadFile(file),
    {
      onSuccess: () => {
        setFiles([])
        refetchSourceFileList()
      },
    },
  )

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

  const DownloadFile = (file: FileType) => {
    if (file) {
      getDownloadUrlforCommon(
        S3FileType.JOB,
        encodeURIComponent(file.file!),
      ).then(res => {
        fetch(res.url, { method: 'GET' })
          .then(res => {
            return res.blob()
          })
          .then(blob => {
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `${file.name}`
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
    }
  }

  const uploadedFileList = (file: FileType[], type: string) => {
    return file.map((value: FileType) => {
      if (value.type === type) {
        return (
          <Box key={uuidv4()} onClick={() => DownloadFile(value)}>
            <FileItem key={value.name} file={value} />
          </Box>
        )
      }
    })
  }

  const onSubmit = () => {
    if (files.length) {
      const fileInfo: Array<{
        jobId: number
        size: number
        name: string
        type: 'SAMPLE' | 'SOURCE' | 'TARGET'
      }> = []
      const paths: string[] = files.map(file => {
        console.log(file.name)

        return `project/${row.id}/${file.name}`
      })
      console.log(paths)

      const s3URL = paths.map(value => {
        return getUploadUrlforCommon('job', value).then(res => {
          return res.url
        })
      })
      console.log(s3URL)

      Promise.all(s3URL).then(res => {
        const promiseArr = res.map((url: string, idx: number) => {
          fileInfo.push({
            jobId: row.id,
            size: files[idx].size,
            name: files[idx].name,
            type: 'SOURCE',
          })
          return uploadFileToS3(url, files[idx])
        })
        Promise.all(promiseArr)
          .then(res => {
            res.map((value, idx) => {
              uploadFileMutation.mutate(fileInfo[idx])
            })
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
  }

  useEffect(() => {
    console.log(files)
  }, [files])

  useEffect(() => {
    if (sourceFileList) {
      let result = 0
      // files.forEach((file: FileType) => (result += file.size))

      sourceFileList.forEach(
        (file: { name: string; size: number }) => (result += Number(file.size)),
      )
      setFileSize(result)
    }
  }, [sourceFileList, files])

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
                      refetch={refetch}
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
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',

                width: '100%',
                gap: '20px',
              }}
            >
              {sourceFileList &&
                sourceFileList?.length > 0 &&
                uploadedFileList(sourceFileList!, 'SOURCE')}
              {files.length > 0 &&
                files.map((file: FileType, index: number) => {
                  return (
                    <Box key={uuidv4()}>
                      <FileItem
                        key={file.name}
                        file={file}
                        onClear={handleRemoveFile}
                      />
                    </Box>
                  )
                })}
            </Box>
          </Box>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: '9px' }}>
        <Button
          variant='contained'
          disabled={files.length === 0}
          onClick={onSubmit}
        >
          Send
        </Button>
      </Box>
    </Box>
  )
}

export default SourceFileUpload
