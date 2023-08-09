import { useState, ReactNode, useEffect } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'

// ** Style Components
import Box, { BoxProps } from '@mui/material/Box'
import { styled as muiStyled, useTheme } from '@mui/material/styles'
import { useMediaQuery } from '@mui/material'
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'
import { useMutation } from 'react-query'

// ** third parties
import toast from 'react-hot-toast'

// ** types
import {
  ClientClassificationType,
  ClientCompanyInfoType,
  CorporateClientInfoType,
} from '@src/context/types'

// ** components
import CorporateClientForm from './components/corporate-client-form'
import SelectClientRole from './components/select-role'
import { ClientAddressFormType } from '@src/types/schema/client-address.schema'
import IndividualClientForm from './components/individual-client-form'

// ** apis
import { createClient } from '@src/apis/client.api'

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
  const { company } = useAuth()

  useEffect(() => {
    if (company?.name) {
      router.push('/')
    }
  }, [company])

  function onError() {
    toast.error('Something went wrong. Please try again.', {
      position: 'bottom-left',
    })
  }

  const createClientMutation = useMutation(
    (
      data: CorporateClientInfoType &
        ClientCompanyInfoType &
        ClientAddressFormType,
    ) => createClient(data),
    {
      onSuccess: () => {
        router.push('/home')
      },
      onError: () => onError(),
    },
  )

  function updateClientInformation(
    data: CorporateClientInfoType &
      ClientCompanyInfoType &
      ClientAddressFormType,
  ) {
    createClientMutation.mutate(data)
  }

  function renderForm() {
    switch (clientType) {
      case 'corporate':
      case 'corporate_non_korean':
        return (
          <CorporateClientForm
            clientType={clientType}
            setClientType={setClientType}
            onSubmit={updateClientInformation}
          />
        )
      case 'individual':
        return (
          <IndividualClientForm
            clientType={clientType}
            setClientType={setClientType}
            onSubmit={updateClientInformation}
          />
        )
      default:
        return null
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
            src={
              clientType === 'individual'
                ? `/images/pages/register-illustration-1.png`
                : `/images/pages/register-illustration-2.png`
            }
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
              renderForm()
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

NewClientProfileForm.acl = {
  subject: 'client',
  action: 'update',
}
