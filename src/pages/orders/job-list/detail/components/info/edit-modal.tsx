import { yupResolver } from '@hookform/resolvers/yup'
import { Icon } from '@iconify/react'
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Divider,
  FormHelperText,
  Grid,
  IconButton,
  TextField,
  Typography,
  useTheme,
} from '@mui/material'
import DatePickerWrapper from '@src/@core/styles/libs/react-datepicker'
import { ItemType, JobItemType, JobType } from '@src/types/common/item.type'
import {
  AddJobInfoFormType,
  SaveJobInfoParamsType,
} from '@src/types/orders/job-detail'
import { addJobInfoFormSchema } from '@src/types/schema/job-detail'
import { Controller, Resolver, useForm } from 'react-hook-form'
import DatePicker, { ReactDatePickerProps } from 'react-datepicker'
import CustomInput from '@src/views/forms/form-elements/pickers/PickersCustomInput'
import dayjs from 'dayjs'
import { timeZoneFormatter } from '@src/shared/helpers/timezone.helper'
import { useRecoilValueLoadable } from 'recoil'
import { timezoneSelector } from '@src/states/permission'
import { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { CountryType } from '@src/types/sign/personalInfoTypes'
import {
  LanguagePairTypeInItem,
  ProjectInfoType,
} from '@src/types/orders/order-detail'
import languageHelper from '@src/shared/helpers/language.helper'
import { FormErrors } from '@src/shared/const/formErrors'
import { UseMutationResult, useMutation, useQueryClient } from 'react-query'
import {
  deleteJobFile,
  saveJobInfo,
  uploadFile,
} from '@src/apis/jobs/job-detail.api'
import useModal from '@src/hooks/useModal'
import CustomModalV2 from '@src/@core/components/common-modal/custom-modal-v2'
import { FILE_SIZE } from '@src/shared/const/maximumFileSize'
import { FileType } from '@src/types/common/file.type'
import { useDropzone } from 'react-dropzone'
import { srtUploadFileExtension } from '@src/shared/const/upload-file-extention/file-extension'
import AlertModal from '@src/@core/components/common-modal/alert-modal'
import FileItem from '@src/@core/components/fileItem'
import { getUploadUrlforCommon, uploadFileToS3 } from '@src/apis/common.api'
import toast from 'react-hot-toast'
import { byteToGB, formatFileSize } from '@src/shared/helpers/file-size.helper'
import CustomModal from '@src/@core/components/common-modal/custom-modal'
import OverlaySpinner from '@src/@core/components/spinner/overlay-spinner'

type Props = {
  onClose: () => void
  statusList: {
    value: number
    label: string
  }[]
  jobInfo: JobType
  contactPersonList: {
    value: string
    label: string
    userId: any
  }[]
  items: JobItemType | undefined
  languagePair: LanguagePairTypeInItem[]
  saveJobInfoMutation: UseMutationResult<
    {
      id: number
    },
    unknown,
    {
      jobId: number
      data: SaveJobInfoParamsType
    },
    unknown
  >
}

const InfoEditModal = ({
  onClose,
  statusList,
  jobInfo,
  contactPersonList,
  items,
  languagePair,
  saveJobInfoMutation,
}: Props) => {
  const queryClient = useQueryClient()
  const { openModal, closeModal } = useModal()
  const theme = useTheme()
  const { direction } = theme
  const setValueOptions = { shouldDirty: true, shouldValidate: true }

  const [timeZoneList, setTimeZoneList] = useState<
    {
      code: string
      label: string
      phone: string
    }[]
  >([])

  const MAXIMUM_FILE_SIZE = FILE_SIZE.JOB_SAMPLE_FILE

  const [fileSize, setFileSize] = useState<number>(0)
  const [files, setFiles] = useState<File[]>([])
  const [isFileUploading, setIsFileUploading] = useState<boolean>(false)
  const [uploadedFiles, setUploadedFiles] = useState<FileType[]>([])
  const [deletedFiles, setDeletedFiles] = useState<FileType[]>([])

  const popperPlacement: ReactDatePickerProps['popperPlacement'] =
    direction === 'ltr' ? 'bottom-start' : 'bottom-end'

  const dateValue = (date: Date) => {
    return dayjs(date).format('MM/DD/YYYY, hh:mm a')
  }

  const timezone = useRecoilValueLoadable(timezoneSelector)

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
          setFileSize(result)
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

  const handleRemoveFile = (file: FileType) => {
    const uploadedFiles = files
    const filtered = uploadedFiles.filter((i: FileType) => i.name !== file.name)
    setFiles([...filtered])
    setFileSize(prev => prev - file.size)
  }

  const handleRemoveUploadedFile = (file: FileType) => {
    const removeFile = uploadedFiles
    const filtered = removeFile.filter((i: FileType) => i.name !== file.name)
    setUploadedFiles([...filtered])
    setDeletedFiles([...deletedFiles, file])
    setFileSize(prev => prev - file.size)
  }

  const uploadedFileList = (file: FileType[], type: string) => {
    return file.map((file: FileType) => {
      if (file.type === type) {
        return (
          <Box key={uuidv4()}>
            <FileItem
              key={file.name}
              file={file}
              onClear={handleRemoveUploadedFile}
            />
          </Box>
        )
      }
    })
  }

  const fileList = files.map((file: FileType, index: number) => {
    return (
      <Box key={uuidv4()}>
        <FileItem key={file.name} file={file} onClear={handleRemoveFile} />
      </Box>
    )
  })

  const uploadFileMutation = useMutation(
    (file: {
      jobId: number
      files: Array<{
        jobId: number
        size: number
        name: string
        type: 'SAMPLE' | 'SOURCE' | 'TARGET'
      }>
    }) => uploadFile(file),
    {
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries(['jobInfo', variables.jobId, false])
        queryClient.invalidateQueries(['jobPrices', variables.jobId, false])
        queryClient.invalidateQueries(['jobAssignProRequests', variables.jobId])
        // refetch()
      },
    },
  )

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setError,
    trigger,
    getValues,
    setValue,

    formState: { errors, dirtyFields, isValid, isSubmitted, isDirty },
  } = useForm<AddJobInfoFormType>({
    mode: 'onSubmit',

    resolver: yupResolver(addJobInfoFormSchema) as Resolver<AddJobInfoFormType>,
  })

  const description = watch('description')

  const onClickCancel = () => {
    if (!isDirty) {
      onClose()
    } else {
      openModal({
        type: 'CancelEditModal',
        children: (
          <CustomModalV2
            title='Discard changes?'
            subtitle='Are you sure you want to discard all changes?'
            rightButtonText='Discard'
            onClick={() => {
              closeModal('CancelEditModal')
              onClose()
            }}
            onClose={() => closeModal('InfoEditModal')}
            vary='error-alert'
          />
        ),
      })
    }
  }

  const handleSave = () => {
    const data = getValues()

    const asyncDeleteFile = deletedFiles.map(file => {
      if (file.id) {
        return deleteJobFile(file.id)
      }
    })
    Promise.all(asyncDeleteFile).then(res => {
      // step2) 업로드+패치 or 패치
      if (files.length) {
        setIsFileUploading(true)
        // const fileInfo: Array<{
        //   jobId: number
        //   size: number
        //   name: string
        //   type: 'SAMPLE' | 'SOURCE' | 'TARGET'
        // }> = []
        const fileInfo: {
          jobId: number
          files: Array<{
            jobId: number
            size: number
            name: string
            type: 'SAMPLE' | 'SOURCE' | 'TARGET'
          }>
        } = {
          jobId: jobInfo.id,
          files: [],
        }
        const paths: string[] = files.map(file => {
          return `project/${jobInfo.id}/sample/${file.name}`
        })
        const s3URL = paths.map(value => {
          return getUploadUrlforCommon('job', value).then(res => {
            return res.url
          })
        })
        Promise.all(s3URL).then(res => {
          const promiseArr = res.map((url: string, idx: number) => {
            fileInfo.files.push({
              jobId: jobInfo.id,
              size: files[idx].size,
              name: files[idx].name,
              type: 'SAMPLE',
            })
            return uploadFileToS3(url, files[idx])
          })
          Promise.all(promiseArr)
            .then(res => {
              setIsFileUploading(false)
              uploadFileMutation.mutate(fileInfo)
              const jobResult: SaveJobInfoParamsType = {
                contactPersonId: data.contactPerson.userId,
                description: data.description ?? null,
                startDate: data.startedAt ? data.startedAt.toString() : null,
                startTimezone: data.startTimezone ?? null,

                dueDate: data.dueAt.toString(),
                dueTimezone: data.dueTimezone,
                status: data.status,
                sourceLanguage: data.source !== ' ' ? data.source : null,
                targetLanguage: data.target !== ' ' ? data.target : null,
                name: data.name,
                isShowDescription: data.isShowDescription,
              }

              saveJobInfoMutation.mutate(
                { jobId: jobInfo.id, data: jobResult },
                {
                  onSuccess: () => {
                    onClose()
                  },
                },
              )

              // res.map((value, idx) => {
              //   uploadFileMutation.mutate(fileInfo[idx])

              // })
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
        })
      } else {
        const jobResult: SaveJobInfoParamsType = {
          contactPersonId: data.contactPerson.userId,
          description: data.description ?? null,
          startDate: data.startedAt ? data.startedAt.toString() : null,
          startTimezone: data.startTimezone ?? null,

          dueDate: data.dueAt.toString(),
          dueTimezone: data.dueTimezone,
          status: data.status,
          sourceLanguage: data.source !== ' ' ? data.source : null,
          targetLanguage: data.target !== ' ' ? data.target : null,
          name: data.name,
          isShowDescription: data.isShowDescription,
        }
        saveJobInfoMutation.mutate(
          { jobId: jobInfo.id, data: jobResult },
          {
            onSuccess: () => {
              onClose()
            },
          },
        )
      }
    })
  }

  const onSubmit = () => {
    if (!isDirty && deletedFiles.length === 0 && files.length === 0) {
      onClose()
    } else {
      openModal({
        type: 'SaveInfoModal',
        children: (
          <CustomModalV2
            title='Save changes?'
            subtitle='Are you sure you want to save all changes?'
            rightButtonText='Save'
            vary='successful'
            onClose={() => closeModal('SaveInfoModal')}
            onClick={() => {
              closeModal('SaveInfoModal')
              handleSave()
            }}
          />
        ),
      })
    }
  }

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

  console.log(getValues(), 'getValues')

  useEffect(() => {
    console.log(items, 'getValues')

    if (contactPersonList.length > 0 && items) {
      setValue('name', jobInfo.name ?? '')
      setValue('description', jobInfo.description ?? '')
      setValue('status', jobInfo.status)
      setValue(
        'source',
        jobInfo.name ? jobInfo.sourceLanguage : items.sourceLanguage,
      )
      setValue(
        'target',
        jobInfo.name ? jobInfo.targetLanguage : items.targetLanguage,
      )

      // trigger('source')
      // trigger('target')

      setValue('serviceType', jobInfo.serviceType)

      setValue('isShowDescription', jobInfo.isShowDescription)

      setValue(
        'contactPerson',
        jobInfo.contactPerson &&
          contactPersonList.find(
            value => value.userId === jobInfo.contactPerson?.userId,
          )
          ? {
              value: contactPersonList.find(
                value => value.userId === jobInfo.contactPerson?.userId,
              )?.value!,
              label: contactPersonList.find(
                value => value.userId === jobInfo.contactPerson?.userId,
              )?.label!,
              userId: jobInfo.contactPerson.userId ?? null,
            }
          : {
              value: contactPersonList.find(
                value => value.userId === items.contactPersonId,
              )?.value!,
              label: contactPersonList.find(
                value => value.userId === items.contactPersonId,
              )?.label!,
              userId: items.contactPersonId ?? null,
            },
      )

      jobInfo.startedAt && setValue('startedAt', new Date(jobInfo.startedAt))

      jobInfo.startTimezone &&
        setValue('startTimezone', jobInfo.startTimezone ?? null)
      jobInfo.dueAt && setValue('dueAt', new Date(jobInfo.dueAt))
      console.log(jobInfo.dueTimezone, 'getValues')

      jobInfo.dueTimezone &&
        setValue('dueTimezone', jobInfo.dueTimezone ?? null)

      setUploadedFiles(jobInfo.files ?? [])
      const uploadedFileSize = jobInfo.files?.reduce((acc, file) => {
        return acc + file.size
      }, 0)
      setFileSize(uploadedFileSize ?? 0)
    }
  }, [jobInfo, items, contactPersonList])

  return (
    <Box
      sx={{
        maxWidth: '702px',
        width: '100%',

        maxHeight: '85vh',
        background: '#ffffff',
        boxShadow: '0px 0px 20px rgba(76, 78, 100, 0.4)',
        borderRadius: '10px',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid #E5E4E4',
          padding: '32px 20px',
        }}
      >
        <Typography fontSize={20} fontWeight={500}>
          Edit job info
        </Typography>
        <IconButton
          sx={{ padding: 0, height: 'fit-content' }}
          onClick={onClose}
        >
          <Icon icon='mdi:close'></Icon>
        </IconButton>
      </Box>

      <DatePickerWrapper
        sx={{
          width: '100%',
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={6} sx={{ padding: '32px 20px 20px 20px' }}>
            <Grid item xs={12}>
              <Box className='filterFormControl'>
                <Controller
                  name='name'
                  control={control}
                  render={({
                    field: { value, onChange, onBlur },
                    formState,
                  }) => {
                    const showError = formState.isSubmitted
                    return (
                      <TextField
                        fullWidth
                        autoComplete='off'
                        value={value || ''}
                        onBlur={onBlur}
                        label='Job name*'
                        sx={{ height: '46px' }}
                        inputProps={{
                          style: {
                            height: '46px',
                            padding: '0 14px',
                          },
                        }}
                        onChange={e => {
                          const { value } = e.target
                          if (value === '') {
                            onChange('')
                          } else {
                            const filteredValue = value.slice(0, 100)
                            e.target.value = filteredValue
                            onChange(e.target.value)
                          }
                        }}
                        error={showError && Boolean(errors.name)}
                        helperText={
                          showError &&
                          Boolean(errors.name) &&
                          FormErrors.required
                        }
                      />
                    )
                  }}
                />
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box className='filterFormControl'>
                <TextField
                  disabled
                  autoComplete='off'
                  id='status'
                  label='Status*'
                  fullWidth
                  sx={{ height: '46px' }}
                  inputProps={{
                    style: {
                      height: '46px',
                      padding: '0 14px',
                    },
                  }}
                  defaultValue={
                    statusList?.find(list => list.value === jobInfo.status)
                      ?.label!
                  }
                />
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box className='filterFormSoloAutoComplete'>
                <Controller
                  control={control}
                  name='contactPerson'
                  render={({ field: { onChange, value }, formState }) => {
                    const showError = formState.isSubmitted
                    return (
                      <Autocomplete
                        fullWidth
                        onChange={(event, item) => {
                          if (item) {
                            onChange(item)
                          } else {
                            onChange(null)
                          }
                        }}
                        value={value || null}
                        options={contactPersonList}
                        id='contactPerson'
                        getOptionLabel={option => option.label || ''}
                        renderInput={params => (
                          <TextField
                            {...params}
                            autoComplete='off'
                            label='Contact person for job*'
                            error={showError && Boolean(errors.contactPerson)}
                            helperText={
                              showError &&
                              Boolean(errors.contactPerson) &&
                              FormErrors.required
                            }
                          />
                        )}
                      />
                    )
                  }}
                />
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box className='filterFormControl'>
                <TextField
                  disabled
                  autoComplete='off'
                  id='serviceType'
                  label='Service type*'
                  fullWidth
                  sx={{ height: '46px' }}
                  inputProps={{
                    style: {
                      height: '46px',
                      padding: '0 14px',
                    },
                  }}
                  defaultValue={jobInfo.serviceType}
                />
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box className='filterFormSoloAutoComplete'>
                {getValues('source') !== undefined &&
                  getValues('target') !== undefined && (
                    <Controller
                      control={control}
                      name='source'
                      render={({ field: { onChange, value }, formState }) => {
                        const showError = formState.isSubmitted
                        return (
                          <Autocomplete
                            fullWidth
                            disabled={Boolean(jobInfo.pro)}
                            // isOptionEqualToValue={(option, newValue) => {
                            //   return option.source === newValue.source
                            // }}
                            onChange={(event, item) => {
                              if (item) {
                                setValue(
                                  'source',
                                  item?.source,
                                  setValueOptions,
                                )
                                setValue(
                                  'target',
                                  item?.target,
                                  setValueOptions,
                                )
                                trigger('source')
                                trigger('target')
                              } else {
                                setValue('source', null, setValueOptions)
                                setValue('target', null, setValueOptions)
                                trigger('source')
                                trigger('target')
                              }
                              // onChange(item)
                            }}
                            value={
                              value === null
                                ? null
                                : [
                                    {
                                      source: ' ',
                                      target: ' ',
                                    },
                                    ...languagePair.map(data => ({
                                      source: data.source,
                                      target: data.target,
                                    })),
                                  ].find(
                                    item =>
                                      item.source === value &&
                                      item.target === getValues(`target`),
                                  )
                            }
                            defaultValue={{
                              source: getValues('source'),
                              target: getValues('target'),
                            }}
                            options={[
                              {
                                source: ' ',
                                target: ' ',
                              },
                              ...languagePair
                                .map(value => ({
                                  source: value.source,
                                  target: value.target,
                                }))
                                .sort((a, b) =>
                                  a.source.localeCompare(b.source),
                                ),
                            ]}
                            getOptionLabel={option => {
                              if (
                                option.source === ' ' &&
                                option.target === ' '
                              ) {
                                return 'Language-independent'
                              } else {
                                return `${languageHelper(
                                  option.source,
                                )} → ${languageHelper(option.target)}`
                              }
                            }}
                            id='languagePair'
                            renderInput={params => (
                              <TextField
                                {...params}
                                autoComplete='off'
                                label='Language pair*'
                                error={showError && Boolean(errors.source)}
                                helperText={
                                  showError &&
                                  Boolean(errors.source) &&
                                  FormErrors.required
                                }
                              />
                            )}
                          />
                        )
                      }}
                    />
                  )}
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box className='filterFormControl'>
                <Controller
                  control={control}
                  name='startedAt'
                  render={({ field: { onChange, value } }) => (
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
                              label='Job start date'
                              icon='calendar'
                              sx={{ height: '46px' }}
                              placeholder='MM/DD/YYYY, HH:MM'
                              // placeholder='MM/DD/YYYY - MM/DD/YYYY'
                              readOnly
                              value={value ? dateValue(value) : ''}
                            />
                          </Box>
                        }
                        disabled={Boolean(jobInfo.pro)}
                      />
                    </Box>
                  )}
                />
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box className='filterFormSoloAutoComplete'>
                <Controller
                  name='startTimezone'
                  control={control}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <Autocomplete
                      fullWidth
                      disabled={Boolean(jobInfo.pro)}
                      value={value || null}
                      options={timeZoneList as CountryType[]}
                      onChange={(e, v) => {
                        if (v) {
                          onChange(v)
                        } else {
                          onChange(null)
                        }
                      }}
                      getOptionLabel={option =>
                        timeZoneFormatter(option, timezone.getValue()) ?? ''
                      }
                      renderOption={(props, option) => (
                        <Box component='li' {...props} key={uuidv4()}>
                          {timeZoneFormatter(option, timezone.getValue())}
                        </Box>
                      )}
                      renderInput={params => (
                        <TextField
                          {...params}
                          autoComplete='off'
                          label='Timezone'
                          // error={Boolean(errors.startTimezone)}
                        />
                      )}
                    />
                  )}
                />
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box className='filterFormControl'>
                <Controller
                  control={control}
                  name='dueAt'
                  render={({ field: { onChange, value }, formState }) => {
                    const showError = formState.isSubmitted
                    return (
                      <Box sx={{ width: '100%' }}>
                        <DatePicker
                          autoComplete='off'
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
                                label='Job due date*'
                                placeholder='MM/DD/YYYY, HH:MM'
                                sx={{ height: '46px' }}
                                icon='calendar'
                                value={value ? dateValue(value) : ''}
                                error={showError && Boolean(errors.dueAt)}
                                readOnly
                              />
                            </Box>
                          }
                        />
                      </Box>
                    )
                  }}
                />
                {isSubmitted && errors.dueAt && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    {errors.dueAt?.message}
                  </FormHelperText>
                )}
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box className='filterFormSoloAutoComplete'>
                <Controller
                  name='dueTimezone'
                  control={control}
                  render={({
                    field: { value, onChange, onBlur },
                    formState,
                  }) => {
                    const showError = formState.isSubmitted
                    return (
                      <Autocomplete
                        fullWidth
                        value={value || null}
                        options={timeZoneList as CountryType[]}
                        onChange={(e, v) => {
                          if (!v) onChange(null)
                          else onChange(v)
                        }}
                        renderOption={(props, option) => (
                          <Box component='li' {...props} key={uuidv4()}>
                            {timeZoneFormatter(option, timezone.getValue())}
                          </Box>
                        )}
                        renderInput={params => (
                          <TextField
                            {...params}
                            autoComplete='off'
                            label='Timezone*'
                            error={showError && Boolean(errors.dueTimezone)}
                            helperText={
                              showError &&
                              Boolean(errors.dueTimezone) &&
                              FormErrors.required
                            }
                          />
                        )}
                        getOptionLabel={option =>
                          timeZoneFormatter(option, timezone.getValue()) ?? ''
                        }
                      />
                    )
                  }}
                />
              </Box>
            </Grid>
          </Grid>
          <Box
            sx={{
              width: '100%',
              padding: '20px',
              borderBottom: '1px solid #E5E4E4',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography fontSize={14} fontWeight={600}>
                Job description
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Controller
                  name='isShowDescription'
                  control={control}
                  defaultValue={jobInfo.isShowDescription}
                  render={({ field: { value, onChange } }) => (
                    <Checkbox
                      value={value}
                      onChange={e => {
                        onChange(e.target.checked)
                      }}
                      checked={value}
                    />
                  )}
                />

                <Typography fontSize={14} fontWeight={400}>
                  Show job description to Pro
                </Typography>
              </Box>
            </Box>
            <Box sx={{ mt: '12px' }}>
              <Controller
                name='description'
                control={control}
                render={({ field: { value, onChange, onBlur } }) => (
                  <TextField
                    multiline
                    autoComplete='off'
                    fullWidth
                    rows={4}
                    value={value}
                    placeholder='Write down a job description.'
                    onChange={onChange}
                    id='textarea-standard-controlled'
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
                {description?.length ?? 0}/500
              </Box>
            </Box>
            <>
              {!jobInfo.pro ? (
                <Box>
                  <Divider />
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap:
                        uploadedFiles.length > 0 || fileList.length > 0
                          ? '20px'
                          : 0,
                      padding: '20px 0',
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                      }}
                    >
                      <Typography fontSize={14} fontWeight={600}>
                        Sample files to Pro
                      </Typography>
                      <div {...getRootProps({ className: 'dropzone' })}>
                        <Button variant='contained' sx={{ height: '30px' }}>
                          <input {...getInputProps()} />
                          Upload files
                        </Button>
                      </div>
                    </Box>
                    <Box
                      sx={{
                        maxHeight: '200px',
                        overflowY: 'scroll',
                      }}
                    >
                      {uploadedFiles && (
                        <Box
                          sx={{
                            display: uploadedFiles.length > 0 ? 'grid' : 'none',
                            gridTemplateColumns: 'repeat(2, 1fr)',

                            width: '100%',
                            gap: '20px',
                          }}
                        >
                          {uploadedFileList(uploadedFiles, 'SAMPLE')}
                        </Box>
                      )}
                      {fileList.length > 0 && (
                        <Box
                          sx={{
                            display: fileList.length > 0 ? 'grid' : 'none',
                            gridTemplateColumns: 'repeat(2, 1fr)',

                            width: '100%',
                            gap: '20px',
                          }}
                        >
                          {fileList}
                        </Box>
                      )}
                    </Box>

                    <Box>
                      <Typography
                        fontSize={12}
                        fontWeight={400}
                        color='rgba(76, 78, 100, 0.60)'
                      >
                        {formatFileSize(fileSize)}/{' '}
                        {byteToGB(MAXIMUM_FILE_SIZE)}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              ) : null}
            </>
          </Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '16px',
              padding: '32px 20px',
            }}
          >
            <Button variant='outlined' onClick={onClickCancel}>
              Cancel
            </Button>
            <Button variant='contained' type='submit'>
              {jobInfo.pro === null ? 'Save' : 'Save changes'}
            </Button>
          </Box>
        </form>
      </DatePickerWrapper>
    </Box>
  )
}

export default InfoEditModal
