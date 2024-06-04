import { Icon } from '@iconify/react'
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Divider,
  FormHelperText,
  IconButton,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material'
import { FormErrors } from '@src/shared/const/formErrors'
import { timeZoneFormatter } from '@src/shared/helpers/timezone.helper'
import { timezoneSelector } from '@src/states/permission'

import {
  JobRequestReviewFormType,
  JobRequestReviewListType,
  JobRequestReviewParamsType,
} from '@src/types/orders/job-detail'
import { CountryType } from '@src/types/sign/personalInfoTypes'
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react'
import DatePickerWrapper from '@src/@core/styles/libs/react-datepicker'
import DatePicker, { ReactDatePickerProps } from 'react-datepicker'
import CustomInput from '@src/views/forms/form-elements/pickers/PickersCustomInput'
import { Controller, FieldErrors, useForm, Resolver } from 'react-hook-form'
import { useRecoilValueLoadable } from 'recoil'
import { v4 as uuidv4 } from 'uuid'
import dayjs from 'dayjs'
import { DropEvent, FileRejection, useDropzone } from 'react-dropzone'
import { FileType } from '@src/types/common/file.type'
import { FILE_SIZE } from '@src/shared/const/maximumFileSize'
import useModal from '@src/hooks/useModal'

import CustomModal from '@src/@core/components/common-modal/custom-modal'
import Image from 'next/image'

import { byteToGB, formatFileSize } from '@src/shared/helpers/file-size.helper'
import TargetDropzone from './target-dropzone'
import { yupResolver } from '@hookform/resolvers/yup'
import { requestReviewSchema } from '@src/types/schema/job-detail'
import { getUploadUrlforCommon, uploadFileToS3 } from '@src/apis/common.api'

import CustomModalV2 from '@src/@core/components/common-modal/custom-modal-v2'
import { useMutation, useQueryClient } from 'react-query'
import {
  createRequestReview,
  deleteRequestReviewFile,
  updateRequestReview,
} from '@src/apis/jobs/job-detail.api'
import { useGetMemberList } from '@src/queries/quotes.query'
import { extractFileExtension } from '@src/shared/transformer/file-extension.transformer'
import { displayCustomToast } from '@src/shared/utils/toast'
import OverlaySpinner from '@src/@core/components/spinner/overlay-spinner'
import { authState } from '@src/states/auth'
import { request } from 'http'
import {
  useGetSourceFile,
  useGetTargetFile,
} from '@src/queries/order/job.query'
import { set } from 'lodash'

type Props = {
  onClose: any

  // jobSourceFiles: FileType[]
  // jobTargetFiles: FileType[]
  type: 'edit' | 'create'
  jobId: number
  expanded: { [key: number]: boolean }
  setExpanded: Dispatch<
    SetStateAction<{
      [key: number]: boolean
    }>
  >
  requestInfo?: JobRequestReviewListType
}

const MAXIMUM_FILE_SIZE = FILE_SIZE.JOB_SOURCE_FILE

const RequestReviewModal = ({
  onClose,
  // jobSourceFiles,
  // jobTargetFiles,
  type,
  jobId,
  expanded,
  setExpanded,
  requestInfo,
}: Props) => {
  const queryClient = useQueryClient()
  const auth = useRecoilValueLoadable(authState)
  const { openModal, closeModal } = useModal()
  const theme = useTheme()
  const { direction } = theme
  const timezone = useRecoilValueLoadable(timezoneSelector)
  const [isSavingData, setIsSavingData] = useState<boolean>(false)

  const {
    data: jobSourceFiles,

    refetch: refetchSourceFiles,
  } = useGetSourceFile(jobId)

  const {
    data: jobTargetFiles,

    refetch: refetchTargetFiles,
  } = useGetTargetFile(jobId)

  const createRequestReviewMutation = useMutation(
    (params: JobRequestReviewParamsType) => createRequestReview(params),
    {
      onSuccess: data => {
        setIsSavingData(false)
        queryClient.invalidateQueries(['jobRequestReview'])
        onClose()
        setExpanded({ ...expanded, [data.id]: true })
        displayCustomToast(' Submitted successfully.', 'success')
        refetchSourceFiles()
        refetchTargetFiles()
      },
    },
  )

  const updateRequestReviewMutation = useMutation(
    (data: { params: JobRequestReviewParamsType; id: number }) =>
      updateRequestReview(data.params, data.id),
    {
      onSuccess: data => {
        setIsSavingData(false)
        queryClient.invalidateQueries(['jobRequestReview'])
        setExpanded({ ...expanded, [data.id]: true })
        displayCustomToast(' Saved successfully.', 'success')
        onClose()
        refetchSourceFiles()
        refetchTargetFiles()
      },
    },
  )

  const { data: members } = useGetMemberList()

  const {
    control,
    handleSubmit,
    getValues,
    setValue,
    setError,
    clearErrors,
    watch,
    reset,
    trigger,
    setFocus,
    formState: { errors, dirtyFields, isValid, isSubmitted, isDirty },
  } = useForm<JobRequestReviewFormType>({
    // defaultValues,
    mode: 'onSubmit',
    resolver: yupResolver(
      requestReviewSchema,
    ) as unknown as Resolver<JobRequestReviewFormType>,
  })

  const notes = watch('note')

  const [memberList, setMemberList] = useState<
    Array<{ value: number; label: string; jobTitle?: string }>
  >([])

  const [sourceFileSize, setSourceFileSize] = useState(0)
  const [targetFileSize, setTargetFileSize] = useState(0)

  const [sourceFiles, setSourceFiles] = useState<FileType[]>([])
  const [targetFiles, setTargetFiles] = useState<FileType[]>([])
  const [selectedSourceFiles, setSelectedSourceFiles] = useState<FileType[]>([])
  const [selectedTargetFiles, setSelectedTargetFiles] = useState<FileType[]>([])

  const [isSourceFileUpdate, setIsSourceFileUpdate] = useState(false)
  const [isTargetFileUpdate, setIsTargetFileUpdate] = useState(false)

  const [importSourceFileUpdate, setImportSourceFileUpdate] = useState(false)
  const [importTargetFileUpdate, setImportTargetFileUpdate] = useState(false)

  const [uploadedSourceFiles, setUploadedSourceFiles] = useState<File[]>([])
  const [uploadedTargetFiles, setUploadedTargetFiles] = useState<File[]>([])

  const [deleteFiles, setDeleteFiles] = useState<FileType[]>([])

  const popperPlacement: ReactDatePickerProps['popperPlacement'] =
    direction === 'ltr' ? 'bottom-start' : 'bottom-end'

  const dateValue = (date: Date) => {
    return dayjs(date).format('MM/DD/YYYY, hh:mm a')
  }

  const [timeZoneList, setTimeZoneList] = useState<
    {
      code: string
      label: string
      phone: string
    }[]
  >([])

  const saveData = (data: JobRequestReviewFormType) => {
    const asyncDeleteFile = deleteFiles.map(file => {
      console.log(file.id)

      if (file.id) {
        return deleteRequestReviewFile(file.id)
      }
    })
    Promise.all(asyncDeleteFile).then(res => {
      if (uploadedSourceFiles.length || uploadedTargetFiles.length) {
        // setIsSavingData(true)
        const fileInfo: {
          jobId: number
          files: Array<{
            id?: number
            name: string
            path: string
            extension: string
            size: number
            type: 'SAMPLE' | 'SOURCE' | 'TARGET' | 'REVIEWED'
            savedType: 'UPLOAD' | 'IMPORT'
          }>
        } = {
          jobId: jobId,
          files: [],
        }

        // const files = sourceFiles.concat(targetFiles)

        const savedSourceFiles = sourceFiles.filter(value => value.id)
        const uploadSourceFiles = sourceFiles.filter(value => !value.id)
        const savedTargetFiles = targetFiles.filter(value => value.id)
        const uploadTargetFiles = targetFiles.filter(value => !value.id)

        const sourcePaths: string[] = uploadSourceFiles.map(file => {
          return `project/${jobId}/review-request/source/${file.name}`
        })

        const targetPaths: string[] = uploadTargetFiles.map(file => {
          return `project/${jobId}/review-request/target/${file.name}`
        })

        savedSourceFiles.concat(savedTargetFiles).map(value => {
          fileInfo.files.push({
            id: value.id,
            name: value.name,
            path: value.path!,
            extension: value.extension!,
            size: value.size,
            type: value.type as 'SAMPLE' | 'SOURCE' | 'TARGET' | 'REVIEWED',
            savedType: 'UPLOAD',
          })
        })

        const s3SourceURL: Promise<{ type: 'SOURCE'; url: string }>[] =
          sourcePaths.map(value => {
            return getUploadUrlforCommon('job', value).then(res => {
              return { type: 'SOURCE', url: res }
            })
          })

        const s3TargetUrl: Promise<{ type: 'TARGET'; url: string }>[] =
          targetPaths.map(value => {
            return getUploadUrlforCommon('job', value).then(res => {
              return { type: 'TARGET', url: res }
            })
          })

        console.log(s3SourceURL)

        Promise.all([...s3SourceURL, ...s3TargetUrl]).then(res => {
          console.log(res)

          const sourceArr = res
            .filter(value => value.type === 'SOURCE')
            .map(
              (
                item: { type: 'SOURCE' | 'TARGET'; url: string },
                idx: number,
              ) => {
                console.log(item.url)

                const parts = item.url.split('/')
                const index = parts.indexOf('project')
                const result = parts.slice(index).join('/')

                console.log(result)

                fileInfo.files.push({
                  size: uploadSourceFiles[idx].size,
                  name: uploadSourceFiles[idx].name,
                  path: result,
                  extension:
                    uploadSourceFiles[idx].name
                      .split('.')
                      .pop()
                      ?.toLowerCase() ?? '',
                  type: 'SOURCE',
                  savedType: 'UPLOAD',
                })

                return uploadFileToS3(item.url, uploadedSourceFiles[idx])
              },
            )

          const targetArr = res
            .filter(value => value.type === 'TARGET')
            .map(
              (
                item: { type: 'SOURCE' | 'TARGET'; url: string },
                idx: number,
              ) => {
                const parts = item.url.split('/')
                const index = parts.indexOf('project')
                const result = parts.slice(index).join('/')

                fileInfo.files.push({
                  size: uploadTargetFiles[idx].size,
                  name: uploadTargetFiles[idx].name,
                  path: result,
                  extension:
                    uploadTargetFiles[idx].name
                      .split('.')
                      .pop()
                      ?.toLowerCase() ?? '',
                  type: 'TARGET',
                  savedType: 'UPLOAD',
                })

                return uploadFileToS3(item.url, uploadedTargetFiles[idx])
              },
            )

          Promise.all([sourceArr, targetArr]).then(res => {
            const result: JobRequestReviewParamsType = {
              jobId: jobId,
              assigneeId: data.assignee,
              dueDate: data.desiredDueAt,
              dueDateTimezone: data.desiredDueTimezone,
              runtime: data.runtime,
              wordCount: data.wordCount,
              noteToAssignee: data.note,
              reviewedFileGroup:
                type === 'create' ? [] : requestInfo?.reviewedFileGroup ?? [],
              files: [
                ...fileInfo.files,
                ...selectedSourceFiles
                  .filter(item => item.isSelected && !item.isImported)
                  .map(value => ({
                    name: value.name,
                    path: value.file!,
                    extension: value.name.split('.').pop()?.toLowerCase() ?? '',
                    size: value.size,
                    type: 'SOURCE' as
                      | 'SOURCE'
                      | 'TARGET'
                      | 'SAMPLE'
                      | 'REVIEWED',
                    jobFileId: value.jobFileId,
                    savedType: 'IMPORT' as 'UPLOAD' | 'IMPORT',
                  })),
                ...selectedTargetFiles
                  .filter(item => item.isSelected && !item.isImported)
                  .map(value => ({
                    name: value.name,
                    path: value.file!,
                    extension: value.name.split('.').pop()?.toLowerCase() ?? '',
                    size: value.size,
                    type: 'TARGET' as
                      | 'SOURCE'
                      | 'TARGET'
                      | 'SAMPLE'
                      | 'REVIEWED',
                    jobFileId: value.jobFileId,
                    savedType: 'IMPORT' as 'UPLOAD' | 'IMPORT',
                  })),
              ],
            }

            type === 'edit'
              ? updateRequestReviewMutation.mutate({
                  params: result,
                  id: requestInfo?.id!,
                })
              : createRequestReviewMutation.mutate(result)
          })
        })
      } else {
        const result: JobRequestReviewParamsType = {
          jobId: jobId,
          assigneeId: data.assignee,
          dueDate: data.desiredDueAt,
          dueDateTimezone: data.desiredDueTimezone,
          runtime: data.runtime,
          wordCount: data.wordCount,
          noteToAssignee: data.note,
          reviewedFileGroup:
            type === 'create' ? [] : requestInfo?.reviewedFileGroup ?? [],
          files: [
            ...sourceFiles.map(value => ({
              id: value.id,
              name: value.name,
              path: value.path!,
              extension: value.extension!,
              size: value.size,
              type: 'SOURCE' as 'SOURCE' | 'TARGET' | 'SAMPLE' | 'REVIEWED',
              savedType: 'UPLOAD' as 'UPLOAD' | 'IMPORT',
            })),
            ...targetFiles.map(value => ({
              id: value.id,
              name: value.name,
              path: value.path!,
              extension: value.extension!,
              size: value.size,
              type: 'TARGET' as 'SOURCE' | 'TARGET' | 'SAMPLE' | 'REVIEWED',
              savedType: 'UPLOAD' as 'UPLOAD' | 'IMPORT',
            })),
            ...selectedSourceFiles
              .filter(item => item.isSelected && !item.isImported)
              .map(value => ({
                name: value.name,
                path: value.file!,
                extension: value.name.split('.').pop()?.toLowerCase() ?? '',
                size: value.size,
                type: 'SOURCE' as 'SOURCE' | 'TARGET' | 'SAMPLE' | 'REVIEWED',
                jobFileId: value.jobFileId,
                savedType: 'IMPORT' as 'UPLOAD' | 'IMPORT',
              })),
            ...selectedTargetFiles
              .filter(item => item.isSelected && !item.isImported)
              .map(value => ({
                name: value.name,
                path: value.file!,
                extension: value.name.split('.').pop()?.toLowerCase() ?? '',
                size: value.size,
                type: 'TARGET' as 'SOURCE' | 'TARGET' | 'SAMPLE' | 'REVIEWED',
                jobFileId: value.jobFileId,
                savedType: 'IMPORT' as 'UPLOAD' | 'IMPORT',
              })),
          ],
        }

        type === 'edit'
          ? updateRequestReviewMutation.mutate({
              params: result,
              id: requestInfo?.id!,
            })
          : createRequestReviewMutation.mutate(result)
        // TODO :Mutation call (기본 정보 Save)
      }
    })
  }

  const onSubmit = (data: JobRequestReviewFormType) => {
    if (type === 'create') {
      saveData(data)
    } else {
      if (
        isDirty ||
        isSourceFileUpdate ||
        isTargetFileUpdate ||
        importSourceFileUpdate ||
        importTargetFileUpdate
      ) {
        openModal({
          type: 'ReviseRequestModal',
          children: (
            <CustomModalV2
              title='Revise request information'
              subtitle='Are you sure you want to revise the request information? '
              vary='error'
              rightButtonText='Revise'
              onClick={() => {
                closeModal('ReviseRequestModal')
                saveData(data)
              }}
              onClose={() => closeModal('ReviseRequestModal')}
            />
          ),
        })
      } else {
        onClose()
      }
    }
  }

  const onError = (errors: FieldErrors<JobRequestReviewFormType>) => {
    const firstName: keyof JobRequestReviewFormType = Object.keys(
      errors,
    )[0] as keyof JobRequestReviewFormType

    setFocus(firstName)
  }

  const handleRemoveFile = (file: FileType, type: 'source' | 'target') => {
    const uploadedFiles = type === 'source' ? sourceFiles : targetFiles
    const tempFiles =
      type === 'source' ? uploadedSourceFiles : uploadedTargetFiles

    file.id && setDeleteFiles([...deleteFiles, file])

    const filtered = uploadedFiles.filter((i: FileType) => i.name !== file.name)
    const tempFiltered = tempFiles.filter((i: File) => i.name !== file.name)

    type === 'source'
      ? setSourceFileSize(sourceFileSize - file.size)
      : setTargetFileSize(targetFileSize - file.size)

    type === 'source'
      ? setSourceFiles([...filtered])
      : setTargetFiles([...filtered])

    type === 'source'
      ? setUploadedSourceFiles([...tempFiltered])
      : setUploadedTargetFiles([...tempFiltered])

    type === 'source'
      ? setIsSourceFileUpdate(true)
      : setIsTargetFileUpdate(true)
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
        acceptedFiles.reduce((res, file) => (res += file.size), 0) +
        sourceFileSize
      if (totalFileSize > MAXIMUM_FILE_SIZE) {
        onFileUploadReject()
      } else {
        setUploadedSourceFiles(uploadedSourceFiles.concat(acceptedFiles))
      }

      const uniqueFiles = sourceFiles
        .concat(acceptedFiles)
        .reduce((acc: FileType[], file: FileType, index: number) => {
          let result = sourceFileSize

          acc.concat(file).forEach((file: FileType) => (result += file.size))
          setSourceFileSize(result)
          if (result > MAXIMUM_FILE_SIZE) {
            //  TODO : show exceed file size modal
            onFileUploadReject()
            return acc
          } else {
            const found = acc.find(f => f.name === file.name)

            if (!found)
              acc.push({
                uniqueId: uuidv4(),
                id: file.id ?? undefined,
                name: file.name,
                size: file.size,
                type: 'SOURCE',
                path: file.path,
                extension: file.extension,
                // index: index,
              })
            // console.log(acc)

            return acc
          }
        }, [])
      console.log(uniqueFiles)
      type === 'edit' && setIsSourceFileUpdate(true)
      setSourceFiles(uniqueFiles)
    },
  })

  useEffect(() => {
    console.log(deleteFiles)
  }, [deleteFiles])

  useEffect(() => {
    const timezoneList = timezone.getValue()
    const filteredTimezone = timezoneList.map(list => {
      return {
        code: list.timezoneCode,
        label: list.timezone,
        phone: '',
      }
    })
    setTimeZoneList(filteredTimezone)
  }, [timezone])

  useEffect(() => {
    if (members) {
      let init = [...members].sort((a, b) => a.label.localeCompare(b.label))
      init.unshift({ value: -1, label: 'Not specified', jobTitle: '' })
      setMemberList(init)
    }
  }, [members])

  useEffect(() => {
    if (jobSourceFiles && jobSourceFiles.length > 0) {
      const savedSourceFilesId =
        type === 'edit'
          ? requestInfo && requestInfo.files
            ? requestInfo.files
                .filter(value => value.type === 'SOURCE')
                .map(value => value.jobFileId)
            : []
          : []
      console.log(jobSourceFiles)

      setSelectedSourceFiles(
        jobSourceFiles.map(value => {
          return {
            name: value.name,
            size: value.size,
            type: value.type,
            file: value.file,
            isSelected: savedSourceFilesId.includes(value.id),
            isImported: savedSourceFilesId.includes(value.id),
            alreadyInReviewRequest: savedSourceFilesId.includes(value.id)
              ? false
              : value.alreadyInReviewRequest,

            jobFileId: value.id,
            id:
              requestInfo?.files.find(item => item.jobFileId === value.id)
                ?.id ?? undefined,
          }
        }),
      )
    }
  }, [jobSourceFiles, requestInfo])

  useEffect(() => {
    if (jobTargetFiles && jobTargetFiles.length > 0) {
      const savedTargetFilesId =
        type === 'edit'
          ? requestInfo && requestInfo.files
            ? requestInfo.files
                .filter(value => value.type === 'TARGET')
                .map(value => value.jobFileId)
            : []
          : []

      setSelectedTargetFiles(
        jobTargetFiles.map(value => ({
          name: value.name,
          size: value.size,
          type: value.type,
          file: value.file,
          isSelected: savedTargetFilesId.includes(value.id),
          isImported: savedTargetFilesId.includes(value.id),
          alreadyInReviewRequest: savedTargetFilesId.includes(value.id)
            ? false
            : value.alreadyInReviewRequest,

          jobFileId: value.id,
          id:
            requestInfo?.files.find(item => item.jobFileId === value.id)?.id ??
            undefined,
        })),
      )
    }
  }, [jobTargetFiles, requestInfo])

  useEffect(() => {
    if (type === 'edit' && requestInfo) {
      const sourceFileSize = requestInfo.files
        .filter(value => value.type === 'SOURCE')
        .reduce((acc, file) => acc + file.size, 0)
      setSourceFileSize(sourceFileSize)

      const targetFileSize = requestInfo.files
        .filter(value => value.type === 'TARGET')
        .reduce((acc, file) => acc + file.size, 0)
      setTargetFileSize(targetFileSize)

      setSourceFiles(
        requestInfo.files
          .filter(
            value => value.type === 'SOURCE' && value.savedType === 'UPLOAD',
          )
          .map(value => ({ ...value, uniqueId: uuidv4() })),
      )
      setTargetFiles(
        requestInfo.files
          .filter(
            value => value.type === 'TARGET' && value.savedType === 'UPLOAD',
          )
          .map(value => ({ ...value, uniqueId: uuidv4() })),
      )

      setValue('assignee', requestInfo.assigneeInfo.userId ?? -1, {
        shouldDirty: false,
      })
      setValue('desiredDueAt', new Date(requestInfo.dueDate), {
        shouldDirty: false,
      })
      setValue('desiredDueTimezone', requestInfo.dueDateTimezone, {
        shouldDirty: false,
      })
      setValue('runtime', requestInfo.runtime, { shouldDirty: false })
      setValue('wordCount', requestInfo.wordCount, { shouldDirty: false })
    } else if (type === 'create') {
      setValue('desiredDueTimezone', auth.getValue().user?.timezone!, {
        shouldDirty: false,
      })
    }
  }, [type, requestInfo])

  const renderedSourceFiles = useMemo(
    () =>
      sourceFiles.map((file: FileType, index: number) => {
        return (
          <Box key={index}>
            <Box
              sx={{
                display: 'flex',
                // marginBottom: '8px',
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

                  <Typography variant='caption' lineHeight={'14px'}>
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
                  }}
                  onClick={event => {
                    event.stopPropagation()
                    handleRemoveFile(file, 'source')
                  }}
                >
                  <Icon icon='mdi:close' fontSize={20} />
                </Box>
              </Box>
            </Box>
          </Box>
        )
      }),
    [sourceFiles],
  )

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
              {type === 'edit' ? 'Edit request info' : 'Request form'}
            </Typography>
            <IconButton
              onClick={() => {
                if (isDirty) {
                  openModal({
                    type: 'DiscardChangeModal',
                    children: (
                      <CustomModalV2
                        title='Discard changes'
                        subtitle='Are you sure you want to discard all changes?'
                        vary='error'
                        rightButtonText='Discard'
                        onClick={() => {
                          closeModal('DiscardChangeModal')
                          onClose()
                        }}
                        onClose={() => closeModal('DiscardChangeModal')}
                      />
                    ),
                  })
                } else {
                  onClose()
                }
              }}
            >
              <Icon icon='mdi:close'></Icon>
            </IconButton>
          </Box>
          <Divider sx={{ my: '0 !important' }} />
          <DatePickerWrapper
            sx={{
              width: '100%',
            }}
          >
            <form
              noValidate
              autoComplete='off'
              onSubmit={handleSubmit(onSubmit, onError)}
            >
              <Box
                sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                    maxHeight: 'calc(90vh - 168px)',
                    // border: '1px solid red',
                    overflowY: 'scroll',
                    padding: '20px',
                    '&::-webkit-scrollbar': { width: 4 },
                    '&::-webkit-scrollbar-thumb': {
                      borderRadius: 20,
                      background: '#CCCCCC',
                    },
                  }}
                >
                  <Box
                    className='filterFormAutoCompleteV2'
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        padding: '1px 12px !important',
                      },
                      width: '100%',
                    }}
                  >
                    <Typography fontSize={14} fontWeight={600} mb='8px'>
                      Assignee
                      <Typography component={'span'} color='#666CFF'>
                        *
                      </Typography>
                    </Typography>
                    <Controller
                      name='assignee'
                      control={control}
                      render={({
                        field: { value, onChange, ref },
                        formState: { isSubmitted, errors },
                      }) => (
                        <Autocomplete
                          // label='legalName_pronounce'
                          fullWidth
                          value={
                            memberList?.find(
                              option => option.value === value,
                            ) ?? null
                          }
                          onChange={(e, newValue) => onChange(newValue?.value)}
                          options={memberList || []}
                          renderInput={params => (
                            <TextField
                              {...params}
                              inputRef={ref}
                              autoComplete='off'
                              placeholder='Select'
                              error={isSubmitted && Boolean(errors.assignee)}
                              helperText={
                                isSubmitted && Boolean(errors.assignee)
                                  ? FormErrors.required
                                  : ''
                              }
                              inputProps={{
                                ...params.inputProps,
                              }}
                            />
                          )}
                        />
                      )}
                    />
                  </Box>
                  <Box sx={{ display: 'flex', gap: '20px' }}>
                    <Box
                      className='filterFormAutoCompleteV2'
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          padding: '1px 12px 1px 3px !important',
                        },
                        flex: 1,
                      }}
                    >
                      <Typography fontSize={14} fontWeight={600} mb='8px'>
                        Desired due date
                        <Typography component={'span'} color='#666CFF'>
                          *
                        </Typography>
                      </Typography>
                      <Controller
                        control={control}
                        name='desiredDueAt'
                        render={({
                          field: { onChange, value, ref },
                          formState: { errors, isSubmitted },
                        }) => (
                          <Box sx={{ width: '100%' }}>
                            <DatePicker
                              selected={value}
                              dateFormat='MM/dd/yyyy, hh:mm a'
                              showTimeSelect={true}
                              shouldCloseOnSelect={false}
                              id='date-range-picker-months'
                              onChange={onChange}
                              popperPlacement={popperPlacement}
                              placeholderText='MM/DD/YYYY, HH:MM'
                              customInput={
                                <Box>
                                  <CustomInput
                                    icon='calendar'
                                    sx={{ height: '46px' }}
                                    label='MM/DD/YYYY, HH:MM'
                                    noLabel={true}
                                    // placeholder='MM/DD/YYYY, HH:MM'
                                    error={
                                      Boolean(errors.desiredDueAt) &&
                                      isSubmitted
                                    }
                                    placeholder='MM/DD/YYYY, HH:MM'
                                    readOnly
                                    value={value ? dateValue(value) : ''}
                                    ref={ref}
                                  />
                                </Box>
                              }
                            />

                            {errors.desiredDueAt && (
                              <FormHelperText
                                sx={{ color: 'error.main', marginLeft: '14px' }}
                              >
                                {errors.desiredDueAt.message}
                              </FormHelperText>
                            )}
                          </Box>
                        )}
                      />
                    </Box>
                    <Box
                      className='filterFormAutoCompleteV2'
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          padding: '1px 12px !important',
                        },
                        flex: 1,
                      }}
                    >
                      <Typography fontSize={14} fontWeight={600} mb='8px'>
                        Timezone
                        <Typography component={'span'} color='#666CFF'>
                          *
                        </Typography>
                      </Typography>
                      <Controller
                        name='desiredDueTimezone'
                        control={control}
                        render={({
                          field: { onChange, value, ref },
                          formState: { isSubmitted, errors },
                        }) => {
                          return (
                            <Autocomplete
                              autoHighlight
                              fullWidth
                              value={
                                value ?? { code: '', label: '', phone: '' }
                              }
                              options={timeZoneList as CountryType[]}
                              onChange={(e, v) => onChange(v)}
                              disableClearable
                              // renderOption={(props, option) => (
                              //   <Box component='li' {...props} key={uuidv4()}>
                              //     {timeZoneFormatter(option, timezone.getValue())}
                              //   </Box>
                              // )}
                              renderInput={params => (
                                <TextField
                                  {...params}
                                  inputRef={ref}
                                  autoComplete='off'
                                  error={
                                    isSubmitted &&
                                    Boolean(errors.desiredDueTimezone)
                                  }
                                  helperText={
                                    isSubmitted &&
                                    Boolean(errors.desiredDueTimezone)
                                      ? FormErrors.required
                                      : ''
                                  }
                                />
                              )}
                              getOptionLabel={option =>
                                timeZoneFormatter(
                                  option,
                                  timezone.getValue(),
                                ) ?? ''
                              }
                            />
                          )
                        }}
                      />
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', gap: '20px' }}>
                    <Box
                      className='filterFormAutoCompleteV2'
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          padding: '1px 12px 1px 3px !important',
                        },
                        flex: 1,
                      }}
                    >
                      <Typography fontSize={14} fontWeight={600} mb='8px'>
                        Runtime
                        <Typography
                          component={'span'}
                          color='#666CFF'
                        ></Typography>
                      </Typography>
                      <Controller
                        control={control}
                        name='runtime'
                        render={({ field: { onChange, value } }) => (
                          <TextField
                            fullWidth
                            autoComplete='off'
                            value={value}
                            onChange={onChange}
                            inputProps={{
                              maxLength: 50,
                            }}
                          />
                        )}
                      />
                    </Box>
                    <Box
                      className='filterFormAutoCompleteV2'
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          padding: '1px 12px 1px 3px !important',
                        },
                        flex: 1,
                      }}
                    >
                      <Typography fontSize={14} fontWeight={600} mb='8px'>
                        Word count
                        <Typography
                          component={'span'}
                          color='#666CFF'
                        ></Typography>
                      </Typography>
                      <Controller
                        control={control}
                        name='wordCount'
                        render={({ field: { onChange, value } }) => (
                          <TextField
                            fullWidth
                            autoComplete='off'
                            value={value}
                            onChange={onChange}
                            inputProps={{
                              maxLength: 50,
                            }}
                          />
                        )}
                      />
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                    }}
                  >
                    <Box
                      sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                      <Typography fontSize={14} fontWeight={600}>
                        Upload source files
                      </Typography>
                      <Typography
                        fontSize={12}
                        color={
                          sourceFileSize > MAXIMUM_FILE_SIZE
                            ? '#FF4D49'
                            : 'rgba(76, 78, 100, 0.60)'
                        }
                        fontWeight={400}
                      >
                        {formatFileSize(sourceFileSize)}/{' '}
                        {byteToGB(MAXIMUM_FILE_SIZE)}
                      </Typography>
                      {sourceFileSize > MAXIMUM_FILE_SIZE && (
                        <Typography
                          fontSize={14}
                          fontWeight={600}
                          color='#FF4D49'
                        >
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
                          maxHeight: '325px',
                          overflowY: 'scroll',
                          '&::-webkit-scrollbar': { width: 4 },
                          '&::-webkit-scrollbar-thumb': {
                            borderRadius: 20,
                            background: '#CCCCCC',
                          },
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            gap: '8px',
                            alignItems: 'center',
                          }}
                        >
                          <Typography
                            fontSize={14}
                            fontWeight={400}
                            color='#8D8E9A'
                          >
                            Drag and drop or
                          </Typography>
                          <Button variant='outlined' size='small'>
                            <input {...getInputProps()} />
                            Browse file
                          </Button>
                        </Box>
                        {sourceFiles.length > 0 && (
                          <Box
                            sx={{
                              display: 'grid',
                              gridTemplateColumns: 'repeat(2, 1fr)',
                              mt: '20px',
                              width: '100%',
                              gap: '8px',
                            }}
                          >
                            {renderedSourceFiles}
                            {/* {sourceFiles.map(
                              (file: FileType, index: number) => {
                                return (
                                  <Box key={index}>
                                    <Box
                                      sx={{
                                        display: 'flex',
                                        // marginBottom: '8px',
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
                                          }}
                                          onClick={event => {
                                            event.stopPropagation()
                                            handleRemoveFile(file, 'source')
                                          }}
                                        >
                                          <Icon
                                            icon='mdi:close'
                                            fontSize={20}
                                          />
                                        </Box>
                                      </Box>
                                    </Box>
                                  </Box>
                                )
                              },
                            )} */}
                          </Box>
                        )}
                      </Box>
                    </div>
                    {selectedSourceFiles.length > 0 && (
                      <Box
                        sx={{
                          width: '100%',
                          border: '1px dashed #8D8E9A',
                          borderRadius: '10px',
                          padding: '12px 20px',
                          maxHeight: '325px',
                          overflowY: 'scroll',
                          '&::-webkit-scrollbar': { width: 4 },
                          '&::-webkit-scrollbar-thumb': {
                            borderRadius: 20,
                            background: '#CCCCCC',
                          },
                        }}
                      >
                        <Typography
                          fontSize={14}
                          fontWeight={400}
                          color='#8D8E9A'
                        >
                          or select source files
                        </Typography>
                        <Box
                          sx={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(2, 1fr)',
                            mt: '8px',
                            width: '100%',
                            // gap: '20px',
                            gap: '8px',
                          }}
                        >
                          {selectedSourceFiles.map(
                            (file: FileType, index: number) => {
                              return (
                                <Box key={uuidv4()}>
                                  <Box
                                    sx={{
                                      display: 'flex',
                                      // marginBottom: '8px',
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
                                      <Checkbox
                                        checked={file.isSelected}
                                        value={file.isSelected}
                                        disabled={file.alreadyInReviewRequest}
                                        onChange={event => {
                                          event.stopPropagation()
                                          file.isSelected = !file.isSelected

                                          type === 'edit' &&
                                            setImportSourceFileUpdate(true)

                                          if (file.isSelected) {
                                            deleteFiles.findIndex(
                                              value => value.id === file.id,
                                            ) !== -1 &&
                                              setDeleteFiles(
                                                deleteFiles.filter(
                                                  value => value.id !== file.id,
                                                ),
                                              )
                                          } else {
                                            setDeleteFiles([
                                              ...deleteFiles,
                                              file,
                                            ])
                                          }

                                          setSourceFileSize(prev => {
                                            return file.isSelected
                                              ? prev + file.size
                                              : prev - file.size
                                          })
                                          setSelectedSourceFiles(prevFiles =>
                                            prevFiles.map(f =>
                                              f.name === file.name ? file : f,
                                            ),
                                          )
                                        }}
                                      />

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
                                  </Box>
                                  {file.alreadyInReviewRequest ? (
                                    <Typography
                                      sx={{ textAlign: 'right' }}
                                      fontSize={12}
                                      fontStyle={'italic'}
                                      color='#666CFF'
                                    >
                                      Review requested
                                    </Typography>
                                  ) : null}
                                </Box>
                              )
                            },
                          )}
                        </Box>
                      </Box>
                    )}
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                    }}
                  >
                    <Box
                      sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                      <Typography fontSize={14} fontWeight={600}>
                        Upload target files
                      </Typography>
                      <Typography
                        fontSize={12}
                        color={
                          targetFileSize > MAXIMUM_FILE_SIZE
                            ? '#FF4D49'
                            : 'rgba(76, 78, 100, 0.60)'
                        }
                        fontWeight={400}
                      >
                        {formatFileSize(targetFileSize)}/{' '}
                        {byteToGB(MAXIMUM_FILE_SIZE)}
                      </Typography>
                      {targetFileSize > MAXIMUM_FILE_SIZE && (
                        <Typography
                          fontSize={14}
                          fontWeight={600}
                          color='#FF4D49'
                        >
                          Maximum size exceeded
                        </Typography>
                      )}
                    </Box>
                    <TargetDropzone
                      targetFileSize={targetFileSize}
                      targetFiles={targetFiles}
                      setTargetFileSize={setTargetFileSize}
                      setTargetFiles={setTargetFiles}
                      onFileUploadReject={onFileUploadReject}
                      handleRemoveFile={handleRemoveFile}
                      type={type}
                      setTargetFileUpdate={setIsTargetFileUpdate}
                      setUploadedTargetFiles={setUploadedTargetFiles}
                      uploadedTargetFiles={uploadedTargetFiles}
                    />
                    {selectedTargetFiles.length > 0 && (
                      <Box
                        sx={{
                          width: '100%',
                          border: '1px dashed #8D8E9A',
                          borderRadius: '10px',
                          padding: '12px 20px',
                          maxHeight: '325px',
                          overflowY: 'scroll',
                          '&::-webkit-scrollbar': { width: 4 },
                          '&::-webkit-scrollbar-thumb': {
                            borderRadius: 20,
                            background: '#CCCCCC',
                          },
                        }}
                      >
                        <Typography
                          fontSize={14}
                          fontWeight={400}
                          color='#8D8E9A'
                        >
                          or select target files
                        </Typography>
                        <Box
                          sx={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(2, 1fr)',
                            mt: '8px',
                            width: '100%',
                            gap: '8px',
                            // gap: '20px',
                          }}
                        >
                          {selectedTargetFiles.map(
                            (file: FileType, index: number) => {
                              return (
                                <Box key={uuidv4()}>
                                  <Box
                                    sx={{
                                      display: 'flex',
                                      // marginBottom: '8px',
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
                                      <Checkbox
                                        checked={file.isSelected}
                                        value={file.isSelected}
                                        disabled={file.alreadyInReviewRequest}
                                        onChange={event => {
                                          event.stopPropagation()
                                          file.isSelected = !file.isSelected
                                          setImportTargetFileUpdate(true)
                                          if (file.isSelected) {
                                            deleteFiles.findIndex(
                                              value => value.id === file.id,
                                            ) !== -1 &&
                                              setDeleteFiles(
                                                deleteFiles.filter(
                                                  value => value.id !== file.id,
                                                ),
                                              )
                                          } else {
                                            setDeleteFiles([
                                              ...deleteFiles,
                                              file,
                                            ])
                                          }
                                          setTargetFileSize(prev => {
                                            return file.isSelected
                                              ? prev + file.size
                                              : prev - file.size
                                          })

                                          setSelectedTargetFiles(prevFiles =>
                                            prevFiles.map(f =>
                                              f.name === file.name ? file : f,
                                            ),
                                          )
                                        }}
                                      />

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
                                  </Box>
                                  {file.alreadyInReviewRequest ? (
                                    <Typography
                                      sx={{ textAlign: 'right' }}
                                      fontSize={12}
                                      fontStyle={'italic'}
                                      color='#666CFF'
                                    >
                                      Review requested
                                    </Typography>
                                  ) : null}
                                </Box>
                              )
                            },
                          )}
                        </Box>
                      </Box>
                    )}
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                    }}
                  >
                    <Typography fontSize={14} fontWeight={600}>
                      Notes to assignee
                    </Typography>
                    <Controller
                      name='note'
                      control={control}
                      render={({ field: { value, onChange, onBlur } }) => (
                        <TextField
                          multiline
                          autoComplete='off'
                          fullWidth
                          rows={4}
                          value={value}
                          onChange={onChange}
                        />
                      )}
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
                      {notes?.length ?? 0}/500
                    </Box>
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    padding: '0 20px 20px 20px',
                  }}
                >
                  <Button
                    type='submit'
                    variant='contained'
                    disabled={
                      sourceFileSize > MAXIMUM_FILE_SIZE ||
                      targetFileSize > MAXIMUM_FILE_SIZE ||
                      isSavingData
                    }
                  >
                    {type === 'edit' ? 'Save changes' : 'Submit'}
                  </Button>
                </Box>
              </Box>
            </form>
          </DatePickerWrapper>
        </Box>
      </Box>
    </>
  )
}

export default RequestReviewModal
