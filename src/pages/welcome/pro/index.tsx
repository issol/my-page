// ** React Imports
import { Fragment, ReactNode, useEffect, useRef, useState } from 'react'

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

import Typography, { TypographyProps } from '@mui/material/Typography'
import {
  Checkbox,
  FormControlLabel,
  Grid,
  List,
  useMediaQuery,
} from '@mui/material'
import Autocomplete from '@mui/material/Autocomplete'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'

import DatePicker from 'react-datepicker'

import CustomInput from '@src/views/forms/form-elements/pickers/PickersCustomInput'
// ** styled components
import FileItem from '@src/@core/components/fileItem'

// ** Third Party Imports
import {
  Controller,
  FieldErrors,
  Resolver,
  useFieldArray,
  useForm,
} from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
// ** CleaveJS Imports

import 'cleave.js/dist/addons/cleave-phone.us'
import { v4 as uuidv4 } from 'uuid'
// ** Hooks
// ** Layout Import
import BlankLayout from '@src/@core/layouts/BlankLayout'

import { useMutation } from 'react-query'

// ** Data

import { getGloLanguage } from 'src/shared/transformer/language.transformer'

// ** helpers
import { getResumeFilePath } from '@src/shared/transformer/filePath.transformer'

// ** Third Party Components
import toast from 'react-hot-toast'
import { useRouter } from 'next/router'

import { useDropzone } from 'react-dropzone'

// ** values
import {
  CountryType,
  PersonalInfo,
  ProPersonalInfo,
  ProUserInfoType,
} from '@src/types/sign/personalInfoTypes'
import { FormErrors } from '@src/shared/const/formErrors'
import { ExperiencedYears } from '@src/shared/const/experienced-years'
import { Pronunciation } from '@src/shared/const/pronunciation'
import { AreaOfExpertiseList } from '@src/shared/const/area-of-expertise/area-of-expertise'
import { JobList, ProJobPair } from '@src/shared/const/job/jobs'
import { ProRolePair, RoleList } from '@src/shared/const/role/roles'

import { getProfileSchema } from 'src/types/schema/profile.schema'

import { styled } from '@mui/system'

// ** types
import { FileType } from '@src/types/common/file.type'
import { S3FileType } from '@src/shared/const/signedURLFileType'

// **fetches
import { updateConsumerUserInfo } from '@src/apis/user.api'
import { getUploadUrlforCommon, uploadFileToS3 } from '@src/apis/common.api'

// ** helpers
import { FILE_SIZE } from '@src/shared/const/maximumFileSize'
import { byteToMB, formatFileSize } from '@src/shared/helpers/file-size.helper'
import DatePickerWrapper from '@src/@core/styles/libs/react-datepicker'
import {
  clientBillingAddressDefaultValue,
  clientBillingAddressSchema,
} from '@src/types/schema/client-billing-address.schema'
import ClientBillingAddressesForm from '@src/pages/client/components/forms/client-billing-address'
import { ClientAddressType } from '@src/types/schema/client-address.schema'
import { useRecoilValueLoadable } from 'recoil'
import { authState } from '@src/states/auth'
import useAuth from '@src/hooks/useAuth'

import useModal from '@src/hooks/useModal'
import CustomModal from '@src/@core/components/common-modal/custom-modal'
import { getJobOpeningDetail } from '@src/apis/pro/pro-job-openings.api'
import { timeZoneFormatter } from '@src/shared/helpers/timezone.helper'

import MuiPhone from '@src/pages/components/phone/mui-phone'
import { timezoneSelector } from '@src/states/permission'
import Stepper from '@src/pages/components/stepper'
import { Icon } from '@iconify/react'
import dayjs from 'dayjs'

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

const defaultValues: ProPersonalInfo = {
  firstName: '',
  middleName: '',
  lastName: '',
  legalNamePronunciation: '',
  havePreferred: false,
  preferredName: '',
  preferredNamePronunciation: '',
  timezone: { code: '', label: '', phone: '' },
  mobile: '',
  phone: '',
  jobInfo: [{ jobType: '', role: '', source: '', target: '' }],
  experience: '',
  resume: [],
  specialties: [{ label: '', value: '' }],

  ...clientBillingAddressDefaultValue,
  addressType: 'billing',
}

const steps = [
  {
    title: 'Application form',
  },
  {
    title: 'NDA',
  },
]

const PersonalInfoPro = () => {
  const theme = useTheme()
  const router = useRouter()
  const jobId = router.query
  console.log(router.query)
  console.log(jobId)
  const hidden = useMediaQuery(theme.breakpoints.down('md'))

  const MAXIMUM_FILE_SIZE = FILE_SIZE.PRO_RESUME

  const languageList = getGloLanguage()

  const { openModal, closeModal } = useModal()

  // ** states
  const errorRefs = useRef<(HTMLInputElement | null)[]>([])
  const resumeRef = useRef<HTMLElement | null>(null)
  const [resumeError, setResumeError] = useState(false)
  const [fileSize, setFileSize] = useState(0)
  const [activeStep, setActiveStep] = useState<number>(0)

  // ** Hooks
  const auth = useRecoilValueLoadable(authState)
  const setAuth = useAuth()

  // ** State
  const [files, setFiles] = useState<File[]>([])
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

  // ** Hooks
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      // 'image/*': ['.png', '.jpg', '.jpeg'],
      'text/csv': ['.csv'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        ['.docx'],
    },
    // onDrop: (acceptedFiles: File[]) => {
    //   setFiles(acceptedFiles.map((file: File) => Object.assign(file)))
    // },
    onDrop: (acceptedFiles: File[]) => {
      setFiles(prevFiles => [...prevFiles, ...acceptedFiles])
      setResumeError(false)
    },
  })

  useEffect(() => {
    if (
      auth.state === 'hasValue' &&
      auth.getValue() &&
      auth.getValue().user?.firstName
    ) {
      router.replace(`/`)
    }
  }, [auth])

  const handleRemoveFile = (file: FileType) => {
    const uploadedFiles = files
    const filtered = uploadedFiles.filter((i: FileType) => i.name !== file.name)
    setFiles([...filtered])
  }

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1)
  }

  const handleNext = () => {
    setActiveStep(prevActiveStep => prevActiveStep + 1)
  }

  const fileList = files.map((file: FileType) => (
    <FileItem key={file.name} file={file} onClear={handleRemoveFile} />
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
    setFocus,
    formState: { errors, dirtyFields, isValid, isSubmitted },
  } = useForm<ProPersonalInfo>({
    defaultValues,
    mode: 'onSubmit',
    resolver: yupResolver(
      getProfileSchema('join'),
    ) as unknown as Resolver<ProPersonalInfo>,
  })

  const {
    control: addressControl,
    getValues: getAddress,
    setValue: setAddress,
    setError: setAddressError,
    formState: { errors: addressError, isValid: isAddressValid },
  } = useForm<ClientAddressType>({
    defaultValues: {
      ...clientBillingAddressDefaultValue,
      addressType: 'billing',
    },
    mode: 'onSubmit',
    resolver: yupResolver(
      clientBillingAddressSchema,
    ) as Resolver<ClientAddressType>,
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
    files.forEach((file: FileType) => (result += file.size))

    setFileSize(result)
  }, [files])

  useEffect(() => {
    if (fileSize > MAXIMUM_FILE_SIZE) {
      setError('resume', { message: FormErrors.fileSizeExceed })
    } else {
      clearErrors('resume')
    }
  }, [fileSize])

  const updateUserInfoMutation = useMutation(
    (data: ProUserInfoType & { userId: number }) =>
      updateConsumerUserInfo(data),
    {
      onSuccess: () => {
        const { userId, email, accessToken } = router.query
        const accessTokenAsString: string = accessToken as string
        setAuth.updateUserInfo({
          userId: auth.getValue().user!.id,
          email: auth.getValue().user!.email,
          accessToken: accessTokenAsString,
        })

        router.push('/dashboards/pro')
      },
      onError: () => {
        openModal({
          type: 'ErrorModal',
          children: (
            <CustomModal
              title='Something went wrong. Please try again.'
              soloButton
              rightButtonText='Okay'
              onClick={() => closeModal('ErrorModal')}
              onClose={() => closeModal('ErrorModal')}
              vary='error'
            />
          ),
        })
      },
    },
  )

  function isInvalidPhoneNumber(str: string) {
    const regex = /^[0-9]+$/
    return str && !regex.test(str)
  }

  const onSubmit = (data: Omit<PersonalInfo, 'address'>) => {
    handleNext()

    // if (data.resume?.length) {
    //   const promiseArr = data.resume.map((file, idx) => {
    //     return getUploadUrlforCommon(
    //       S3FileType.RESUME,
    //       getResumeFilePath(auth.getValue().user?.id as number, file.name),
    //     ).then(res => {
    //       return uploadFileToS3(res.url, file)
    //     })
    //   })
    //   Promise.all(promiseArr)
    //     .then(res => {
    //       const finalData: ProUserInfoType & { userId: number } = {
    //         userId: auth.getValue().user?.id || 0,
    //         firstName: data.firstName,
    //         lastName: data.lastName,
    //         country: data.timezone.label,
    //         birthday: data.birthday?.toISOString()!,
    //         extraData: {
    //           havePreferredName: data.havePreferred,
    //           jobInfo: data.jobInfo,
    //           middleName: data.middleName,
    //           experience: data.experience,
    //           legalNamePronunciation: data.legalNamePronunciation,
    //           mobilePhone: data.mobile,
    //           telephone: data.phone,
    //           preferredName: data.preferredName,
    //           resume: data.resume?.length
    //             ? data.resume.map(file => file.name)
    //             : [],
    //           preferredNamePronunciation: data.preferredNamePronunciation,
    //           pronounce: data.pronounce,
    //           specialties: data.specialties?.map(item => item.value),
    //           timezone: data.timezone,
    //           addresses: [getAddress()],
    //         },
    //       }
    //       updateUserInfoMutation.mutate(finalData)
    //     })
    //     .catch(err => {
    //       toast.error(
    //         'Something went wrong while uploading files. Please try again.',
    //         {
    //           position: 'bottom-left',
    //         },
    //       )
    //     })
    // }
  }

  const onError = (errors: FieldErrors<ProPersonalInfo>) => {
    // if(Object.keys(errors))
    console.log(errors)

    const firstErrorName: keyof ProPersonalInfo = Object.keys(
      errors,
    )[0] as keyof ProPersonalInfo
    if (firstErrorName === 'jobInfo') {
      const firstErrorIndex = Number(Object.keys(errors.jobInfo || {})[0])
      const detailError =
        (errors.jobInfo && errors.jobInfo[firstErrorIndex]) ?? {}
      const firstErrorName = Object.keys(detailError)[0]
      console.log(detailError)

      // const detailError = (error.detail && error.detail[detailErrorIndex]) ?? {}
      errorRefs.current[
        firstErrorIndex +
          (firstErrorName === 'jobType'
            ? 0
            : firstErrorName === 'role'
              ? 1
              : firstErrorName === 'source'
                ? 2
                : 3) +
          (firstErrorIndex > 0 ? 3 * firstErrorIndex : 0)
      ]?.focus()
      // setFocus()
    } else if (firstErrorName === 'resume') {
      setResumeError(true)
      resumeRef.current?.focus()
    } else {
      setFocus(firstErrorName)
    }
  }

  function addJobInfo() {
    if (jobInfoFields?.length >= 10) {
      openModal({
        type: 'MaximumError',
        children: (
          <CustomModal
            onClose={() => closeModal('MaximumError')}
            onClick={() => {
              closeModal('MaximumError')
            }}
            vary='error'
            soloButton
            rightButtonText='Okay'
            title={
              <Typography variant='h6'>
                You can select up to 10 at maximum.
              </Typography>
            }
          />
        ),
      })

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
    console.log('onChangeJobInfo', id, value, item)
    const filtered = jobInfoFields.filter(f => f.id! === id)[0]
    const index = jobInfoFields.findIndex(f => f.id! === id)
    let newVal = { ...filtered, [item]: value }
    if (item === 'jobType' && value === 'DTP') {
      newVal = { ...filtered, [item]: value, source: '', target: '' }
    }
    console.log('onChangeJobInfo2', filtered, index, newVal)
    update(index, newVal)
    trigger('jobInfo')
  }

  useEffect(() => {
    if (!router.isReady) return
    if (activeStep === 1 && router.query.jobId) {
      getJobOpeningDetail(Number(router.query.jobId)).then(res => {
        if (res) {
          openModal({
            type: 'FillInDataModal',
            children: (
              <CustomModal
                onClose={() => closeModal('FillInDataModal')}
                onClick={() => {
                  closeModal('FillInDataModal')
                  const jobInfo = jobInfoFields[0]
                  const index = 0
                  let newVal = {
                    ...jobInfo,
                    ['jobType']: res.jobType,
                    ['role']: res.role,
                    ['source']: res.sourceLanguage ?? '',
                    ['target']: res.targetLanguage ?? '',
                  }
                  update(index, newVal)
                  trigger('jobInfo')
                }}
                vary='info'
                rightButtonText='Okay'
                leftButtonText='No, thanks'
                title={
                  <Box>
                    <Typography variant='h6'>
                      It appears that you are signing up to apply for a job.
                    </Typography>
                    <Typography variant='body1' sx={{ mt: '20px' }}>
                      Would you like the application form to be{' '}
                      <Typography
                        variant='body1'
                        fontWeight={600}
                        component={'span'}
                      >
                        automatically filled with the relevant information
                      </Typography>{' '}
                      regarding the job?
                    </Typography>
                  </Box>
                }
              />
            ),
          })
        }
      })
    }
  }, [router.isReady, activeStep])

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
      <RightWrapper sx={{ maxHeight: '100vh', overflow: 'scroll' }}>
        <Box
          sx={{
            // p: 7,
            display: 'flex',
            alignItems: 'center',
            padding: '50px 50px',
            // height: '100%',
            // maxWidth: '850px',
            // height: '100vh',
            // maxHeight: '110vh',

            margin: 'auto',
          }}
        >
          <BoxWrapper>
            <Box sx={{ mb: '64px' }}>
              <Stepper
                activeStep={activeStep}
                steps={steps}
                style={{
                  maxWidth: '70%',
                  // margin: '0 auto',
                  padding: '20px 20px 20px 0',
                }}
              />
            </Box>

            <form
              noValidate
              autoComplete='off'
              onSubmit={handleSubmit(onSubmit, onError)}
            >
              {activeStep === 0 ? (
                <Box>
                  <Typography fontSize={20} fontWeight={500} mb={'20px'}>
                    Personal information
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      gap: '20px',
                      // justifyContent: 'space-between',
                    }}
                  >
                    <FormControl fullWidth className='filterFormControl'>
                      <Typography fontSize={14} fontWeight={600} mb='8px'>
                        First name{' '}
                        <Typography component={'span'} color='#666CFF'>
                          *
                        </Typography>
                      </Typography>
                      <Controller
                        name='firstName'
                        control={control}
                        rules={{ required: true }}
                        render={({
                          field: { value, onChange, onBlur, ref },
                        }) => (
                          <TextField
                            autoComplete='off'
                            value={value}
                            // onBlur={onBlur}
                            inputRef={ref}
                            onChange={onChange}
                            sx={{ height: '46px' }}
                            inputProps={{
                              maxLength: 50,
                              style: { height: '46px', padding: '0 14px' },
                            }}
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
                    <FormControl fullWidth className='filterFormControl'>
                      <Typography fontSize={14} fontWeight={600} mb='8px'>
                        Middle name{' '}
                        <Typography
                          component={'span'}
                          color='#666CFF'
                        ></Typography>
                      </Typography>
                      <Controller
                        name='middleName'
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { value, onChange, onBlur } }) => (
                          <TextField
                            autoComplete='off'
                            value={value}
                            // onBlur={onBlur}
                            onChange={onChange}
                            inputProps={{
                              maxLength: 50,
                              style: {
                                height: '46px',
                                padding: '0 14px',
                              },
                            }}
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
                    <FormControl fullWidth className='filterFormControl'>
                      <Typography fontSize={14} fontWeight={600} mb='8px'>
                        Last name{' '}
                        <Typography component={'span'} color='#666CFF'>
                          *
                        </Typography>
                      </Typography>
                      <Controller
                        name='lastName'
                        control={control}
                        rules={{ required: true }}
                        render={({
                          field: { value, onChange, onBlur, ref },
                        }) => (
                          <TextField
                            autoComplete='off'
                            value={value}
                            // onBlur={onBlur}
                            inputRef={ref}
                            sx={{ height: '46px' }}
                            onChange={onChange}
                            inputProps={{
                              maxLength: 50,
                              style: {
                                height: '46px',
                                padding: '0 14px',
                              },
                            }}
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
                  <Box
                    sx={{
                      display: 'flex',
                      width: '100%',
                      flexDirection: 'column',
                      mt: '8px',
                      paddingLeft: '16px',
                    }}
                  >
                    <Typography fontSize={14} color='#8D8E9A'>
                      *Please enter your{' '}
                      <Typography
                        component={'span'}
                        color='#666CFF'
                        fontWeight={600}
                        fontSize={14}
                      >
                        legal name in English
                      </Typography>{' '}
                      as it appears on your I.D., passport, or bank account.
                    </Typography>
                    <Typography fontSize={14} color='#8D8E9A'>
                      *Your payment may be affected if the spelling is
                      different.
                    </Typography>
                    <Typography fontSize={14} color='#8D8E9A'>
                      *Do NOT use all caps
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      gap: '20px',
                      mt: '20px',
                      alignItems: 'self-end',
                      // alignItems: 'center',
                    }}
                  >
                    <Box sx={{ display: 'flex', flex: 1 }}>
                      <FormControl fullWidth className='filterFormControl'>
                        <Typography fontSize={14} fontWeight={600} mb='8px'>
                          Pronunciation
                          <Typography
                            component={'span'}
                            color='#666CFF'
                          ></Typography>
                        </Typography>
                        <Controller
                          name='legalNamePronunciation'
                          control={control}
                          rules={{ required: true }}
                          render={({ field: { value, onChange, onBlur } }) => (
                            <TextField
                              autoComplete='off'
                              value={value}
                              onBlur={onBlur}
                              onChange={onChange}
                              sx={{ height: '46px' }}
                              inputProps={{
                                maxLength: 200,
                                style: {
                                  height: '46px',
                                  padding: '0 14px',
                                },
                              }}
                              error={Boolean(errors.legalNamePronunciation)}
                              placeholder='Pronunciation'
                            />
                          )}
                        />
                        {errors.legalNamePronunciation && (
                          <FormHelperText sx={{ color: 'error.main' }}>
                            {errors.legalNamePronunciation.message}
                          </FormHelperText>
                        )}
                      </FormControl>
                    </Box>
                    <Box sx={{ display: 'flex', flex: 1 }}>
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
                    </Box>
                  </Box>

                  {getValues('havePreferred') && (
                    <Box sx={{ display: 'flex', gap: '20px', mt: '20px' }}>
                      <FormControl fullWidth className='filterFormControl'>
                        <Typography fontSize={14} fontWeight={600} mb='8px'>
                          Preferred name
                          <Typography
                            component={'span'}
                            color='#666CFF'
                          ></Typography>
                        </Typography>
                        <Controller
                          name='preferredName'
                          control={control}
                          rules={{ required: true }}
                          render={({ field: { value, onChange, onBlur } }) => (
                            <TextField
                              autoComplete='off'
                              value={value}
                              onBlur={onBlur}
                              onChange={onChange}
                              sx={{ height: '46px' }}
                              inputProps={{
                                maxLength: 200,
                                style: {
                                  height: '46px',
                                  padding: '0 14px',
                                },
                              }}
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
                      <FormControl fullWidth className='filterFormControl'>
                        <Typography fontSize={14} fontWeight={600} mb='8px'>
                          Pronunciation
                          <Typography
                            component={'span'}
                            color='#666CFF'
                          ></Typography>
                        </Typography>
                        <Controller
                          name='preferredNamePronunciation'
                          control={control}
                          rules={{ required: true }}
                          render={({ field: { value, onChange, onBlur } }) => (
                            <TextField
                              autoComplete='off'
                              value={value}
                              onBlur={onBlur}
                              onChange={onChange}
                              inputProps={{
                                maxLength: 200,
                                style: {
                                  height: '46px',
                                  padding: '0 14px',
                                },
                              }}
                              error={Boolean(errors.preferredNamePronunciation)}
                              placeholder='Pronunciation'
                            />
                          )}
                        />
                        {errors.preferredNamePronunciation && (
                          <FormHelperText sx={{ color: 'error.main' }}>
                            {errors.preferredNamePronunciation.message}
                          </FormHelperText>
                        )}
                      </FormControl>
                    </Box>
                  )}
                  <Box sx={{ display: 'flex', gap: '20px', mt: '20px' }}>
                    <FormControl fullWidth>
                      <Typography fontSize={14} fontWeight={600} mb='8px'>
                        Date of birth
                        <Typography component={'span'} color='#666CFF'>
                          *
                        </Typography>
                      </Typography>
                      <DatePickerWrapper>
                        <Controller
                          control={control}
                          name='birthday'
                          render={({ field: { onChange, value, ref } }) => {
                            const selected = value ? new Date(value) : null
                            return (
                              <Box sx={{ width: '100%' }}>
                                <DatePicker
                                  shouldCloseOnSelect={false}
                                  selected={selected}
                                  isClearable={true}
                                  onChange={onChange}
                                  placeholderText='MM/DD/YYYY'
                                  showYearDropdown
                                  scrollableYearDropdown
                                  customInput={
                                    <Box>
                                      <CustomInput
                                        // label='Date of birth*'
                                        icon='calendar'
                                        sx={{ height: '46px' }}
                                        error={Boolean(errors?.birthday)}
                                        placeholder='MM/DD/YYYY'
                                        ref={ref}
                                        value={
                                          value
                                            ? dayjs(value).format('MM/DD/YYYY')
                                            : ''
                                        }
                                      />
                                    </Box>
                                  }
                                />
                              </Box>
                            )
                          }}
                        />
                      </DatePickerWrapper>
                      {errors.birthday && (
                        <FormHelperText sx={{ color: 'error.main' }}>
                          {errors.birthday.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                    <FormControl fullWidth className='filterFormControl'>
                      <Typography fontSize={14} fontWeight={600} mb='8px'>
                        Pronouns
                        <Typography
                          component={'span'}
                          color='#666CFF'
                        ></Typography>
                      </Typography>
                      <Controller
                        name='pronounce'
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { value, onChange, onBlur } }) => (
                          <>
                            <Select
                              // label='legalName_pronounce'
                              value={value}
                              placeholder='Pronouns'
                              onBlur={onBlur}
                              onChange={onChange}
                              sx={{ height: '46px' }}
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

                  <Box sx={{ display: 'flex', gap: '20px', mt: '20px' }}>
                    <FormControl fullWidth>
                      <Typography fontSize={14} fontWeight={600}>
                        Mobile phone
                        <Typography
                          component={'span'}
                          color='#666CFF'
                        ></Typography>
                      </Typography>
                      <Controller
                        name='mobile'
                        control={control}
                        rules={{ required: false }}
                        render={({ field: { value, onChange, onBlur } }) => (
                          <MuiPhone
                            value={value || ''}
                            onChange={onChange}

                            // label={'Mobile phone'}
                          />
                        )}
                      />
                      {errors.mobile && (
                        <FormHelperText sx={{ color: 'error.main' }}>
                          {errors.mobile.message}
                        </FormHelperText>
                      )}
                    </FormControl>

                    <FormControl fullWidth>
                      <Typography fontSize={14} fontWeight={600}>
                        Telephone
                        <Typography
                          component={'span'}
                          color='#666CFF'
                        ></Typography>
                      </Typography>
                      <Controller
                        name='phone'
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { value, onChange, onBlur } }) => (
                          <MuiPhone
                            value={value || ''}
                            onChange={onChange}
                            // label={'Telephone'}
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

                  <Divider sx={{ my: '20px !important' }} />
                  <Box>
                    <Typography fontSize={20} fontWeight={500}>
                      Permanent address
                    </Typography>
                    <Typography
                      fontSize={14}
                      fontWeight={400}
                      color='#8D8E9A'
                      sx={{ paddingLeft: '16px', mb: '20px', mt: '8px' }}
                    >
                      *Please enter your{' '}
                      <Typography
                        fontSize={14}
                        color='#666CFF'
                        component={'span'}
                        fontWeight={600}
                      >
                        address in English
                      </Typography>{' '}
                      as it appears on your I.D., passport, or bank account.
                    </Typography>
                    <Grid container spacing={5}>
                      <ClientBillingAddressesForm
                        control={control}
                        errors={errors}
                      />
                    </Grid>
                  </Box>
                  <Divider sx={{ my: '20px !important' }} />
                  <Box>
                    <Typography fontSize={20} fontWeight={500}>
                      Work-related information
                    </Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                        mt: '16px',
                        '.MuiInputBase-root': {
                          height: '46px',
                          padding: '0 10px',
                        },
                      }}
                    >
                      <Typography fontSize={14} fontWeight={600}>
                        Timezone&nbsp;
                        <Typography component={'span'} color='#666CFF'>
                          *
                        </Typography>
                      </Typography>
                      <Controller
                        name='timezone'
                        control={control}
                        render={({ field }) => (
                          <Autocomplete
                            autoHighlight
                            fullWidth
                            {...field}
                            options={timeZoneList as CountryType[]}
                            onChange={(e, v) => field.onChange(v)}
                            disableClearable
                            renderOption={(props, option) => (
                              <Box component='li' {...props} key={uuidv4()}>
                                {timeZoneFormatter(option, timezone.getValue())}
                              </Box>
                            )}
                            renderInput={params => (
                              <TextField
                                {...params}
                                autoComplete='off'
                                error={Boolean(errors.timezone)}
                                inputProps={{
                                  ...params.inputProps,
                                }}
                              />
                            )}
                            getOptionLabel={option =>
                              timeZoneFormatter(option, timezone.getValue()) ??
                              ''
                            }
                          />
                        )}
                      />
                      {errors.timezone && (
                        <FormHelperText sx={{ color: 'error.main' }}>
                          {errors.timezone.message}
                        </FormHelperText>
                      )}
                    </Box>
                    <Box sx={{ display: 'flex', gap: '20px', mt: '20px' }}>
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '8px',
                          flex: 1,
                          '.MuiInputBase-root': {
                            height: '46px',
                            padding: '0 10px',
                          },
                        }}
                      >
                        <Typography fontSize={14} fontWeight={600}>
                          Years of experience&nbsp;
                          <Typography component={'span'} color='#666CFF'>
                            *
                          </Typography>
                        </Typography>
                        <Controller
                          name='experience'
                          control={control}
                          rules={{ required: true }}
                          render={({ field: { value, onChange, onBlur } }) => (
                            <Autocomplete
                              fullWidth
                              options={ExperiencedYears}
                              getOptionLabel={option => option.label}
                              value={{ label: value, value: value }}
                              onChange={(event, item) => {
                                console.log('event', event, item)
                                onChange(item ? item.value : '')
                              }}
                              renderInput={params => (
                                <TextField
                                  {...params}
                                  autoComplete='off'
                                  error={Boolean(errors.experience)}
                                />
                              )}
                            />
                          )}
                        />
                        {errors.experience && (
                          <FormHelperText sx={{ color: 'error.main' }}>
                            {errors.experience.message}
                          </FormHelperText>
                        )}
                      </Box>
                      <Box
                        sx={{
                          display: 'flex',
                          flex: 1,
                          flexDirection: 'column',
                          gap: '8px',
                          '.MuiInputBase-root': {
                            height: '46px',
                            padding: '0 10px',
                          },
                        }}
                      >
                        <Typography fontSize={14} fontWeight={600}>
                          Specialties
                          <Typography
                            component={'span'}
                            color='#666CFF'
                          ></Typography>
                        </Typography>
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
                              options={AreaOfExpertiseList}
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
                                  autoComplete='off'
                                  error={Boolean(errors.specialties)}
                                />
                              )}
                            />
                          )}
                        />

                        {Boolean(errors.specialties) && (
                          <FormHelperText sx={{ color: 'error.main' }}>
                            {FormErrors.required}
                          </FormHelperText>
                        )}
                      </Box>
                    </Box>
                    <Box
                      sx={{
                        border:
                          errors.resume && isSubmitted
                            ? '1px dashed #FF4D49'
                            : '1px dashed #666CFF',
                        borderRadius: '10px',
                        padding: '20px',
                        mt: '20px',
                      }}
                      ref={resumeRef}
                    >
                      <div {...getRootProps({ className: 'dropzone' })}>
                        <input {...getInputProps()} />
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '10px',
                          }}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '4px',
                            }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'end' }}>
                              <Typography fontSize={14} fontWeight={600}>
                                Resume&nbsp;
                                <Typography
                                  component={'span'}
                                  color={
                                    errors.resume && isSubmitted
                                      ? '#FF4D49'
                                      : '#666CFF'
                                  }
                                >
                                  *&nbsp;
                                </Typography>
                              </Typography>
                              <Typography
                                fontSize={14}
                                color={
                                  errors.resume && isSubmitted
                                    ? '#4C4E6499'
                                    : '#666CFF'
                                }
                              >
                                Supports only csv. pdf. and docx.
                              </Typography>
                            </Box>
                            <Typography
                              fontSize={14}
                              color='rgba(76, 78, 100, 0.60)'
                              fontWeight={400}
                            >
                              {formatFileSize(fileSize)}/{' '}
                              {byteToMB(MAXIMUM_FILE_SIZE)}
                            </Typography>
                          </Box>

                          <Button variant='contained' size='small'>
                            Upload
                          </Button>
                        </Box>
                        <Box
                          sx={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(2, 1fr)',
                            mt: '20px',
                            width: '100%',
                            gap: '20px',
                          }}
                        >
                          {files.length > 0
                            ? files.map((value, index) => (
                                <FileItem
                                  key={uuidv4()}
                                  file={value}
                                  onClear={handleRemoveFile}
                                />
                              ))
                            : null}
                        </Box>
                      </div>
                    </Box>
                  </Box>
                  <Divider sx={{ my: '20px !important' }} />
                  <Box>
                    <Typography fontSize={20} fontWeight={500}>
                      Applying Role{' '}
                      <Typography
                        component={'span'}
                        color='#666CFF'
                        fontSize={20}
                        fontWeight={500}
                      >
                        *
                      </Typography>
                    </Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        paddingLeft: '16px',
                        mt: '8px',
                      }}
                    >
                      <Typography
                        color='#8D8E9A'
                        fontSize={14}
                        fontWeight={400}
                      >
                        *After sign-up, you'll automatically be enrolled for the
                        certification test for your applied role here.
                      </Typography>
                      <Typography
                        color='#8D8E9A'
                        fontSize={14}
                        fontWeight={400}
                      >
                        *Applying here does not guarantee that you will be able
                        to take a test immediately.
                      </Typography>
                    </Box>
                    <Box sx={{ mt: '16px' }}>
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
                              {jobInfoFields?.length > 1 && (
                                <IconButton onClick={() => removeJobInfo(item)}>
                                  <img
                                    src='/images/signup/delete-info.png'
                                    alt='delete job information'
                                    width={25}
                                  />
                                </IconButton>
                              )}
                            </Box>

                            <Box sx={{ display: 'flex', gap: '20px' }}>
                              <Box
                                sx={{
                                  display: 'flex',
                                  flex: 1,
                                  flexDirection: 'column',
                                  gap: '8px',
                                  '.MuiInputBase-root': {
                                    height: '46px',
                                    padding: '0 10px',
                                  },
                                }}
                              >
                                <Typography fontSize={14} fontWeight={600}>
                                  Job type&nbsp;
                                  <Typography
                                    component={'span'}
                                    color='#666CFF'
                                  >
                                    *
                                  </Typography>
                                </Typography>
                                <Controller
                                  name={`jobInfo.${idx}.jobType`}
                                  control={control}
                                  render={({ field }) => (
                                    <Autocomplete
                                      fullWidth
                                      options={
                                        item.role && item.role !== ''
                                          ? /* @ts-ignore */
                                            ProJobPair[item.role] ?? JobList
                                          : JobList
                                      }
                                      getOptionLabel={option => option.label}
                                      value={{
                                        label: item.jobType,
                                        value: item.jobType,
                                      }}
                                      onChange={(e, newValue) =>
                                        onChangeJobInfo(
                                          item.id,
                                          newValue?.value ?? '',
                                          'jobType',
                                        )
                                      }
                                      renderInput={params => (
                                        <TextField
                                          {...params}
                                          autoComplete='off'
                                          inputRef={ref => {
                                            errorRefs.current[
                                              idx + (idx > 0 ? 3 * idx : 0)
                                            ] = ref
                                          }}
                                          error={
                                            errors.jobInfo?.length
                                              ? !!errors.jobInfo[idx]?.jobType
                                              : false
                                          }
                                        />
                                      )}
                                    />
                                  )}
                                />
                                {errors.jobInfo?.length
                                  ? errors.jobInfo[idx]?.jobType && (
                                      <FormHelperText
                                        sx={{ color: 'error.main' }}
                                      >
                                        {errors?.jobInfo[idx]?.jobType?.message}
                                      </FormHelperText>
                                    )
                                  : ''}
                              </Box>
                              <Box
                                sx={{
                                  display: 'flex',
                                  flex: 1,
                                  flexDirection: 'column',
                                  gap: '8px',
                                  '.MuiInputBase-root': {
                                    height: '46px',
                                    padding: '0 10px',
                                  },
                                }}
                              >
                                <Typography fontSize={14} fontWeight={600}>
                                  Role&nbsp;
                                  <Typography
                                    component={'span'}
                                    color='#666CFF'
                                  >
                                    *
                                  </Typography>
                                </Typography>
                                <Controller
                                  name={`jobInfo.${idx}.role`}
                                  control={control}
                                  render={({ field }) => (
                                    <Autocomplete
                                      fullWidth
                                      options={
                                        item.jobType && item.jobType !== ''
                                          ? /* @ts-ignore */
                                            ProRolePair[item.jobType]
                                          : RoleList
                                      }
                                      getOptionLabel={option => option.label}
                                      value={{
                                        label: item.role,
                                        value: item.role,
                                      }}
                                      onChange={(e, newValue) =>
                                        onChangeJobInfo(
                                          item.id,
                                          newValue?.value ?? '',
                                          'role',
                                        )
                                      }
                                      renderInput={params => (
                                        <TextField
                                          {...params}
                                          autoComplete='off'
                                          inputRef={ref => {
                                            errorRefs.current[
                                              idx + 1 + (idx > 0 ? 3 * idx : 0)
                                            ] = ref
                                          }}
                                          error={
                                            errors.jobInfo?.length
                                              ? !!errors.jobInfo[idx]?.role
                                              : false
                                          }
                                        />
                                      )}
                                    />
                                  )}
                                />
                                {errors.jobInfo?.length
                                  ? errors.jobInfo[idx]?.role && (
                                      <FormHelperText
                                        sx={{ color: 'error.main' }}
                                      >
                                        {errors?.jobInfo[idx]?.role?.message}
                                      </FormHelperText>
                                    )
                                  : ''}
                              </Box>
                            </Box>
                            {/* languages */}
                            <Box
                              sx={{ display: 'flex', gap: '20px', mt: '20px' }}
                            >
                              <Box
                                sx={{
                                  display: 'flex',
                                  flex: 1,
                                  flexDirection: 'column',
                                  gap: '8px',
                                  '.MuiInputBase-root': {
                                    height: '46px',
                                    padding: '0 10px',
                                  },
                                }}
                              >
                                <Typography fontSize={14} fontWeight={600}>
                                  Source&nbsp;
                                  <Typography
                                    component={'span'}
                                    color='#666CFF'
                                  >
                                    *
                                  </Typography>
                                </Typography>
                                <Controller
                                  name={`jobInfo.${idx}.source`}
                                  control={control}
                                  render={({ field }) => (
                                    <Autocomplete
                                      autoHighlight
                                      fullWidth
                                      {...field}
                                      disableClearable
                                      disabled={item.jobType === 'DTP'}
                                      value={
                                        languageList.filter(
                                          l => l.value === item.source,
                                        )[0]
                                      }
                                      options={languageList}
                                      onChange={(e, v) =>
                                        onChangeJobInfo(
                                          item.id,
                                          v?.value,
                                          'source',
                                        )
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
                                          autoComplete='off'
                                          inputRef={ref => {
                                            errorRefs.current[
                                              idx + 2 + (idx > 0 ? 3 * idx : 0)
                                            ] = ref
                                          }}
                                          error={
                                            errors.jobInfo?.length
                                              ? !!errors.jobInfo[idx]?.source
                                              : false
                                          }
                                          inputProps={{
                                            ...params.inputProps,
                                          }}
                                        />
                                      )}
                                    />
                                  )}
                                />

                                {errors.jobInfo?.length
                                  ? errors.jobInfo[idx]?.source && (
                                      <FormHelperText
                                        sx={{ color: 'error.main' }}
                                      >
                                        {errors?.jobInfo[idx]?.source?.message}
                                      </FormHelperText>
                                    )
                                  : ''}
                              </Box>
                              <Box
                                sx={{
                                  display: 'flex',
                                  flex: 1,
                                  flexDirection: 'column',

                                  gap: '8px',
                                  '.MuiInputBase-root': {
                                    height: '46px',
                                    padding: '0 10px',
                                  },
                                }}
                              >
                                <Typography fontSize={14} fontWeight={600}>
                                  Target&nbsp;
                                  <Typography
                                    component={'span'}
                                    color='#666CFF'
                                  >
                                    *
                                  </Typography>
                                </Typography>
                                <Controller
                                  name={`jobInfo.${idx}.target`}
                                  control={control}
                                  render={({ field }) => (
                                    <Autocomplete
                                      autoHighlight
                                      fullWidth
                                      {...field}
                                      disableClearable
                                      disabled={item.jobType === 'DTP'}
                                      value={
                                        languageList.filter(
                                          l => l.value === item.target,
                                        )[0]
                                      }
                                      options={languageList}
                                      onChange={(e, v) =>
                                        onChangeJobInfo(
                                          item.id,
                                          v?.value,
                                          'target',
                                        )
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
                                          autoComplete='off'
                                          inputRef={ref => {
                                            errorRefs.current[
                                              idx + 3 + (idx > 0 ? 3 * idx : 0)
                                            ] = ref
                                          }}
                                          error={
                                            errors.jobInfo?.length
                                              ? !!errors.jobInfo[idx]?.target
                                              : false
                                          }
                                          inputProps={{
                                            ...params.inputProps,
                                          }}
                                        />
                                      )}
                                    />
                                  )}
                                />

                                {errors.jobInfo?.length
                                  ? errors.jobInfo[idx]?.target && (
                                      <FormHelperText
                                        sx={{ color: 'error.main' }}
                                      >
                                        {errors?.jobInfo[idx]?.target?.message}
                                      </FormHelperText>
                                    )
                                  : ''}
                              </Box>
                            </Box>
                          </Box>
                        )
                      })}
                      <IconButton
                        onClick={addJobInfo}
                        disabled={jobInfoFields.some(item => {
                          if (item.jobType === 'DTP') {
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
                    </Box>
                  </Box>
                </Box>
              ) : (
                <Box>{/* NDA */}</Box>
              )}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  mt: '32px',
                }}
              >
                <Button
                  size='large'
                  type='button'
                  variant='outlined'
                  color='secondary'
                  disabled={activeStep === 0}
                  onClick={() => handleBack()}
                  sx={{ mb: 7 }}
                >
                  <Icon icon='mdi:arrow-left' /> &nbsp;Previous
                </Button>
                {activeStep === 1 ? (
                  <Button
                    size='large'
                    type='button'
                    variant='contained'
                    disabled={!isValid}
                    sx={{ mb: 7 }}
                  >
                    Get started &nbsp; <Icon icon='mdi:arrow-right' />
                  </Button>
                ) : (
                  <Button
                    size='large'
                    // type='button'
                    variant='contained'
                    type='submit'
                    sx={{ mb: 7 }}
                    // disabled={
                    //   !(
                    //     dirtyFields.firstName &&
                    //     dirtyFields.lastName &&
                    //     dirtyFields.timezone &&
                    //     dirtyFields.birthday &&
                    //     (!errors.firstName ||
                    //       !errors.lastName ||
                    //       !errors.timezone ||
                    //       !errors.birthday)
                    //   ) || !isAddressValid
                    // }
                    // onClick={e => {
                    //   e.preventDefault()
                    //   handleNext()
                    // }}
                  >
                    Next &nbsp;
                    <Icon icon='mdi:arrow-right' />
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

PersonalInfoPro.acl = {
  action: 'update',
  subject: 'personalInfo_pro',
}

export default PersonalInfoPro
// const StepperImgWrapper = styled('div')<{ step: number }>`
//   img {
//     opacity: ${({ step }) => (step === 1 ? 0.3 : 1)};
//   }
// `
