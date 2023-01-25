import { ReactNode, useCallback, useEffect, useState } from 'react'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import Box, { BoxProps } from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { styled, useTheme } from '@mui/material/styles'
import MuiCard, { CardProps } from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import themeConfig from 'src/configs/themeConfig'
import TextField from '@mui/material/TextField'
import Link from 'next/link'
import Button from '@mui/material/Button'
import Icon from 'src/@core/components/icon'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'
import useResetPasswordSchema from './validation'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import FormHelperText from '@mui/material/FormHelperText'
import InputAdornment from '@mui/material/InputAdornment'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import cloneDeep from 'lodash/cloneDeep'
import { useRouter } from 'next/router'
import { useMutation } from 'react-query'
import { resetPassword } from 'src/apis/user.api'
import { removeUserDataFromBrowser } from 'src/shared/auth/storage'

const BoxWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  width: '100%',
  [theme.breakpoints.down('md')]: {
    maxWidth: 400,
  },
}))

const Card = styled(MuiCard)<CardProps>(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: 450 },
}))

const MaskImg = styled('img')(({ theme }) => ({
  width: '18px',
  height: '18px',
}))

interface ResetPasswordProps {
  password: string | null
  confirmPassword: string | null
}

const ResetPassword = () => {
  const theme = useTheme()
  const router = useRouter()
  const resetPasswordSchema = useResetPasswordSchema()
  const code =
    typeof window === 'object' &&
    new URL(window.location.href).searchParams.get('token')

  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false)
  const [validationNewPassword, setValidationNewPassword] = useState([
    {
      id: 1,
      text: 'characters',
      checked: false,
    },
    {
      id: 2,
      text: 'upperLower',
      checked: false,
    },
    {
      id: 3,
      text: 'specialDigit',
      checked: false,
    },
  ])

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    watch,
    control,
    reset,
    setError,
    formState: { errors, dirtyFields },
  } = useForm<ResetPasswordProps>({
    mode: 'onChange',
    resolver: yupResolver(resetPasswordSchema),
    defaultValues: { password: null, confirmPassword: null },
  })

  const isValid = !watch(['password', 'confirmPassword']).includes(null)

  const resetPasswordMutation = useMutation(
    (params: { token: string; newPW: string }) => resetPassword(params),
    {
      onSuccess: () => {
        router.push({
          pathname: '/reset-password/complete',
        })
      },
    },
  )

  const onSubmitResetPassword = useCallback((info: ResetPasswordProps) => {
    code &&
      info.password &&
      resetPasswordMutation.mutate({
        token: code,
        newPW: info.password,
      })
  }, [])

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      const beforeState = cloneDeep(validationNewPassword)
      if (value.password) {
        beforeState[0].checked = /^.{9,20}$/.test(value?.password)
        beforeState[1].checked = /(?=.*?[a-z])(?=.*?[A-Z])/.test(
          value?.password,
        )
        beforeState[2].checked = /(?=.*?[0-9])(?=.*?[#?!@$%^&*-])/.test(
          value?.password,
        )
      }

      setValidationNewPassword(beforeState)
    })
    return () => subscription.unsubscribe()
  }, [watch])

  useEffect(() => {
    removeUserDataFromBrowser()
  }, [])

  return (
    <Box className='content-center'>
      <Box
        sx={{
          p: 7,
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
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
              width={47}
              fill='none'
              height={26}
              viewBox='0 0 268 150'
              xmlns='http://www.w3.org/2000/svg'
            >
              <rect
                rx='25.1443'
                width='50.2886'
                height='143.953'
                fill={theme.palette.primary.main}
                transform='matrix(-0.865206 0.501417 0.498585 0.866841 195.571 0)'
              />
              <rect
                rx='25.1443'
                width='50.2886'
                height='143.953'
                fillOpacity='0.4'
                fill='url(#paint0_linear_7821_79167)'
                transform='matrix(-0.865206 0.501417 0.498585 0.866841 196.084 0)'
              />
              <rect
                rx='25.1443'
                width='50.2886'
                height='143.953'
                fill={theme.palette.primary.main}
                transform='matrix(0.865206 0.501417 -0.498585 0.866841 173.147 0)'
              />
              <rect
                rx='25.1443'
                width='50.2886'
                height='143.953'
                fill={theme.palette.primary.main}
                transform='matrix(-0.865206 0.501417 0.498585 0.866841 94.1973 0)'
              />
              <rect
                rx='25.1443'
                width='50.2886'
                height='143.953'
                fillOpacity='0.4'
                fill='url(#paint1_linear_7821_79167)'
                transform='matrix(-0.865206 0.501417 0.498585 0.866841 94.1973 0)'
              />
              <rect
                rx='25.1443'
                width='50.2886'
                height='143.953'
                fill={theme.palette.primary.main}
                transform='matrix(0.865206 0.501417 -0.498585 0.866841 71.7728 0)'
              />
              <defs>
                <linearGradient
                  y1='0'
                  x1='25.1443'
                  x2='25.1443'
                  y2='143.953'
                  id='paint0_linear_7821_79167'
                  gradientUnits='userSpaceOnUse'
                >
                  <stop />
                  <stop offset='1' stopOpacity='0' />
                </linearGradient>
                <linearGradient
                  y1='0'
                  x1='25.1443'
                  x2='25.1443'
                  y2='143.953'
                  id='paint1_linear_7821_79167'
                  gradientUnits='userSpaceOnUse'
                >
                  <stop />
                  <stop offset='1' stopOpacity='0' />
                </linearGradient>
              </defs>
            </svg>
            <Typography
              variant='h6'
              sx={{
                ml: 2,
                lineHeight: 1,
                fontWeight: 700,
                fontSize: '1.5rem !important',
              }}
            >
              {themeConfig.templateName}
            </Typography>
          </Box>
          <Card
            sx={{
              zIndex: 1,
              backgroundColor: 'transparent',
              boxShadow: 'none',
            }}
          >
            <CardContent
              sx={{
                p: theme => `${theme.spacing(15.5, 7, 8)} !important`,
              }}
            >
              <Box sx={{ mb: 6.5 }}>
                <Typography
                  variant='h5'
                  sx={{ mb: 1.5, letterSpacing: '0.18px', fontWeight: 600 }}
                >
                  Reset Password 🔒
                </Typography>
              </Box>
              <form
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                }}
                noValidate
                autoComplete='off'
                onSubmit={handleSubmit(onSubmitResetPassword)}
              >
                <FormControl fullWidth>
                  <InputLabel
                    htmlFor='reset-password'
                    // error={Boolean(errors.password)}
                  >
                    New password
                  </InputLabel>
                  <Controller
                    name='password'
                    control={control}
                    rules={{ required: true }}
                    render={({
                      field: { onChange, onBlur, value, name, ref },
                    }) => (
                      <OutlinedInput
                        value={value}
                        inputProps={{ maxLength: 20 }}
                        // onBlur={onBlur}
                        label='New password'
                        onChange={onChange}
                        id='reset-password'
                        // error={Boolean(errors.password)}
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
                </FormControl>
                <Box>
                  <Typography
                    variant='body2'
                    sx={{ display: 'flex', gap: '5px', alignItems: 'center' }}
                  >
                    <MaskImg
                      src={`/images/icons/auth-icons/check-${
                        validationNewPassword[0].checked
                          ? 'available'
                          : 'disable'
                      }.svg`}
                    />
                    9-20 characters
                  </Typography>
                  <Typography
                    variant='body2'
                    sx={{ display: 'flex', gap: '5px', alignItems: 'center' }}
                  >
                    <MaskImg
                      src={`/images/icons/auth-icons/check-${
                        validationNewPassword[1].checked
                          ? 'available'
                          : 'disable'
                      }.svg`}
                    />
                    Uppercase and lowercase characters
                  </Typography>
                  <Typography
                    variant='body2'
                    sx={{ display: 'flex', gap: '5px', alignItems: 'center' }}
                  >
                    <MaskImg
                      src={`/images/icons/auth-icons/check-${
                        validationNewPassword[2].checked
                          ? 'available'
                          : 'disable'
                      }.svg`}
                    />
                    At least one number and special character
                  </Typography>
                </Box>
                <FormControl fullWidth>
                  <InputLabel
                    htmlFor='confirm-password'
                    error={Boolean(errors.confirmPassword)}
                  >
                    Confirm password
                  </InputLabel>
                  <Controller
                    name='confirmPassword'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <OutlinedInput
                        value={value}
                        // onBlur={onBlur}
                        inputProps={{ maxLength: 20 }}
                        label='Confirm password'
                        onChange={onChange}
                        id='confirm-password'
                        error={Boolean(errors.confirmPassword)}
                        type={showConfirmPassword ? 'text' : 'password'}
                        endAdornment={
                          <InputAdornment position='end'>
                            <IconButton
                              edge='end'
                              onMouseDown={e => e.preventDefault()}
                              onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
                            >
                              <Icon
                                icon={
                                  showConfirmPassword
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
                  {errors.confirmPassword &&
                    errors.confirmPassword?.type === 'oneOf' && (
                      <FormHelperText sx={{ color: 'error.main' }} id=''>
                        {errors.confirmPassword.message}
                      </FormHelperText>
                    )}
                </FormControl>
                <Button
                  fullWidth
                  size='large'
                  type='submit'
                  variant='contained'
                  disabled={Object.keys(errors).length !== 0 || !isValid}
                  sx={{ mt: 2, textTransform: 'none' }}
                >
                  Reset Password
                </Button>
              </form>
            </CardContent>
          </Card>
        </BoxWrapper>
      </Box>
    </Box>
  )
}

ResetPassword.guestGuard = true
ResetPassword.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>
export default ResetPassword
