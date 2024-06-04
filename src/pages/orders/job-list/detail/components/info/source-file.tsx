import { Icon } from '@iconify/react'
import {
  Box,
  Button,
  Checkbox,
  Divider,
  IconButton,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material'
import FileItem from '@src/@core/components/fileItem'
import useModal from '@src/hooks/useModal'
import { FileType } from '@src/types/common/file.type'
import { AssignProListType } from '@src/types/orders/job-detail'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { v4 as uuidv4 } from 'uuid'

import { JobType } from '@src/types/common/item.type'
import { getLegalName } from '@src/shared/helpers/legalname.helper'
import { JobsStatusChip } from '@src/@core/components/chips/chips'

import { useMutation } from 'react-query'
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
import {
  srtUploadFileExtension,
  videoExtensions,
} from '@src/shared/const/upload-file-extention/file-extension'

import CustomModal from '@src/@core/components/common-modal/custom-modal'

import { useRecoilValueLoadable } from 'recoil'
import { timezoneSelector } from '@src/states/permission'
import { authState } from '@src/states/auth'
import Image from 'next/image'
import { useGetClientRequestDetail } from '@src/queries/requests/client-request.query'
import OverlaySpinner from '@src/@core/components/spinner/overlay-spinner'
import CustomModalV2 from '@src/@core/components/common-modal/custom-modal-v2'
import { extractFileExtension } from '@src/shared/transformer/file-extension.transformer'

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
  const theme = useTheme()

  const [isLoading, setIsLoading] = useState(false)

  const [fileSize, setFileSize] = useState<number>(0)
  const [files, setFiles] = useState<FileType[]>([])
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])

  const { data: requestData } = useGetClientRequestDetail(
    Number(row.order.requestId),
  )

  const {
    data: sourceFileList,

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
        closeModal('SourceFileUploadModal')
        setIsLoading(false)
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
        setIsLoading(false)
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
    // noClick: files.length > 0,
    noDragEventsBubbling: true,

    disabled:
      type === 'import' ||
      [60500, 60600, 60700, 601000, 60800, 60900].includes(row.status),
    onDrop: (acceptedFiles: File[]) => {
      const totalFileSize =
        acceptedFiles.reduce((res, file) => (res += file.size), 0) + fileSize
      if (totalFileSize > MAXIMUM_FILE_SIZE) {
        onFileUploadReject()
      } else {
        setUploadedFiles(uploadedFiles.concat(acceptedFiles))
      }

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
            console.log(file.name)

            if (!found)
              acc.push({
                // uniqueId: uuidv4(),
                name: file.name,
                size: file.size,
                type: file.type,

                downloadAvailable: videoExtensions.includes(
                  file.name?.split('.').pop()?.toLowerCase() ?? '',
                )
                  ? false
                  : true,
              })
            // console.log(acc)

            return acc
          }
        }, [])

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
    const postFiles = files
    const tempFiles = uploadedFiles
    const filtered = postFiles.filter((i: FileType) => i.name !== file.name)
    const filterUploaded = tempFiles.filter((i: File) => i.name !== file.name)

    setFiles([...filtered])
    setUploadedFiles([...filterUploaded])
  }

  const handleBlockFile = (file: FileType) => {
    const postFiles = files
    const filtered = postFiles.map((i: FileType) => {
      if (i.name === file.name) {
        i.downloadAvailable = !i.downloadAvailable
      }
      return i
    })
    setFiles([...filtered])
  }

  const DownloadFile = (file: FileType) => {
    if (file) {
      getDownloadUrlforCommon(
        S3FileType.JOB,
        encodeURIComponent(file.file!),
      ).then(res => {
        fetch(res, { method: 'GET' })
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

  const onClickBlockDownloadInfo = () => {
    openModal({
      type: 'BlockDownloadInfoModal',
      children: (
        <CustomModalV2
          noButton
          title='Block download'
          subtitle='When enabled, video files among the source files that a Pro received cannot be downloaded in order to protect the content. Pros will only receive video files through Glosub, and the setting can be changed later.'
          vary='info'
          closeButton
          onClick={() => closeModal('BlockDownloadInfoModal')}
          onClose={() => closeModal('BlockDownloadInfoModal')}
          rightButtonText=''
        />
      ),
    })
  }

  const onSubmit = () => {
    if (type === 'import') {
      setIsLoading(true)
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
        setIsLoading(true)
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
        console.log(uploadedFiles, files)

        const paths: string[] = files.map(file => {
          return `project/${row.id}/source/${file.name}`
        })

        const s3URL = paths.map(value => {
          return getUploadUrlforCommon('job', value).then(res => {
            return res
          })
        })

        Promise.all(s3URL).then(res => {
          const promiseArr = res.map((url: string, idx: number) => {
            fileInfo.files.push({
              jobId: row.id,
              size: files[idx].size,
              name: files[idx].name,
              type: 'SOURCE',
              downloadAvailable: files[idx].downloadAvailable ?? true,
            })
            return uploadFileToS3(url, uploadedFiles[idx])
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
          downloadAvailable: videoExtensions.includes(
            value.fileName?.split('.').pop()?.toLowerCase() ?? '',
          )
            ? false
            : true,
          isImported: value.isImported,
          isSelected: false,
        })),
      )
    }
  }, [importFile])

  const renderedFiles = useMemo(
    () =>
      files.map((file: FileType, index: number) => {
        return (
          <Box key={index}>
            <Box
              sx={{
                display: 'flex',
                // marginBottom: type === 'import' ? 0 : '8px',
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
                        prevFiles.map(f => (f.name === file.name ? file : f)),
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
                    src={`/images/icons/file-icons/${extractFileExtension(
                      file.name,
                    )}.svg`}
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
                {videoExtensions.includes(
                  file.name?.split('.').pop()?.toLowerCase() ?? '',
                ) ? (
                  <Box
                    sx={{
                      alignItems: 'center',
                      display: 'flex',
                      cursor: 'pointer',
                      padding: '4px',
                      '& :hover': {
                        borderRadius: '50%',
                        backgroundColor: theme.palette.grey[300],
                      },
                    }}
                    onClick={event => {
                      event.stopPropagation()
                      handleBlockFile(file)
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
                      event.stopPropagation()

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
      }),
    [files],
  )

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
      {isLoading ? <OverlaySpinner /> : null}
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
                <IconButton
                  sx={{ padding: 0 }}
                  onClick={onClickBlockDownloadInfo}
                >
                  <Icon
                    icon='material-symbols:info-outline'
                    fontSize={20}
                    color='#8D8E9A'
                  ></Icon>
                </IconButton>
              </Box>
            </Box>
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
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Typography fontSize={12} fontWeight={400} color='#8D8E9A'>
                    Drag and drop or{' '}
                  </Typography>
                  <Button
                    variant='outlined'
                    size='small'
                    disabled={[
                      60500, 60600, 60700, 601000, 60800, 60900,
                    ].includes(row.status)}
                  >
                    <input {...getInputProps()} />
                    Browse files
                  </Button>
                </Box>
              )}

              {files.length > 0 && (
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    mt: '20px',
                    width: '100%',

                    rowGap: '8px',
                    columnGap: '20px',
                  }}
                >
                  {renderedFiles}
                  {/* {files.map((file: FileType, index: number) => {
                    return (
                      <Box key={index}>
                        <Box
                          sx={{
                            display: 'flex',
                            // marginBottom: type === 'import' ? 0 : '8px',
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
                                src={`/images/icons/file-icons/${extractFileExtension(
                                  file.name,
                                )}.svg`}
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
                            {videoExtensions.includes(
                              file.name?.split('.').pop()?.toLowerCase() ?? '',
                            ) ? (
                              <Box
                                sx={{
                                  alignItems: 'center',
                                  display: 'flex',
                                  cursor: 'pointer',
                                  padding: '4px',
                                  '& :hover': {
                                    borderRadius: '50%',
                                    backgroundColor: theme.palette.grey[300],
                                  },
                                }}
                                onClick={event => {
                                  event.stopPropagation()
                                  handleBlockFile(file)
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
                                  event.stopPropagation()

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
                  })} */}
                </Box>
              )}
            </Box>
          </div>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: '32px' }}>
          <Button
            variant='contained'
            disabled={
              isLoading ||
              files.length === 0 ||
              fileSize > 100 * 1024 * 1024 * 1024 ||
              (type === 'import' ? !files.some(file => file.isSelected) : false)
            }
            onClick={onSubmit}
          >
            {type === 'import' ? 'Import' : 'Save'}
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

export default SourceFileUpload
