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
import { getGmtTimeEng } from '@src/shared/helpers/timezone.helper'
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
import { deleteJob, saveJobInfo, uploadFile } from '@src/apis/job-detail.api'
import {
  getDownloadUrlforCommon,
  getUploadUrlforCommon,
  uploadFileToS3,
} from '@src/apis/common.api'
import { FilePostType } from '@src/apis/client-guideline.api'

// ** helpers
import { FILE_SIZE } from '@src/shared/const/maximumFileSize'
import { byteToGB, formatFileSize } from '@src/shared/helpers/file-size.helper'

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

  const popperPlacement: ReactDatePickerProps['popperPlacement'] =
    direction === 'ltr' ? 'bottom-start' : 'bottom-end'

  const saveJobInfoMutation = useMutation(
    (data: { jobId: number; data: SaveJobInfoParamsType }) =>
      saveJobInfo(data.jobId, data.data),
    {
      onSuccess: () => {
        setSuccess(true)
        queryClient.invalidateQueries('jobInfo')
        refetch()
        setEditJobInfo(false)
      },
    },
  )

  const uploadFileMutation = useMutation(
    (file: {
      jobId: number,
      files: Array<{
        jobId: number
        size: number
        name: string
        type: 'SAMPLE' | 'SOURCE' | 'TARGET'
      }>
    }) => uploadFile(file),
    {
      onSuccess: () => {
        // console.log('success')
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

    formState: { errors, dirtyFields, isValid },
  } = useForm<AddJobInfoFormType>({
    mode: 'onChange',

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
      'image/*': ['.png', '.jpg', '.jpeg'],
      'text/csv': ['.cvs'],
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt'],
      'application/vnd.ms-powerpoint': ['.ppt'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        ['.docx'],
      'video/*': ['.avi', '.mp4', '.mkv', '.wmv', '.mov'],
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
            // console.log(acc)

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

  // console.log('data', getValues())
  const onSubmit = () => {
    const data = getValues()
    if (files.length) {
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
        files: []
      }
      const paths: string[] = files.map(file => {
        return `project/${row.id}/${file.name}`
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
            uploadFileMutation.mutate(fileInfo)
            const jobInfo: SaveJobInfoParamsType = {
              contactPersonId: data.contactPerson.userId,
              description: data.description ?? null,
              startDate: data.startedAt ? data.startedAt.toString() : null,
              startTimezone: data.startTimezone ?? null,

              dueDate: data.dueAt.toString(),
              dueTimezone: data.dueTimezone,
              status: data.status,
              sourceLanguage:
                data.languagePair.value === 'Language-independent'
                  ? null
                  : data.languagePair.source,
              targetLanguage:
                data.languagePair.value === 'Language-independent'
                  ? null
                  : data.languagePair.target,
              name: data.name,
              isShowDescription: data.isShowDescription,
            }

            saveJobInfoMutation.mutate({ jobId: row.id, data: jobInfo })

            // res.map((value, idx) => {
            //   uploadFileMutation.mutate(fileInfo[idx])
              
            // })
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
      const jobInfo: SaveJobInfoParamsType = {
        contactPersonId: data.contactPerson.userId,
        description: data.description ?? null,
        startDate: data.startedAt ? data.startedAt.toString() : null,
        startTimezone: data.startTimezone ?? null,

        dueDate: data.dueAt.toString(),
        dueTimezone: data.dueTimezone,
        status: data.status,
        //TODO 'Language-independent'일 경우 null로 값을 보내는데 실제로 null인거와 'Language-independent'를 선택한것의 구분이 안됨
        sourceLanguage:
          data.languagePair.value === 'Language-independent'
            ? null
            : data.languagePair.source,
        targetLanguage:
          data.languagePair.value === 'Language-independent'
            ? null
            : data.languagePair.target,
        name: data.name,
        isShowDescription: data.isShowDescription,
      }
      console.log("jobInfo",jobInfo)
      saveJobInfoMutation.mutate({ jobId: row.id, data: jobInfo })
    }

    // TODO : delete file form s3
  }

  useEffect(() => {
    setValue('name', row.name ?? '')
    setValue('description', row.description ?? '')
    setValue('status', row.status)
    row.sourceLanguage && row.targetLanguage
      ? setValue('languagePair', {
          value: `${languageHelper(row.sourceLanguage)} -> ${languageHelper(
            row.targetLanguage,
          )}`,
          label: `${languageHelper(row.sourceLanguage)} -> ${languageHelper(
            row.targetLanguage,
          )}`,
          source: row.sourceLanguage,
          target: row.targetLanguage,
        })
      : setValue('languagePair', {
          value: `${languageHelper(item.sourceLanguage)} -> ${languageHelper(
            item.targetLanguage,
          )}`,
          label: `${languageHelper(item.sourceLanguage)} -> ${languageHelper(
            item.targetLanguage,
          )}`,
          source: item.sourceLanguage,
          target: item.targetLanguage,
        })
    setValue('serviceType', { value: row.serviceType, label: row.serviceType })
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
      setValue('startTimezone', row.startTimezone, {
        shouldDirty: true,
        shouldValidate: true,
      })
    row.dueAt && setValue('dueAt', new Date(row.dueAt))
    row.dueTimezone &&
      setValue('dueTimezone', row.dueTimezone, {
        shouldDirty: true,
        shouldValidate: true,
      })

    const langPairList = languagePair.map((item, index) => ({
      value: `${languageHelper(item.source)} -> ${languageHelper(item.target)}`,
      label: `${languageHelper(item.source)} -> ${languageHelper(item.target)}`,
    }))
    setLanguageItemList([
      {
        value: 'Language-independent',
        label: 'Language-independent',
      },
      ...langPairList,
    ])
    setUploadedFiles(row.files ?? [])
    trigger()
  }, [row, item, setValue, languagePair, contactPersonList, trigger])
  console.log("row",row)
  console.log("job name",getValues().name)
  return (
    <>
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
              defaultValue={statusList?.find(list => list.value === row.status)?.label!} 
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
              <Controller
                control={control}
                name='serviceType'
                render={({ field: { onChange, value } }) => (
                  <Autocomplete
                    fullWidth
                    disabled
                    isOptionEqualToValue={(option, newValue) => {
                      return option.value === newValue.value
                    }}
                    onChange={(event, item) => {
                      onChange(item)
                    }}
                    value={{ label: 'Translation', value: 'Translation' }}
                    options={[]}
                    id='serviceType'
                    getOptionLabel={option => option.label}
                    renderInput={params => (
                      <TextField {...params} label='Service type*' />
                    )}
                  />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                control={control}
                name='languagePair'
                render={({ field: { onChange, value } }) => (
                  <Autocomplete
                    fullWidth
                    disabled={Boolean(row.name)}
                    isOptionEqualToValue={(option, newValue) => {
                      return option.value === newValue.value
                    }}
                    onChange={(event, item) => {
                      if (item) {
                        onChange(item)
                      } else {
                        onChange({
                          value: '',
                          label: '',
                          source: '',
                          target: '',
                        })
                      }
                    }}
                    value={
                      value || { value: '', label: '', source: '', target: '' }
                    }
                    options={languageItemList}
                    id='languagePair'
                    getOptionLabel={option => option.label}
                    renderInput={params => (
                      <TextField
                        {...params}
                        label='Language pair*'
                        error={Boolean(errors.languagePair)}
                      />
                    )}
                  />
                )}
              />
              {errors.languagePair && (
                <FormHelperText sx={{ color: 'error.main' }}>
                  {errors.languagePair?.label?.message ||
                    errors.languagePair?.value?.message}
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
                      placeholderText='MM/DD/YYYY, HH:MM'
                      customInput={
                        <CustomInput label='Job start date' icon='calendar' />
                      }
                      disabled={Boolean(row.name)}
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
                    disabled={Boolean(row.name)}
                    value={value || { code: '', label: '', phone: '' }}
                    options={countries as CountryType[]}
                    onChange={(e, v) => onChange(v)}
                    getOptionLabel={option => getGmtTimeEng(option.code) ?? ''}
                    renderOption={(props, option) => (
                      <Box component='li' {...props} key={uuidv4()}>
                        {getGmtTimeEng(option.code)}
                      </Box>
                    )}
                    renderInput={params => (
                      <TextField
                        {...params}
                        label='Timezone'
                        error={Boolean(errors.startTimezone)}
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
                      selected={value}
                      dateFormat='MM/dd/yyyy, hh:mm a'
                      showTimeSelect={true}
                      shouldCloseOnSelect={false}
                      id='date-range-picker-months'
                      onChange={onChange}
                      popperPlacement={popperPlacement}
                      placeholderText='MM/DD/YYYY, HH:MM'
                      customInput={
                        <CustomInput
                          label='Job due date*'
                          icon='calendar'
                          error={Boolean(errors.dueAt)}
                        />
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
                    options={countries as CountryType[]}
                    onChange={(e, v) => {
                      // console.log(value)

                      if (!v) onChange(null)
                      else onChange(v)
                    }}
                    renderOption={(props, option) => (
                      <Box component='li' {...props} key={uuidv4()}>
                        {getGmtTimeEng(option.code)}
                      </Box>
                    )}
                    renderInput={params => (
                      <TextField
                        {...params}
                        label='Timezone*'
                        error={Boolean(errors.dueTimezone)}
                      />
                    )}
                    getOptionLabel={option => getGmtTimeEng(option.code) ?? ''}
                  />
                )}
              />
              {errors.dueTimezone && (
                <FormHelperText sx={{ color: 'error.main' }}>
                  {errors.dueTimezone?.label?.message ||
                    errors.dueTimezone?.code?.message}
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
          {!row.proId ? (
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
              <Box mt='20px' sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button variant='contained' onClick={onSubmit} disabled={!isValid}>
                  Save draft
                </Button>
              </Box>
            </Box>
          ) : (
            <Box mt='20px' sx={{ 
              display: 'flex', 
              justifyContent: 'center',
              gap: '16px',
              mt: '16px', 
            }}>
              <Button variant='outlined' onClick={() => setEditJobInfo(false)} disabled={!isValid}>
                Cancel
              </Button>
              <Button variant='contained' onClick={onSubmit} disabled={!isValid}>
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
