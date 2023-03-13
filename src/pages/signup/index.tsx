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
  redirectLinkedInAuth,
  sendEmailVerificationCode,
  signUp,
  snsSignUp,
  validateRole,
  verifyPinCode,
} from 'src/apis/sign.api'
import { RoleType } from 'src/context/types'
import { useMutation } from 'react-query'

// ** Third Party Components
import toast from 'react-hot-toast'

// ** NextJs
import { useRouter } from 'next/router'

// ** Context
import { ModalContext } from 'src/context/ModalContext'

// ** values
import { FormErrors } from 'src/shared/const/formErrors'

// ** components
import GoogleButton from '../components/google-button'

// ** types
import { loginResType } from 'src/types/sign/signInTypes'

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
    .email(FormErrors.invalidEmail)
    .test('email-duplication', FormErrors.registeredEmail, (val: any) => {
      return new Promise((resolve, reject) => {
        checkEmailDuplication(val)
          .then(() => {
            resolve(true)
          })
          .catch((e: any) => {
            resolve(false)
          })
      })
    })
    .required(FormErrors.required),
  password: yup
    .string()
    .required(FormErrors.required)
    .test('password-validation', '', (val: any) => {
      return (
        val.length >= 9 &&
        val.length <= 20 &&
        /[a-z]/g.test(val) &&
        /[A-Z]/g.test(val) &&
        /[0-9]/g.test(val) &&
        /[$@$!%*#?&]/g.test(val)
      )
    })
    .when('type', (type, schema) =>
      type === 'sns' ? yup.string().nullable() : schema,
    ),

  terms: yup.bool().oneOf([true], FormErrors.checkbox),
})

const defaultValues = {
  password: '',
  email: '',
  terms: true,
  type: '',
}

interface FormData {
  email: string
  password: string
  terms: boolean
  type: string
}

enum Roles {
  PRO = 'PRO',
  LPM = 'LPM',
  TAD = 'TAD',
  CLIENT = 'CLIENT',
}

const SignUpPage = () => {
  const router = useRouter()
  const { email } = router.query
  const { setModal } = useContext(ModalContext)
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [role, setRole] = useState<Array<RoleType>>([])
  const [pin, setPin] = useState('')
  const [pinError, setPinError] = useState('')
  const isPro = role.includes(Roles.PRO)
  const isNotPro = role.some(item => item === Roles.LPM || item === Roles.TAD)
  const [validationNewPassword, setValidationNewPassword] = useState([
    {
      id: 1,
      text: FormErrors.passwordLength,
      checked: false,
    },
    {
      id: 2,
      text: FormErrors.passwordRegexCase,
      checked: false,
    },
    {
      id: 3,
      text: FormErrors.passwordRegexSpecialChar,
      checked: false,
    },
  ])

  // ** Hooks
  const auth = useAuth()

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    watch,
    formState: { errors, isValid },
  } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(schema),
  })

  useEffect(() => {
    const emailAsString: string = email as string
    const replacedEmail = emailAsString?.replace('%40', '@')
    setValue('email', replacedEmail, {
      shouldDirty: true,
      shouldValidate: true,
    })
    watch('email')
    setValue('type', 'sns', { shouldDirty: true, shouldValidate: true })
    setStep(2)
  }, [email])

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

  function signUpOnsuccess(res: loginResType) {
    if (role.includes(Roles.PRO) || role.includes(Roles.CLIENT)) {
      router.push(
        {
          pathname: '/signup/finish/consumer',
          query: {
            userId: res.userId,
            email: res.email,
            accessToken: res.accessToken,
          },
        },
        '/signup/finish/consumer',
      )
    } else {
      router.push('/signup/finish/manager')
    }
  }

  function signUpOnError(e: any) {
    if (e?.statusCode === 409) {
      toast.error(FormErrors.alreadyRegistered)
    } else {
      toast.error('Something went wrong. Please try again.')
    }
  }

  const signUpMutation = useMutation(
    () => signUp(getValues('email'), role, getValues('password')),
    {
      onSuccess(data: loginResType) {
        signUpOnsuccess(data)
      },
      onError: (e: any) => {
        signUpOnError(e)
      },
      retry: 1,
    },
  )

  const snsSignUpMutation = useMutation(
    () => snsSignUp(getValues('email'), role),
    {
      onSuccess(data: loginResType) {
        signUpOnsuccess(data)
      },
      onError: (e: any) => {
        signUpOnError(e)
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
      setPinError(FormErrors.invalidVerificationCode)
    },
  })

  function validatePinLength() {
    if (pin.length < 7) setPinError(FormErrors.required)
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
        case Roles.LPM:
        case Roles.TAD:
          validateRole('GloZ', getValues('email')).then(res => {
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

        case Roles.PRO:
        case Roles.CLIENT:
          setRole([...filtered, value])
          break
      }
    } else {
      setRole([...filtered])
    }
  }

  const onRoleSubmit = () => {
    if (getValues('type') === 'sns') {
      snsSignUpMutation.mutate()
    } else {
      verifyEmail.mutate()
    }
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
                <img src='/images/logos/gloz-logo.svg' alt='logo' />
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

                <Link href='' style={{ textDecoration: 'none' }}>
                  <Typography color='primary'>Sign up with Google</Typography>
                </Link>
                <GoogleButton
                // handleCredentialResponse={handleCredentialResponse}
                />
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
                            alt=''
                            aria-hidden
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
                    value={Roles.CLIENT}
                    checked={role.some(item => item === Roles.CLIENT) || false}
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
                    value={Roles.PRO}
                    id='pro'
                    checked={role.includes(Roles.PRO)}
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
                    value={Roles.TAD}
                    id='tad'
                    disabled={isPro}
                    checked={role.includes(Roles.TAD)}
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
                    value={Roles.LPM}
                    id='lpm'
                    checked={role.includes(Roles.LPM)}
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
