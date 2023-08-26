import { useState, ReactNode, useEffect } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'

// ** Style Components
import Box, { BoxProps } from '@mui/material/Box'
import { styled as muiStyled, useTheme } from '@mui/material/styles'
import { Button, Grid, Typography, useMediaQuery } from '@mui/material'
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Hooks

import { useMutation } from 'react-query'

// ** third parties
import toast from 'react-hot-toast'

// ** types

// ** components

// ** apis
import { createClient } from '@src/apis/client.api'
import { getCurrentRole } from '@src/shared/auth/storage'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import {
  ContactPersonType,
  clientContactPersonDefaultValue,
  createContactPersonSchema,
} from '@src/types/schema/client-contact-person.schema'
import CreateContactPersonForm from '@src/pages/components/forms/create-contact-person-form'
import { updateClientUserInfo } from '@src/apis/user.api'
import useAuth from '@src/hooks/useAuth'
import { useRecoilValue } from 'recoil'
import { authState } from '@src/states/auth'

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

export default function NewGeneralClientForm() {
  const theme = useTheme()
  const router = useRouter()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))

  const currentRole = getCurrentRole()

  // ** Hooks

  const { company, user } = useRecoilValue(authState)

  useEffect(() => {
    if (
      user?.firstName ||
      (currentRole?.name !== 'CLIENT' && currentRole?.type !== 'General')
    ) {
      router.push('/')
    }
  }, [user])

  const {
    control,
    getValues,
    watch,
    reset,
    formState: { errors, dirtyFields, isValid },
  } = useForm<ContactPersonType>({
    defaultValues: clientContactPersonDefaultValue,
    mode: 'onChange',
    resolver: yupResolver(createContactPersonSchema),
  })

  function onError() {
    toast.error('Something went wrong. Please try again.', {
      position: 'bottom-left',
    })
  }

  const createClientMutation = useMutation(
    (
      data: ContactPersonType & { userId: number } & {
        clientId: number
        companyId: string
      },
    ) => updateClientUserInfo(data),
    {
      onSuccess: () => {
        router.push('/home')
      },
      onError: () => onError(),
    },
  )

  function updateClientInformation() {
    if (company && company.companyId) {
      const data: ContactPersonType & { userId: number } & {
        clientId: number
        companyId: string
      } = {
        ...getValues(),
        userId: user?.userId!,
        clientId: company.clientId,
        companyId: company?.companyId,
      }
      createClientMutation.mutate(data)
    }
  }

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
            alt=''
            src='/images/pages/auth-v2-register-multi-steps-illustration.png'
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
            <Box sx={{ alignItems: 'center' }} mb={6}>
              <Typography variant='h5'>Personal Information</Typography>
              <Typography variant='body2'>
                Please fill in the required information.
              </Typography>
            </Box>
            <Grid container spacing={6}>
              <CreateContactPersonForm
                control={control}
                watch={watch}
                errors={errors}
              />
              <Grid item xs={12} display='flex' justifyContent='center'>
                <Button
                  variant='contained'
                  disabled={!isValid}
                  onClick={updateClientInformation}
                >
                  Get started!
                </Button>
              </Grid>
            </Grid>
          </BoxWrapper>
        </Box>
      </RightWrapper>
    </Box>
  )
}

NewGeneralClientForm.getLayout = (page: ReactNode) => (
  <BlankLayout>{page}</BlankLayout>
)

NewGeneralClientForm.acl = {
  subject: 'client',
  action: 'update',
}
