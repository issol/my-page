// ** React Imports
import { useState, ReactNode, MouseEvent, useEffect } from 'react'

// ** MUI Components
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import Box, { BoxProps } from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import { styled as muiStyled, useTheme } from '@mui/material/styles'
import FormHelperText from '@mui/material/FormHelperText'
import InputAdornment from '@mui/material/InputAdornment'
import Typography, { TypographyProps } from '@mui/material/Typography'
import { Card, CardContent, Link, useMediaQuery } from '@mui/material'

import cloneDeep from 'lodash/cloneDeep'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'
import { Checkbox } from '@mui/material'
import { checkEmailDuplication } from 'src/apis/sign.api'
import { RoleType } from 'src/types/apps/userTypes'
import { useMutation } from 'react-query'

// ** Third Party Components
import toast from 'react-hot-toast'
import { useRouter } from 'next/router'
import { checkName } from 'src/shared/helpers/profile.validator'

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
    marginBottom: theme.spacing(1.5),
    [theme.breakpoints.down('md')]: { marginTop: theme.spacing(8) },
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

const profileErrorMsg = {
  name_regex: '',
  required: 'This field is required.',
} as const

const schema = yup.object().shape({
  // email: yup
  //   .string()
  //   .email('Invalid email address')
  //   .test(
  //     'email-duplication',
  //     'This email is already registered',
  //     (val: any) => {
  //       return new Promise((resolve, reject) => {
  //         checkEmailDuplication(val)
  //           .then(() => {
  //             resolve(true)
  //           })
  //           .catch((e: any) => {
  //             reject(true)
  //           })
  //       })
  //     },
  //   )
  //   .required('This field is required'),
  // password: yup
  //   .string()
  //   .test('password-validation', '', (val: any) => {
  //     return (
  //       val.length >= 9 &&
  //       val.length <= 20 &&
  //       /[a-z]/g.test(val) &&
  //       /[A-Z]/g.test(val) &&
  //       /[0-9]/g.test(val) &&
  //       /[$@$!%*#?&]/g.test(val)
  //     )
  //   })
  //   .required('This field is required'),
  firstName: yup
    .string()
    .test('name-regex', profileErrorMsg.name_regex, (val: any) =>
      checkName(val),
    )
    .required(profileErrorMsg.required),
  middleName: yup
    .string()
    .nullable()
    .test('name-regex', profileErrorMsg.name_regex, (val: any) => {
      if (val === '' || val === null) return true
      return checkName(val)
    }),
  lastName: yup
    .string()
    .test('name-regex', profileErrorMsg.name_regex, (val: any) =>
      checkName(val),
    )
    .required(profileErrorMsg.required),
})

const defaultValues = {
  firstName: '',
  middleName: '',
  lastName: '',
  pronunciation: '',
  pronounce: '',
  havePreferred: false,
  timezone: '',
  mobile: '',
  phone: '',
  jobInfo: [{ jobType: '', role: '', source: '', target: '' }],
  experience: '',
  resume: null,
  specialties: '',
}

interface FormData {
  firstName: string
  middleName?: string
  lastName: string
  pronunciation?: ''
  pronounce?: ''
  havePreferred: boolean
  timezone: ''
  mobile?: ''
  phone?: ''
  jobInfo: [{ jobType: ''; role: ''; source: ''; target: '' }]
  experience: ''
  resume: null
  specialties?: ''
}

const PersonalInfo = () => {
  const theme = useTheme()
  const router = useRouter()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))

  // ** states
  const [step, setStep] = useState<1 | 2>(1)

  // ** Hooks
  const auth = useAuth()

  const {
    control,
    setError,
    handleSubmit,
    clearErrors,
    getValues,
    setValue,
    watch,
    formState: { errors, dirtyFields },
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema),
  })

  const onSubmit = (data: FormData) => {
    // const { email, password } = data
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
          }}
        >
          <BoxWrapper>
            <Box
              sx={{ mb: 6, display: 'flex', alignItems: 'center', gap: '16px' }}
            >
              <Box sx={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <TypographyStyled variant='h2'>01</TypographyStyled>
                <Typography>Personal Information</Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <TypographyStyled variant='h2'>02</TypographyStyled>
                <Typography>Application</Typography>
              </Box>
            </Box>

            {/* <form
              noValidate
              autoComplete='off'
              onSubmit={handleSubmit(onSubmit)}
            >
              <FormControl fullWidth sx={{ mb: 4 }}>
                <Controller
                  name='email'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <TextField
                      autoFocus
                      label='Email'
                      value={value}
                      onBlur={onBlur}
                      onChange={onChange}
                      error={Boolean(errors.email)}
                      placeholder='username@example.com'
                    />
                  )}
                />
                {errors.email && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    {errors.email.message}
                  </FormHelperText>
                )}
              </FormControl>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button
                  size='large'
                  type='submit'
                  variant='contained'
                  disabled={step === 1}
                  onClick={() => setStep(1)}
                  sx={{ mb: 7 }}
                >
                  &larr; Previous
                </Button>
                <Button
                  size='large'
                  type='submit'
                  variant='contained'
                  sx={{ mb: 7 }}
                  onClick={() => setStep(2)}
                >
                  Next &rarr;
                </Button>
              </Box>
            </form> */}
          </BoxWrapper>
        </Box>
      </RightWrapper>
    </Box>
  )
}

PersonalInfo.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

PersonalInfo.guestGuard = true

export default PersonalInfo
