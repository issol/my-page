import { yupResolver } from '@hookform/resolvers/yup'
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Divider,
  Grid,
  List,
  TextField,
  Typography,
  useTheme,
} from '@mui/material'
import { JobStatus } from '@src/shared/const/status/statuses'
import {
  AddJobInfoFormType,
  AddJobInfoType,
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
import { getGmtTime } from '@src/shared/helpers/timezone.helper'
import CustomCheckbox from '@src/@core/components/custom-checkbox/basic'
import { useEffect, useRef, useState } from 'react'
import { FileType } from '@src/types/common/file.type'
import { useDropzone } from 'react-dropzone'
import FileItem from '@src/@core/components/fileItem'
import { v4 as uuidv4 } from 'uuid'
import toast, { Toaster, resolveValue } from 'react-hot-toast'
import { JobType } from '@src/types/common/item.type'
import languageHelper from '@src/shared/helpers/language.helper'

type Props = {
  row: JobType
}

const EditJobInfo = ({ row }: Props) => {
  const theme = useTheme()
  const { direction } = theme

  const [success, setSuccess] = useState(false)

  const popperPlacement: ReactDatePickerProps['popperPlacement'] =
    direction === 'ltr' ? 'bottom-start' : 'bottom-end'

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
  const MAXIMUM_FILE_SIZE = 20000000

  const [fileSize, setFileSize] = useState<number>(0)
  const [files, setFiles] = useState<File[]>([])

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
            console.log(acc)

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
  const fileList = files.map((file: FileType, index: number) => {
    return (
      <Box key={uuidv4()}>
        <FileItem key={file.name} file={file} onClear={handleRemoveFile} />
      </Box>
    )
  })

  const onSubmit = () => {
    const data = getValues()
    setSuccess(true)
    // toast('Job info added successfully')
    console.log(data)
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setSuccess(false)
    }, 3000)
    return () => {
      clearTimeout(timer)
    }
  }, [success])

  useEffect(() => {
    console.log(row)

    setValue('jobName', row.jobName)
    setValue('description', row.description)
    setValue('status', { value: row.status, label: row.status })
    setValue('languagePair', {
      value: `${languageHelper(row.sourceLanguage)} -> ${languageHelper(
        row.targetLanguage,
      )}`,
      label: `${languageHelper(row.sourceLanguage)} -> ${languageHelper(
        row.targetLanguage,
      )}`,
    })
    setValue('serviceType', { value: row.serviceType, label: row.serviceType })
    setValue('isShowDescription', row.isShowDescription)
    setValue('contactPerson', {
      value: row.contactPerson,
      label: row.contactPerson,
    })
    setValue('startedAt', new Date(row.startedAt))
    console.log(getGmtTime(row.startTimezone.code))

    setValue('startTimezone', row.startTimezone)
    setValue('dueAt', new Date(row.dueAt))
    setValue('dueTimezone', row.dueTimezone)
  }, [row, setValue])

  return (
    <>
      {success && (
        <Box
          sx={{
            position: 'absolute',
            bottom: 40,
            left: 40,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',

            background: ' #FFFFFF',

            boxShadow: '0px 4px 8px -4px rgba(76, 78, 100, 0.42)',
            borderRadius: '8px',
            padding: '12px 10px',
          }}
        >
          <img src='/images/icons/order-icons/success.svg' alt='' />
          Saved successfully
        </Box>
      )}

      <DatePickerWrapper sx={{ width: '100%' }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container xs={12} spacing={6} mb='20px'>
            <Grid item xs={12}>
              <Controller
                name='jobName'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <TextField
                    fullWidth
                    value={value || null}
                    onBlur={onBlur}
                    label='Job name*'
                    onChange={e => {
                      const { value } = e.target
                      if (value === '') {
                        onChange(null)
                      } else {
                        const filteredValue = value.slice(0, 100)
                        e.target.value = filteredValue
                        onChange(e.target.value)
                      }
                    }}
                    error={Boolean(errors.jobName)}
                  />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                control={control}
                name='status'
                render={({ field: { onChange, value } }) => (
                  <Autocomplete
                    fullWidth
                    onChange={(event, item) => {
                      onChange(item)
                    }}
                    value={value || { value: '', label: '' }}
                    options={JobStatus}
                    id='Status'
                    getOptionLabel={option => option.label}
                    renderInput={params => (
                      <TextField {...params} label='Status*' />
                    )}
                  />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                control={control}
                name='contactPerson'
                render={({ field: { onChange, value } }) => (
                  <Autocomplete
                    fullWidth
                    onChange={(event, item) => {
                      onChange(item)
                    }}
                    value={value || { value: '', label: '' }}
                    options={[
                      {
                        value: 'Aria (Soyoung) Jeong',
                        label: 'Aria (Soyoung) Jeong',
                      },
                    ]}
                    id='contactPerson'
                    getOptionLabel={option => option.label}
                    renderInput={params => (
                      <TextField {...params} label='Contact person for job*' />
                    )}
                  />
                )}
              />
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
                    isOptionEqualToValue={(option, newValue) => {
                      return option.value === newValue.value
                    }}
                    onChange={(event, item) => {
                      onChange(item)
                    }}
                    value={value || { value: '', label: '' }}
                    options={[
                      {
                        value: `English -> Korean`,
                        label: 'English -> Korean',
                      },
                    ]}
                    id='languagePair'
                    getOptionLabel={option => option.label}
                    renderInput={params => (
                      <TextField {...params} label='Language pair*' />
                    )}
                  />
                )}
              />
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
                    value={value}
                    options={countries as CountryType[]}
                    onChange={(e, v) => onChange(v)}
                    getOptionLabel={option => getGmtTime(option.code)}
                    renderOption={(props, option) => (
                      <Box component='li' {...props}>
                        {getGmtTime(option.code)}
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
                        <CustomInput label='Job due date*' icon='calendar' />
                      }
                    />
                  </Box>
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                name='dueTimezone'
                control={control}
                render={({ field: { value, onChange, onBlur } }) => (
                  <Autocomplete
                    fullWidth
                    value={value}
                    defaultValue={value}
                    options={countries as CountryType[]}
                    onChange={(e, v) => {
                      console.log(value)

                      if (!v) onChange(null)
                      else onChange(v)
                    }}
                    renderOption={(props, option) => (
                      <Box component='li' {...props}>
                        {getGmtTime(option.code)}
                      </Box>
                    )}
                    renderInput={params => (
                      <TextField
                        {...params}
                        label='Timezone*'
                        error={Boolean(errors.dueTimezone)}
                      />
                    )}
                    getOptionLabel={option => getGmtTime(option.code)}
                  />
                )}
              />
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
                  render={({ field: { value, onChange, onBlur } }) => (
                    <Checkbox value={value} onChange={onChange} />
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
                {fileSize === 0
                  ? 0
                  : Math.round(fileSize / 100) / 10 > 1000
                  ? `${(Math.round(fileSize / 100) / 10000).toFixed(1)} mb`
                  : `${(Math.round(fileSize / 100) / 10).toFixed(1)} kb`}
                /2gb
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
        </form>
        <div id='toast-container'></div>
      </DatePickerWrapper>
    </>
  )
}

export default EditJobInfo
