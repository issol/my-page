import { Icon } from '@iconify/react'
import {
  Box,
  Button,
  Divider,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material'
import CustomModal from '@src/@core/components/common-modal/custom-modal'
import useModal from '@src/hooks/useModal'
import { FILE_SIZE } from '@src/shared/const/maximumFileSize'
import { videoExtensions } from '@src/shared/const/upload-file-extention/file-extension'
import { byteToGB, formatFileSize } from '@src/shared/helpers/file-size.helper'
import { FileType } from '@src/types/common/file.type'
import { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { v4 as uuidv4 } from 'uuid'
import Image from 'next/image'
import { useMutation, useQueryClient } from 'react-query'
import { saveReviewedFile } from '@src/apis/jobs/job-detail.api'
import { getUploadUrlforCommon, uploadFileToS3 } from '@src/apis/common.api'
import toast from 'react-hot-toast'

import OverlaySpinner from '@src/@core/components/spinner/overlay-spinner'

type Props = {
  onClose: any
  id: number
  jobId: number
}

const MAXIMUM_FILE_SIZE = FILE_SIZE.JOB_SOURCE_FILE

const UploadReviewedFilesModal = ({ onClose, id, jobId }: Props) => {
  const { openModal, closeModal } = useModal()
  const [uploadedReviewedFiles, setUploadedReviewedFiles] = useState<File[]>([])
  const [isSavingData, setIsSavingData] = useState(false)

  const [fileSize, setFileSize] = useState(0)

  const [note, setNote] = useState('')

  const [files, setFiles] = useState<FileType[]>([])

  const queryClient = useQueryClient()

  const saveReviewedFileMutation = useMutation(
    (params: {
      noteFromAssignee?: string
      files?: Array<{
        name: string
        path: string
        extension: string
        size: number
        type: 'SAMPLE' | 'SOURCE' | 'TARGET' | 'REVIEWED'
        jobFileId?: number
      }>
    }) => saveReviewedFile(params, id),
    {
      onSuccess: () => {
        onClose()
        setIsSavingData(false)
        queryClient.invalidateQueries(['jobRequestReview'])
      },
    },
  )

  const onClickSubmit = () => {
    if (files.length) {
      setIsSavingData(true)
      const fileInfo: Array<{
        name: string
        path: string
        extension: string
        size: number
        type: 'SAMPLE' | 'SOURCE' | 'TARGET' | 'REVIEWED'
      }> = []

      const paths: string[] = files.map(file => {
        return `project/${jobId}/review-request/${file.type}/${file.name}`
      })

      const s3URL = paths.map(value => {
        return getUploadUrlforCommon('job', value).then(res => {
          return res
        })
      })

      Promise.all(s3URL).then(res => {
        const promiseArr = res.map((url: string, idx: number) => {
          fileInfo.push({
            size: files[idx].size,
            name: files[idx].name,
            path: url,
            extension: files[idx].name.split('.').pop()?.toLowerCase() ?? '',
            type: 'REVIEWED',
            // downloadAvailable: files[idx].downloadAvailable ?? false,
          })
          return uploadFileToS3(url, uploadedReviewedFiles[idx])
        })
        Promise.all(promiseArr)
          .then(res => {
            //TODO : Mutation call (파일 정보 Save)
            // uploadFileMutation.mutate(fileInfo)
            // TODO :Mutation call (기본 정보 Save)

            saveReviewedFileMutation.mutate({
              noteFromAssignee: note,
              files: fileInfo,
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
    } else {
      saveReviewedFileMutation.mutate({
        noteFromAssignee: note,
      })
    }
  }

  const handleRemoveFile = (file: FileType) => {
    const uploadedFiles = files
    const tempFiles = uploadedReviewedFiles

    const filtered = uploadedFiles.filter((i: FileType) => i.name !== file.name)
    const filteredTempFiles = tempFiles.filter(
      (i: File) => i.name !== file.name,
    )
    setFileSize(fileSize - file.size)
    setFiles([...filtered])
    setUploadedReviewedFiles([...filteredTempFiles])
  }

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

  const { getRootProps, getInputProps } = useDropzone({
    noDragEventsBubbling: true,

    onDrop: (acceptedFiles: File[]) => {
      const totalFileSize =
        acceptedFiles.reduce((res, file) => (res += file.size), 0) + fileSize
      if (totalFileSize > MAXIMUM_FILE_SIZE) {
        onFileUploadReject()
      } else {
        setUploadedReviewedFiles(uploadedReviewedFiles.concat(acceptedFiles))
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

            if (!found)
              acc.push({
                name: file.name,
                size: file.size,
                type: 'REVIEWED',
              })

            return acc
          }
        }, [])

      setFiles(uniqueFiles)
    },
  })
  return (
    <>
      {isSavingData && <OverlaySpinner />}
      <Box
        sx={{
          maxWidth: '569px',
          width: '100%',
          maxHeight: '90vh',
          background: '#ffffff',
          boxShadow: '0px 0px 20px rgba(76, 78, 100, 0.4)',
          borderRadius: '10px',
          // padding: '32px 20px',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Box
            sx={{
              padding: '24px 20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography fontSize={20} fontWeight={500}>
              Upload reviewed files
            </Typography>
            <IconButton onClick={onClose}>
              <Icon icon='mdi:close'></Icon>
            </IconButton>
          </Box>
          <Divider />

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              padding: '20px',
              gap: '16px',
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Typography fontSize={16} fontWeight={600}>
                  Reviewed files
                </Typography>
                <Typography
                  fontSize={12}
                  fontWeight={400}
                  color={
                    fileSize > MAXIMUM_FILE_SIZE
                      ? '#FF4D49'
                      : 'rgba(76, 78, 100, 0.60)'
                  }
                >
                  {formatFileSize(fileSize)}/ {byteToGB(MAXIMUM_FILE_SIZE)}
                </Typography>
                {fileSize > MAXIMUM_FILE_SIZE && (
                  <Typography fontSize={14} fontWeight={600} color='#FF4D49'>
                    Maximum size exceeded
                  </Typography>
                )}
              </Box>
              <div
                {...getRootProps({
                  className: 'dropzone',
                })}
              >
                <Box
                  sx={{
                    width: '100%',
                    border: '1px dashed #8D8E9A',
                    borderRadius: '10px',
                    padding: '12px 20px',
                  }}
                >
                  <Box
                    sx={{ display: 'flex', gap: '8px', alignItems: 'center' }}
                  >
                    <Typography fontSize={14} fontWeight={400} color='#8D8E9A'>
                      Drag and drop or
                    </Typography>
                    <Button variant='outlined' size='small'>
                      <input {...getInputProps()} />
                      Browse file
                    </Button>
                  </Box>
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

                                  <Typography
                                    variant='caption'
                                    lineHeight={'14px'}
                                  >
                                    {formatFileSize(file.size)}
                                  </Typography>
                                </Box>
                              </Box>
                              <Box
                                sx={{ display: 'flex', alignItems: 'center' }}
                              >
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
                              </Box>
                            </Box>
                          </Box>
                        )
                      })}
                    </Box>
                  )}
                </Box>
              </div>
            </Box>
            {/* <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Typography fontSize={16} fontWeight={600}>
            Note
          </Typography>
          <Box>
            <TextField
              multiline
              autoComplete='off'
              fullWidth
              rows={3}
              value={note}
              onChange={event => {
                setNote(event.target.value)
              }}
            />
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                fontSize: '12px',
                lineHeight: '25px',
                color: '#888888',
              }}
            >
              {note?.length ?? 0}/500
            </Box>
          </Box>
        </Box> */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant='contained'
                onClick={onClickSubmit}
                // disabled={files.length === 0 && note === ''}
                disabled={files.length === 0 || isSavingData}
              >
                Save
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  )
}

export default UploadReviewedFilesModal
