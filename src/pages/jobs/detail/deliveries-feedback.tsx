import { Icon } from '@iconify/react'
import {
  Badge,
  Box,
  Button,
  Card,
  Checkbox,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import AlertModal from '@src/@core/components/common-modal/alert-modal'
import useModal from '@src/hooks/useModal'
import {
  FileBox,
  FileName,
} from '@src/pages/invoice/receivable/detail/components/invoice-info'
import { FILE_SIZE } from '@src/shared/const/maximumFileSize'

import { byteToGB, formatFileSize } from '@src/shared/helpers/file-size.helper'
import { FileType } from '@src/types/common/file.type'
import {
  JobsFileType,
  ProJobDeliveryType,
  ProJobDetailType,
} from '@src/types/jobs/jobs.type'
import { ChangeEvent, useEffect, useMemo, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { v4 as uuidv4 } from 'uuid'
import PartialDeliveryModal from './components/modal/partial-delivery-modal'
import FinalDeliveryModal from './components/modal/final-delivery-modal'
import CustomModal from '@src/@core/components/common-modal/custom-modal'
import { useRecoilValueLoadable } from 'recoil'
import { authState } from '@src/states/auth'
import {
  getDownloadUrlforCommon,
  getUploadUrlforCommon,
  uploadFileToS3,
} from '@src/apis/common.api'
import { S3FileType } from '@src/shared/const/signedURLFileType'
import toast from 'react-hot-toast'
import Deliveries from './components/deliveries'
import Feedbacks from './components/feedbacks'
import { useGetProJobDeliveriesFeedbacks } from '@src/queries/jobs/jobs.query'
import {
  RefetchOptions,
  RefetchQueryFilters,
  useMutation,
  useQueryClient,
  QueryObserverResult,
} from 'react-query'
import {
  patchProJobFeedbackCheck,
  postProJobDeliveries,
} from '@src/apis/jobs/job-detail.api'
import OverlaySpinner from '@src/@core/components/spinner/overlay-spinner'
import { srtUploadFileExtension } from '@src/shared/const/upload-file-extention/file-extension'
import Image from 'next/image'
import SubmitModal from './components/modal/submit-modal'
import { extractFileExtension } from '@src/shared/transformer/file-extension.transformer'

// NOTE : 리딜리버리 코드 필요
const NOT_FILE_UPLOAD_JOB_STATUS = [
  60500, 60600, 60700, 60800, 60900, 601000, 601100,
]

type Props = {
  jobInfo: ProJobDetailType
  jobDetailDots: string[]
  jobDetailRefetch: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined,
  ) => Promise<QueryObserverResult<ProJobDetailType, unknown>>
}

const DeliveriesFeedback = ({
  jobInfo,
  jobDetailDots,
  jobDetailRefetch,
}: Props) => {
  const MAXIMUM_FILE_SIZE = FILE_SIZE.DELIVERY_FILE
  const queryClient = useQueryClient()
  const [withoutFiles, setWithoutFiles] = useState(false)
  const [note, setNote] = useState<string | null>(null)
  const auth = useRecoilValueLoadable(authState)
  const [expanded, setExpanded] = useState<string | false>(false)

  const { data, refetch } = useGetProJobDeliveriesFeedbacks(jobInfo.id)

  const [isFileUploading, setIsFileUploading] = useState<boolean>(false)
  const updateDeliveries = useMutation(
    (params: {
      jobId: number
      deliveryType: 'partial' | 'final'
      note?: string
      isWithoutFile: boolean
      files?: Array<{
        size: number
        name: string
        type: 'TARGET' | 'SOURCE' | 'SAMPLE'
      }>
    }) => postProJobDeliveries(params),
    {
      onSuccess: (data, variables) => {
        if (data.length > 0) {
          const id = data[0].delivery.id ?? 0

          setExpanded(id.toString())
        }

        refetch()
        setFiles([])
        setNote(null)
        setWithoutFiles(false)
        queryClient.invalidateQueries(['proJobDetail', variables.jobId])
        jobDetailRefetch()
      },
    },
  )

  const patchFeedbackCheckMutation = useMutation(
    (feedbackId: number) => patchProJobFeedbackCheck(jobInfo.id, feedbackId),
    {
      onSuccess: () => {
        refetch()
        queryClient.invalidateQueries(['proJobDetail'])
        queryClient.invalidateQueries(['proJobDots'])
      },
    },
  )

  const { openModal, closeModal } = useModal()

  const [files, setFiles] = useState<File[]>([])
  const [fileSize, setFileSize] = useState(0)
  const [deliveryFileSize, setDeliveryFileSize] = useState(0)

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setWithoutFiles(event.target.checked)
  }

  const handleRemoveFile = (file: FileType) => {
    const uploadedFiles = files
    const filtered = uploadedFiles.filter((i: FileType) => i.name !== file.name)
    setFiles([...filtered])
  }

  const handlePartialDelivery = () => {
    //TODO API 연결
    onSubmit('partial')
  }

  const handleFinalDelivery = () => {
    // TODO API 연결
    onSubmit('final')
  }

  const handleCancelDelivery = () => {
    closeModal('CancelDeliveryModal')
    setFiles([])
    setFileSize(0)
    setWithoutFiles(false)
    setNote(null)
  }

  const onClickPartialDelivery = () => {
    openModal({
      type: 'PartialDeliveryModal',
      children: (
        <PartialDeliveryModal
          onClose={() => closeModal('PartialDeliveryModal')}
          onClick={handlePartialDelivery}
        />
      ),
    })
  }

  const onClickFinalDelivery = () => {
    openModal({
      type: 'FinalDeliveryModal',
      children: (
        <FinalDeliveryModal
          onClose={() => closeModal('FinalDeliveryModal')}
          onClick={handleFinalDelivery}
        />
      ),
    })
  }

  const onClickCancelDelivery = () => {
    openModal({
      type: 'CancelDeliveryModal',
      children: (
        <CustomModal
          onClose={() => closeModal('CancelDeliveryModal')}
          onClick={handleCancelDelivery}
          title='Are you sure you want to cancel the delivery? The note and files will not be saved.'
          rightButtonText='Cancel'
          leftButtonText='No'
          vary='error'
        />
      ),
    })
  }

  const fetchFile = (file: JobsFileType) => {
    getDownloadUrlforCommon(S3FileType.ORDER_DELIVERY, file.file).then(res => {
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

  const downloadOneFile = (file: JobsFileType) => {
    fetchFile(file)
  }

  const downloadAllFiles = (files: Array<JobsFileType> | [] | undefined) => {
    if (!files || !files.length) return

    files.forEach(file => {
      fetchFile(file)
    })
  }

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      ...srtUploadFileExtension.accept,
    },
    onDrop: (acceptedFiles: File[]) => {
      const uniqueFiles = files
        .concat(acceptedFiles)
        .reduce((acc: File[], file: File) => {
          let result = 0
          acc.concat(file).forEach((file: FileType) => (result += file.size))
          console.log('file size', result, MAXIMUM_FILE_SIZE)
          if (result > MAXIMUM_FILE_SIZE) {
            openModal({
              type: 'AlertMaximumFileSizeModal',
              children: (
                <AlertModal
                  title='The maximum file size you can upload is 100GB.'
                  onClick={() => closeModal('AlertMaximumFileSizeModal')}
                  vary='error'
                  buttonText='Okay'
                />
              ),
            })

            return acc
          } else {
            const found = acc.find(f => f.name === file.name)
            if (found) {
              let index = 1
              let newFileName = file.name.replace(
                /(\.[^/.]+)$/,
                ` (${index})$1`,
              )
              while (acc.find(f => f.name === newFileName)) {
                index++
                newFileName = file.name.replace(/(\.[^/.]+)$/, ` (${index})$1`)
              }
              file = new File([file], newFileName)
            }
            acc.push(file)
            return acc
          }
        }, [])
      setFiles(uniqueFiles)
    },
  })

  useEffect(() => {
    let result = 0
    files.forEach((file: FileType) => (result += Number(file.size)))

    setFileSize(result)
  }, [files])

  useEffect(() => {
    if (data?.deliveries) {
      setDeliveryFileSize(getDeliveryFileSize(data?.deliveries))
    }
  }, [data])

  const getDeliveryFileSize = (deliveries: ProJobDeliveryType[]) => {
    let result = 0
    deliveries.forEach((delivery: ProJobDeliveryType) => {
      delivery.files.forEach((file: JobsFileType) => {
        result += Number(file.size)
      })
    })
    return result
  }

  const onSubmit = (deliveryType: 'final' | 'partial') => {
    console.log(deliveryType)

    // closeModal('DeliverToClientModal')
    if (files.length) {
      setIsFileUploading(true)
      const fileInfo: Array<{
        name: string
        size: number
        type: 'SAMPLE' | 'TARGET' | 'SOURCE'
      }> = []
      const paths: string[] = files.map(file => {
        return `project/${jobInfo.id}/${file.name}`
      })
      const promiseArr = paths.map((url, idx) => {
        return getUploadUrlforCommon(S3FileType.ORDER_DELIVERY, url).then(
          res => {
            fileInfo.push({
              name: files[idx].name,
              size: files[idx]?.size,
              type: 'TARGET',
            })
            return uploadFileToS3(res, files[idx])
          },
        )
      })
      Promise.all(promiseArr)
        .then(res => {
          setIsFileUploading(false)
          updateDeliveries.mutate({
            jobId: jobInfo.id,
            deliveryType: deliveryType,
            note: note ?? undefined,
            isWithoutFile: withoutFiles,
            files: fileInfo.length > 0 ? fileInfo : undefined,
          })
        })
        .catch(err => {
          setIsFileUploading(false)
          toast.error(
            'Something went wrong while uploading files. Please try again.',
            {
              position: 'bottom-left',
            },
          )
        })
    } else {
      updateDeliveries.mutate({
        jobId: jobInfo.id,
        deliveryType: deliveryType,
        note: note ?? undefined,
        isWithoutFile: withoutFiles,
        files: [],
      })
    }
  }

  const onClickSubmit = () => {
    openModal({
      type: 'submitModal',
      children: (
        <SubmitModal
          onClick={(deliveryType: 'final' | 'partial') => {
            closeModal('submitModal')
            onSubmit(deliveryType)
          }}
          onClose={() => closeModal('submitModal')}
        />
      ),
    })
  }

  return (
    <Grid container xs={12} spacing={4}>
      {patchFeedbackCheckMutation.isLoading ||
      updateDeliveries.isLoading ||
      isFileUploading ? (
        <OverlaySpinner />
      ) : null}
      <Grid item xs={6}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <Card
            sx={{
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                gap: '20px',
                justifyContent: 'space-between',
              }}
            >
              <Box
                sx={{ display: 'flex', flexDirection: 'column', gap: '3px' }}
              >
                <Typography fontSize={20} fontWeight={500}>
                  Deliveries ({data?.deliveries.length ?? 0})
                </Typography>
                <Typography fontSize={12} fontWeight={400} color='#4C4E6499'>
                  {formatFileSize(fileSize + deliveryFileSize)}/{' '}
                  {byteToGB(MAXIMUM_FILE_SIZE)}
                </Typography>
              </Box>
              {NOT_FILE_UPLOAD_JOB_STATUS.includes(jobInfo.status) ? null : (
                <FormControlLabel
                  label='Deliver without files'
                  sx={{
                    alignItems: 'start',
                    marginRight: 0,
                    '& .MuiFormControlLabel-label': {
                      fontSize: '14px',
                      marginTop: '4px',
                      color: 'rgba(76, 78, 100, 0.60)',
                    },
                  }}
                  control={
                    <Checkbox
                      size='small'
                      checked={withoutFiles}
                      sx={{ padding: '4px 9px 9px 9px' }}
                      onChange={handleChange}
                      name='controlled'
                      disabled={files.length > 0 || jobInfo.status === 601000}
                    />
                  }
                />
              )}
            </Box>
            {!NOT_FILE_UPLOAD_JOB_STATUS.includes(jobInfo.status) &&
              !withoutFiles && (
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
                    <Box
                      sx={{
                        display: 'flex',
                        gap: '8px',
                        alignItems: 'center',
                        // mb: '12px',
                      }}
                    >
                      <Typography
                        fontSize={12}
                        fontWeight={400}
                        color='#8D8E9A'
                      >
                        Drag and drop or{' '}
                      </Typography>
                      <Button variant='outlined' size='small'>
                        <input {...getInputProps()} />
                        Browse files
                      </Button>
                    </Box>
                    {files.length > 0 && (
                      <Box
                        sx={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(2, 1fr)',
                          width: '100%',
                          gap: '20px',
                          mt: '20px',
                        }}
                      >
                        {files.map(file => {
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
              )}
            {NOT_FILE_UPLOAD_JOB_STATUS.includes(jobInfo.status) ? null : (
              <>
                <Box display='flex' flexDirection='column'>
                  <Typography
                    fontSize={14}
                    fontWeight={600}
                    sx={{ marginBottom: '8px' }}
                  >
                    Notes to LPM
                  </Typography>
                  <TextField
                    fullWidth
                    autoComplete='off'
                    placeholder='Leave a note for LPM.'
                    multiline
                    rows={2}
                    value={note ?? ''}
                    inputProps={{ maxLength: 200 }}
                    onChange={e => {
                      if (e.target.value === '') {
                        setNote(null)
                      } else setNote(e.target.value)
                    }}
                  />
                  <Typography
                    fontSize={12}
                    fontWeight={400}
                    lineHeight={'25.302px'}
                    textAlign='right'
                    color='#888888'
                  >
                    {note?.length ?? 0}/200
                  </Typography>
                </Box>
              </>
            )}
            {NOT_FILE_UPLOAD_JOB_STATUS.includes(jobInfo.status) ? null : (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                }}
              >
                <Button
                  variant='contained'
                  sx={{ width: '134px' }}
                  onClick={onClickSubmit}
                  disabled={withoutFiles ? false : files.length === 0}
                >
                  Submit
                </Button>
              </Box>
            )}
            {/* {NOT_FILE_UPLOAD_JOB_STATUS.includes(jobInfo.status) ? null : (
              <Divider />
            )} */}

            {data && data.deliveries.length > 0 ? (
              <>
                <Divider />
                <Deliveries
                  delivery={data.deliveries}
                  downloadAllFiles={downloadAllFiles}
                  downloadOneFile={downloadOneFile}
                  expanded={expanded}
                  setExpanded={setExpanded}
                />
              </>
            ) : null}
          </Card>
        </Box>
      </Grid>
      <Grid item xs={6}>
        <Card sx={{ padding: '20px' }}>
          <Box sx={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            {/* <img src='/images/icons/job-icons/feedback.png' alt='' /> */}
            <Typography fontSize={20} fontWeight={500}>
              Feedback
            </Typography>
          </Box>
          {data && data?.feedbacks && data.feedbacks.length > 0 ? (
            <Feedbacks
              feedbacks={data.feedbacks}
              checkFeedback={patchFeedbackCheckMutation.mutate}
            />
          ) : (
            <Box
              sx={{
                height: '332px',
                padding: '20px 0',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Typography fontSize={14} fontWeight={400} color='#8D8E9A'>
                There is no feedback yet
              </Typography>
            </Box>
          )}
        </Card>

        {/* <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <Card sx={{ padding: '24px' }}>
            {NOT_FILE_UPLOAD_JOB_STATUS.includes(jobInfo.status) ? (
              <Box
                sx={{
                  height: '38px',
                  padding: '20px 16px',
                  background: 'rgba(114, 225, 40, 0.2)',
                  borderRadius: '10px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Typography
                  variant='body1'
                  fontWeight={600}
                  color='#64C623'
                  fontSize={14}
                >
                  Delivery completed
                </Typography>
                <Icon icon='mdi-check' fontSize={24} color='#64C623' />
              </Box>
            ) : (
              <Box
                sx={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
              >
                <Button
                  variant='outlined'
                  disabled={
                    (withoutFiles ? files.length > 0 : files.length < 1) ||
                    jobInfo.status === 601000
                  }
                  onClick={onClickPartialDelivery}
                >
                  Partial delivery
                </Button>
                <Button
                  variant='contained'
                  disabled={
                    (withoutFiles ? files.length > 0 : files.length < 1) ||
                    jobInfo.status === 601000
                  }
                  onClick={onClickFinalDelivery}
                >
                  Final delivery
                </Button>
              </Box>
            )}
          </Card>
          {files.length > 0 || withoutFiles ? (
            <Card sx={{ padding: '24px' }}>
              <Button
                variant='outlined'
                color='secondary'
                fullWidth
                onClick={onClickCancelDelivery}
              >
                Cancel delivery
              </Button>
            </Card>
          ) : null}

          {jobDetailDots.includes('feedback') ? (
            <Card sx={{ padding: '24px' }}>
              <Box sx={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <Badge
                  variant='dot'
                  color='primary'
                  sx={{ marginLeft: '4px' }}
                />
                <Typography variant='body1' fontWeight={600} fontSize={14}>
                  New feedback registered
                </Typography>
                <Icon icon='mdi:arrow-downward' fontSize={24} />
              </Box>
            </Card>
          ) : null}
        </Box> */}
      </Grid>
    </Grid>
  )
}
export default DeliveriesFeedback
