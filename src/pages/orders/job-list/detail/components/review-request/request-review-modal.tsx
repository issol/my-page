import { Icon } from '@iconify/react'
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Divider,
  FormHelperText,
  IconButton,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material'
import { FormErrors } from '@src/shared/const/formErrors'
import { timeZoneFormatter } from '@src/shared/helpers/timezone.helper'
import { timezoneSelector } from '@src/states/permission'
import { CompanyOptionType } from '@src/types/options.type'
import {
  JobRequestReviewFormType,
  JobRequestReviewListType,
} from '@src/types/orders/job-detail'
import { CountryType } from '@src/types/sign/personalInfoTypes'
import { useEffect, useState } from 'react'
import DatePickerWrapper from '@src/@core/styles/libs/react-datepicker'
import DatePicker, { ReactDatePickerProps } from 'react-datepicker'
import CustomInput from '@src/views/forms/form-elements/pickers/PickersCustomInput'
import {
  Control,
  Controller,
  FieldErrors,
  UseFormHandleSubmit,
  UseFormWatch,
  UseFormSetFocus,
  useForm,
  Resolver,
} from 'react-hook-form'
import { useRecoilValueLoadable } from 'recoil'
import { v4 as uuidv4 } from 'uuid'
import dayjs from 'dayjs'
import { DropEvent, FileRejection, useDropzone } from 'react-dropzone'
import { FileType } from '@src/types/common/file.type'
import { FILE_SIZE } from '@src/shared/const/maximumFileSize'
import useModal from '@src/hooks/useModal'

import CustomModal from '@src/@core/components/common-modal/custom-modal'
import Image from 'next/image'
import { videoExtensions } from '@src/shared/const/upload-file-extention/file-extension'
import {
  byteToGB,
  byteToMB,
  formatFileSize,
} from '@src/shared/helpers/file-size.helper'
import TargetDropzone from './target-dropzone'
import { yupResolver } from '@hookform/resolvers/yup'
import { requestReviewSchema } from '@src/types/schema/job-detail'
import { getUploadUrlforCommon, uploadFileToS3 } from '@src/apis/common.api'
import toast from 'react-hot-toast'
import { s } from '@fullcalendar/core/internal-common'
import CustomModalV2 from '@src/@core/components/common-modal/custom-modal-v2'

type Props = {
  onClose: any
  // control: Control<JobRequestReviewFormType, any>
  // handleSubmit: UseFormHandleSubmit<JobRequestReviewFormType, undefined>
  lspList: CompanyOptionType[]
  jobSourceFiles: FileType[]
  jobTargetFiles: FileType[]
  type: 'edit' | 'create'
  jobId: number
  requestInfo?: JobRequestReviewListType
  // watch: UseFormWatch<JobRequestReviewFormType>
  // errors: FieldErrors<JobRequestReviewFormType>
  // setFocus: UseFormSetFocus<JobRequestReviewFormType>
}

const MAXIMUM_FILE_SIZE = FILE_SIZE.JOB_SOURCE_FILE

const RequestReviewModal = ({
  onClose,
  // control,
  // handleSubmit,
  lspList,
  jobSourceFiles,
  jobTargetFiles,
  type,
  jobId,
  requestInfo,
  // watch,
  // errors,
  // setFocus,
}: Props) => {
  const { openModal, closeModal } = useModal()
  const theme = useTheme()
  const { direction } = theme
  const timezone = useRecoilValueLoadable(timezoneSelector)

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

  const [sourceFileSize, setSourceFileSize] = useState(0)
  const [targetFileSize, setTargetFileSize] = useState(0)

  const [sourceFiles, setSourceFiles] = useState<FileType[]>([])
  const [targetFiles, setTargetFiles] = useState<FileType[]>([])
  const [selectedSourceFiles, setSelectedSourceFiles] = useState<FileType[]>([])
  const [selectedTargetFiles, setSelectedTargetFiles] = useState<FileType[]>([])

  const popperPlacement: ReactDatePickerProps['popperPlacement'] =
    direction === 'ltr' ? 'bottom-start' : 'bottom-end'

  const dateValue = (date: Date) => {
    return dayjs(date).format('MM/DD/YYYY, hh:mm a')
  }

  const [lspListOptions, setLspListOptions] = useState<
    {
      label: string
      value: string
    }[]
  >([])

  const [timeZoneList, setTimeZoneList] = useState<
    {
      code: string
      label: string
      phone: string
    }[]
  >([])

  const saveData = (data: JobRequestReviewFormType) => {
    if (sourceFiles.length || targetFiles.length) {
      // setIsLoading(true)
      const fileInfo: {
        jobId: number
        files: Array<{
          jobId: number
          size: number
          name: string
          type: 'SAMPLE' | 'SOURCE' | 'TARGET' | 'REVIEWED'
        }>
      } = {
        jobId: jobId,
        files: [],
      }

      const files = sourceFiles.concat(targetFiles)

      const paths: string[] = files.map(file => {
        return `project/${jobId}/${file.type === 'SOURCE' ? 'source' : 'target'}/${file.name}`
      })

      const s3URL = paths.map(value => {
        return getUploadUrlforCommon('job', value).then(res => {
          return res.url
        })
      })

      Promise.all(s3URL).then(res => {
        const promiseArr = res.map((url: string, idx: number) => {
          fileInfo.files.push({
            jobId: jobId,
            size: files[idx].size,
            name: files[idx].name,
            type:
              (files[idx].type as
                | 'SOURCE'
                | 'TARGET'
                | 'SAMPLE'
                | 'REVIEWED') ?? 'SOURCE',
            // downloadAvailable: files[idx].downloadAvailable ?? false,
          })
          return uploadFileToS3(url, files[idx])
        })
        Promise.all(promiseArr)
          .then(res => {
            //TODO : Mutation call (파일 정보 Save)
            // uploadFileMutation.mutate(fileInfo)
            // TODO :Mutation call (기본 정보 Save)
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
    } else if (sourceFiles.length || targetFiles.length) {
      // TODO : Mutation call (Import 파일 정보 Save)
    } else {
      // TODO :Mutation call (기본 정보 Save)
    }
  }

  const onSubmit = (data: JobRequestReviewFormType) => {
    if (type === 'create') {
      saveData(data)
    } else {
      if (isDirty) {
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
    const filtered = uploadedFiles.filter((i: FileType) => i.name !== file.name)
    type === 'source'
      ? setSourceFileSize(sourceFileSize - file.size)
      : setTargetFileSize(targetFileSize - file.size)

    type === 'source'
      ? setSourceFiles([...filtered])
      : setTargetFiles([...filtered])
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
    // accept: {
    //   ...srtUploadFileExtension.accept,
    // },

    noDragEventsBubbling: true,

    onDrop: (
      acceptedFiles: File[],
      fileRejections: FileRejection[],
      event: DropEvent,
    ) => {
      console.log(event)

      const uniqueFiles = sourceFiles
        .concat(acceptedFiles)
        .reduce((acc: FileType[], file: FileType) => {
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

      setSourceFiles(uniqueFiles)
    },
  })

  useEffect(() => {
    const res = lspList.map(lsp => ({
      label: lsp.name,
      value: lsp.id,
    }))
    const result = [{ label: 'Not specified', value: 'Not specified' }, ...res]
    setLspListOptions(result)
  }, [lspList])

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
    if (jobSourceFiles.length > 0) {
      const source = jobSourceFiles.filter(value => value.type === 'SOURCE')
      setSelectedSourceFiles(
        source.map(value => ({
          name: value.name,
          size: value.size,
          type: value.type,
          file: value.file,
          isSelected: false,
          isRequested: value.isRequested,
        })),
      )
    }
  }, [jobSourceFiles])

  useEffect(() => {
    if (jobTargetFiles.length > 0) {
      const target = jobTargetFiles.filter(value => value.type === 'SOURCE')
      setSelectedTargetFiles(
        target.map(value => ({
          name: value.name,
          size: value.size,
          type: value.type,
          file: value.file,
          isSelected: false,
          isRequested: value.isRequested,
        })),
      )
    }
  }, [jobTargetFiles])

  useEffect(() => {
    if (type === 'edit' && requestInfo) {
      setValue('assignee', requestInfo.assignee, { shouldDirty: false })
      setValue('desiredDueAt', new Date(requestInfo.desiredDueAt), {
        shouldDirty: false,
      })
      setValue('desiredDueTimezone', requestInfo.desiredDueTimezone, {
        shouldDirty: false,
      })
      setValue('runtime', requestInfo.runtime, { shouldDirty: false })
      setValue('wordCount', requestInfo.wordCount, { shouldDirty: false })
    }
  }, [type, requestInfo])

  return (
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
              console.log(isDirty)
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
              // onClose()
            }}
          >
            <Icon icon='mdi:close'></Icon>
          </IconButton>
        </Box>
        <Divider sx={{ my: '0 !important' }} />
        <DatePickerWrapper
          sx={{
            width: '100%',
            // padding: '20px',
          }}
        >
          <form
            noValidate
            autoComplete='off'
            onSubmit={handleSubmit(onSubmit, onError)}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
                        value={lspListOptions.find(
                          option => option.value === value,
                        )}
                        onChange={(e, newValue) => onChange(newValue?.value)}
                        options={lspListOptions}
                        renderInput={params => (
                          <TextField
                            {...params}
                            inputRef={ref}
                            autoComplete='off'
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
                            customInput={
                              <Box>
                                <CustomInput
                                  icon='calendar'
                                  sx={{ height: '46px' }}
                                  placeholder='MM/DD/YYYY, HH:MM'
                                  error={
                                    Boolean(errors.desiredDueAt) && isSubmitted
                                  }
                                  // placeholder='MM/DD/YYYY - MM/DD/YYYY'
                                  // readOnly
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
                      }) => (
                        <Autocomplete
                          autoHighlight
                          fullWidth
                          value={value}
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
                              inputProps={{
                                ...params.inputProps,
                              }}
                            />
                          )}
                          getOptionLabel={option =>
                            timeZoneFormatter(option, timezone.getValue()) ?? ''
                          }
                        />
                      )}
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
                  sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
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
                            gap: '20px',
                          }}
                        >
                          {sourceFiles.map((file: FileType, index: number) => {
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
                          })}
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
                          gap: '20px',
                        }}
                      >
                        {selectedSourceFiles.map(
                          (file: FileType, index: number) => {
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
                                    <Checkbox
                                      checked={file.isSelected}
                                      value={file.isSelected}
                                      disabled={file.isRequested}
                                      onChange={event => {
                                        event.stopPropagation()
                                        file.isSelected = !file.isSelected
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
                                </Box>
                                {file.isRequested ? (
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
                  sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
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
                        or select source files
                      </Typography>
                      <Box
                        sx={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(2, 1fr)',
                          mt: '8px',
                          width: '100%',
                          gap: '20px',
                        }}
                      >
                        {selectedTargetFiles.map(
                          (file: FileType, index: number) => {
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
                                    <Checkbox
                                      checked={file.isSelected}
                                      value={file.isSelected}
                                      disabled={file.isRequested}
                                      onChange={event => {
                                        event.stopPropagation()
                                        file.isSelected = !file.isSelected
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
                                </Box>
                                {file.isRequested ? (
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
                <Button type='submit' variant='contained'>
                  {type === 'edit' ? 'Save changes' : 'Submit'}
                </Button>
              </Box>
            </Box>
          </form>
        </DatePickerWrapper>
      </Box>
    </Box>
  )
}

export default RequestReviewModal
