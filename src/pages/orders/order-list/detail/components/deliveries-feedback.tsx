import { Icon } from '@iconify/react'
import {
  Box,
  Button,
  Card,
  Divider,
  Grid,
  IconButton,
  Typography,
} from '@mui/material'
import AlertModal from '@src/@core/components/common-modal/alert-modal'

import logger from '@src/@core/utils/logger'
import {
  getDownloadUrlforCommon,
  getUploadUrlforCommon,
  uploadFileToS3,
} from '@src/apis/common.api'
import useModal from '@src/hooks/useModal'
import { getCurrentRole } from '@src/shared/auth/storage'
import { FILE_SIZE } from '@src/shared/const/maximumFileSize'
import { S3FileType } from '@src/shared/const/signedURLFileType'
import { getFilePath } from '@src/shared/transformer/filePath.transformer'
import { FileType } from '@src/types/common/file.type'
import {
  DeliveryFileType,
  ProjectInfoType,
} from '@src/types/orders/order-detail'
import { useContext, useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import toast from 'react-hot-toast'
import { UseMutationResult } from 'react-query'
import { updateOrderType } from '../[id]'
import CustomModal from '@src/@core/components/common-modal/custom-modal'
import { v4 as uuidv4 } from 'uuid'
import { formatFileSize } from '@src/shared/helpers/file-size.helper'
import { FullDateTimezoneHelper } from '@src/shared/helpers/date.helper'
import { AuthContext } from '@src/context/AuthContext'
import { CancelReasonType } from '@src/types/requests/detail.type'
import SelectReasonModal from '@src/pages/quotes/components/modal/select-reason-modal'
import {
  CancelOrderReason,
  RequestRedeliveryReason,
} from '@src/shared/const/reason/reason'

type Props = {
  project: ProjectInfoType
  isSubmittable: boolean
  updateProject: UseMutationResult<void, unknown, updateOrderType, unknown>
  statusList: Array<{ value: number; label: string }>
}

const DeliveriesFeedback = ({
  project,
  isSubmittable,
  updateProject,
  statusList,
}: Props) => {
  const MAXIMUM_FILE_SIZE = FILE_SIZE.DELIVERY_FILE
  const { openModal, closeModal } = useModal()
  const currentRole = getCurrentRole()
  const { user } = useContext(AuthContext)

  const [fileSize, setFileSize] = useState(0)
  const [files, setFiles] = useState<File[]>([])
  const [savedFiles, setSavedFiles] = useState<DeliveryFileType[]>([])

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg'],
      'text/csv': ['.csv'],
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt'],
      'application/vnd.ms-powerpoint': ['.ppt'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        ['.docx'],
      'video/*': ['.avi', '.mp4', '.mkv', '.wmv', '.mov'],
      'image/vnd.adobe.photoshop': ['.psd', '.psb'],
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

  function fetchFile(fileName: string) {
    const path = getFilePath(['delivery', project.id.toString()], fileName)

    getDownloadUrlforCommon(S3FileType.ORDER_DELIVERY, path).then(res => {
      fetch(res.url, { method: 'GET' })
        .then(res => {
          return res.blob()
        })
        .then(blob => {
          const url = window.URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = `${fileName}`
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

  function downloadOneFile(file: DeliveryFileType) {
    fetchFile(file.fileName)
  }

  function downloadAllFiles(files: Array<DeliveryFileType> | [] | undefined) {
    if (!files || !files.length) return

    files.forEach(file => {
      fetchFile(file.fileName)
    })
  }

  const handleRemoveFile = (file: FileType) => {
    const uploadedFiles = files
    const filtered = uploadedFiles.filter((i: FileType) => i.name !== file.name)
    setFiles([...filtered])
  }

  const fileList = files.map((file: FileType) => (
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
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ marginRight: '8px', display: 'flex' }}>
          <Icon
            icon='material-symbols:file-present-outline'
            style={{ color: 'rgba(76, 78, 100, 0.54)' }}
            fontSize={24}
          />
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
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
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {file.name}
          </Typography>
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
    </Box>
  ))

  const savedFileList = savedFiles?.map((file: DeliveryFileType) => (
    <Box key={uuidv4()}>
      <Typography
        variant='body2'
        fontSize={14}
        fontWeight={400}
        sx={{ mb: '5px' }}
      >
        {FullDateTimezoneHelper(file.createdAt, user?.timezone)}
      </Typography>
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
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ marginRight: '8px', display: 'flex' }}>
            <Icon
              icon='material-symbols:file-present-outline'
              style={{ color: 'rgba(76, 78, 100, 0.54)' }}
              fontSize={24}
            />
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
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
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
              }}
            >
              {file.fileName}
            </Typography>
            <Typography variant='caption' lineHeight={'14px'}>
              {formatFileSize(file.fileSize)}
            </Typography>
          </Box>
        </Box>
        {files.length ? null : (
          <IconButton onClick={() => downloadOneFile(file)}>
            <Icon icon='mdi:download' fontSize={24} />
          </IconButton>
        )}
      </Box>
    </Box>
  ))

  const onSubmit = () => {
    closeModal('DeliverToClientModal')
    if (files.length) {
      const fileInfo: Array<{
        filePath: string
        fileName: string
        fileExtension: string
        fileSize?: number
      }> = []
      const paths: string[] = files.map(file =>
        getFilePath(['delivery', project.id.toString()], file.name),
      )
      const promiseArr = paths.map((url, idx) => {
        return getUploadUrlforCommon(S3FileType.ORDER_DELIVERY, url).then(
          res => {
            fileInfo.push({
              fileName: files[idx].name,
              fileSize: files[idx]?.size,
              filePath: url,
              fileExtension: files[idx].name.split('.')[1],
            })
            return uploadFileToS3(res.url, files[idx])
          },
        )
      })
      Promise.all(promiseArr)
        .then(res => {
          logger.debug('upload client guideline file success :', res)

          updateProject.mutate({ deliveries: fileInfo })
        })
        .catch(err =>
          toast.error(
            'Something went wrong while uploading files. Please try again.',
            {
              position: 'bottom-left',
            },
          ),
        )
    }
  }

  const handleCompleteDelivery = () => {
    closeModal('CompleteDeliveryModal')
    // updateProject.mutate
  }

  const handleConfirmDelivery = (feedback: string) => {
    closeModal('ConfirmDeliveriesModal')
    updateProject.mutate(
      feedback !== '' ? { status: 109, feedback: feedback } : { status: 109 },
    )
  }

  const onClickDeliverToClient = () => {
    openModal({
      type: 'DeliverToClientModal',
      children: (
        <CustomModal
          onClick={() => onSubmit()}
          onClose={() => closeModal('DeliverToClientModal')}
          title={
            <>
              Are you sure you want to deliver the uploaded files?
              <Typography variant='body1' fontWeight={600}>
                You cannot delete the files after delivering them to the client.
              </Typography>
            </>
          }
          vary='successful'
          rightButtonText='Deliver'
        />
      ),
    })
  }

  const onClickCancelDeliver = () => {
    openModal({
      type: 'CancelDeliverModal',
      children: (
        <CustomModal
          onClick={() => {
            closeModal('CancelDeliverModal')
            setFiles([])
          }}
          onClose={() => closeModal('CancelDeliverModal')}
          title='Are you sure you want to cancel the file upload? The files you uploaded will not be saved.'
          vary='error'
          rightButtonText='Cancel'
        />
      ),
    })
  }

  const onClickCompleteDelivery = () => {
    openModal({
      type: 'CompleteDeliveryModal',
      children: (
        <CustomModal
          onClick={handleCompleteDelivery}
          onClose={() => closeModal('CompleteDeliveryModal')}
          title='Are you sure you want to complete delivery? You cannot upload additional files after completing delivery.'
          vary='successful'
          rightButtonText='Complete'
        />
      ),
    })
  }

  const onClickConfirmDeliveries = () => {
    openModal({
      type: 'ConfirmDeliveriesModal',
      children: (
        <CustomModal
          onClick={(text: string) => handleConfirmDelivery(text)}
          onClose={() => closeModal('ConfirmDeliveriesModal')}
          title='Are you sure you want to confirm deliveries? Please send feedback with the confirmation.'
          vary='successful'
          rightButtonText='Confirm'
          textarea={true}
          textareaPlaceholder='Write down feedback for the deliveries'
        />
      ),
    })
  }

  const onClickRequestRedelivery = () => {
    openModal({
      type: 'RequestRedeliveryModal',
      children: (
        <SelectReasonModal
          onClose={() => closeModal('RequestRedeliveryModal')}
          onClick={(status: number, reason: CancelReasonType) =>
            updateProject.mutate(
              { status: status, reason: reason },
              {
                onSuccess: () => {
                  closeModal('RequestRedeliveryModal')
                },
              },
            )
          }
          title='Are you sure you want to request redelivery?'
          vary='error'
          rightButtonText='Request'
          action='Redelivery requested'
          from='client'
          statusList={statusList!}
          type='redelivery_request'
          reasonList={RequestRedeliveryReason}
        />
      ),
    })
  }

  const onClickSendFeedback = () => {
    openModal({
      type: 'SendFeedbackModal',
      children: (
        <CustomModal
          onClick={(feedback: string) => {
            if (feedback !== '') {
              updateProject.mutate(
                { feedback: feedback },
                {
                  onSuccess: () => {
                    closeModal('SendFeedbackModal')
                  },
                },
              )
            }
          }}
          onClose={() => closeModal('SendFeedbackModal')}
          title='Please send feedback for the deliveries.'
          vary='successful'
          rightButtonText='Send'
          textarea={true}
          textareaPlaceholder='Write down feedback for the deliveries'
        />
      ),
    })
  }

  useEffect(() => {
    let result = 0
    files.forEach((file: FileType) => (result += file.size))

    savedFiles.forEach(
      (file: { fileSize: number }) => (result += file.fileSize),
    )
    setFileSize(result)
  }, [files, savedFiles])

  useEffect(() => {
    if (project?.deliveries?.length) {
      setSavedFiles(project.deliveries)
    }
  }, [project])

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
                <Typography variant='caption'>
                  {formatFileSize(fileSize).toLowerCase()}/2 gb
                </Typography>
              </Box>
              {isSubmittable && currentRole && currentRole.name !== 'CLIENT' ? (
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
                  <Button
                    variant='outlined'
                    disabled={savedFiles.length < 1}
                    sx={{
                      height: '34px',
                    }}
                    onClick={() => downloadAllFiles(savedFiles)}
                  >
                    <Icon icon='mdi:download' fontSize={18} />
                    &nbsp;Download all
                  </Button>
                </Box>
              ) : null}
              {currentRole &&
              currentRole.name === 'CLIENT' &&
              project.deliveries.length ? (
                <Button
                  variant='outlined'
                  disabled={savedFiles.length < 1}
                  sx={{
                    height: '34px',
                  }}
                  onClick={() => downloadAllFiles(savedFiles)}
                >
                  <Icon icon='mdi:download' fontSize={18} />
                  &nbsp;Download all
                </Button>
              ) : null}
            </Box>

            {savedFiles.length ? (
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3,1fr)',
                  gridGap: '16px',
                }}
              >
                {savedFileList}
              </Box>
            ) : (
              '-'
            )}
            {files.length ? (
              <>
                <Divider />
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3,1fr)',
                    gridGap: '16px',
                  }}
                >
                  {fileList}
                </Box>
              </>
            ) : null}
          </Box>
        </Card>

        <Card sx={{ padding: '24px', mt: '24px' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <Box sx={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <Typography variant='body1' fontWeight={600} fontSize={16}>
                Feedback
              </Typography>
              {currentRole &&
              currentRole.name === 'CLIENT' &&
              (project.feedback === '-' || project.feedback === null) ? (
                <Button
                  variant='contained'
                  sx={{ height: '34px' }}
                  onClick={onClickSendFeedback}
                >
                  Send feedback
                </Button>
              ) : null}
            </Box>

            <Typography variant='body1' fontWeight={400} fontSize={16}>
              {project.feedback ?? '-'}
            </Typography>
          </Box>
        </Card>
      </Grid>
      <Grid item xs={3}>
        <Card sx={{ padding: '24px' }}>
          {currentRole && currentRole.name === 'CLIENT' ? (
            <>
              <Box
                sx={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
              >
                <Button
                  variant='contained'
                  onClick={onClickConfirmDeliveries}
                  disabled={project.status !== 'Delivery completed'}
                >
                  Confirm deliveries
                </Button>
                <Button
                  variant='outlined'
                  onClick={onClickRequestRedelivery}
                  color='error'
                  disabled={
                    project.status !== 'Partially delivered' &&
                    project.status !== 'Delivery completed'
                  }
                >
                  Request redelivery
                </Button>
              </Box>
            </>
          ) : (
            <>
              {files.length ? (
                <Box
                  sx={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
                >
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
              ) : (
                <Box sx={{ display: 'flex' }}>
                  <Button
                    variant='contained'
                    fullWidth
                    onClick={onClickCompleteDelivery}
                    disabled={
                      (project.status !== 'Under revision' &&
                        project.status !== 'Partially delivered' &&
                        project.status !== 'Redelivery requested') ||
                      project.deliveries?.length === 0
                    }
                  >
                    Complete delivery
                  </Button>
                </Box>
              )}
            </>
          )}
        </Card>
      </Grid>
    </Grid>
  )
}

export default DeliveriesFeedback