import { useState } from 'react'

// ** third parties
import { yupResolver } from '@hookform/resolvers/yup'

// ** style component
import { Icon } from '@iconify/react'
import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Typography,
} from '@mui/material'
import styled from '@emotion/styled'

// ** component
import { renderErrorMsg } from '@src/@core/components/error/form-error-renderer'

// ** types & validation
import { UserDataType } from '@src/context/types'
import {
  passwordDefaultValue,
  passwordSchema,
} from '@src/types/schema/password.schema'

// ** react hook form
import { Controller, useForm } from 'react-hook-form'
import { useMutation } from 'react-query'
import { validatePassword } from '@src/apis/user.api'
import { FormErrors } from '@src/shared/const/formErrors'

type Props = {
  user: UserDataType
  onCancel: () => void
  onReset: (currPw: string, newPw: string) => void
}

export default function ChangePasswordForm({ user, onCancel, onReset }: Props) {
  const {
    control,
    getValues,
    setError,
    clearErrors,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm<{
    currentPassword: string
    newPassword: string
    confirmPassword: string
  }>({
    defaultValues: passwordDefaultValue,
    mode: 'onChange',
    resolver: yupResolver(passwordSchema),
  })

  const [showPw, setShowPw] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  })

  const newPassword = watch('newPassword')

  const step1Pass = newPassword.length >= 9 && newPassword.length <= 20
  const step2Pass = /[a-z]/g.test(newPassword) && /[A-Z]/g.test(newPassword)
  const step3Pass =
    /[0-9]/g.test(newPassword) && /[$@$!%*#?&]/g.test(newPassword)

  const validatePw = useMutation((pw: string) => validatePassword(pw), {
    onSuccess: res => {
      if (!res) {
        setError('currentPassword', { message: FormErrors.passwordDoesntMatch })
      } else {
        clearErrors('currentPassword')
      }
    },
    onError: () => {
      setError('currentPassword', { message: FormErrors.passwordDoesntMatch })
    },
  })

  return (
    <StyledBox>
      <InnerBox sx={{ mb: '20px' }}>
        <Typography variant='h6'>Change password</Typography>
      </InnerBox>
      <InnerBox>
        <Controller
          control={control}
          name='currentPassword'
          render={({ field: { onChange, value } }) => (
            <FormControl sx={{ width: '420px' }}>
              <InputLabel error={Boolean(errors.currentPassword)}>
                Current password*
              </InputLabel>
              <OutlinedInput
                label='Current password*'
                value={value}
                onChange={onChange}
                onBlur={() => validatePw.mutate(value)}
                error={Boolean(errors.currentPassword)}
                type={showPw.currentPassword ? 'text' : 'password'}
                inputProps={{ maxLength: 20 }}
                endAdornment={
                  <InputAdornment position='end'>
                    <IconButton
                      edge='end'
                      onClick={() =>
                        setShowPw({
                          ...showPw,
                          currentPassword: !showPw.currentPassword,
                        })
                      }
                      onMouseDown={e => e.preventDefault()}
                      aria-label='toggle password visibility'
                    >
                      <Icon
                        fontSize={20}
                        icon={
                          showPw.currentPassword
                            ? 'mdi:eye-outline'
                            : 'mdi:eye-off-outline'
                        }
                      />
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
          )}
        />
        <ErrorBox>{renderErrorMsg(errors.currentPassword)}</ErrorBox>
      </InnerBox>
      <InnerBox>
        <Controller
          control={control}
          name='newPassword'
          render={({ field: { onChange, value } }) => (
            <FormControl sx={{ width: '420px' }}>
              <InputLabel error={Boolean(errors.newPassword)}>
                New password*
              </InputLabel>
              <OutlinedInput
                label='New password*'
                value={value}
                onChange={onChange}
                type={showPw.newPassword ? 'text' : 'password'}
                inputProps={{ maxLength: 20 }}
                error={Boolean(errors.newPassword)}
                endAdornment={
                  <InputAdornment position='end'>
                    <IconButton
                      edge='end'
                      onClick={() =>
                        setShowPw({
                          ...showPw,
                          newPassword: !showPw.newPassword,
                        })
                      }
                      onMouseDown={e => e.preventDefault()}
                      aria-label='toggle password visibility'
                    >
                      <Icon
                        fontSize={20}
                        icon={
                          showPw.newPassword
                            ? 'mdi:eye-outline'
                            : 'mdi:eye-off-outline'
                        }
                      />
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
          )}
        />
        {errors?.newPassword?.message === '0' ? null : (
          <ErrorBox>{renderErrorMsg(errors.newPassword)}</ErrorBox>
        )}
        <Box
          display='flex'
          alignItems='center'
          alignSelf='start'
          gap='4px'
          mt={3}
        >
          <img
            src={`/images/icons/validation/verify-${
              step1Pass ? 'green' : 'gray'
            }.svg`}
            alt=''
          />
          <Typography variant='body2' color={step1Pass ? '#2EAE4E' : '#888'}>
            9-20 characters
          </Typography>
        </Box>
        <Box display='flex' alignItems='center' alignSelf='start' gap='4px'>
          <img
            src={`/images/icons/validation/verify-${
              step2Pass ? 'green' : 'gray'
            }.svg`}
            alt=''
          />
          <Typography variant='body2' color={step2Pass ? '#2EAE4E' : '#888'}>
            Uppercase and lowercase characters
          </Typography>
        </Box>
        <Box display='flex' alignItems='center' alignSelf='start' gap='4px'>
          <img
            src={`/images/icons/validation/verify-${
              step3Pass ? 'green' : 'gray'
            }.svg`}
            alt=''
          />
          <Typography variant='body2' color={step3Pass ? '#2EAE4E' : '#888'}>
            At least one number and special character
          </Typography>
        </Box>
      </InnerBox>
      <InnerBox>
        <Controller
          control={control}
          name='confirmPassword'
          render={({ field: { onChange, value } }) => (
            <FormControl sx={{ width: '420px' }}>
              <InputLabel error={Boolean(errors.confirmPassword)}>
                Confirm new password*
              </InputLabel>
              <OutlinedInput
                label='Confirm new password*'
                value={value}
                onChange={onChange}
                error={Boolean(errors.confirmPassword)}
                type={showPw.confirmPassword ? 'text' : 'password'}
                inputProps={{ maxLength: 20 }}
                endAdornment={
                  <InputAdornment position='end'>
                    <IconButton
                      edge='end'
                      onClick={() =>
                        setShowPw({
                          ...showPw,
                          confirmPassword: !showPw.confirmPassword,
                        })
                      }
                      onMouseDown={e => e.preventDefault()}
                      aria-label='toggle password visibility'
                    >
                      <Icon
                        fontSize={20}
                        icon={
                          showPw.confirmPassword
                            ? 'mdi:eye-outline'
                            : 'mdi:eye-off-outline'
                        }
                      />
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
          )}
        />
        <ErrorBox>{renderErrorMsg(errors.confirmPassword)}</ErrorBox>
      </InnerBox>
      <Box display='flex' justifyContent='center' gap='16px' mt={14} mb={6}>
        <Button
          variant='outlined'
          onClick={() => {
            onCancel()
            reset(passwordDefaultValue)
          }}
        >
          Cancel
        </Button>
        <Button
          variant='contained'
          disabled={!isValid}
          onClick={() => {
            const currPw = getValues('currentPassword')
            const newPw = getValues('newPassword')
            onReset(currPw, newPw)
          }}
        >
          Reset
        </Button>
      </Box>
    </StyledBox>
  )
}

const StyledBox = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const InnerBox = styled(Box)`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  max-width: 420px;
`

const ErrorBox = styled(Box)`
  margin-top: 4px;
  align-self: flex-start;
`
