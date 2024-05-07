import { Icon } from '@iconify/react'
import {
  Box,
  Button,
  Checkbox,
  Divider,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material'
import FileItem from '@src/@core/components/fileItem'
import useModal from '@src/hooks/useModal'
import { FileType } from '@src/types/common/file.type'
import { AssignProListType } from '@src/types/orders/job-detail'
import { useEffect, useRef, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { v4 as uuidv4 } from 'uuid'
import JobInfoDetailView from '../..'
import { JobItemType, JobType } from '@src/types/common/item.type'
import { getLegalName } from '@src/shared/helpers/legalname.helper'
import {
  JobsStatusChip,
  assignmentStatusChip,
} from '@src/@core/components/chips/chips'
import { ProjectInfoType } from '@src/types/orders/order-detail'
import {
  RefetchOptions,
  RefetchQueryFilters,
  QueryObserverResult,
  useMutation,
} from 'react-query'
import {
  importFileFromRequest,
  setFileLock,
  setFileUnlock,
  uploadFile,
} from '@src/apis/jobs/job-detail.api'
import toast from 'react-hot-toast'
import {
  getDownloadUrlforCommon,
  getUploadUrlforCommon,
  uploadFileToS3,
} from '@src/apis/common.api'
import { useGetSourceFile } from '@src/queries/order/job.query'
import { S3FileType } from '@src/shared/const/signedURLFileType'

// ** helpers
import { FILE_SIZE } from '@src/shared/const/maximumFileSize'
import { byteToGB, formatFileSize } from '@src/shared/helpers/file-size.helper'
import { srtUploadFileExtension } from '@src/shared/const/upload-file-extention/file-extension'
import SimpleAlertModal from '@src/pages/client/components/modals/simple-alert-modal'
import CustomModal from '@src/@core/components/common-modal/custom-modal'
import { convertTimeToTimezone } from '@src/shared/helpers/date.helper'
import { useRecoilValueLoadable } from 'recoil'
import { timezoneSelector } from '@src/states/permission'
import { authState } from '@src/states/auth'
import Image from 'next/image'
import { useGetClientRequestDetail } from '@src/queries/requests/client-request.query'

type Props = {
  info:
    | AssignProListType
    | {
        id: number
        firstName: string
        middleName: string
        lastName: string
      }
  row: JobType
  type: 'import' | 'upload'
  importFile: {
    fileExtension: string
    fileName: string
    filePath: string
    fileSize: number
    isImported: boolean
  }[]
  statusList: {
    value: number
    label: string
  }[]
}
const videoExtensions = ['mp4', 'avi', 'mkv', 'mov']

const SourceFileUpload = ({
  info,
  row,
  type,
  importFile,
  statusList,
}: Props) => {
  const auth = useRecoilValueLoadable(authState)
  const timezone = useRecoilValueLoadable(timezoneSelector)
  const { openModal, closeModal } = useModal()
  const MAXIMUM_FILE_SIZE = FILE_SIZE.JOB_SOURCE_FILE
  const uploadRef = useRef()

  const [fileSize, setFileSize] = useState<number>(0)
  const [files, setFiles] = useState<FileType[]>([])

  const { data: requestData } = useGetClientRequestDetail(
    Number(row.order.requestId),
  )

  const [groupedFiles, setGroupedFiles] = useState<
    { createdAt: string; data: FileType[] }[]
  >([])

  // console.log(row)

  const {
    data: sourceFileList,
    isLoading,
    refetch: refetchSourceFileList,
  } = useGetSourceFile(row.id)

  const uploadFileMutation = useMutation(
    (file: {
      jobId: number
      files: Array<{
        jobId: number
        size: number
        name: string
        type: 'SAMPLE' | 'SOURCE' | 'TARGET'
        downloadAvailable: boolean
      }>
    }) => uploadFile(file),
    {
      onSuccess: (data, variables) => {
        const files = variables.files
        console.log(files)

        files.map(value => {
          const id = data.find((item: any) => item.name === value.name).id
          if (!value.downloadAvailable) {
            setFileLock(id)
          } else {
            setFileUnlock(id)
          }
        })
        setFiles([])
        refetchSourceFileList()
      },
    },
  )

  const importFileMutation = useMutation(
    (file: {
      jobId: number
      files: Array<{
        fileExtension: string
        fileName: string
        filePath: string
        fileSize: number
        downloadAvailable: boolean
      }>
    }) => importFileFromRequest(file.jobId, file.files),
    {
      onSuccess: (data, variables) => {
        const files = variables.files
        closeModal('ImportFileModal')

        // files.map(value => {
        //   const id = data.find(
        //     (item: any) => item.fileName === value.fileName,
        //   ).id
        //   if (!value.downloadAvailable) {
        //     setFileLock(id)
        //   } else {
        //     setFileUnlock(id)
        //   }
        // })
        setFiles([])
        refetchSourceFileList()
      },
    },
  )

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      ...srtUploadFileExtension.accept,
    },
    noDragEventsBubbling: true,
    disabled: type === 'import',
    onDrop: (acceptedFiles: File[]) => {
      console.log(acceptedFiles)

      const uniqueFiles = files
        .concat(acceptedFiles)
        .reduce((acc: FileType[], file: FileType) => {
          let result = fileSize

          acc.concat(file).forEach((file: FileType) => (result += file.size))
          setFileSize(result)
          if (result > MAXIMUM_FILE_SIZE) {
            //  TODO : show exceed file size modal
            onFileUploadReject()
            return acc
          } else {
            const found = acc.find(f => f.name === file.name)

            if (!found)
              acc.push({
                name: file.name,
                size: file.size,
                type: file.type,

                downloadAvailable: false,
              })
            // console.log(acc)

            return acc
          }
        }, [])
      console.log(uniqueFiles)

      setFiles(uniqueFiles)
    },
  })

  console.log(files)

  function onFileUploadReject() {
    openModal({
      type: 'rejectDrop',
      children: (
        <CustomModal
          title='The maximum file size you can upload is 100 GB.'
          soloButton
          rightButtonText='Okay'
          onClick={() => closeModal('rejectDrop')}
          vary='error'
          onClose={() => closeModal('rejectDrop')}
        />
      ),
    })
  }

  const handleRemoveFile = (file: FileType) => {
    const uploadedFiles = files
    const filtered = uploadedFiles.filter((i: FileType) => i.name !== file.name)
    console.log(filtered)

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
    if (type === 'import') {
      const fileList: {
        fileExtension: string
        fileName: string
        filePath: string
        fileSize: number
        downloadAvailable: boolean
      }[] = files
        .filter(value => value.isSelected)
        .map(file => {
          return {
            fileExtension: file.type!,
            fileName: file.name,
            filePath: file.file!,
            fileSize: file.size,
            downloadAvailable: file.downloadAvailable ?? false,
          }
        })
      const fileInfo = {
        jobId: row.id,
        files: fileList,
      }
      importFileMutation.mutate(fileInfo)
    } else {
      if (files.length) {
        const fileInfo: {
          jobId: number
          files: Array<{
            jobId: number
            size: number
            name: string
            type: 'SAMPLE' | 'SOURCE' | 'TARGET'
            downloadAvailable: boolean
          }>
        } = {
          jobId: row.id,
          files: [],
        }
        const paths: string[] = files.map(file => {
          // console.log(file.name)

          return `project/${row.id}/source/${file.name}`
        })
        // console.log(paths)

        const s3URL = paths.map(value => {
          return getUploadUrlforCommon('job', value).then(res => {
            return res.url
          })
        })
        // console.log(s3URL)

        Promise.all(s3URL).then(res => {
          const promiseArr = res.map((url: string, idx: number) => {
            fileInfo.files.push({
              jobId: row.id,
              size: files[idx].size,
              name: files[idx].name,
              type: 'SOURCE',
              downloadAvailable: files[idx].downloadAvailable ?? false,
            })
            return uploadFileToS3(url, files[idx])
          })
          Promise.all(promiseArr)
            .then(res => {
              uploadFileMutation.mutate(fileInfo)
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
  }

  useEffect(() => {
    if (sourceFileList) {
      let result = 0
      files.forEach((file: FileType) => {
        type === 'import'
          ? file.isSelected && (result += file.size)
          : (result += file.size)
      })

      sourceFileList.forEach(
        (file: { name: string; size: number }) => (result += Number(file.size)),
      )
      setFileSize(result)

      const groupedFiles: { createdAt: string; data: FileType[] }[] =
        sourceFileList.reduce(
          (acc: { createdAt: string; data: FileType[] }[], curr: FileType) => {
            const existingGroup = acc.find(
              group => group.createdAt === curr.createdAt,
            )
            if (existingGroup) {
              existingGroup.data.push(curr)
            } else {
              acc.push({ createdAt: curr.createdAt!, data: [curr] })
            }
            return acc
          },
          [],
        )
      setGroupedFiles(groupedFiles)
    }
  }, [sourceFileList, files])

  useEffect(() => {
    if (importFile.length > 0 && type === 'import') {
      setFiles(
        importFile.map(value => ({
          name: value.fileName,
          size: value.fileSize,
          type: value.fileExtension,
          file: value.filePath,
          downloadAvailable: false,
          isImported: value.isImported,
          isSelected: false,
        })),
      )
    }
  }, [importFile])

  return (
    <Box
      sx={{
        maxWidth: '780px',
        width: '100%',
        background: '#ffffff',
        boxShadow: '0px 0px 20px rgba(76, 78, 100, 0.4)',
        borderRadius: '10px',
      }}
    >
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
            <Image
              src='/images/icons/order-icons/source-file-pro.svg'
              alt=''
              width={50}
              height={50}
            />
            <Typography fontSize={20} fontWeight={500}>
              {getLegalName({
                firstName: info.firstName,
                middleName: info.middleName,
                lastName: info.lastName,
              })}
            </Typography>
            {/* <AssignmentStatusChip
            label={info.assignmentStatus}
            status={info.assignmentStatus!}
          /> */}
            {JobsStatusChip(row.status, statusList)}
            {/* <JobsStatusChip status={row.status} statusList={statusList} /> */}
            {/* {assignmentStatusChip(Number(row.status), statusList!)} */}
          </Box>
          <Divider />
          <Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Box sx={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <Typography variant='subtitle1' fontWeight={600}>
                  Source file to Pro
                </Typography>
                <Typography
                  variant='subtitle2'
                  color={
                    fileSize > 100 * 1024 * 1024 * 1024
                      ? '#FF4D49'
                      : '#4C4E6499'
                  }
                >
                  {formatFileSize(fileSize)}/ {byteToGB(MAXIMUM_FILE_SIZE)}
                </Typography>
                {fileSize > 100 * 1024 * 1024 * 1024 && (
                  <Typography fontSize={14} fontWeight={600} color='#FF4D49'>
                    Maximum size exceeded
                  </Typography>
                )}
              </Box>
              <Box sx={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                <Icon icon='mdi:lock' fontSize={20} />
                <Typography fontSize={14} fontWeight={400} color='#8D8E9A'>
                  Block download
                </Typography>
                <IconButton sx={{ padding: 0 }}>
                  <Icon
                    icon='material-symbols:info-outline'
                    fontSize={20}
                    color='#8D8E9A'
                  ></Icon>
                </IconButton>
              </Box>
            </Box>

            {/* <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '24px',
                // mt: '24px',
              }}
            >
              {sourceFileList &&
                sourceFileList?.length > 0 &&
                // uploadedFileList(sourceFileList!, 'SOURCE')}
                groupedFiles.map(value => {
                  return (
                    <Box key={uuidv4()}>
                      <Typography
                        variant='body2'
                        fontSize={14}
                        fontWeight={400}
                        sx={{ mb: '5px' }}
                      >
                        {convertTimeToTimezone(
                          value.createdAt,
                          auth.getValue().user?.timezone,
                          timezone.getValue(),
                        )}
                      </Typography>
                      <Box
                        sx={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(2,1fr)',
                          gridGap: '16px',
                        }}
                      >
                        {value.data.map(item => {
                          return (
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
                                  <Tooltip title={item.name}>
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
                                      {item.name}
                                    </Typography>
                                  </Tooltip>

                                  <Typography
                                    variant='caption'
                                    lineHeight={'14px'}
                                  >
                                    {formatFileSize(item.size)}
                                  </Typography>
                                </Box>
                              </Box>
                            </Box>
                          )
                        })}
                      </Box>
                    </Box>
                  )
                })}
            </Box> */}
          </Box>
          <div
            {...getRootProps({
              className: 'dropzone',
            })}
          >
            <Box
              sx={{
                width: '100%',
                border: '1px dashed #666CFF',
                borderRadius: '10px',
                padding: '20px',
              }}
            >
              {type === 'import' ? (
                <Typography color='#666CFF' fontWeight={600} fontSize={14}>
                  Linked Request: {requestData?.corporationId}
                </Typography>
              ) : (
                <Button
                  variant='outlined'
                  disabled={[
                    60500, 60600, 60700, 601000, 60800, 60900,
                  ].includes(row.status)} // Delivered, Approved, invoiced, canceled, Paid, without invoice
                >
                  <input {...getInputProps()} />
                  <Icon
                    icon='ic:baseline-attachment'
                    color='#666CFF'
                    fontSize={18}
                  ></Icon>
                  &nbsp; Upload files
                </Button>
              )}

              {files.length > 0 && (
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    mt: '20px',
                    width: '100%',
                    gap: '20px',
                  }}
                >
                  {files.map((file: FileType, index: number) => {
                    return (
                      <Box key={uuidv4()}>
                        <Box
                          sx={{
                            display: 'flex',
                            marginBottom: type === 'import' ? 0 : '8px',
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
                            {type === 'import' ? (
                              <Checkbox
                                checked={file.isSelected}
                                value={file.isSelected}
                                onChange={event => {
                                  event.stopPropagation()
                                  file.isSelected = !file.isSelected
                                  setFiles(prevFiles =>
                                    prevFiles.map(f =>
                                      f.name === file.name ? file : f,
                                    ),
                                  )
                                }}
                              />
                            ) : null}

                            <Box
                              sx={{
                                marginRight: '8px',
                                display: 'flex',
                              }}
                            >
                              <Image
                                src={`/images/icons/file-icons/${
                                  videoExtensions.includes(
                                    file.name
                                      ?.split('.')
                                      .pop()
                                      ?.toLowerCase() ?? '',
                                  )
                                    ? 'video'
                                    : 'document'
                                }.svg`}
                                alt=''
                                width={32}
                                height={32}
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
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {' '}
                            {videoExtensions.includes(
                              file.name?.split('.').pop()?.toLowerCase() ?? '',
                            ) ? (
                              <Box
                                sx={{
                                  alignItems: 'center',
                                  display: 'flex',
                                  // color: file.downloadAvailable
                                  //   ? '#4C4E64'
                                  //   : 'rgba(76, 78, 100, 0.54)',
                                  cursor: 'pointer',
                                  padding: '4px',
                                }}
                                onClick={event => {
                                  event.stopPropagation()
                                  file.downloadAvailable =
                                    !file.downloadAvailable
                                  setFiles(prevFiles =>
                                    prevFiles.map(f =>
                                      f.name === file.name ? file : f,
                                    ),
                                  )
                                  // handleRemoveFile(file)
                                }}
                              >
                                <Icon
                                  icon={
                                    file.downloadAvailable
                                      ? 'mdi:unlocked-outline'
                                      : 'mdi:lock'
                                  }
                                  fontSize={20}
                                />
                              </Box>
                            ) : null}
                            {type === 'import' ? null : (
                              <Box
                                sx={{
                                  alignItems: 'center',
                                  display: 'flex',
                                  color: 'rgba(76, 78, 100, 0.54)',
                                  cursor: 'pointer',
                                  padding: '4px',
                                }}
                                onClick={event => {
                                  handleRemoveFile(file)
                                }}
                              >
                                <Icon icon='mdi:close' fontSize={20} />
                              </Box>
                            )}
                          </Box>
                        </Box>
                        {type === 'import' && file.isImported ? (
                          <Typography
                            sx={{ textAlign: 'right' }}
                            fontSize={12}
                            fontStyle={'italic'}
                            color='#666CFF'
                          >
                            Already imported
                          </Typography>
                        ) : null}
                      </Box>
                    )
                  })}
                </Box>
              )}
            </Box>
          </div>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: '32px' }}>
          <Button
            variant='contained'
            disabled={
              files.length === 0 ||
              fileSize > 100 * 1024 * 1024 * 1024 ||
              files.some(file => !file.isSelected)
            }
            onClick={onSubmit}
          >
            {type === 'import' ? 'Import' : 'Send'}
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

export default SourceFileUpload
