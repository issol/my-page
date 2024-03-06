import { Icon } from '@iconify/react'
import { CheckBox } from '@mui/icons-material'
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
import { JobsFileType, ProJobDetailType } from '@src/types/jobs/jobs.type'
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
import { getFilePath } from '@src/shared/transformer/filePath.transformer'
import { useMutation, useQueryClient } from 'react-query'
import {
  patchProJobFeedbackCheck,
  patchProJobSourceFileDownload,
  postProJobDeliveries,
} from '@src/apis/jobs/job-detail.api'
import OverlaySpinner from '@src/@core/components/spinner/overlay-spinner'
import { srtUploadFileExtension } from '@src/shared/const/upload-file-extention/file-extension'

type Props = {
  jobInfo: ProJobDetailType
  jobDetailDots: string[]
}

const DeliveriesFeedback = ({ jobInfo, jobDetailDots }: Props) => {
  const MAXIMUM_FILE_SIZE = FILE_SIZE.DELIVERY_FILE
  const queryClient = useQueryClient()
  const [withoutFiles, setWithoutFiles] = useState(false)
  const [note, setNote] = useState<string | null>(null)
  const auth = useRecoilValueLoadable(authState)

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
      onSuccess: () => {
        refetch()
        setFiles([])
        setNote(null)
        setWithoutFiles(false)
        queryClient.invalidateQueries(['proJobDetail'])
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

  function fetchFile(file: JobsFileType) {
    getDownloadUrlforCommon(S3FileType.ORDER_DELIVERY, file.file).then(res => {
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

  function downloadOneFile(file: JobsFileType) {
    fetchFile(file)
  }

  function downloadAllFiles(files: Array<JobsFileType> | [] | undefined) {
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
    files.forEach((file: FileType) => (result += file.size))

    setFileSize(result)
  }, [files])

  const onSubmit = (deliveryType: 'final' | 'partial') => {
    closeModal('DeliverToClientModal')
    if (files.length) {
      setIsFileUploading(true)
      const fileInfo: Array<{
        name: string
        size: number
        type: 'SAMPLE' | 'TARGET' | 'SOURCE'
      }> = []
      const paths: string[] = files.map(
        file => {
          // return `project/${jobInfo.id}/delivery/${file.name}`
          //TODO: 경로에 delivery가 들어가는게 맞는지 확인 필요
          return `project/${jobInfo.id}/${file.name}`
        },
        // getFilePath(['delivery', jobInfo.id.toString()], file.name),
      )
      const promiseArr = paths.map((url, idx) => {
        return getUploadUrlforCommon(S3FileType.ORDER_DELIVERY, url).then(
          res => {
            fileInfo.push({
              name: files[idx].name,
              size: files[idx]?.size,
              // filePath: url,
              // fileExtension: splitFileNameAndExtension(files[idx].name)[1],
              type: 'TARGET',
            })
            return uploadFileToS3(res.url, files[idx])
          },
        )
      })
      Promise.all(promiseArr)
        .then(res => {
          setIsFileUploading(false)
          // logger.debug('upload client guideline file success :', res)

          // updateProject.mutate({ deliveries: fileInfo })
          updateDeliveries.mutate({
            jobId: jobInfo.id,
            deliveryType: deliveryType,
            note: note ?? undefined,
            isWithoutFile: withoutFiles,
            files: fileInfo.length > 0 ? fileInfo : undefined,
          })

          // setImportedFiles([])
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
        // files: fileInfo.length > 0 ? fileInfo : undefined,
      })
    }
  }

  const fileList = files.map(file => (
    <Box key={uuidv4()}>
      <FileBox>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ marginRight: '8px', display: 'flex' }}>
            <Icon
              icon='material-symbols:file-present-outline'
              style={{ color: 'rgba(76, 78, 100, 0.54)' }}
              fontSize={24}
            />
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Tooltip title={file.name}>
              <FileName variant='body1'>{file.name}</FileName>
            </Tooltip>

            <Typography variant='caption' lineHeight={'14px'}>
              {formatFileSize(file.size)}
            </Typography>
          </Box>
        </Box>
        <IconButton>
          <Icon
            icon='mdi:close'
            fontSize={24}
            onClick={() => handleRemoveFile(file)}
          />
        </IconButton>
        {/* {jobInfo.status === 'Declined' ||
        jobInfo.status === 'Canceled' ? null : (
          <IconButton
            onClick={() => downloadOneFile(file)}
            // disabled={jobInfo.status === 'Declined'}
            // disabled={isFileUploading || !isUserInTeamMember}
          >
            <Icon icon='mdi:download' fontSize={24} />
          </IconButton>
        )} */}
      </FileBox>
    </Box>
  ))

  return (
    <Grid container xs={12} spacing={4}>
      {patchFeedbackCheckMutation.isLoading ||
      updateDeliveries.isLoading ||
      isFileUploading ? (
        <OverlaySpinner />
      ) : null}
      <Grid item xs={8.75}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <Card
            sx={{
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
            }}
          >
            <Box sx={{ display: 'flex', gap: '20px' }}>
              <Box
                sx={{ display: 'flex', flexDirection: 'column', gap: '3px' }}
              >
                <Typography variant='h6'>Deliveries</Typography>
                <Typography variant='body2'>
                  {formatFileSize(fileSize)}/ {byteToGB(MAXIMUM_FILE_SIZE)}
                </Typography>
              </Box>
              {[60500, 60600, 60700, 60800, 60900, 601000, 601100].includes(
                jobInfo.status,
              ) ? null : (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'start',
                    gap: '16px',
                  }}
                >
                  <div {...getRootProps({ className: 'dropzone' })}>
                    <Button
                      variant='contained'
                      size='small'
                      sx={{ height: '30px' }}
                      disabled={withoutFiles || jobInfo.status === 601000}
                    >
                      <input {...getInputProps()} />
                      Upload
                    </Button>
                  </div>

                  <FormControlLabel
                    label='Deliver without files'
                    sx={{
                      alignItems: 'start',
                      '& .MuiFormControlLabel-label': {
                        fontSize: '14px',
                        marginTop: '4px',
                        color: 'rgba(76, 78, 100, 0.60)',
                      },
                    }}
                    control={
                      <Checkbox
                        checked={withoutFiles}
                        sx={{ padding: '4px 9px 9px 9px' }}
                        onChange={handleChange}
                        name='controlled'
                        disabled={files.length > 0 || jobInfo.status === 601000}
                      />
                    }
                  />
                </Box>
              )}
            </Box>
            {[60500, 60600, 60700, 60800, 60900, 601000, 601100].includes(
              jobInfo.status,
            ) ? null : (
              <>
                {fileList.length > 0 && (
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3, 1fr)',

                      width: '100%',
                      gap: '20px',
                    }}
                  >
                    {fileList}
                  </Box>
                )}
                <Divider />
                <Box
                  sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
                >
                  <Typography variant='body1' fontWeight={600}>
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
                  <Typography variant='body2' mt='12px' textAlign='right'>
                    {note?.length ?? 0}/200
                  </Typography>
                </Box>
              </>
            )}
          </Card>
          {data && data.deliveries.length > 0 ? (
            <Deliveries
              delivery={data.deliveries}
              downloadAllFiles={downloadAllFiles}
              downloadOneFile={downloadOneFile}
            />
          ) : null}
          {data && data.feedbacks.length > 0 ? (
            <Card sx={{ padding: '20px' }}>
              <Box sx={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                <img src='/images/icons/job-icons/feedback.png' alt='' />
                <Typography variant='h6'>Feedback</Typography>
              </Box>

              <Feedbacks
                feedbacks={data.feedbacks}
                checkFeedback={patchFeedbackCheckMutation.mutate}
              />
            </Card>
          ) : null}
        </Box>
      </Grid>
      <Grid item xs={3.25}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <Card sx={{ padding: '24px' }}>
            {[60500, 60600, 60700, 60800, 60900, 601000, 601100].includes(
              jobInfo.status,
            ) ? (
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
        </Box>
      </Grid>
    </Grid>
  )
}
export default DeliveriesFeedback
