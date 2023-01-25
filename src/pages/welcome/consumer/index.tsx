// ** React Imports
import { useState, ReactNode, useEffect, useContext, Fragment } from 'react'

// ** MUI Components
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import Box, { BoxProps } from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import { styled as muiStyled, useTheme } from '@mui/material/styles'
import FormHelperText from '@mui/material/FormHelperText'
import InputAdornment from '@mui/material/InputAdornment'
import Typography, { TypographyProps } from '@mui/material/Typography'
import { FormControlLabel, List, useMediaQuery } from '@mui/material'
import Autocomplete from '@mui/material/Autocomplete'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports

import { useForm, Controller, useFieldArray } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
// ** CleaveJS Imports
import Cleave from 'cleave.js/react'
import 'cleave.js/dist/addons/cleave-phone.us'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'
import { Checkbox } from '@mui/material'
import { checkEmailDuplication } from 'src/apis/sign.api'
import { RoleType } from 'src/types/apps/userTypes'
import { useMutation } from 'react-query'

// ** Data
import { countries } from 'src/@fake-db/autocomplete'
import { getGloLanguage } from 'src/shared/transformer/language.transformer'

// ** Third Party Components
import toast from 'react-hot-toast'
import { useRouter } from 'next/router'
import {
  ExperiencedYears,
  JobList,
  Pronunciation,
  RolePair,
  Specialties,
} from 'src/shared/const/personalInfo'
import CleaveWrapper from 'src/@core/styles/libs/react-cleave'
import {
  ConsumerUserInfoType,
  CountryType,
  PersonalInfo,
} from 'src/types/sign/personalInfoTypes'
import { profileSchema } from 'src/types/schema/profile.schema'
import { ModalContext } from 'src/context/ModalContext'
import { useDropzone } from 'react-dropzone'
import styled from 'styled-components'
import {
  getPresignedUrl,
  getUserInfo,
  updateConsumerUserInfo,
} from 'src/apis/user.api'
import axios from 'axios'
import { getUserTokenFromBrowser } from 'src/shared/auth/storage'

const RightWrapper = muiStyled(Box)<BoxProps>(({ theme }) => ({
  width: '100%',
  backgroundColor: '#ffffff',
}))
const BoxWrapper = muiStyled(Box)<BoxProps>(({ theme }) => ({
  width: '100%',
}))

const TypographyStyled = muiStyled(Typography)<TypographyProps>(
  ({ theme }) => ({
    fontWeight: 600,
    letterSpacing: '0.18px',
  }),
)

const Illustration = muiStyled('img')(({ theme }) => ({
  maxWidth: '10rem',

  [theme.breakpoints.down('xl')]: {
    maxWidth: '10rem',
  },
  [theme.breakpoints.down('lg')]: {
    maxWidth: '8rem',
  },
}))

const defaultValues = {
  firstName: '',
  middleName: '',
  lastName: '',
  legalName_pronunciation: '',
  havePreferred: false,
  preferredName: '',
  preferredName_pronunciation: '',
  timezone: { code: '', label: '', phone: '' },
  mobile: '',
  phone: '',
  jobInfo: [{ jobType: '', role: '', source: '', target: '' }],
  experience: '',
  resume: [],
  specialties: [{ label: '', value: '' }],
}

interface FileProp {
  name: string
  type: string
  size: number
}

const PersonalInfoPro = () => {
  const { setModal } = useContext(ModalContext)

  const theme = useTheme()
  const router = useRouter()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))

  const MAXIMUM_FILE_SIZE = 50000000

  const languageList = getGloLanguage()

  // ** states
  const [step, setStep] = useState<1 | 2>(1)
  const [fileSize, setFileSize] = useState(0)

  // ** Hooks
  const auth = useAuth()

  // ** State
  const [files, setFiles] = useState<File[]>([])

  // ** Hooks
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg'],
      'text/csv': ['.cvs'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        ['.docx'],
    },
    onDrop: (acceptedFiles: File[]) => {
      setFiles(acceptedFiles.map((file: File) => Object.assign(file)))
    },
  })

  useEffect(() => {
    if (auth.user?.firstName) {
      const role = auth.user.role.length ? auth.user.role[0] : null
      router.replace(`/${role?.toLowerCase()}/dashboard`)
    }
  }, [auth])

  const handleRemoveFile = (file: FileProp) => {
    const uploadedFiles = files
    const filtered = uploadedFiles.filter((i: FileProp) => i.name !== file.name)
    setFiles([...filtered])
  }

  const fileList = files.map((file: FileProp) => (
    <FileList key={file.name}>
      <div className='file-details'>
        <div className='file-preview'>
          <Icon icon='mdi:file-document-outline' />
        </div>
        <div>
          <Typography className='file-name'>{file.name}</Typography>
          <Typography className='file-size' variant='body2'>
            {Math.round(file.size / 100) / 10 > 1000
              ? `${(Math.round(file.size / 100) / 10000).toFixed(1)} mb`
              : `${(Math.round(file.size / 100) / 10).toFixed(1)} kb`}
          </Typography>
        </div>
      </div>
      <IconButton onClick={() => handleRemoveFile(file)}>
        <Icon icon='mdi:close' fontSize={20} />
      </IconButton>
    </FileList>
  ))

  const {
    control,
    handleSubmit,
    getValues,
    setValue,
    setError,
    clearErrors,
    watch,
    trigger,
    formState: { errors, dirtyFields },
  } = useForm<PersonalInfo>({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(profileSchema),
  })

  const {
    fields: jobInfoFields,
    append,
    remove,
    update,
  } = useFieldArray({
    control,
    name: 'jobInfo',
  })

  useEffect(() => {
    setValue('resume', files, { shouldDirty: true, shouldValidate: true })

    let result = 0
    files.forEach((file: FileProp) => (result += file.size))

    setFileSize(result)
  }, [files])

  useEffect(() => {
    if (fileSize > MAXIMUM_FILE_SIZE) {
      setError('resume', { message: 'File size too large' })
    } else {
      clearErrors('resume')
    }
  }, [fileSize])

  const updateUserInfoMutation = useMutation(
    (data: ConsumerUserInfoType & { userId: number }) =>
      updateConsumerUserInfo(data),
    {
      onSuccess: () => {
        getUserInfo(auth.user?.email as string).then(res => {
          if (auth.user?.role.includes('PRO')) {
            /* @ts-ignore */
            auth.updateUserInfo({
              userId: auth.user.id,
              email: auth.user.email,
            })
            router.push('/pro/dashboard')
          } else {
            router.push('/client/dashboard')
          }
        })
      },
      onError: () => {
        setModal(
          <Box
            sx={{
              padding: '24px',
              textAlign: 'center',
              background: '#ffffff',
              borderRadius: '14px',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <img
                src='/images/icons/project-icons/status-alert-error.png'
                width={60}
                height={60}
                alt='role select error'
              />
              <Typography variant='body2'>
                An error has occurred. Please try again.
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center' }} mt={4}>
              <Button variant='contained' onClick={() => setModal(null)}>
                Okay
              </Button>
            </Box>
          </Box>,
        )
      },
    },
  )

  function isInvalidPhoneNumber(str: string) {
    const regex = /^[0-9]+$/
    return str && !regex.test(str)
  }

  const onSubmit = (data: PersonalInfo) => {
    data.resume?.length &&
      data.resume.forEach(file => {
        getPresignedUrl(auth.user?.id as number, file.name).then(res => {
          const formData = new FormData()
          formData.append('files', file)
          axios
            .put(res, formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
                Authorization:
                  'Bearer ' + typeof window === 'object'
                    ? getUserTokenFromBrowser()
                    : null,
              },
            })
            .then(res => console.log('upload resume success :', res))
            .catch(err => console.log('upload resume failed : ', err))
        })
      })

    const finalData: ConsumerUserInfoType & { userId: number } = {
      userId: auth.user?.id || 0,
      firstName: data.firstName,
      lastName: data.lastName,
      country: data.timezone.label,
      extraData: {
        havePreferredName: data.havePreferred,
        jobInfo: data.jobInfo,
        middleName: data.middleName,
        experience: data.experience,
        legalName_pronunciation: data.legalName_pronunciation,
        mobilePhone: data.mobile,
        telephone: data.phone,
        preferredName: data.preferredName,
        resume: data.resume?.length ? data.resume.map(file => file.name) : [],
        preferredName_pronunciation: data.preferredName_pronunciation,
        pronounce: data.pronounce,
        specialties: data.specialties?.map(item => item.value),
        timezone: data.timezone,
      },
    }
    updateUserInfoMutation.mutate(finalData)
  }

  function addJobInfo() {
    if (jobInfoFields.length >= 10) {
      setModal(
        <Box
          sx={{
            padding: '24px',
            textAlign: 'center',
            background: '#ffffff',
            borderRadius: '14px',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <img
              src='/images/icons/project-icons/status-alert-error.png'
              width={60}
              height={60}
              alt='role select error'
            />
            <Typography variant='body2'>
              You can select up to 10 at maximum.
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center' }} mt={4}>
            <Button variant='contained' onClick={() => setModal(null)}>
              Okay
            </Button>
          </Box>
        </Box>,
      )
      return
    }
    append({ jobType: '', role: '', source: '', target: '' })
  }

  function removeJobInfo(item: { id: string }) {
    const idx = jobInfoFields.map(item => item.id).indexOf(item.id)
    idx !== -1 && remove(idx)
  }

  function onChangeJobInfo(
    id: string,
    value: any,
    item: 'jobType' | 'role' | 'source' | 'target',
  ) {
    const filtered = jobInfoFields.filter(f => f.id! === id)[0]
    const index = jobInfoFields.findIndex(f => f.id! === id)
    let newVal = { ...filtered, [item]: value }
    if (item === 'jobType' && value === 'dtp') {
      newVal = { ...filtered, [item]: value, source: '', target: '' }
    }
    update(index, newVal)
    trigger('jobInfo')
  }

  return (
    <Box className='content-right'>
      {!hidden ? (
        <Box
          sx={{
            maxWidth: '30rem',
            padding: '8rem',
            flex: 1,
            display: 'flex',
            position: 'relative',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          aria-hidden
        >
          <Illustration
            alt='forgot-password-illustration'
            src={`/images/pages/auth-v2-register-multi-steps-illustration.png`}
          />
        </Box>
      ) : null}
      <RightWrapper>
        <Box
          sx={{
            p: 7,
            display: 'flex',
            alignItems: 'center',
            padding: '50px 50px',
            height: '100%',
            maxWidth: '850px',
            margin: 'auto',
          }}
        >
          <BoxWrapper>
            <Box
              sx={{ mb: 6, display: 'flex', alignItems: 'center', gap: '16px' }}
            >
              <Box sx={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <img
                  src={`${
                    step === 1
                      ? '/images/signup/stepper-empty.png'
                      : '/images/signup/stepper-complete.png'
                  }`}
                  width={14}
                  height={14}
                  alt=''
                  aria-hidden
                />
                <TypographyStyled variant='h2'>01</TypographyStyled>
                <Typography>Personal Information</Typography>
              </Box>
              <StepperImgWrapper step={step} style={{ marginBottom: '6px' }}>
                <img src='/images/signup/stepper-line.png' alt='' aria-hidden />
              </StepperImgWrapper>
              <Box sx={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <StepperImgWrapper step={step}>
                  <img
                    src='/images/signup/stepper-empty.png'
                    width={14}
                    height={14}
                    alt=''
                    aria-hidden
                  />
                </StepperImgWrapper>

                <TypographyStyled variant='h2'>02</TypographyStyled>
                <Typography>Application</Typography>
              </Box>
            </Box>

            <form
              noValidate
              autoComplete='off'
              onSubmit={handleSubmit(onSubmit)}
            >
              {step === 1 ? (
                <Box>
                  <Box
                    sx={{
                      display: 'flex',
                      gap: '8px',
                      justifyContent: 'space-between',
                    }}
                  >
                    <FormControl sx={{ mb: 4 }} fullWidth>
                      <Controller
                        name='firstName'
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { value, onChange, onBlur } }) => (
                          <TextField
                            autoFocus
                            value={value}
                            onBlur={onBlur}
                            onChange={onChange}
                            inputProps={{ maxLength: 50 }}
                            error={Boolean(errors.firstName)}
                            placeholder='First name*'
                          />
                        )}
                      />
                      {errors.firstName && (
                        <FormHelperText sx={{ color: 'error.main' }}>
                          {errors.firstName.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                    <FormControl sx={{ mb: 4 }} fullWidth>
                      <Controller
                        name='middleName'
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { value, onChange, onBlur } }) => (
                          <TextField
                            autoFocus
                            value={value}
                            onBlur={onBlur}
                            onChange={onChange}
                            inputProps={{ maxLength: 50 }}
                            error={Boolean(errors.middleName)}
                            placeholder='Middle name'
                          />
                        )}
                      />
                      {errors.middleName && (
                        <FormHelperText sx={{ color: 'error.main' }}>
                          {errors.middleName.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                    <FormControl sx={{ mb: 4 }} fullWidth>
                      <Controller
                        name='lastName'
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { value, onChange, onBlur } }) => (
                          <TextField
                            autoFocus
                            value={value}
                            onBlur={onBlur}
                            onChange={onChange}
                            inputProps={{ maxLength: 50 }}
                            error={Boolean(errors.lastName)}
                            placeholder='Last name*'
                          />
                        )}
                      />
                      {errors.lastName && (
                        <FormHelperText sx={{ color: 'error.main' }}>
                          {errors.lastName.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Box>
                  <Box sx={{ display: 'flex', gap: '8px' }}>
                    <FormControl sx={{ mb: 2 }} fullWidth>
                      <Controller
                        name='legalName_pronunciation'
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { value, onChange, onBlur } }) => (
                          <TextField
                            autoFocus
                            value={value}
                            onBlur={onBlur}
                            onChange={onChange}
                            inputProps={{ maxLength: 200 }}
                            error={Boolean(errors.legalName_pronunciation)}
                            placeholder='Pronunciation'
                          />
                        )}
                      />
                      {errors.legalName_pronunciation && (
                        <FormHelperText sx={{ color: 'error.main' }}>
                          {errors.legalName_pronunciation.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                    <FormControl sx={{ mb: 2 }} fullWidth>
                      <Controller
                        name='pronounce'
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { value, onChange, onBlur } }) => (
                          <>
                            <InputLabel id='legalName_pronounce'>
                              Pronounce
                            </InputLabel>
                            <Select
                              label='legalName_pronounce'
                              value={value}
                              placeholder='Pronounce'
                              onBlur={onBlur}
                              onChange={onChange}
                            >
                              {Pronunciation.map((item, idx) => (
                                <MenuItem value={item.value} key={idx}>
                                  {item.label}
                                </MenuItem>
                              ))}
                            </Select>
                          </>
                        )}
                      />
                      {errors.pronounce && (
                        <FormHelperText sx={{ color: 'error.main' }}>
                          {errors.pronounce.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Box>
                  <Controller
                    name='havePreferred'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <FormControlLabel
                        control={
                          <Checkbox
                            value={value || false}
                            onChange={onChange}
                            onBlur={onBlur}
                            checked={value || false}
                          />
                        }
                        label='I have my preferred name.'
                      />
                    )}
                  />
                  {getValues('havePreferred') && (
                    <Box sx={{ display: 'flex', gap: '8px' }}>
                      <FormControl sx={{ mb: 2 }} fullWidth>
                        <Controller
                          name='preferredName'
                          control={control}
                          rules={{ required: true }}
                          render={({ field: { value, onChange, onBlur } }) => (
                            <TextField
                              autoFocus
                              value={value}
                              onBlur={onBlur}
                              onChange={onChange}
                              inputProps={{ maxLength: 200 }}
                              error={Boolean(errors.preferredName)}
                              placeholder='Preferred name'
                            />
                          )}
                        />
                        {errors.preferredName && (
                          <FormHelperText sx={{ color: 'error.main' }}>
                            {errors.preferredName.message}
                          </FormHelperText>
                        )}
                      </FormControl>
                      <FormControl sx={{ mb: 2 }} fullWidth>
                        <Controller
                          name='preferredName_pronunciation'
                          control={control}
                          rules={{ required: true }}
                          render={({ field: { value, onChange, onBlur } }) => (
                            <TextField
                              autoFocus
                              value={value}
                              onBlur={onBlur}
                              onChange={onChange}
                              inputProps={{ maxLength: 200 }}
                              error={Boolean(
                                errors.preferredName_pronunciation,
                              )}
                              placeholder='Pronunciation'
                            />
                          )}
                        />
                        {errors.preferredName_pronunciation && (
                          <FormHelperText sx={{ color: 'error.main' }}>
                            {errors.preferredName_pronunciation.message}
                          </FormHelperText>
                        )}
                      </FormControl>
                    </Box>
                  )}

                  <Divider />
                  <Box mt={4}>
                    <FormControl sx={{ mb: 2 }} fullWidth>
                      <Controller
                        name='timezone'
                        control={control}
                        render={({ field }) => (
                          <Autocomplete
                            autoHighlight
                            fullWidth
                            {...field}
                            options={countries as CountryType[]}
                            onChange={(e, v) => field.onChange(v)}
                            disableClearable
                            renderOption={(props, option) => (
                              <Box component='li' {...props}>
                                {option.label} ({option.code}) +{option.phone}
                              </Box>
                            )}
                            renderInput={params => (
                              <TextField
                                {...params}
                                label='Time zone*'
                                error={Boolean(errors.timezone)}
                                inputProps={{
                                  ...params.inputProps,
                                  autoComplete: 'new-password',
                                }}
                              />
                            )}
                          />
                        )}
                      />
                      {errors.timezone && (
                        <FormHelperText sx={{ color: 'error.main' }}>
                          {errors.timezone.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Box>
                  {/* phone  */}
                  <Box sx={{ display: 'flex', gap: '8px' }} mt={2}>
                    <FormControl sx={{ mb: 2 }} fullWidth>
                      <Controller
                        name='mobile'
                        control={control}
                        rules={{ required: false }}
                        render={({ field: { value, onChange, onBlur } }) => (
                          <TextField
                            autoFocus
                            id='outlined-basic'
                            label='Mobile phone'
                            variant='outlined'
                            value={value}
                            onBlur={onBlur}
                            onChange={e => {
                              if (isInvalidPhoneNumber(e.target.value)) return
                              onChange(e)
                            }}
                            inputProps={{ maxLength: 50 }}
                            error={Boolean(errors.mobile)}
                            placeholder={
                              !watch('timezone').phone
                                ? `+ 1) 012 345 6789`
                                : `012 345 6789`
                            }
                            InputProps={{
                              startAdornment: watch('timezone').phone && (
                                <InputAdornment position='start'>
                                  {'+' + watch('timezone').phone}
                                </InputAdornment>
                              ),
                            }}
                          />
                        )}
                      />
                      {errors.mobile && (
                        <FormHelperText sx={{ color: 'error.main' }}>
                          {errors.mobile.message}
                        </FormHelperText>
                      )}
                    </FormControl>

                    <FormControl sx={{ mb: 2 }} fullWidth>
                      <Controller
                        name='phone'
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { value, onChange, onBlur } }) => (
                          <TextField
                            autoFocus
                            id='outlined-basic'
                            label='Telephone'
                            variant='outlined'
                            value={value}
                            onBlur={onBlur}
                            onChange={e => {
                              if (isInvalidPhoneNumber(e.target.value)) return
                              onChange(e)
                            }}
                            inputProps={{ maxLength: 50 }}
                            error={Boolean(errors.phone)}
                            placeholder={
                              !watch('timezone').phone
                                ? `+ 1) 012 345 6789`
                                : `012 345 6789`
                            }
                            InputProps={{
                              startAdornment: watch('timezone').phone && (
                                <InputAdornment position='start'>
                                  {'+' + watch('timezone').phone}
                                </InputAdornment>
                              ),
                            }}
                          />
                        )}
                      />
                      {errors.phone && (
                        <FormHelperText sx={{ color: 'error.main' }}>
                          {errors.phone.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Box>
                </Box>
              ) : (
                <Box>
                  {/* JobInfos */}
                  {jobInfoFields?.map((item, idx) => {
                    return (
                      <Box key={item.id} mb={4}>
                        {/* job type & role */}
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                          }}
                        >
                          <Typography mb={3}>
                            {idx < 9 ? 0 : null}
                            {idx + 1}.
                          </Typography>
                          {jobInfoFields.length > 1 && (
                            <IconButton onClick={() => removeJobInfo(item)}>
                              <img
                                src='/images/signup/delete-info.png'
                                alt='delete job information'
                                width={25}
                              />
                            </IconButton>
                          )}
                        </Box>

                        <Box sx={{ display: 'flex', gap: '16px' }}>
                          <FormControl sx={{ mb: 2 }} fullWidth>
                            <Controller
                              name={`jobInfo.${idx}.jobType`}
                              control={control}
                              render={({ field }) => (
                                <>
                                  <InputLabel
                                    id='jobType'
                                    error={
                                      errors.jobInfo?.length
                                        ? !!errors.jobInfo[idx]?.jobType
                                        : false
                                    }
                                  >
                                    Job type*
                                  </InputLabel>
                                  <Select
                                    label='Job type*'
                                    {...field}
                                    error={
                                      errors.jobInfo?.length
                                        ? !!errors.jobInfo[idx]?.jobType
                                        : false
                                    }
                                    value={item.jobType}
                                    placeholder='Job type *'
                                    onChange={e =>
                                      onChangeJobInfo(
                                        item.id,
                                        e.target.value,
                                        'jobType',
                                      )
                                    }
                                  >
                                    {JobList.map((item, idx) => (
                                      <MenuItem value={item.value} key={idx}>
                                        {item.label}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                </>
                              )}
                            />
                            {errors.jobInfo?.length
                              ? errors.jobInfo[idx]?.jobType && (
                                  <FormHelperText sx={{ color: 'error.main' }}>
                                    {errors?.jobInfo[idx]?.jobType?.message}
                                  </FormHelperText>
                                )
                              : ''}
                          </FormControl>
                          <FormControl sx={{ mb: 4 }} fullWidth>
                            <Controller
                              name={`jobInfo.${idx}.role`}
                              control={control}
                              render={({ field }) => (
                                <>
                                  <InputLabel
                                    id='role'
                                    error={
                                      errors.jobInfo?.length
                                        ? !!errors.jobInfo[idx]?.role
                                        : false
                                    }
                                  >
                                    Role*
                                  </InputLabel>
                                  <Select
                                    label='Role*'
                                    {...field}
                                    error={
                                      errors.jobInfo?.length
                                        ? !!errors.jobInfo[idx]?.role
                                        : false
                                    }
                                    value={item.role}
                                    placeholder='Role *'
                                    onChange={e =>
                                      onChangeJobInfo(
                                        item.id,
                                        e.target.value,
                                        'role',
                                      )
                                    }
                                  >
                                    {/* @ts-ignore */}
                                    {RolePair[item.jobType]?.map(
                                      (item: any, idx: number) => (
                                        <MenuItem value={item.value} key={idx}>
                                          {item.label}
                                        </MenuItem>
                                      ),
                                    )}
                                  </Select>
                                </>
                              )}
                            />

                            {errors.jobInfo?.length
                              ? errors.jobInfo[idx]?.role && (
                                  <FormHelperText sx={{ color: 'error.main' }}>
                                    {errors?.jobInfo[idx]?.role?.message}
                                  </FormHelperText>
                                )
                              : ''}
                          </FormControl>
                        </Box>
                        {/* languages */}
                        <Box sx={{ display: 'flex', gap: '16px' }}>
                          <FormControl sx={{ mb: 2 }} fullWidth>
                            <Controller
                              name={`jobInfo.${idx}.source`}
                              control={control}
                              render={({ field }) => (
                                <Autocomplete
                                  autoHighlight
                                  fullWidth
                                  {...field}
                                  disableClearable
                                  disabled={item.jobType === 'dtp'}
                                  value={
                                    languageList.filter(
                                      l => l.value === item.source,
                                    )[0]
                                  }
                                  options={languageList}
                                  onChange={(e, v) =>
                                    onChangeJobInfo(item.id, v?.value, 'source')
                                  }
                                  renderOption={(props, option) => (
                                    <Box
                                      component='li'
                                      {...props}
                                      key={props.id}
                                    >
                                      {option.label}
                                    </Box>
                                  )}
                                  renderInput={params => (
                                    <TextField
                                      {...params}
                                      label='Source*'
                                      error={
                                        errors.jobInfo?.length
                                          ? !!errors.jobInfo[idx]?.source
                                          : false
                                      }
                                      inputProps={{
                                        ...params.inputProps,
                                        autoComplete: 'new-password',
                                      }}
                                    />
                                  )}
                                />
                              )}
                            />

                            {errors.jobInfo?.length
                              ? errors.jobInfo[idx]?.source && (
                                  <FormHelperText sx={{ color: 'error.main' }}>
                                    {errors?.jobInfo[idx]?.source?.message}
                                  </FormHelperText>
                                )
                              : ''}
                          </FormControl>
                          <FormControl sx={{ mb: 2 }} fullWidth>
                            <Controller
                              name={`jobInfo.${idx}.target`}
                              control={control}
                              render={({ field }) => (
                                <Autocomplete
                                  autoHighlight
                                  fullWidth
                                  {...field}
                                  disableClearable
                                  disabled={item.jobType === 'dtp'}
                                  value={
                                    languageList.filter(
                                      l => l.value === item.target,
                                    )[0]
                                  }
                                  options={languageList}
                                  onChange={(e, v) =>
                                    onChangeJobInfo(item.id, v?.value, 'target')
                                  }
                                  renderOption={(props, option) => (
                                    <Box
                                      component='li'
                                      {...props}
                                      key={props.id}
                                    >
                                      {option.label}
                                    </Box>
                                  )}
                                  renderInput={params => (
                                    <TextField
                                      {...params}
                                      label='Target*'
                                      error={
                                        errors.jobInfo?.length
                                          ? !!errors.jobInfo[idx]?.target
                                          : false
                                      }
                                      inputProps={{
                                        ...params.inputProps,
                                        autoComplete: 'new-password',
                                      }}
                                    />
                                  )}
                                />
                              )}
                            />

                            {errors.jobInfo?.length
                              ? errors.jobInfo[idx]?.target && (
                                  <FormHelperText sx={{ color: 'error.main' }}>
                                    {errors?.jobInfo[idx]?.target?.message}
                                  </FormHelperText>
                                )
                              : ''}
                          </FormControl>
                        </Box>
                      </Box>
                    )
                  })}
                  <IconButton
                    onClick={addJobInfo}
                    disabled={jobInfoFields.some(item => {
                      if (item.jobType === 'dtp') {
                        return !item.jobType || !item.role
                      } else {
                        return (
                          !item.jobType ||
                          !item.role ||
                          !item.target ||
                          !item.source
                        )
                      }
                    })}
                  >
                    <img
                      src='/images/signup/add-info.png'
                      width={20}
                      alt='add job information'
                    />
                  </IconButton>
                  <Divider />
                  <Box
                    sx={{
                      marginTop: '16px',
                      display: 'flex',
                      gap: '16px',
                      justifyContent: 'space-between',
                    }}
                  >
                    <FormControl sx={{ mb: 2 }} fullWidth>
                      <Controller
                        name='experience'
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { value, onChange, onBlur } }) => (
                          <>
                            <InputLabel
                              id='experience'
                              error={Boolean(errors.experience)}
                            >
                              Years of experience*
                            </InputLabel>
                            <Select
                              label='experience'
                              value={value}
                              error={Boolean(errors.experience)}
                              placeholder='Years of experience*'
                              onBlur={onBlur}
                              onChange={onChange}
                            >
                              {ExperiencedYears.map((item, idx) => (
                                <MenuItem value={item.value} key={idx}>
                                  {item.label}
                                </MenuItem>
                              ))}
                            </Select>
                          </>
                        )}
                      />
                      {errors.experience && (
                        <FormHelperText sx={{ color: 'error.main' }}>
                          {errors.experience.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                    <FormControl sx={{ mb: 2 }} fullWidth>
                      <Controller
                        name='specialties'
                        control={control}
                        render={({ field }) => (
                          <Autocomplete
                            autoHighlight
                            fullWidth
                            multiple
                            {...field}
                            value={
                              getValues('specialties')[0]?.label === ''
                                ? []
                                : getValues('specialties')
                            }
                            options={Specialties}
                            onChange={(e, v: any, l) => {
                              if (
                                v.length <= 1 &&
                                l === 'removeOption' &&
                                (!v[0]?.value || !v[0]?.label)
                              ) {
                                field.onChange([{ label: '', value: '' }])
                                return
                              }
                              field.onChange(v)
                            }}
                            limitTags={1}
                            renderOption={(props, option, { selected }) => (
                              <li {...props}>
                                <Checkbox
                                  style={{ marginRight: 8 }}
                                  checked={selected}
                                />
                                {option.label}
                              </li>
                            )}
                            id='multiple-limit-tags'
                            renderInput={params => (
                              <TextField
                                {...params}
                                error={Boolean(errors.specialties)}
                                label='Specialties'
                                placeholder='Specialties'
                              />
                            )}
                          />
                        )}
                      />

                      {Boolean(errors.specialties) && (
                        <FormHelperText sx={{ color: 'error.main' }}>
                          This field is required
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Box>
                  <Divider />
                  <Box mb={8}>
                    <FormControl fullWidth>
                      <div {...getRootProps({ className: 'dropzone' })}>
                        <input {...getInputProps()} />
                        <Box
                          sx={{
                            margin: '18px 0 6px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                          }}
                        >
                          <Typography
                            sx={{
                              color: `${
                                Boolean(errors.resume) ? '#FF4D49' : '#6D788D'
                              }`,
                              fontWeight: 'bold',
                            }}
                          >
                            Resume*
                          </Typography>
                          <Button variant='outlined'>Upload Files</Button>
                        </Box>
                      </div>
                    </FormControl>
                    {errors.resume && (
                      <FormHelperText sx={{ color: 'error.main' }} id=''>
                        {errors.resume.message}
                      </FormHelperText>
                    )}
                    {files.length ? (
                      <Fragment>
                        <List>{fileList}</List>
                      </Fragment>
                    ) : null}

                    <Typography variant='body2'>
                      {Math.round(fileSize / 100) / 10 > 1000
                        ? `${(Math.round(fileSize / 100) / 10000).toFixed(
                            1,
                          )} mb`
                        : `${(Math.round(fileSize / 100) / 10).toFixed(1)} kb`}
                      /50mb
                    </Typography>

                    <Divider />
                  </Box>
                </Box>
              )}
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button
                  size='large'
                  type='button'
                  variant='contained'
                  color='secondary'
                  disabled={step === 1}
                  onClick={() => setStep(1)}
                  sx={{ mb: 7 }}
                >
                  &larr; Previous
                </Button>
                {step === 2 ? (
                  <Button
                    size='large'
                    type='submit'
                    variant='contained'
                    sx={{ mb: 7 }}
                    // disabled={!isEmpty(errors)}
                  >
                    Get started &rarr;
                  </Button>
                ) : (
                  <Button
                    size='large'
                    type='button'
                    variant='contained'
                    sx={{ mb: 7 }}
                    disabled={
                      !(
                        dirtyFields.firstName &&
                        dirtyFields.lastName &&
                        dirtyFields.timezone &&
                        (!errors.firstName ||
                          !errors.lastName ||
                          !errors.timezone)
                      )
                    }
                    onClick={e => {
                      e.preventDefault()
                      setStep(2)
                    }}
                  >
                    Next &rarr;
                  </Button>
                )}
              </Box>
            </form>
          </BoxWrapper>
        </Box>
      </RightWrapper>
    </Box>
  )
}

PersonalInfoPro.getLayout = (page: ReactNode) => (
  <BlankLayout>{page}</BlankLayout>
)

PersonalInfoPro.guestGuard = false

PersonalInfoPro.acl = {
  action: 'RE0008',
  subject: 'PRO',
}
// PersonalInfoPro.acl = {
//   action: 'RE0008',
//   subject: 'CLIENT',
// }

export default PersonalInfoPro

const FileList = styled.div`
  display: flex;
  margin-bottom: 8px;
  justify-content: space-between;
  border-radius: 8px;
  padding: 8px;
  border: 1px solid rgba(76, 78, 100, 0.22);
  background: #f9f8f9;
  .file-details {
    display: flex;
    align-items: center;
  }
  .file-preview {
    margin-right: 8px;
    display: flex;
  }

  img {
    width: 38px;
    height: 38px;

    padding: 8px 12px;
    border-radius: 8px;
    border: 1px solid rgba(93, 89, 98, 0.14);
  }

  .file-name {
    font-weight: 600;
  }
`

const StepperImgWrapper = styled.div<{ step: number }>`
  img {
    opacity: ${({ step }) => (step === 1 ? 0.3 : 1)};
  }
`
