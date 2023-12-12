import {
  Box,
  Button,
  Divider,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
  Typography,
} from '@mui/material'

import AlertIcon from '../alert-icon'
import { useState, MouseEvent } from 'react'
import { Icon } from '@iconify/react'
import Link from 'next/link'
import GoogleButton from '@src/pages/components/google-button'
import { redirectLinkedInAuth } from '@src/apis/sign.api'
import { Controller, useForm } from 'react-hook-form'
import useAuth from '@src/hooks/useAuth'
import { yupResolver } from '@hookform/resolvers/yup'
import { FormErrors } from '@src/shared/const/formErrors'

import * as yup from 'yup'
import useModal from '@src/hooks/useModal'
import { useRouter } from 'next/router'

type Props = {
  onClose: any
  onClick: any
  path: string
}

const defaultValues = {
  password: '',
  email: '',
}

interface FormData {
  email: string
  password: string
}

const LoginRequiredModal = ({ onClose, onClick, path }: Props) => {
  const [rememberMe, setRememberMe] = useState<boolean>(false)
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const auth = useAuth()
  const router = useRouter()
  const { openModal, closeModal } = useModal()

  const schema = yup.object().shape({
    email: yup
      .string()
      .email(FormErrors.invalidEmail)
      .required(FormErrors.required),
    password: yup.string().required(FormErrors.required),
  })

  const {
    control,
    setError,
    setValue,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema),
  })

  const onSubmit = (data: FormData) => {
    const { email, password } = data
    auth.login(
      { email, password, rememberMe },
      () => {
        setError('email', {
          type: 'manual',
          message: '',
        })
        setError('password', {
          type: 'manual',
          message: FormErrors.loginFailed,
        })
      },
      () => {
        router.replace(path)
        closeModal('LoginRequiredModal')
        // router.reload()
      },
    )
  }

  return (
    <Box
      sx={{
        maxWidth: '494px',
        width: '100%',
        background: '#ffffff',
        boxShadow: '0px 0px 20px rgba(76, 78, 100, 0.4)',
        borderRadius: '10px',
        position: 'relative',
      }}
    >
      <IconButton
        sx={{ position: 'absolute', top: '10px', right: '10px' }}
        onClick={onClose}
      >
        <Icon icon='mdi:close'></Icon>
      </IconButton>
      <Box
        sx={{
          padding: '50px 60px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
            // alignItems: 'center',
          }}
        >
          <Typography variant='body1' fontSize={24} fontWeight={600}>
            Sign in to continue 🌟
          </Typography>
          <Box
            mt={6}
            mb={6}
            sx={{
              width: '100%',
              display: 'flex',
              borderRadius: 1,
              cursor: 'pointer',
              overflow: 'hidden',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '4px',
              border: theme => `1px solid rgba(76, 78, 100, 0.22)`,
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
              <Typography color='primary'>Sign in with Google</Typography>
            </Link>
            <GoogleButton type='signin' />
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

            <Link
              href=''
              onClick={redirectLinkedInAuth}
              style={{ textDecoration: 'none' }}
            >
              <Typography color='primary'>Sign in with LinkedIn</Typography>
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
          <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
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
                    onChange={onChange}
                    id='auth-login-v2-password'
                    error={Boolean(errors.password)}
                    // placeholder='Password'
                    type={showPassword ? 'text' : 'password'}
                    inputProps={{ maxLength: 20 }}
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
            <Button
              fullWidth
              size='large'
              type='submit'
              variant='contained'
              sx={{ mb: 6, mt: 6 }}
              disabled={!isValid}
            >
              Sign in
            </Button>
            <Box
              sx={{
                mb: 4,

                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <Typography variant='body2' fontSize={16} fontWeight={400}>
                Don’t you have an account?&nbsp;&nbsp;
              </Typography>
              <Link
                href='/signup'
                style={{ textDecoration: 'none' }}
                onClick={e => {
                  closeModal('LoginRequiredModal')
                }}
              >
                <Typography
                  color='primary'
                  sx={{ textDecoration: 'underline' }}
                >
                  Sign up
                </Typography>
              </Link>
            </Box>
          </form>
        </Box>
      </Box>
    </Box>
  )
}

export default LoginRequiredModal
