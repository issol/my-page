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
import { addJobInfoFormSchema } from '@src/types/schema/job-info.schema'
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
import { useState } from 'react'
import { FileType } from '@src/types/common/file.type'
import { useDropzone } from 'react-dropzone'
import FileItem from '@src/@core/components/fileItem'
import { v4 as uuidv4 } from 'uuid'
import toast from 'react-hot-toast'

const JobInfo = () => {
  const theme = useTheme()
  const { direction } = theme

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

  const description = watch('jobDescription')
  const MAXIMUM_FILE_SIZE = 50000000

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
  const fileList = files.map((file: FileType, index: number) => {
    return (
      <Box key={uuidv4()}>
        <FileItem key={file.name} file={file} onClear={handleRemoveFile} />
      </Box>
    )
  })

  const onSubmit = () => {
    const data = getValues()
    // toast.success('Job info added successfully', {
    //   container: document.getElementById('toast-container'),
    // })
    console.log(data)
  }

  return (
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
              name='jobStartDate'
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
              name='jobStartDateTimezone'
              control={control}
              render={({ field: { value, onChange, onBlur } }) => (
                <Autocomplete
                  fullWidth
                  value={value}
                  options={countries as CountryType[]}
                  onChange={(e, v) => onChange(v)}
                  renderOption={(props, option) => (
                    <Box component='li' {...props}>
                      {getGmtTime(option.code)}
                    </Box>
                  )}
                  renderInput={params => (
                    <TextField
                      {...params}
                      label='Timezone'
                      error={Boolean(errors.jobStartDateTimezone)}
                    />
                  )}
                />
              )}
            />
          </Grid>
          <Grid item xs={6}>
            <Controller
              control={control}
              name='jobDueDate'
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
              name='jobDueDateTimezone'
              control={control}
              render={({ field: { value, onChange, onBlur } }) => (
                <Autocomplete
                  fullWidth
                  value={value}
                  options={countries as CountryType[]}
                  onChange={(e, v) => onChange(v)}
                  renderOption={(props, option) => (
                    <Box component='li' {...props}>
                      {getGmtTime(option.code)}
                    </Box>
                  )}
                  renderInput={params => (
                    <TextField
                      {...params}
                      label='Timezone*'
                      error={Boolean(errors.jobStartDateTimezone)}
                    />
                  )}
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
                name='showPro'
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
              name='jobDescription'
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
          <Button variant='contained' onClick={onSubmit}>
            Save draft
          </Button>
        </Box>
      </form>
      <div id='toast-container'></div>
    </DatePickerWrapper>
  )
}

export default JobInfo
