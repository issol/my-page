import { ReactNode, useEffect } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'

// ** Style Components
import Box, { BoxProps } from '@mui/material/Box'
import { styled as muiStyled, useTheme } from '@mui/material/styles'
import { Button, Grid, Typography, useMediaQuery } from '@mui/material'
import BlankLayout from '@src/@core/layouts/BlankLayout'

// ** Hooks
import { useMutation, useQueryClient } from 'react-query'

// ** third parties
import toast from 'react-hot-toast'

// ** types
// ** components
// ** apis
import { Resolver, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import {
  clientContactPersonDefaultValue,
  ContactPersonType,
  createContactPersonSchema,
} from '@src/types/schema/client-contact-person.schema'
import CreateContactPersonForm from 'src/pages/[companyName]/components/forms/create-contact-person-form'
import { updateClientUserInfo } from '@src/apis/user.api'
import useAuth from '@src/hooks/useAuth'
import { useRecoilValueLoadable } from 'recoil'
import { authState } from '@src/states/auth'
import { roleState } from '@src/states/permission'
import { CountryType } from '@src/types/sign/personalInfoTypes'

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
  const queryClient = useQueryClient()

  // const currentRole = getCurrentRole()

  // ** Hooks

  const auth = useRecoilValueLoadable(authState)
  const role = useRecoilValueLoadable(roleState)
  const setAuth = useAuth()

  useEffect(() => {
    if (
      (auth.state === 'hasValue' &&
        auth.getValue() &&
        auth.getValue().user?.firstName) ||
      (role.contents[0].name !== 'CLIENT' &&
        role.contents[0].type !== 'General')
    ) {
      router.push('/')
    }
  }, [auth])

  const {
    control,
    getValues,
    watch,
    reset,
    formState: { errors, dirtyFields, isValid },
  } = useForm<ContactPersonType>({
    defaultValues: clientContactPersonDefaultValue,
    mode: 'onChange',
    resolver: yupResolver(
      createContactPersonSchema,
    ) as unknown as Resolver<ContactPersonType>,
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
        const { userId, email, accessToken } = router.query
        const accessTokenAsString: string = accessToken as string
        setAuth
          .updateUserInfo({
            userId: Number(auth.getValue().user?.userId!),
            email: auth.getValue().user?.email!,
            accessToken: accessTokenAsString,
          })
          .then(() => {
            router.push('/dashboards')
          })
      },
      onError: () => onError(),
    },
  )

  function updateClientInformation() {
    if (
      auth.state === 'hasValue' &&
      auth.getValue() &&
      auth.getValue().company &&
      auth.getValue().user &&
      auth.getValue().company?.companyId
    ) {
      const data: ContactPersonType & { userId: number } & {
        clientId: number
        companyId: string
        extraData: {
          timezone: CountryType
          jobTitle?: string
          mobilePhone?: string
          telephone?: string
          fax?: string
          department?: string
        }
      } = {
        ...getValues(),
        userId: auth.getValue().user?.userId!,
        clientId: auth.getValue().company?.clientId!,
        companyId: auth.getValue().company?.companyId!,
        extraData: {
          timezone: getValues().timezone!,
          jobTitle: getValues().jobTitle,
          mobilePhone: getValues().mobile ?? '',
          telephone: getValues().phone ?? '',
          department: getValues().department ?? '',
          fax: getValues().fax ?? '',
        },
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
  action: 'read',
}
