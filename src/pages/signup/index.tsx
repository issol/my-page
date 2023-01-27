// ** React Imports
import { useState, ReactNode, MouseEvent, useEffect, useContext } from 'react'

// ** MUI Components
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import Box, { BoxProps } from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import { styled as muiStyled } from '@mui/material/styles'
import FormHelperText from '@mui/material/FormHelperText'
import InputAdornment from '@mui/material/InputAdornment'
import Typography, { TypographyProps } from '@mui/material/Typography'
import { Card, CardContent, Link } from '@mui/material'

import cloneDeep from 'lodash/cloneDeep'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import PinInput from 'react-pin-input'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'
import { Checkbox } from '@mui/material'
import {
  checkEmailDuplication,
  redirectGoogleAuth,
  redirectLinkedInAuth,
  sendEmailVerificationCode,
  signUp,
  validateRole,
  verifyPinCode,
} from 'src/apis/sign.api'
import { RoleType } from 'src/context/types'
import { useMutation } from 'react-query'

// ** Third Party Components
import toast from 'react-hot-toast'
import { useRouter } from 'next/router'
import { ModalContext } from 'src/context/ModalContext'

const RightWrapper = muiStyled(Box)<BoxProps>(({ theme }) => ({
  width: '100%',
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

const DisabledCard = muiStyled(Card)(() => ({
  position: 'relative',
  '&::after': {
    content: '"In preparation"',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#ffffff',
    fontSize: '1.3rem',
    fontWeight: '500',
    position: 'absolute',
    width: '100%',
    height: '100%',
    background: '#0000006e',
    top: 0,
    cursor: 'not-allowed',
  },
}))

const schema = yup.object().shape({
  email: yup
    .string()
    .email('Invalid email address')
    .test(
      'email-duplication',
      'This email is already registered',
      (val: any) => {
        return new Promise((resolve, reject) => {
          checkEmailDuplication(val)
            .then(() => {
              resolve(true)
            })
            .catch((e: any) => {
              resolve(false)
            })
        })
      },
    )
    .required('This field is required'),
  password: yup
    .string()
    .required('This field is required')
    .test('password-validation', '', (val: any) => {
      return (
        val.length >= 9 &&
        val.length <= 20 &&
        /[a-z]/g.test(val) &&
        /[A-Z]/g.test(val) &&
        /[0-9]/g.test(val) &&
        /[$@$!%*#?&]/g.test(val)
      )
    }),

  terms: yup.bool().oneOf([true], 'Field must be checked'),
})

const defaultValues = {
  password: '',
  email: '',
  terms: true,
}

interface FormData {
  email: string
  password: string
  terms: boolean
}

const SignUpPage = () => {
  const router = useRouter()
  const { setModal } = useContext(ModalContext)
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [role, setRole] = useState<Array<RoleType>>([])
  const [pin, setPin] = useState('')
  const [pinError, setPinError] = useState('')
  const isPro = role.includes('PRO')
  const isNotPro = role.some(item => item === 'LPM' || item === 'TAD')
  const [validationNewPassword, setValidationNewPassword] = useState([
    {
      id: 1,
      text: '9-20 characters',
      checked: false,
    },
    {
      id: 2,
      text: 'Uppercase and lowercase characters',
      checked: false,
    },
    {
      id: 3,
      text: 'At least one number and special character',
      checked: false,
    },
  ])

  // ** Hooks
  const auth = useAuth()

  const {
    control,
    handleSubmit,
    getValues,
    watch,
    formState: { errors, isValid },
  } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(schema),
  })

  const verifyEmail = useMutation(
    () => sendEmailVerificationCode(getValues('email')),
    {
      onSuccess: data => {
        toast.success('Email has been sent', {
          position: 'bottom-left',
        })

        setStep(3)
      },
      onError: () => {
        toast.error('Something went wrong. Please try again.', {
          position: 'bottom-left',
        })
      },
    },
  )

  const signUpMutation = useMutation(
    () => signUp(getValues('email'), getValues('password'), role),
    {
      onSuccess: data => {
        if (role.includes('PRO') || role.includes('CLIENT')) {
          router.push(
            {
              pathname: '/signup/finish/consumer',
              query: {
                email: getValues('email'),
                password: getValues('password'),
              },
            },
            '/signup/finish/consumer',
          )
        } else {
          router.push('/signup/finish/manager')
        }
      },
      onError: (e: any) => {
        if (e?.statusCode === 409) {
          toast.error('This account is already registered.')
        } else {
          toast.error('Something went wrong. Please try again.')
        }
      },
      retry: 1,
    },
  )

  const verifyPin = useMutation(() => verifyPinCode(getValues('email'), pin), {
    onSuccess: data => {
      setPinError('')
      return signUpMutation.mutate()
    },
    onError: () => {
      setPinError('Invalid verification code.')
    },
  })

  function validatePinLength() {
    if (pin.length < 7) setPinError('This field is required')
    else setPinError('')
  }

  useEffect(() => {
    // validation
    const beforeState = cloneDeep(validationNewPassword)

    // 9 ~ 20자 대소문자
    beforeState[0].checked =
      getValues('password').length >= 9 && getValues('password').length <= 20

    // 영문 대소문자 포함
    beforeState[1].checked =
      /[a-z]/g.test(getValues('password')) &&
      /[A-Z]/g.test(getValues('password'))

    // 최소 1개 이상의 숫자, 특수문자
    beforeState[2].checked =
      /[0-9]/g.test(getValues('password')) &&
      /[$@$!%*#?&]/g.test(getValues('password'))

    setValidationNewPassword(beforeState)
  }, [watch('password')])

  const onSubmit = (data: FormData) => {
    // const { email, password } = data
    setStep(2)
  }

  const onRoleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value as RoleType
    const filtered = role.filter(item => item !== value)
    if (e.target.checked) {
      switch (value) {
        case 'LPM':
        case 'TAD':
          validateRole('Gloz', getValues('email')).then(res => {
            if (res) setRole([...filtered, value])
            else {
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
                      Please use the company email only.
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: '8px' }} mt={4}>
                    <Button variant='contained' onClick={() => setModal(null)}>
                      Cancel
                    </Button>
                    <Button
                      variant='outlined'
                      onClick={() => {
                        setStep(1)
                        setModal(null)
                      }}
                    >
                      Move to sign up
                    </Button>
                  </Box>
                </Box>,
              )
            }
          })

          break

        case 'PRO':
        case 'CLIENT':
          setRole([...filtered, value])
          break
      }
    } else {
      setRole([...filtered])
    }
  }

  const onRoleSubmit = () => {
    verifyEmail.mutate()
  }

  return (
    <Box className='content-center'>
      <RightWrapper>
        {step === 1 ? (
          <Box
            maxWidth={'500px'}
            sx={{
              p: 7,
              margin: '0 auto',
              height: '100%',
              background: '#F7F7F9',
            }}
          >
            <BoxWrapper>
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
                <svg
                  width='44'
                  height='24'
                  viewBox='0 0 44 24'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M43.9977 7.42038L28.0295 6.97529L28.1096 10.8034C27.0637 10.3881 25.9357 10.2441 24.8238 10.3841C22.9437 10.6016 21.3377 11.5375 20.271 13.0015L19.6114 6.88478L13.3837 7.48848L13.3877 7.83724C9.46073 5.65829 4.87985 6.25949 2.05968 9.48972C-0.480801 12.4044 -0.690771 16.5987 1.54678 19.9294C2.78341 21.7449 4.59386 23.055 6.6646 23.633C7.54483 23.879 8.45288 24.0019 9.36456 23.9983C10.9097 23.9983 12.5261 23.6612 14.145 22.9944L21.4379 23.8132L21.2832 22.3766C22.3635 23.2311 23.7379 23.7119 25.263 23.7293C26.0258 23.7402 26.7848 23.6155 27.507 23.3606L27.3202 23.7368L42.1544 23.0309L43.6611 15.4021L39.3815 15.5375L43.9977 7.42038Z'
                    fill='#5F14C5'
                  />
                  <path
                    d='M19.0737 6.07432C19.3357 6.16483 19.5834 6.25119 19.7557 6.42973C19.9304 6.61075 20.0145 6.86984 20.1027 7.14387C20.1609 7.33929 20.2349 7.52929 20.3239 7.71185C20.6268 8.29977 21.1654 8.64605 21.7704 8.64605H21.8241C22.4564 8.62529 22.9966 8.23085 23.2667 7.60141C23.3435 7.41179 23.4043 7.21564 23.4486 7.01516C23.5135 6.75607 23.58 6.48869 23.7171 6.34503C23.8541 6.20137 24.1218 6.12663 24.3774 6.05771C24.5692 6.01095 24.7568 5.94762 24.9384 5.86838C25.5539 5.58356 25.9306 5.01889 25.945 4.35873C25.9594 3.69857 25.6132 3.1256 25.0186 2.81088C24.8425 2.72205 24.6594 2.64926 24.4712 2.59332C24.2171 2.51028 23.9543 2.42724 23.7868 2.24953C23.6193 2.07183 23.5464 1.82188 23.4598 1.54868C23.3484 1.16255 22.9926 0 21.7808 0C20.5691 0 20.2125 1.16255 20.0979 1.54453C20.0177 1.8169 19.9376 2.07432 19.7693 2.24455C19.601 2.41478 19.3646 2.49367 19.1073 2.57671C18.7403 2.69628 17.6223 3.06083 17.6119 4.31306C17.6015 5.56529 18.7098 5.94727 19.0737 6.07432Z'
                    fill='#5F14C5'
                  />
                  <path
                    d='M36.7287 17.0297L41.4362 8.75815L29.5256 8.42682L29.597 11.8406L34.6859 12.0938L29.7837 21.9622L40.9201 21.4316L41.8209 16.8686L36.7287 17.0297Z'
                    fill='#FFE700'
                  />
                  <path
                    d='M30.0947 18.4438C30.5314 17.0156 30.5515 14.7835 29.125 13.2049C28.1112 12.083 26.5973 11.5956 24.9688 11.7833C23.265 11.9809 21.7632 12.935 20.9546 14.5966C20.2958 15.9535 20.1531 17.8302 20.8199 19.3083C21.7912 21.4515 23.7851 22.0585 25.2597 22.0751C27.228 22.0967 29.3317 20.9508 30.0947 18.4438ZM25.5266 14.8798C26.3777 14.9072 26.7063 15.7168 26.6622 16.695C26.6117 17.8202 26.0916 19.0201 25.263 18.9603C24.4343 18.9005 23.9639 18.0253 24.1169 16.6668C24.2315 15.6587 24.7853 14.8565 25.5274 14.8798H25.5266Z'
                    fill='#FFE700'
                  />
                  <path
                    d='M18.2843 8.42682L14.8646 8.75815L15.0225 21.4316L19.7452 21.9622L18.2843 8.42682Z'
                    fill='#FFE700'
                  />
                  <path
                    d='M8.15842 15.9535L9.94557 16.774L9.59295 18.2213C9.05999 18.0805 8.54166 17.8858 8.04542 17.6401C7.53012 17.3801 6.86334 16.8927 6.54358 16.054C6.38716 15.6582 6.31079 15.2333 6.3192 14.8057C6.32761 14.378 6.42061 13.9567 6.59246 13.5678C6.7438 13.2215 6.96237 12.9113 7.23456 12.6564C7.50674 12.4015 7.82669 12.2075 8.17445 12.0864C8.99029 11.7858 9.70195 11.7833 10.6436 12.0033C11.2488 12.1565 11.8308 12.3954 12.3731 12.7133L13.7972 9.79201C9.97363 6.94045 5.57387 7.61057 3.13837 10.3965C-1.57394 15.7941 4.22509 25.3436 13.6225 21.4349L13.7106 15.3008L8.83962 14.4098L8.15842 15.9535Z'
                    fill='#FFE700'
                  />
                  <path
                    d='M21.7632 6.99026C21.4811 7.00022 21.5284 5.99379 20.7887 5.22318C20.049 4.45258 19.0672 4.51403 19.0736 4.19931C19.0801 3.88459 20.0514 3.97012 20.7927 3.20948C21.534 2.44884 21.4611 1.41168 21.7632 1.41168C22.0653 1.41168 21.9876 2.4422 22.7321 3.2128C23.4766 3.98341 24.4631 3.91282 24.4567 4.20263C24.4503 4.49244 23.3876 4.37867 22.6544 5.14596C21.9211 5.91324 22.0549 6.98029 21.7632 6.99026Z'
                    fill='#FFE700'
                  />
                </svg>
              </Box>
              <Box sx={{ mb: 6 }}>
                <TypographyStyled variant='h5'>
                  Adventure starts here 🚀
                </TypographyStyled>
              </Box>
              <Box
                mb={4}
                sx={{
                  width: '100%',
                  display: 'flex',
                  borderRadius: 1,
                  cursor: 'pointer',
                  overflow: 'hidden',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '4px',
                  border: theme => `1px solid ${theme.palette.divider}`,
                  '& img': {
                    width: '30px',
                    height: '30px',
                    objectFit: 'cover',
                  },
                }}
              >
                <IconButton
                  href='/'
                  component={Link}
                  sx={{ color: '#db4437' }}
                  onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
                >
                  <img src='/images/logos/google.png' alt='google sign in' />
                </IconButton>

                <Link href='' onClick={redirectGoogleAuth}>
                  Sign up with Google
                </Link>
              </Box>
              <Box
                sx={{
                  width: '100%',
                  display: 'flex',
                  borderRadius: 1,
                  cursor: 'pointer',
                  overflow: 'hidden',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '4px',
                  border: theme => `1px solid ${theme.palette.divider}`,
                  '& img': {
                    width: '30px',
                    height: '30px',
                    objectFit: 'cover',
                  },
                }}
              >
                <IconButton
                  href='/'
                  component={Link}
                  sx={{ color: '#db4437' }}
                  onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
                >
                  <img src='/images/logos/linkedin.png' alt='google sign in' />
                </IconButton>
                <Link href='' onClick={redirectLinkedInAuth}>
                  Sign up with LinkedIn
                </Link>
              </Box>
              <Divider
                sx={{
                  '& .MuiDivider-wrapper': { px: 4 },
                  mt: theme => `${theme.spacing(5)} !important`,
                  mb: theme => `${theme.spacing(7.5)} !important`,
                }}
              >
                or
              </Divider>
              <form
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
                <FormControl fullWidth>
                  <InputLabel
                    htmlFor='auth-login-v2-password'
                    error={Boolean(errors.password)}
                  >
                    Password
                  </InputLabel>
                  <Controller
                    name='password'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <OutlinedInput
                        value={value}
                        onBlur={onBlur}
                        label='Password'
                        inputProps={{ maxLength: 20 }}
                        onChange={onChange}
                        id='auth-login-v2-password'
                        error={Boolean(errors.password)}
                        // placeholder='Password'
                        type={showPassword ? 'text' : 'password'}
                        endAdornment={
                          <InputAdornment position='end'>
                            <IconButton
                              edge='end'
                              onMouseDown={e => e.preventDefault()}
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              <Icon
                                icon={
                                  showPassword
                                    ? 'mdi:eye-outline'
                                    : 'mdi:eye-off-outline'
                                }
                                fontSize={20}
                              />
                            </IconButton>
                          </InputAdornment>
                        }
                      />
                    )}
                  />
                  {errors.password && (
                    <FormHelperText sx={{ color: 'error.main' }} id=''>
                      {errors.password.message}
                    </FormHelperText>
                  )}
                  <Box mt={3}>
                    {validationNewPassword.map(validation => {
                      const validationIcon = validation.checked
                        ? `/images/icons/validation/verify-green.svg`
                        : `/images/icons/validation/verify-gray.svg`
                      return (
                        <div
                          key={validation.id}
                          className='validation-desc'
                          style={{
                            color: validation.checked ? '#2EAE4E' : '#888',
                            fontWeight: 500,
                            fontSize: `0.75rem`,
                            lineHeight: '0.875rem',
                          }}
                        >
                          <img
                            width='14px'
                            height='14px'
                            src={validationIcon}
                          />
                          {validation.text}
                        </div>
                      )
                    })}
                  </Box>
                  <Box margin='10px 0' display='flex' alignItems='center'>
                    <Controller
                      name='terms'
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange, onBlur } }) => (
                        <Checkbox
                          checked={value}
                          color='primary'
                          onChange={onChange}
                          onBlur={onBlur}
                        />
                      )}
                    />

                    <Typography>
                      I agree to{' '}
                      <Link href='/terms/GDPR.pdf' target='_blank'>
                        GDPR
                      </Link>{' '}
                      &{' '}
                      <Link href='/terms/Privacy.pdf' target='_blank'>
                        Privacy policy
                      </Link>{' '}
                      &{' '}
                      <Link href='/terms/Terms of Use.pdf' target='_blank'>
                        Terms of use
                      </Link>
                      *
                    </Typography>
                  </Box>
                </FormControl>

                <Button
                  fullWidth
                  size='large'
                  type='submit'
                  variant='contained'
                  sx={{ mb: 7 }}
                  disabled={!isValid}
                >
                  Sign Up
                </Button>
                <Box
                  sx={{
                    mb: 4,
                    textAlign: 'center',
                  }}
                >
                  <Typography>
                    Already have an account? <Link href='/login'>Sign in</Link>
                  </Typography>
                </Box>
              </form>
            </BoxWrapper>
          </Box>
        ) : step === 2 ? (
          <Box>
            <Typography variant='h4' align='center' mb={12}>
              Select your role
            </Typography>
            <Box
              sx={{ display: 'flex', gap: '30px', justifyContent: 'center' }}
            >
              <DisabledCard>
                <CardContent
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <img
                    src='/images/signup/role-client.png'
                    aria-hidden
                    alt=''
                    width={200}
                    height={200}
                  />
                  <InputLabel htmlFor='client' sx={{ textAlign: 'center' }}>
                    <Typography color='primary'>Client</Typography>
                  </InputLabel>
                  <Typography sx={{ textAlign: 'center' }}>
                    I order localization projects
                  </Typography>

                  <Checkbox
                    id='client'
                    value='CLIENT'
                    checked={role.some(item => item === 'CLIENT') || false}
                    onChange={onRoleSelect}
                    disabled
                  />
                </CardContent>
              </DisabledCard>
              <Card>
                <CardContent
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <img
                    src='/images/signup/role-pro.png'
                    aria-hidden
                    alt=''
                    width={200}
                    height={200}
                  />
                  <InputLabel htmlFor='pro' sx={{ textAlign: 'center' }}>
                    <Typography color='primary'>Pro</Typography>
                  </InputLabel>
                  <Typography align='center'>
                    I perform localization projects
                  </Typography>

                  <Checkbox
                    value='PRO'
                    id='pro'
                    checked={role.includes('PRO')}
                    disabled={isNotPro}
                    onChange={onRoleSelect}
                  />
                </CardContent>
              </Card>
              <Card>
                <CardContent
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <img
                    src='/images/signup/role-tad.png'
                    aria-hidden
                    alt=''
                    width={200}
                    height={200}
                  />
                  <InputLabel htmlFor='tad' sx={{ textAlign: 'center' }}>
                    <Typography color='primary'>TAD</Typography>
                  </InputLabel>
                  <Typography align='center'>
                    I recruit and train Pros
                  </Typography>
                  <Checkbox
                    value='TAD'
                    id='tad'
                    disabled={isPro}
                    checked={role.includes('TAD')}
                    onChange={onRoleSelect}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardContent
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <img
                    src='/images/signup/role-lpm.png'
                    aria-hidden
                    alt=''
                    width={200}
                    height={200}
                  />
                  <InputLabel htmlFor='lpm' sx={{ textAlign: 'center' }}>
                    <Typography color='primary'>LPM</Typography>
                  </InputLabel>
                  <Typography align='center'>
                    I manage localization projects
                  </Typography>
                  <Checkbox
                    value='LPM'
                    id='lpm'
                    checked={role.includes('LPM')}
                    disabled={isPro}
                    onChange={onRoleSelect}
                  />
                </CardContent>
              </Card>
            </Box>
            <Box sx={{ textAlign: 'center', margin: '50px' }}>
              <Button
                variant='contained'
                onClick={onRoleSubmit}
                disabled={!role.length}
              >
                Confirm
              </Button>
            </Box>
          </Box>
        ) : (
          <Box
            maxWidth={'450px'}
            sx={{
              p: 7,
              margin: '0 auto',
              height: '100%',
              background: '#F7F7F9',
            }}
          >
            <Box sx={{ mb: 6 }}>
              <TypographyStyled variant='h5'>
                Verify email address 💬
              </TypographyStyled>
              <TypographyStyled variant='body2'>
                Please enter the verification code we've sent to
              </TypographyStyled>
              <TypographyStyled variant='body1'>
                {getValues('email')}
              </TypographyStyled>
              <Box mt={8} onBlur={validatePinLength}>
                <PinInput
                  length={7}
                  focus
                  onChange={value => {
                    validatePinLength()
                    setPin(value)
                  }}
                  onComplete={value => {
                    setPinError('')
                    setPin(value)
                  }}
                  type='numeric'
                  inputMode='number'
                  style={{
                    display: 'flex',
                    gap: '4px',
                    justifyContent: 'space-between',
                  }}
                  inputStyle={{
                    width: 45,
                    height: 45,
                    fontSize: '1rem',
                    borderRadius: '4px',
                    border: `1px solid ${pinError ? '#FF625F' : '#aaa'} `,
                  }}
                  autoSelect={true}
                />
                {pinError && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    {pinError}
                  </FormHelperText>
                )}
              </Box>
              <Box sx={{ margin: '30px 0 20px' }}>
                <Button
                  fullWidth
                  variant='contained'
                  onClick={() => verifyPin.mutate()}
                  disabled={pin.length < 7}
                >
                  Confirm
                </Button>
              </Box>
              <Box
                sx={{ display: 'flex', justifyContent: 'center', gap: '6px' }}
              >
                <Typography variant='body2'>Didn't get the email? </Typography>
                <Button
                  variant='text'
                  onClick={() => verifyEmail.mutate()}
                  sx={{ padding: 0 }}
                  size='small'
                >
                  Resend
                </Button>
              </Box>
            </Box>
          </Box>
        )}
      </RightWrapper>
    </Box>
  )
}

SignUpPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

SignUpPage.guestGuard = true

export default SignUpPage
