import { Icon } from '@iconify/react'
import {
  Box,
  Button,
  Card,
  Divider,
  Grid,
  IconButton,
  Tooltip,
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
  OrderFeatureType,
  ProjectInfoType,
} from '@src/types/orders/order-detail'
import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react'
import { useDropzone } from 'react-dropzone'
import toast from 'react-hot-toast'
import { UseMutationResult, useMutation, useQueryClient } from 'react-query'
import { updateOrderType } from '../[id]'
import CustomModal from '@src/@core/components/common-modal/custom-modal'
import { v4 as uuidv4 } from 'uuid'
import { byteToGB, formatFileSize } from '@src/shared/helpers/file-size.helper'
import { convertTimeToTimezone } from '@src/shared/helpers/date.helper'
import { useRecoilValueLoadable } from 'recoil'
import { authState } from '@src/states/auth'
import { CancelReasonType } from '@src/types/requests/detail.type'
import SelectReasonModal from '@src/pages/quotes/components/modal/select-reason-modal'
import {
  CancelOrderReason,
  RequestRedeliveryReason,
} from '@src/shared/const/reason/reason'
import { useGetJobDetails } from '@src/queries/order/job.query'
import ImportFromJob from './modal/import-from-job'
import { GridCallbackDetails, GridSelectionModel } from '@mui/x-data-grid'
import { set } from 'lodash'
import {
  completeDelivery,
  confirmDelivery,
  deliverySendToClient,
} from '@src/apis/order/order-detail.api'
import NoList from '@src/pages/components/no-list'
import OverlaySpinner from '@src/@core/components/spinner/overlay-spinner'
import SelectRequestRedeliveryReasonModal from './modal/select-request-redelivery-reason-modal'
import { ReasonType } from '@src/types/quotes/quote'
import { srtUploadFileExtension } from '@src/shared/const/upload-file-extention/file-extension'
import { timezoneSelector } from '@src/states/permission'

type Props = {
  project: ProjectInfoType
  isSubmittable: boolean
  updateProject: UseMutationResult<void, unknown, updateOrderType, unknown>
  updateStatus: UseMutationResult<
    any,
    unknown,
    {
      id: number
      status: number
      reason?: ReasonType | undefined
    },
    unknown
  >
  statusList: Array<{ value: number; label: string }>
  canUseFeature: (v: OrderFeatureType) => boolean
  uploadFileProcessing: boolean
  setUploadFileProcessing: Dispatch<SetStateAction<boolean>>
  isEditable: boolean
}

const DeliveriesFeedback = ({
  project,
  isSubmittable,
  updateProject,
  updateStatus,
  statusList,
  canUseFeature,
  uploadFileProcessing,
  setUploadFileProcessing,
  isEditable,
}: Props) => {
  const MAXIMUM_FILE_SIZE = FILE_SIZE.DELIVERY_FILE
  const { openModal, closeModal } = useModal()
  const currentRole = getCurrentRole()
  const auth = useRecoilValueLoadable(authState)
  const timezone = useRecoilValueLoadable(timezoneSelector)

  const { data: jobDetails, refetch } = useGetJobDetails(project.id)

  const [fileSize, setFileSize] = useState(0)
  const [files, setFiles] = useState<File[]>([])
  const [savedFiles, setSavedFiles] = useState<DeliveryFileType[]>([])
  const [importedFiles, setImportedFiles] = useState<DeliveryFileType[]>([])

  const queryClient = useQueryClient()

  const updateDeliveries = useMutation(
    (
      deliveries: {
        filePath: string
        fileName: string
        fileExtension: string
        fileSize?: number
      }[],
    ) => deliverySendToClient(project.id, deliveries),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['orderDetail'],
        })
        queryClient.invalidateQueries(['orderList'])
      },
    },
  )

  const completeDeliveryMutation = useMutation(
    () => completeDelivery(project.id),
    {
      onSuccess: () => {
        closeModal('CompleteDeliveryModal')
        queryClient.invalidateQueries({
          queryKey: ['orderDetail'],
        })
        queryClient.invalidateQueries(['orderList'])
      },
    },
  )

  const confirmDeliveryMutation = useMutation(
    (feedback?: string) => confirmDelivery(project.id, feedback),
    {
      onSuccess: () => {
        closeModal('ConfirmDeliveriesModal')
        queryClient.invalidateQueries({
          queryKey: ['orderDetail'],
        })
        queryClient.invalidateQueries(['orderList'])
      },
    },
  )

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      ...srtUploadFileExtension.accept,
    },
    disabled: !canUseFeature('button-Deliveries&Feedback-Upload'),
    noKeyboard: true,
    noDrag: true,

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
                  title={`The maximum file size you can upload is ${byteToGB(
                    MAXIMUM_FILE_SIZE,
                  )}.`}
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
      setUploadFileProcessing(true)
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

  const handleRemoveImportedFile = (file: DeliveryFileType) => {
    const uploadedFiles = importedFiles
    const filtered = uploadedFiles.filter(
      (i: DeliveryFileType) => i.fileName !== file.fileName,
    )
    setImportedFiles([...filtered])
  }

  const onClickUploadJobFile = (selected: DeliveryFileType[]) => {
    closeModal('ImportFromJobModal')
    setImportedFiles(selected)
  }

  const onClickImportJob = () => {
    if (jobDetails)
      openModal({
        type: 'ImportFromJobModal',
        children: (
          <ImportFromJob
            items={jobDetails?.items}
            onClickUpload={onClickUploadJobFile}
            onClose={() => closeModal('ImportFromJobModal')}
          />
        ),
      })
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
      <IconButton>
        <Icon
          icon='mdi:close'
          fontSize={24}
          onClick={() => handleRemoveFile(file)}
        />
      </IconButton>
    </Box>
  ))

  const importedFileList = importedFiles.map((file: DeliveryFileType) => (
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
          <Tooltip title={file.fileName}>
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
              {file.fileName}
            </Typography>
          </Tooltip>
          <Typography variant='caption' lineHeight={'14px'}>
            {formatFileSize(file.fileSize)}
          </Typography>
        </Box>
      </Box>
      <IconButton>
        <Icon
          icon='mdi:close'
          fontSize={24}
          onClick={() => handleRemoveImportedFile(file)}
        />
      </IconButton>
    </Box>
  ))

  // const groupedFiles: DeliveryFileType[][] = savedFiles.reduce(
  //   (acc: DeliveryFileType[][], curr: DeliveryFileType) => {
  //     const existingGroup = acc.find(
  //       group => group[0]?.createdAt === curr.createdAt,
  //     )
  //     if (existingGroup) {
  //       existingGroup.push(curr)
  //     } else {
  //       acc.push([curr])
  //     }
  //     return acc
  //   },
  //   [],
  // )

  interface GroupedDeliveryFileType {
    createdAt: string
    data: DeliveryFileType[]
  }

  const groupedFiles: GroupedDeliveryFileType[] = savedFiles.reduce(
    (acc: GroupedDeliveryFileType[], curr: DeliveryFileType) => {
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

  const savedFileList = savedFiles?.map((file: DeliveryFileType) => (
    <Box key={uuidv4()}>
      <Typography
        variant='body2'
        fontSize={14}
        fontWeight={400}
        sx={{ mb: '5px' }}
      >
        {convertTimeToTimezone(
          file.createdAt,
          auth.getValue().user?.timezone,
          timezone.getValue(),
        )}
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
            <Tooltip title={file.fileName}>
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
                {file.fileName}
              </Typography>
            </Tooltip>

            <Typography variant='caption' lineHeight={'14px'}>
              {formatFileSize(file.fileSize)}
            </Typography>
          </Box>
        </Box>
        {files.length ? null : (
          <IconButton
            onClick={() => downloadOneFile(file)}
            disabled={
              currentRole?.name !== 'CLIENT' &&
              !canUseFeature('button-Deliveries&Feedback-DownloadOnce')
            }
          >
            <Icon icon='mdi:download' fontSize={24} />
          </IconButton>
        )}
      </Box>
    </Box>
  ))

  const splitFileNameAndExtension = (fileName: string): [string, string] => {
    const splitIndex = fileName.lastIndexOf('.')
    if (splitIndex === -1) {
      return [fileName, '']
    }
    const name = fileName.slice(0, splitIndex)
    const extension = fileName.slice(splitIndex + 1)
    return [name, extension]
  }

  const onSubmit = () => {
    closeModal('DeliverToClientModal')
    setUploadFileProcessing(false)
    if (files.length || importedFiles.length) {
      const fileInfo: Array<DeliveryFileType> = [
        ...savedFiles,
        ...importedFiles,
      ]
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
              fileExtension: splitFileNameAndExtension(files[idx].name)[1],
              type: 'imported',
            })
            return uploadFileToS3(res.url, files[idx])
          },
        )
      })
      Promise.all(promiseArr)
        .then(res => {
          logger.debug('upload client guideline file success :', res)

          // updateProject.mutate({ deliveries: fileInfo })
          updateDeliveries.mutate(fileInfo)
          setFiles([])
          setImportedFiles([])
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
    // updateProject.mutate
    completeDeliveryMutation.mutate()
  }

  const handleConfirmDelivery = (feedback: string) => {
    confirmDeliveryMutation.mutate(feedback)
    // updateProject.mutate(
    //   feedback !== '' ? { status: 109, feedback: feedback } : { status: 109 },
    // )
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
              Are you sure you want to deliver the uploaded files?&nbsp;
              <Typography
                variant='body2'
                fontWeight={600}
                component={'span'}
                fontSize={16}
              >
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
            setUploadFileProcessing(false)
          }}
          onClose={() => closeModal('CancelDeliverModal')}
          title='Are you sure you want to cancel the file upload? The files you uploaded will not be saved.'
          vary='error'
          leftButtonText='No'
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
          textareaRequired={false}
          textareaPlaceholder='Write down feedback for the deliveries'
        />
      ),
    })
  }

  const onClickRequestRedelivery = () => {
    openModal({
      type: 'RequestRedeliveryModal',
      children: (
        <SelectRequestRedeliveryReasonModal
          onClose={() => closeModal('RequestRedeliveryModal')}
          onClick={(status: number, reason: ReasonType) =>
            updateStatus.mutate(
              { id: project.id, status: status, reason: reason },
              {
                onSuccess: () => {
                  closeModal('RequestRedeliveryModal')
                },
                onError: () => {
                  closeModal('RequestRedeliveryModal')
                },
              },
            )
          }
          title='Are you sure you want to request redelivery?'
          vary='error'
          rightButtonText='Request'
          leftButtonText='Cancel'
          action='Redelivery requested'
          from='client'
          statusList={statusList!}
          type='redelivery-requested'
          reasonList={RequestRedeliveryReason}
          usage='request'
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
          textareaRequired={true}
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
      {updateDeliveries.isLoading ||
      completeDeliveryMutation.isLoading ||
      updateProject.isLoading ? (
        <OverlaySpinner />
      ) : null}
      <Grid item xs={isEditable ? 9 : 12}>
        <Card sx={{ padding: '24px' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <Box sx={{ display: 'flex', gap: '20px' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant='body1' fontWeight={600}>
                  Deliveries
                </Typography>
                <Typography variant='caption'>
                  {formatFileSize(fileSize)}/{byteToGB(MAXIMUM_FILE_SIZE)}
                </Typography>
              </Box>
              {isSubmittable && currentRole && currentRole.name !== 'CLIENT' ? (
                <Box sx={{ display: 'flex', gap: '16px' }}>
                  <div {...getRootProps({ className: 'dropzone' })}>
                    <Button
                      variant='contained'
                      sx={{
                        height: '34px',
                      }}
                      disabled={
                        !canUseFeature('button-Deliveries&Feedback-Upload')
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
                      !canUseFeature('button-Deliveries&Feedback-ImportFromJob')
                    }
                    onClick={onClickImportJob}
                  >
                    <Icon icon='mdi:import' fontSize={18} />
                    &nbsp;Import from job
                  </Button>
                  {uploadFileProcessing ? null : (
                    <Button
                      variant='outlined'
                      disabled={
                        savedFiles.length < 1 ||
                        !canUseFeature('button-Deliveries&Feedback-DownloadAll')
                      }
                      sx={{
                        height: '34px',
                      }}
                      onClick={() => downloadAllFiles(savedFiles)}
                    >
                      <Icon icon='mdi:download' fontSize={18} />
                      &nbsp;Download all
                    </Button>
                  )}
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

            {savedFiles.length
              ? groupedFiles.map(value => {
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
                          gridTemplateColumns: 'repeat(3,1fr)',
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
                                sx={{ display: 'flex', alignItems: 'center' }}
                              >
                                <Box
                                  sx={{ marginRight: '8px', display: 'flex' }}
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
                                  <Tooltip title={item.fileName}>
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
                                      {item.fileName}
                                    </Typography>
                                  </Tooltip>

                                  <Typography
                                    variant='caption'
                                    lineHeight={'14px'}
                                  >
                                    {formatFileSize(item.fileSize)}
                                  </Typography>
                                </Box>
                              </Box>

                              <IconButton
                                onClick={() => downloadOneFile(item)}
                                disabled={
                                  currentRole?.name !== 'CLIENT' &&
                                  !canUseFeature(
                                    'button-Deliveries&Feedback-DownloadOnce',
                                  )
                                }
                              >
                                <Icon icon='mdi:download' fontSize={24} />
                              </IconButton>
                            </Box>
                          )
                        })}
                      </Box>
                    </Box>
                  )
                })
              : // <Box
              //   sx={{
              //     display: 'grid',
              //     gridTemplateColumns: 'repeat(3,1fr)',
              //     gridGap: '16px',
              //   }}
              // >
              //   {savedFileList}
              // </Box>
              uploadFileProcessing
              ? null
              : '-'}
            {files.length || importedFiles.length ? (
              <>
                {savedFiles.length ? <Divider /> : null}
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3,1fr)',
                    gridGap: '16px',
                  }}
                >
                  {fileList}
                  {importedFileList}
                </Box>
              </>
            ) : uploadFileProcessing ? (
              <>
                {savedFiles.length > 0 ? <Divider /> : null}
                <Box
                  sx={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',

                    padding: '24px',
                  }}
                >
                  <Typography variant='body2'>No files uploaded</Typography>
                </Box>
              </>
            ) : null}
          </Box>
        </Card>
        {uploadFileProcessing ? null : Boolean(
            [
              'Delivery confirmed',
              'Invoiced',
              'Paid',
              'Without invoice',
              'Canceled',
            ].includes(String(project.status)),
          ) ? (
          <Card sx={{ padding: '24px', mt: '24px' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <Box sx={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <Typography variant='body1' fontWeight={600} fontSize={16}>
                  Feedback
                </Typography>
                {currentRole &&
                currentRole.name === 'CLIENT' &&
                (!project.feedback ||
                  project.feedback === '-' ||
                  project.feedback === null) ? (
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
        ) : null}
      </Grid>
      <Grid item xs={3}>
        {currentRole && currentRole.name === 'CLIENT' ? (
          <>
            {isEditable ? (
              <Card sx={{ padding: '24px' }}>
                <Box
                  sx={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
                >
                  <Button
                    variant='contained'
                    onClick={onClickConfirmDeliveries}
                    disabled={
                      !canUseFeature(
                        'button-Deliveries&Feedback-ConfirmDeliveries',
                      )
                    }
                  >
                    Confirm deliveries
                  </Button>
                  <Button
                    variant='outlined'
                    onClick={onClickRequestRedelivery}
                    color='error'
                    disabled={
                      !canUseFeature(
                        'button-Deliveries&Feedback-RequestRedelivery',
                      )
                    }
                  >
                    Request redelivery
                  </Button>
                </Box>
              </Card>
            ) : null}
          </>
        ) : (
          <Card sx={{ padding: '24px' }}>
            {files.length || uploadFileProcessing ? (
              <Box
                sx={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
              >
                <Button
                  variant='contained'
                  color='success'
                  onClick={onClickDeliverToClient}
                  disabled={
                    !canUseFeature(
                      'button-Deliveries&Feedback-DeliverToClient',
                    ) || files.length === 0
                  }
                >
                  <Icon icon='ic:outline-send' fontSize={18} />
                  &nbsp;Deliver to client
                </Button>
                <Button variant='outlined' onClick={onClickCancelDeliver}>
                  Cancel
                </Button>
              </Box>
            ) : importedFiles.length || uploadFileProcessing ? (
              <Box
                sx={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
              >
                <Button
                  variant='contained'
                  color='success'
                  onClick={onClickDeliverToClient}
                  disabled={
                    !canUseFeature(
                      'button-Deliveries&Feedback-DeliverToClient',
                    ) || importedFiles.length === 0
                  }
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
                    !canUseFeature(
                      'button-Deliveries&Feedback-CompleteDelivery',
                    )
                  }
                >
                  Complete delivery
                </Button>
              </Box>
            )}
          </Card>
        )}
      </Grid>
    </Grid>
  )
}

export default DeliveriesFeedback
