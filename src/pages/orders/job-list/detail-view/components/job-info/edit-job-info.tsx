import { yupResolver } from '@hookform/resolvers/yup'
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Divider,
  FormHelperText,
  Grid,
  List,
  TextField,
  Typography,
  useTheme,
} from '@mui/material'

import {
  AddJobInfoFormType,
  AddJobInfoType,
  SaveJobInfoParamsType,
} from '@src/types/orders/job-detail'
import { addJobInfoFormSchema } from '@src/types/schema/job-detail'
import { standardPricesSchema } from '@src/types/schema/standard-prices.schema'
import { Controller, useForm } from 'react-hook-form'
import DatePickerWrapper from '@src/@core/styles/libs/react-datepicker'
import DatePicker, { ReactDatePickerProps } from 'react-datepicker'
import CustomInput from 'src/views/forms/form-elements/pickers/PickersCustomInput'
import dayjs from 'dayjs'
import { countries } from '@src/@fake-db/autocomplete'
import { CountryType } from '@src/types/sign/personalInfoTypes'
import { timeZoneFormatter } from '@src/shared/helpers/timezone.helper'
import CustomCheckbox from '@src/@core/components/custom-checkbox/basic'
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'
import { FileType } from '@src/types/common/file.type'
import { useDropzone } from 'react-dropzone'
import FileItem from '@src/@core/components/fileItem'
import { v4 as uuidv4 } from 'uuid'
import toast, { Toaster, resolveValue } from 'react-hot-toast'
import { JobItemType, JobType } from '@src/types/common/item.type'
import languageHelper from '@src/shared/helpers/language.helper'
import { PositionType, ProjectInfoType } from '@src/types/orders/order-detail'
import { CurrencyType } from '@src/types/common/standard-price'
import { set } from 'nprogress'
import { getLegalName } from '@src/shared/helpers/legalname.helper'
import { id } from 'date-fns/locale'
import {
  QueryObserverResult,
  RefetchOptions,
  RefetchQueryFilters,
  useMutation,
  useQueryClient,
} from 'react-query'
import {
  deleteJob,
  deleteJobFile,
  saveJobInfo,
  uploadFile,
} from '@src/apis/job-detail.api'
import {
  getDownloadUrlforCommon,
  getUploadUrlforCommon,
  uploadFileToS3,
} from '@src/apis/common.api'
import { FilePostType } from '@src/apis/client-guideline.api'

// ** helpers
import { FILE_SIZE } from '@src/shared/const/maximumFileSize'
import { byteToGB, formatFileSize } from '@src/shared/helpers/file-size.helper'
import { JobStatusType } from '@src/types/jobs/common.type'
import { log } from 'npmlog'
import { FormErrors } from '@src/shared/const/formErrors'
import OverlaySpinner from '@src/@core/components/spinner/overlay-spinner'
import { srtUploadFileExtension } from '@src/shared/const/upload-file-extention/file-extension'

import { timezoneSelector } from '@src/states/permission'
import { useRecoilValueLoadable } from 'recoil'

type Props = {
  row: JobType
  contactPersonList: Array<{ value: string; label: string; userId: number }>
  orderDetail: ProjectInfoType
  item: JobItemType
  languagePair: Array<{
    id: number
    source: string
    target: string
    price: {
      id: number
      name: string
      isStandard: boolean
      category: string
      serviceType: Array<string>
      currency: CurrencyType
      calculationBasis: string
      rounding: number
      numberPlace: number
      authorId: number
    } | null
  }>
  refetch: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined,
  ) => Promise<
    QueryObserverResult<
      {
        id: number
        cooperationId: string
        items: JobItemType[]
      },
      unknown
    >
  >
  success: boolean
  setSuccess: Dispatch<SetStateAction<boolean>>
  setEditJobInfo: Dispatch<SetStateAction<boolean>>
  statusList: Array<{ value: number; label: string }>
  setJobId?: (n: number) => void
}

const EditJobInfo = ({
  row,
  contactPersonList,
  orderDetail,
  item,
  languagePair,
  refetch,
  success,
  setSuccess,
  setEditJobInfo,
  statusList,
  setJobId,
}: Props) => {
  const theme = useTheme()
  const { direction } = theme
  const queryClient = useQueryClient()

  const [languageItemList, setLanguageItemList] = useState<
    {
      value: string
      label: string
    }[]
  >([])
  const [isFileUploading, setIsFileUploading] = useState<boolean>(false)
  const [timeZoneList, setTimeZoneList] = useState<
    {
      code: string
      label: string
      phone: string
    }[]
  >([])

  const timezone = useRecoilValueLoadable(timezoneSelector)

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

  const popperPlacement: ReactDatePickerProps['popperPlacement'] =
    direction === 'ltr' ? 'bottom-start' : 'bottom-end'

  const saveJobInfoMutation = useMutation(
    (data: { jobId: number; data: SaveJobInfoParamsType }) =>
      saveJobInfo(data.jobId, data.data),
    {
      onSuccess: (data, variables) => {
        setSuccess(true)
        if (data.id === variables.jobId) {
          queryClient.invalidateQueries('jobInfo')
          queryClient.invalidateQueries('jobPrices')
          // refetch()
          setJobId && setJobId(variables.jobId)
        } else {
          setJobId && setJobId(data.id)
        }
        setEditJobInfo(false)
      },
    },
  )

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
        if (data.id === variables.jobId) {
          queryClient.invalidateQueries('jobInfo')
          // refetch()
          setJobId && setJobId(variables.jobId)
        } else {
          setJobId && setJobId(data.id)
        }
      },
    },
  )

  const setValueOptions = { shouldDirty: true, shouldValidate: true }

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setError,
    trigger,
    getValues,
    setValue,

    formState: { errors, dirtyFields, isValid },
  } = useForm<AddJobInfoFormType>({
    mode: 'onSubmit',

    resolver: yupResolver(addJobInfoFormSchema),
  })
  const description = watch('description')
  const MAXIMUM_FILE_SIZE = FILE_SIZE.JOB_SAMPLE_FILE

  const [fileSize, setFileSize] = useState<number>(0)
  const [files, setFiles] = useState<File[]>([])
  const [uploadedFiles, setUploadedFiles] = useState<FileType[]>([])
  const [deletedFiles, setDeletedFiles] = useState<FileType[]>([])

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
            //  TODO : show exceed file size modal
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
  }

  const handleRemoveUploadedFile = (file: FileType) => {
    const removeFile = uploadedFiles
    const filtered = removeFile.filter((i: FileType) => i.name !== file.name)
    setUploadedFiles([...filtered])
    setDeletedFiles([...deletedFiles, file])
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

  const dateValue = (date: Date) => {
    return dayjs(date).format('MM/DD/YYYY, hh:mm a')
  }

  async function deleteFiles() {
    for (const file of deletedFiles) {
      if (file.id) {
        await deleteJobFile(file.id)
      }
    }
  }

  const onSubmit = () => {
    const data = getValues()
    // step1) 파일 삭제
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
          jobId: row.id,
          files: [],
        }
        const paths: string[] = files.map(file => {
          return `project/${row.id}/sample/${file.name}`
        })
        const s3URL = paths.map(value => {
          return getUploadUrlforCommon('job', value).then(res => {
            return res.url
          })
        })
        Promise.all(s3URL).then(res => {
          const promiseArr = res.map((url: string, idx: number) => {
            fileInfo.files.push({
              jobId: row.id,
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
              const jobInfo: SaveJobInfoParamsType = {
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

              saveJobInfoMutation.mutate({ jobId: row.id, data: jobInfo })

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
        const jobInfo: SaveJobInfoParamsType = {
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
        saveJobInfoMutation.mutate({ jobId: row.id, data: jobInfo })
      }
    })
  }

  useEffect(() => {
    // reset({
    //   name: row.name ?? '',
    //   description: row.description ?? '',
    //   status: row.status,
    //   source: row.name ? row.sourceLanguage : item.sourceLanguage,
    //   target: row.name ? row.targetLanguage : item.targetLanguage,
    //   serviceType: row.serviceType,
    //   isShowDescription: row.isShowDescription,

    //   contactPerson:
    //     row.contactPerson &&
    //     contactPersonList.find(
    //       value => value.userId === row.contactPerson?.userId,
    //     )
    //       ? {
    //           value: contactPersonList.find(
    //             value => value.userId === row.contactPerson?.userId,
    //           )?.value!,
    //           label: contactPersonList.find(
    //             value => value.userId === row.contactPerson?.userId,
    //           )?.label!,
    //           userId: row.contactPerson.userId,
    //         }
    //       : {
    //           value: contactPersonList.find(
    //             value => value.userId === item.contactPersonId,
    //           )?.value!,
    //           label: contactPersonList.find(
    //             value => value.userId === item.contactPersonId,
    //           )?.label!,
    //           userId: item.contactPersonId,
    //         },
    //   startedAt: row.startedAt ? new Date(row.startedAt) : undefined,
    //   startTimezone: row.startTimezone ?? null,
    //   dueAt: new Date(row.dueAt),
    //   dueTimezone: row.dueTimezone ?? null,
    // })

    setValue('name', row.name ?? '')
    setValue('description', row.description ?? '')
    setValue('status', row.status)
    setValue('source', row.name ? row.sourceLanguage : item.sourceLanguage, {
      shouldDirty: true,
      shouldValidate: true,
    })
    setValue('target', row.name ? row.targetLanguage : item.targetLanguage, {
      shouldDirty: true,
      shouldValidate: true,
    })

    // trigger('source')
    // trigger('target')

    setValue('serviceType', row.serviceType, {
      shouldDirty: true,
      shouldValidate: true,
    })

    setValue('isShowDescription', row.isShowDescription, {
      shouldDirty: true,
      shouldValidate: true,
    })

    setValue(
      'contactPerson',
      row.contactPerson &&
        contactPersonList.find(
          value => value.userId === row.contactPerson?.userId,
        )
        ? {
            value: contactPersonList.find(
              value => value.userId === row.contactPerson?.userId,
            )?.value!,
            label: contactPersonList.find(
              value => value.userId === row.contactPerson?.userId,
            )?.label!,
            userId: row.contactPerson.userId,
          }
        : {
            value: contactPersonList.find(
              value => value.userId === item.contactPersonId,
            )?.value!,
            label: contactPersonList.find(
              value => value.userId === item.contactPersonId,
            )?.label!,
            userId: item.contactPersonId,
          },
    )
    row.startedAt && setValue('startedAt', new Date(row.startedAt))

    row.startTimezone &&
      setValue('startTimezone', row.startTimezone ?? null, {
        shouldDirty: true,
        shouldValidate: true,
      })
    row.dueAt && setValue('dueAt', new Date(row.dueAt))
    row.dueTimezone &&
      setValue('dueTimezone', row.dueTimezone ?? null, {
        shouldDirty: true,
        shouldValidate: true,
      })

    // const langPairList = languagePair.map((item, index) => ({
    //   value: `${languageHelper(item.source)} -> ${languageHelper(item.target)}`,
    //   label: `${languageHelper(item.source)} -> ${languageHelper(item.target)}`,
    // }))
    // setLanguageItemList([
    //   {
    //     value: 'Language-independent',
    //     label: 'Language-independent',
    //   },
    //   ...langPairList,
    // ])
    setUploadedFiles(row.files ?? [])
    // trigger()
  }, [row, item])

  return (
    <>
      {uploadFileMutation.isLoading ||
      saveJobInfoMutation.isLoading ||
      isFileUploading ? (
        <OverlaySpinner />
      ) : null}
      <DatePickerWrapper sx={{ width: '100%' }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container xs={12} spacing={6} mb='20px'>
            <Grid item xs={12}>
              <Controller
                name='name'
                control={control}
                render={({ field: { value, onChange, onBlur } }) => (
                  <TextField
                    fullWidth
                    value={value || ''}
                    onBlur={onBlur}
                    label='Job name*'
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
                    error={Boolean(errors.name)}
                  />
                )}
              />
              {errors.name && (
                <FormHelperText sx={{ color: 'error.main' }}>
                  {errors.name?.message || errors.name?.message}
                </FormHelperText>
              )}
            </Grid>
            <Grid item xs={6}>
              <TextField
                disabled
                id='status'
                label='Status*'
                fullWidth
                defaultValue={
                  statusList?.find(list => list.value === row.status)?.label!
                }
              />
              {/* <Controller
                control={control}
                name='status'
                render={({ field: { onChange, value } }) => (
                  <Autocomplete
                    fullWidth
                    disabled
                    onChange={(event, item) => {
                      console.log("item",item)
                      if (item) {
                        onChange(item.value)
                      } else {
                        onChange(null)
                      }
                    }}
                    value={statusList?.find(list => list.value === value)!}
                    options={statusList!}
                    id='Status'
                    getOptionLabel={option => option.label}
                    renderInput={params => (
                      <TextField
                        {...params}
                        label='Status*'
                        error={Boolean(errors.status)}
                      />
                    )}
                  />
                )}
              />
              {errors.status && (
                <FormHelperText sx={{ color: 'error.main' }}>
                  {errors.status?.message}
                </FormHelperText>
              )} */}
            </Grid>
            <Grid item xs={6}>
              <Controller
                control={control}
                name='contactPerson'
                render={({ field: { onChange, value } }) => (
                  <Autocomplete
                    fullWidth
                    onChange={(event, item) => {
                      if (item) {
                        onChange(item)
                      } else {
                        onChange({ value: '', label: '', userId: 0 })
                      }
                    }}
                    value={value || { value: '', label: '', userId: 0 }}
                    options={contactPersonList}
                    id='contactPerson'
                    getOptionLabel={option => option.label || ''}
                    renderInput={params => (
                      <TextField
                        {...params}
                        label='Contact person for job*'
                        error={Boolean(errors.contactPerson)}
                      />
                    )}
                  />
                )}
              />
              {errors.contactPerson && (
                <FormHelperText sx={{ color: 'error.main' }}>
                  {errors.contactPerson?.label?.message ||
                    errors.contactPerson?.value?.message}
                </FormHelperText>
              )}
            </Grid>
            <Grid item xs={6}>
              {/* <Controller
                control={control}
                name='serviceType'
                render={({ field: { onChange, value } }) => (
                  <Autocomplete
                    fullWidth
                    disabled
                    onChange={(event, item) => {
                      onChange(item)
                    }}
                    value={value}
                    options={[]}
                    id='serviceType'
                    getOptionLabel={option => option}
                    renderInput={params => (
                      <TextField {...params} label='Service type*' />
                    )}
                  />
                )}
              /> */}
              <TextField
                disabled
                id='serviceType'
                label='Service type*'
                fullWidth
                defaultValue={row.serviceType}
              />
            </Grid>
            <Grid item xs={6}>
              {getValues('source') !== undefined &&
                getValues('target') !== undefined && (
                  <Controller
                    control={control}
                    name='source'
                    render={({ field: { onChange, value } }) => {
                      return (
                        <Autocomplete
                          fullWidth
                          disabled={Boolean(row.pro)}
                          // isOptionEqualToValue={(option, newValue) => {
                          //   return option.source === newValue.source
                          // }}
                          onChange={(event, item) => {
                            if (item) {
                              setValue('source', item?.source, setValueOptions)
                              setValue('target', item?.target, setValueOptions)
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
                              .sort((a, b) => a.source.localeCompare(b.source)),
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
                              )} -> ${languageHelper(option.target)}`
                            }
                          }}
                          id='languagePair'
                          renderInput={params => (
                            <TextField
                              {...params}
                              label='Language pair*'
                              defaultValue={'hi'}
                              error={Boolean(errors.source)}
                            />
                          )}
                        />
                      )
                    }}
                  />
                )}

              {errors.source && (
                <FormHelperText sx={{ color: 'error.main' }}>
                  {errors.source?.message || errors.target?.message}
                </FormHelperText>
              )}
            </Grid>
            <Grid item xs={6}>
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
                            placeholder='MM/DD/YYYY, HH:MM'
                            // placeholder='MM/DD/YYYY - MM/DD/YYYY'
                            readOnly
                            value={value ? dateValue(value) : ''}
                          />
                        </Box>
                      }
                      disabled={Boolean(row.pro)}
                    />
                  </Box>
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                name='startTimezone'
                control={control}
                render={({ field: { value, onChange, onBlur } }) => (
                  <Autocomplete
                    fullWidth
                    disabled={Boolean(row.pro)}
                    value={value || { code: '', label: '', phone: '' }}
                    options={timeZoneList as CountryType[]}
                    onChange={(e, v) => onChange(v)}
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
                        label='Timezone'
                        // error={Boolean(errors.startTimezone)}
                      />
                    )}
                  />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                control={control}
                name='dueAt'
                render={({ field: { onChange, value } }) => (
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
                            icon='calendar'
                            value={value ? dateValue(value) : ''}
                            error={Boolean(errors.dueAt)}
                            readOnly
                          />
                        </Box>
                      }
                    />
                  </Box>
                )}
              />
              {errors.dueAt && (
                <FormHelperText sx={{ color: 'error.main' }}>
                  {errors.dueAt?.message}
                </FormHelperText>
              )}
            </Grid>
            <Grid item xs={6}>
              <Controller
                name='dueTimezone'
                control={control}
                render={({ field: { value, onChange, onBlur } }) => (
                  <Autocomplete
                    fullWidth
                    value={value || { code: '', label: '', phone: '' }}
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
                        label='Timezone*'
                        error={Boolean(errors.dueTimezone)}
                      />
                    )}
                    getOptionLabel={option =>
                      timeZoneFormatter(option, timezone.getValue()) ?? ''
                    }
                  />
                )}
              />
              {(errors.dueTimezone || getValues('dueTimezone') === null) && (
                <FormHelperText sx={{ color: 'error.main' }}>
                  {errors.dueTimezone?.label?.message ||
                    errors.dueTimezone?.code?.message ||
                    FormErrors.required}
                </FormHelperText>
              )}
            </Grid>
          </Grid>
          <Divider />
          <Box
            mt='20px'
            mb='20px'
            sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant='body1' fontWeight={600}>
                Job description
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Controller
                  name='isShowDescription'
                  control={control}
                  defaultValue={row.isShowDescription}
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

                <Typography variant='body2'>
                  Show job description to Pro
                </Typography>
              </Box>
            </Box>
            <Box>
              <Controller
                name='description'
                control={control}
                render={({ field: { value, onChange, onBlur } }) => (
                  <TextField
                    multiline
                    fullWidth
                    rows={4}
                    value={value}
                    placeholder='Write down a job description.'
                    onChange={onChange}
                    id='textarea-standard-controlled'
                  />
                )}
              />
            </Box>
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
          {!row.pro ? (
            <Box>
              <Divider />
              <Box
                mt='20px'
                mb='20px'
                sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}
                >
                  <Typography variant='body1' fontWeight={600}>
                    Sample files to pro
                  </Typography>
                  <div {...getRootProps({ className: 'dropzone' })}>
                    <Button variant='outlined' sx={{ height: '30px' }}>
                      <input {...getInputProps()} />
                      Upload files
                    </Button>
                  </div>
                </Box>
                {uploadedFiles && (
                  <Box
                    sx={{
                      display: 'grid',
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
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, 1fr)',

                      width: '100%',
                      gap: '20px',
                    }}
                  >
                    {fileList}
                  </Box>
                )}

                <Box>
                  <Typography variant='subtitle2'>
                    {formatFileSize(fileSize)}/ {byteToGB(MAXIMUM_FILE_SIZE)}
                  </Typography>
                </Box>
              </Box>
              <Divider />
              <Box
                mt='20px'
                mb='20px'
                sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}
                >
                  <Typography variant='body1' fontWeight={600}>
                    Target files from Pro
                  </Typography>
                </Box>
                <Typography variant='subtitle2'>
                  There are no files delivered from Pro
                </Typography>
              </Box>
              <Divider />
              <Box
                mt='20px'
                sx={{ display: 'flex', justifyContent: 'flex-end' }}
              >
                <Button
                  variant='contained'
                  onClick={onSubmit}
                  disabled={!isValid}
                >
                  Save draft
                </Button>
              </Box>
            </Box>
          ) : (
            <Box
              mt='20px'
              sx={{
                display: 'flex',
                justifyContent: 'center',
                gap: '16px',
                mt: '16px',
              }}
            >
              <Button
                variant='outlined'
                onClick={() => setEditJobInfo(false)}
                disabled={!isValid}
              >
                Cancel
              </Button>
              <Button
                variant='contained'
                onClick={onSubmit}
                disabled={!isValid}
              >
                Save
              </Button>
            </Box>
          )}
        </form>
        <div id='toast-container'></div>
      </DatePickerWrapper>
    </>
  )
}

export default EditJobInfo
