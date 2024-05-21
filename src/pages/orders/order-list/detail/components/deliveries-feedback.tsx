import { Icon } from '@iconify/react'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Card,
  Divider,
  Grid,
  IconButton,
  TextField,
  Tooltip,
  Typography,
  useTheme,
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
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import toast from 'react-hot-toast'
import { useMutation, UseMutationResult, useQueryClient } from 'react-query'
import { updateOrderType } from '../[id]'
import CustomModal from '@src/@core/components/common-modal/custom-modal'
import { v4 as uuidv4 } from 'uuid'
import { byteToGB, formatFileSize } from '@src/shared/helpers/file-size.helper'
import { convertTimeToTimezone } from '@src/shared/helpers/date.helper'
import { useRecoilValueLoadable } from 'recoil'
import { authState } from '@src/states/auth'
import { RequestRedeliveryReason } from '@src/shared/const/reason/reason'
import { useGetJobDetails } from '@src/queries/order/job.query'
import ImportFromJob from './modal/import-from-job'
import {
  completeDelivery,
  confirmDelivery,
  deliverySendToClient,
  patchClientFeedback,
} from '@src/apis/order/order-detail.api'
import OverlaySpinner from '@src/@core/components/spinner/overlay-spinner'
import SelectRequestRedeliveryReasonModal from './modal/select-request-redelivery-reason-modal'
import { ReasonType } from '@src/types/quotes/quote'
import {
  srtUploadFileExtension,
  videoExtensions,
} from '@src/shared/const/upload-file-extention/file-extension'
import { timezoneSelector } from '@src/states/permission'
import { useRouter } from 'next/router'
import Image from 'next/image'
import DeliverClientModal from './modal/deliver-client-modal'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import CustomChip from '@src/@core/components/mui/chip'
import { extractFileExtension } from '@src/shared/transformer/file-extension.transformer'

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
  const router = useRouter()
  const theme = useTheme()
  const { id: orderId } = router.query
  const [expanded, setExpanded] = useState<string | false>(false)

  const queryClient = useQueryClient()

  const MAXIMUM_FILE_SIZE = FILE_SIZE.DELIVERY_FILE
  const { openModal, closeModal } = useModal()
  const currentRole = getCurrentRole()
  const auth = useRecoilValueLoadable(authState)
  const timezone = useRecoilValueLoadable(timezoneSelector)

  const { data: jobDetails, refetch } = useGetJobDetails(
    project.id,
    currentRole?.name !== 'CLIENT',
  )

  const [fileSize, setFileSize] = useState(0)
  const [files, setFiles] = useState<FileType[]>([])

  const [importedFiles, setImportedFiles] = useState<DeliveryFileType[]>([])
  const [note, setNote] = useState<string | null>(null)

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false)
    }

  const updateDeliveries = useMutation(
    (data: {
      deliveries: {
        filePath: string
        fileName: string
        fileExtension: string
        fileSize?: number
      }[]
      notes?: string
    }) => deliverySendToClient(project.id, data.deliveries, data.notes),
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

    onDrop: (acceptedFiles: File[]) => {
      const uniqueFiles = files
        .concat(acceptedFiles)
        .reduce((acc: FileType[], file: FileType) => {
          let result = fileSize
          acc.concat(file).forEach((file: FileType) => (result += file.size))
          setFileSize(result)
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
              file = new File([file as File], newFileName)
            }
            acc.push(file)
            return acc
          }
        }, [])

      setFiles(uniqueFiles)
      setUploadFileProcessing(true)
    },
  })

  const fetchFile = (fileName: string) => {
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

  const downloadOneFile = (file: DeliveryFileType) => {
    fetchFile(file.fileName)
  }

  const downloadAllFiles = (
    files: Array<DeliveryFileType> | [] | undefined,
  ) => {
    if (!files || !files.length) return

    files.forEach(file => {
      fetchFile(file.fileName)
    })
  }

  const handleRemoveFile = (file: FileType, type: 'import' | 'upload') => {
    const uploadedFiles = type === 'import' ? importedFiles : files
    const filtered = uploadedFiles.filter((i: FileType | DeliveryFileType) =>
      type === 'import'
        ? (i as DeliveryFileType).fileName !== file.name
        : (i as FileType).name !== file.name,
    )
    type === 'import'
      ? setImportedFiles([...(filtered as DeliveryFileType[])])
      : setFiles([...(filtered as FileType[])])

    setFileSize(fileSize - file.size)
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
            orderId={jobDetails.id}
            setImportedFiles={setImportedFiles}
            setFileSize={setFileSize}
            fileSize={fileSize}
          />
        ),
      })
  }

  // interface GroupedDeliveryFileType {
  //   id: number
  //   createdAt: string
  //   data: DeliveryFileType[]
  // }

  // const groupedFiles: GroupedDeliveryFileType[] = savedFiles.reduce(
  //   (acc: GroupedDeliveryFileType[], curr: DeliveryFileType, index: number) => {
  //     const existingGroup = acc.find(
  //       group => group.createdAt === curr.createdAt,
  //     )
  //     if (existingGroup) {
  //       existingGroup.data.push(curr)
  //     } else {
  //       acc.push({ createdAt: curr.createdAt!, data: [curr], id: index })
  //     }
  //     return acc
  //   },
  //   [],
  // )

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
        // ...files,
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
          updateDeliveries.mutate({
            deliveries: fileInfo,
            notes: note ?? undefined,
          })
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
        <DeliverClientModal
          onClose={() => closeModal('DeliverToClientModal')}
          onClick={(deliverType: 'partial' | 'final') => {
            if (deliverType === 'partial') {
              onSubmit()
            } else {
              handleCompleteDelivery()
            }
          }}
        />
      ),
    })
  }

  // const onClickDeliverToClient = () => {
  //   openModal({
  //     type: 'DeliverToClientModal',
  //     children: (
  //       <CustomModal
  //         onClick={() => onSubmit()}
  //         onClose={() => closeModal('DeliverToClientModal')}
  //         title={
  //           <>
  //             Are you sure you want to deliver the uploaded files?&nbsp;
  //             <Typography
  //               variant='body2'
  //               fontWeight={600}
  //               component={'span'}
  //               fontSize={16}
  //             >
  //               You cannot delete the files after delivering them to the client.
  //             </Typography>
  //           </>
  //         }
  //         vary='successful'
  //         rightButtonText='Deliver'
  //       />
  //     ),
  //   })
  // }

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

  const updateClientFeedback = useMutation((feedback: string) =>
    patchClientFeedback(Number(orderId), feedback),
  )

  const onClickSendFeedback = () => {
    openModal({
      type: 'SendFeedbackModal',
      children: (
        <CustomModal
          onClick={(feedback: string) => {
            if (feedback !== '') {
              updateClientFeedback.mutate(feedback, {
                onSuccess: () => {
                  closeModal('SendFeedbackModal')
                  queryClient.invalidateQueries({
                    queryKey: ['orderDetail'],
                  })
                },
              })
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

  // useEffect(() => {
  //   if (project?.deliveries?.files.length) {
  //     setSavedFiles(project.deliveries.files)
  //   }
  // }, [project])

  return (
    <Grid container xs={12} spacing={4}>
      {updateDeliveries.isLoading ||
      completeDeliveryMutation.isLoading ||
      updateProject.isLoading ? (
        <OverlaySpinner />
      ) : null}
      <Grid item xs={6}>
        <Card sx={{ padding: '24px' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <Box
              sx={{
                display: 'flex',
                gap: '20px',
                justifyContent: 'space-between',
              }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography fontSize={20} fontWeight={600}>
                  Deliveries
                </Typography>
                <Typography fontSize={12} fontWeight={400} color='#4C4E6499'>
                  {formatFileSize(fileSize)} / {byteToGB(MAXIMUM_FILE_SIZE)}
                </Typography>
              </Box>
              {isSubmittable && currentRole && currentRole.name !== 'CLIENT' ? (
                <Tooltip title={isEditable ? '' : 'Not authorized'}>
                  <Box sx={{ display: 'flex', gap: '16px' }}>
                    <Button
                      variant='outlined'
                      sx={{ height: '34px' }}
                      disabled={
                        !canUseFeature(
                          'button-Deliveries&Feedback-ImportFromJob',
                        )
                      }
                      onClick={onClickImportJob}
                    >
                      Import from job
                    </Button>
                  </Box>
                </Tooltip>
              ) : null}
              {/* {currentRole &&
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
              ) : null} */}
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
                  sx={{
                    display: 'flex',
                    gap: '8px',
                    alignItems: 'center',
                  }}
                >
                  <Typography fontSize={14} fontWeight={400} color='#8D8E9A'>
                    Drag and drop or
                  </Typography>
                  <Tooltip title={isEditable ? '' : 'Not authorized'}>
                    <Box>
                      <Button
                        variant='outlined'
                        size='small'
                        disabled={
                          !canUseFeature('button-Deliveries&Feedback-Upload')
                        }
                      >
                        <input {...getInputProps()} />
                        Browse file
                      </Button>
                    </Box>
                  </Tooltip>
                </Box>
                {(files.length > 0 || importedFiles.length > 0) && (
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, 1fr)',
                      mt: '20px',
                      width: '100%',
                      gap: '20px',
                    }}
                  >
                    {files
                      .concat(
                        importedFiles.map((file: DeliveryFileType) => ({
                          name: file.fileName,
                          size: file.fileSize,
                          uploadedBy: 'import',
                        })),
                      )
                      .map((file: FileType, index: number) => {
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
                                    src={`/images/icons/file-icons/${extractFileExtension(file.name)}.svg`}
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
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                }}
                              >
                                <Box
                                  sx={{
                                    alignItems: 'center',
                                    display: 'flex',
                                    color: 'rgba(76, 78, 100, 0.54)',
                                    cursor: 'pointer',
                                    padding: '4px',
                                    '& :hover': {
                                      borderRadius: '50%',
                                      backgroundColor: theme.palette.grey[200],
                                    },
                                  }}
                                  onClick={event => {
                                    event.stopPropagation()
                                    handleRemoveFile(
                                      file,
                                      (file.uploadedBy as
                                        | 'import'
                                        | 'upload') ?? 'upload',
                                    )
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
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography fontSize={14} fontWeight={600} sx={{ mb: '8px' }}>
                Notes to client
              </Typography>
              <TextField
                fullWidth
                autoComplete='off'
                placeholder='Leave a note for client'
                multiline
                rows={2}
                value={note ?? ''}
                inputProps={{ maxLength: 1000 }}
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
                {note?.length ?? 0}/1000
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Tooltip title={isEditable ? '' : 'Not authorized'}>
                <Box>
                  <Button
                    variant='contained'
                    disabled={
                      !canUseFeature(
                        'button-Deliveries&Feedback-DeliverToClient',
                      ) ||
                      (importedFiles.length === 0 && files.length === 0)
                    }
                    onClick={onClickDeliverToClient}
                  >
                    Deliver to client
                  </Button>
                </Box>
              </Tooltip>
            </Box>
            {/* {project.deliveries.length ? (
              <Box
                sx={{
                  '& .Mui-expanded .MuiAccordion-rounded': {
                    borderTop: '1px solid #D8D8DD !important',
                    margin: '0 !important',
                  },
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                {project.deliveries.map(value => {
                  return (
                    <Accordion
                      key={uuidv4()}
                      expanded={expanded === value.id?.toString()}
                      onChange={handleChange(value.id?.toString() ?? '')}
                      sx={{
                        borderRadius: '10px !important',
                        boxShadow: 'none !important',
                        border: '1px solid #D8D8DD',
                        margin: '0 !important',
                      }}
                      disableGutters
                    >
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        sx={{
                          padding:
                            expanded === value.id?.toString()
                              ? '20px'
                              : '12px 20px',
                          background: '#F7F8FF',
                          '& .MuiAccordionSummary-content': {
                            margin: 0,
                          },
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            width: '100%',
                            alignItems: 'center',
                            paddingRight: '32px',
                          }}
                        >
                          <Typography
                            variant='body1'
                            fontWeight={600}
                            fontSize={14}
                          >
                            {convertTimeToTimezone(
                              value.createdAt,
                              auth.getValue().user?.timezone,
                              timezone.getValue(),
                            )}
                          </Typography>
                          <Button
                            variant='outlined'
                            size='small'
                            startIcon={<Icon icon='mdi:download' />}
                            onClick={() => downloadAllFiles(value.files)}
                          >
                            Download all
                          </Button>
                        </Box>
                      </AccordionSummary>
                      <AccordionDetails sx={{ padding: '20px' }}>
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '20px',
                          }}
                        >
                          {value.files.length > 0 ? (
                            <Box
                              sx={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(2, 1fr)',
                                width: '100%',
                                gap: '20px',
                                mt: '20px',
                              }}
                            >
                              {value.files.map(file => {
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
                                        border:
                                          '1px solid rgba(76, 78, 100, 0.22)',
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
                                                file.fileName
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

                                          <Typography
                                            variant='caption'
                                            lineHeight={'14px'}
                                          >
                                            {formatFileSize(file.fileSize)}
                                          </Typography>
                                        </Box>
                                      </Box>
                                      <Box
                                        sx={{
                                          display: 'flex',
                                          alignItems: 'center',
                                        }}
                                      >
                                        <IconButton
                                          onClick={() => {
                                            downloadOneFile(file)
                                          }}
                                          sx={{ padding: 0 }}
                                        >
                                          <Icon icon='ic:sharp-download' />
                                        </IconButton>
                                      </Box>
                                    </Box>
                                  </Box>
                                )
                              })}
                            </Box>
                          ) : (
                            <Box
                              sx={{
                                mt: '20px',
                                padding: '20px',
                                background: '#F9F8F9',
                                borderRadius: '10px',
                              }}
                            >
                              <Typography variant='body2'>
                                No target files
                              </Typography>
                            </Box>
                          )}
                          <Box
                            sx={{
                              background: '#F7F7F9',
                              borderRadius: '10px',
                              padding: '20px',
                            }}
                          >
                            <Typography fontSize={14} fontWeight={400}>
                              {value.note ?? '-'}
                            </Typography>
                          </Box>
                        </Box>
                      </AccordionDetails>
                    </Accordion>
                    // <Card
                    //   key={uuidv4()}
                    //   sx={{
                    //     padding: '24px',
                    //     display: 'flex',
                    //     flexDirection: 'column',
                    //     gap: '20px',
                    //   }}
                    // >
                    //   <Box sx={{ display: 'flex', gap: '20px' }}>
                    //     <Box
                    //       sx={{
                    //         display: 'flex',
                    //         flexDirection: 'column',
                    //         gap: '3px',
                    //       }}
                    //     >
                    //       <Typography variant='body1' fontWeight={600} fontSize={14}>
                    //         {convertTimeToTimezone(
                    //           value.deliveredDate,
                    //           auth.getValue().user?.timezone,
                    //           timezone.getValue(),
                    //         )}
                    //       </Typography>
                    //     </Box>
                    //   </Box>
                    //   {value.files.length > 0 ? (
                    //     <Box
                    //       sx={{
                    //         display: 'flex',
                    //         flexDirection: 'column',
                    //         gap: '12px',
                    //       }}
                    //     >
                    //       <Box
                    //         sx={{
                    //           display: 'flex',
                    //           gap: '20px',
                    //           alignItems: 'center',
                    //         }}
                    //       >
                    //         <Typography variant='caption'>
                    //           {formatFileSize(getFileSize(value.files))}
                    //         </Typography>
                    //         <Button
                    //           variant='outlined'
                    //           size='small'
                    //           startIcon={<Icon icon='mdi:download' />}
                    //           onClick={() => downloadAllFiles(value.files)}
                    //         >
                    //           Download all
                    //         </Button>
                    //       </Box>
                    //       <Box
                    //         sx={{
                    //           display: 'grid',
                    //           gridTemplateColumns: 'repeat(3, 1fr)',
                    //           width: '100%',
                    //           gap: '20px',
                    //         }}
                    //       >
                    //         {value.files.map(file => (
                    //           <Box key={uuidv4()} sx={{ marginTop: '5px' }}>
                    //             <FileBox>
                    //               <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    //                 <Box sx={{ marginRight: '8px', display: 'flex' }}>
                    //                   <Icon
                    //                     icon='material-symbols:file-present-outline'
                    //                     style={{ color: 'rgba(76, 78, 100, 0.54)' }}
                    //                     fontSize={24}
                    //                   />
                    //                 </Box>
                    //                 <Box
                    //                   sx={{
                    //                     display: 'flex',
                    //                     flexDirection: 'column',
                    //                   }}
                    //                 >
                    //                   <Tooltip title={file.name}>
                    //                     <FileName variant='body1'>{file.name}</FileName>
                    //                   </Tooltip>

                    //                   <Typography variant='caption' lineHeight={'14px'}>
                    //                     {formatFileSize(file.size)}
                    //                   </Typography>
                    //                 </Box>
                    //               </Box>

                    //               <IconButton
                    //                 onClick={() => downloadOneFile(file)}
                    //                 // disabled={jobInfo.status === 'Declined'}
                    //                 // disabled={isFileUploading || !isUserInTeamMember}
                    //               >
                    //                 <Icon icon='mdi:download' fontSize={24} />
                    //               </IconButton>
                    //             </FileBox>
                    //           </Box>
                    //         ))}
                    //       </Box>
                    //     </Box>
                    //   ) : (
                    //     <Box
                    //       sx={{
                    //         padding: '20px',
                    //         background: '#F9F8F9',
                    //         borderRadius: '10px',
                    //       }}
                    //     >
                    //       <Typography variant='body2'>No target files</Typography>
                    //     </Box>
                    //   )}
                    //   <Divider />
                    //   <Box
                    //     sx={{
                    //       display: 'flex',
                    //       flexDirection: 'column',
                    //       gap: '10px',
                    //     }}
                    //   >
                    //     <Typography variant='body1' fontWeight={600}>
                    //       Notes to LPM
                    //     </Typography>
                    //     <Typography>{value.note ?? '-'}</Typography>
                    //   </Box>
                    // </Card>
                  )
                })}
              </Box>
            ) : null} */}
            {/* {savedFiles.length
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
                : '-'} */}
            {/* {files.length || importedFiles.length ? (
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
            ) : null} */}
          </Box>
        </Card>
        {/* {uploadFileProcessing ? null : Boolean(
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
        ) : null} */}
      </Grid>
      <Grid item xs={6}>
        <Card sx={{ padding: '20px' }}>
          <Box sx={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            {/* <img src='/images/icons/job-icons/feedback.png' alt='' /> */}
            <Typography fontSize={20} fontWeight={500}>
              Feedback
            </Typography>
          </Box>
          {project && project?.feedbacks && project.feedbacks.length > 0 ? (
            <>
              {project.feedbacks.length > 0 ? (
                <Box sx={{ mt: '20px' }}>
                  {project.feedbacks.map(value => (
                    <Box
                      key={uuidv4()}
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '20px',
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '10px',
                            width: '100%',
                          }}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                            }}
                          >
                            <CustomChip
                              label={'LPM'}
                              skin='light'
                              sx={{
                                background: `linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), #26C6F9`,
                                color: '#26C6F9',
                              }}
                              size='medium'
                            />
                            <Typography
                              variant='body1'
                              fontWeight={600}
                              fontSize={14}
                            >
                              {value.name}
                            </Typography>
                            <Divider
                              orientation='vertical'
                              flexItem
                              variant='middle'
                            />
                            <Typography variant='body2'>
                              {value.email}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: 'flex',
                              gap: '16px',
                              alignItems: 'center',
                            }}
                          >
                            <Typography
                              fontSize={12}
                              fontWeight={400}
                              color={'rgba(76, 78, 100, 0.60)'}
                            >
                              {convertTimeToTimezone(
                                value.createdAt,
                                auth.getValue().user?.timezone,
                                timezone.getValue(),
                              )}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography
                              variant='body1'
                              fontSize={14}
                              fontWeight={400}
                            >
                              {value.feedback ?? ''}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  ))}
                </Box>
              ) : null}
            </>
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
        {/* {currentRole && currentRole.name === 'CLIENT' ? (
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
        )} */}
      </Grid>
    </Grid>
  )
}

export default DeliveriesFeedback
