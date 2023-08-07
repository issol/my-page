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
import { FormControlLabel, Grid, List, useMediaQuery } from '@mui/material'
import Autocomplete from '@mui/material/Autocomplete'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'

import DatePicker from 'react-datepicker'

import CustomInput from 'src/views/forms/form-elements/pickers/PickersCustomInput'
// ** styled components
import FileItem from 'src/@core/components/fileItem'

// ** Third Party Imports
import { useForm, Controller, useFieldArray, Control } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
// ** CleaveJS Imports
import Cleave from 'cleave.js/react'
import 'cleave.js/dist/addons/cleave-phone.us'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'
import { Checkbox } from '@mui/material'

import { useMutation } from 'react-query'

// ** Data
import { countries } from 'src/@fake-db/autocomplete'
import { getGloLanguage } from 'src/shared/transformer/language.transformer'

// ** helpers
import { getResumeFilePath } from 'src/shared/transformer/filePath.transformer'

// ** Third Party Components
import toast from 'react-hot-toast'
import { useRouter } from 'next/router'

import { useDropzone } from 'react-dropzone'
import CleaveWrapper from 'src/@core/styles/libs/react-cleave'

// ** values
import {
  ProUserInfoType,
  CountryType,
  PersonalInfo,
} from 'src/types/sign/personalInfoTypes'
import { FormErrors } from 'src/shared/const/formErrors'
import { ExperiencedYears } from 'src/shared/const/experienced-years'
import { Pronunciation } from 'src/shared/const/pronunciation'
import { AreaOfExpertiseList } from 'src/shared/const/area-of-expertise/area-of-expertise'
import { JobList } from 'src/shared/const/job/jobs'
import { ProRolePair } from 'src/shared/const/role/roles'

import { getProfileSchema } from 'src/types/schema/profile.schema'
import { ModalContext } from 'src/context/ModalContext'
import styled from 'styled-components'

// ** types
import { FileType } from 'src/types/common/file.type'
import { S3FileType } from 'src/shared/const/signedURLFileType'

// **fetches
import { getUserInfo, updateConsumerUserInfo } from 'src/apis/user.api'
import { getUploadUrlforCommon, uploadFileToS3 } from 'src/apis/common.api'

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
import SelectClientRole from './components/select-role'
import { ClientClassificationType } from '@src/context/types'
import Image from 'next/image'
import CorporateClientForm from './components/corporate-client-form'

const RightWrapper = muiStyled(Box)<BoxProps>(({ theme }) => ({
  width: '100%',
  backgroundColor: '#ffffff',
}))
const BoxWrapper = muiStyled(Box)<BoxProps>(({ theme }) => ({
  width: '100%',
}))

const Illustration = muiStyled('img')(({ theme }) => ({
  maxWidth: '10rem',

  [theme.breakpoints.down('xl')]: {
    maxWidth: '10rem',
  },
  [theme.breakpoints.down('lg')]: {
    maxWidth: '8rem',
  },
}))

const defaultValues: Omit<PersonalInfo, 'address'> = {
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
}

export default function NewClientProfileForm() {
  // ** states
  const [step, setStep] = useState<1 | 2>(1)

  const [clientType, setClientType] = useState<ClientClassificationType | null>(
    null,
  )

  const theme = useTheme()
  const router = useRouter()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))

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
      router.replace(`/`)
    }
  }, [auth])

  const handleRemoveFile = (file: FileType) => {
    const uploadedFiles = files
    const filtered = uploadedFiles.filter((i: FileType) => i.name !== file.name)
    setFiles([...filtered])
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
    formState: { errors, dirtyFields, isValid },
  } = useForm<Omit<PersonalInfo, 'address'>>({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(getProfileSchema('join')),
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
    mode: 'onChange',
    resolver: yupResolver(clientBillingAddressSchema),
  })

  return (
    <Box className='content-right'>
      {/* Logo */}
      <Box
        sx={{
          top: 30,
          left: 40,
          display: 'flex',
          position: 'absolute',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Image
          src='/images/logos/gloz-logo.svg'
          alt='logo'
          width={44}
          height={24}
        />
      </Box>

      {/* Illust */}
      {!hidden && step !== 1 ? (
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
            {step === 1 ? (
              <SelectClientRole
                clientType={clientType}
                setClientType={setClientType}
                setStep={setStep}
              />
            ) : (
              <CorporateClientForm />
            )}
          </BoxWrapper>
        </Box>
      </RightWrapper>
    </Box>
  )
}

NewClientProfileForm.getLayout = (page: ReactNode) => (
  <BlankLayout>{page}</BlankLayout>
)

//TODO: 수정하기
NewClientProfileForm.guestGuard = true

// NewClientProfileForm.subject = {
//   subject: '',
//   can: '',
// }
