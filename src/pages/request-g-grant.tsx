// ** React Imports
import { useState, ReactNode, useEffect, useContext } from 'react'

// ** MUI Components
import Box, { BoxProps } from '@mui/material/Box'

import { styled as muiStyled, useTheme } from '@mui/material/styles'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'
import { useMutation } from 'react-query'

// ** Third Party Components
import toast from 'react-hot-toast'
import { useRouter } from 'next/router'
import { ModalContext } from 'src/context/ModalContext'

const RequestGGrant = () => {
  const code =
    typeof window === 'object'
      ? new URL(window.location.href).searchParams.get('code')
      : null
  console.log(window)

  // ** Hooks
  const auth = useAuth()

  return <Box className='content-right'></Box>
}

RequestGGrant.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

RequestGGrant.guestGuard = true

export default RequestGGrant
