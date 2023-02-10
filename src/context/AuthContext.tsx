// ** React Imports
import { createContext, useEffect, useState, ReactNode, Dispatch } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Axios
// import axios from 'src/configs/axios-client'
// import axiosDefault from 'axios'
import axios from 'axios'

// ** Config
import authConfig from 'src/configs/auth'

// ** Types
import {
  AuthValuesType,
  RegisterParams,
  LoginParams,
  ErrCallbackType,
  UserDataType,
} from './types'
import { login, logout } from 'src/apis/sign.api'
import { TadPermission } from 'src/layouts/UserLayout'
import { getUserInfo } from 'src/apis/user.api'
import { loginResType } from 'src/types/sign/signInTypes'
import { Box } from '@mui/system'
import { Button, Dialog, Typography } from '@mui/material'
import {
  getUserDataFromBrowser,
  getUserTokenFromBrowser,
  removeRememberMe,
  removeUserDataFromBrowser,
  removeUserTokenFromBrowser,
  saveRememberMe,
  saveUserDataToBrowser,
  saveUserTokenToBrowser,
} from 'src/shared/auth/storage'

/* redux */
import { getPermission, getRole } from 'src/store/permission'
import { useAppDispatch } from 'src/hooks/useRedux'

// ** Defaults
const defaultProvider: AuthValuesType = {
  user: null,
  loading: true,
  setUser: (n: any) => {
    return null
  },
  updateUserInfo: (_: any) => {
    return null
  },
  setLoading: () => Boolean,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  register: () => Promise.resolve(),
}

const AuthContext = createContext(defaultProvider)

type Props = {
  children: ReactNode
}

const AuthProvider = ({ children }: Props) => {
  const [openModal, setOpenModal] = useState(false)

  // ** States
  const [user, setUser] = useState<UserDataType | null>(defaultProvider.user)
  const [loading, setLoading] = useState<boolean>(defaultProvider.loading)

  const dispatch = useAppDispatch()

  // ** Hooks
  const router = useRouter()

  useEffect(() => {
    if (user) {
      dispatch(getRole(user.id))
      dispatch(getPermission())
    }
  }, [user])

  useEffect(() => {
    const initAuth = async (): Promise<void> => {
      router.pathname === '/' && router.replace('/login')

      const storedToken = getUserTokenFromBrowser()!

      if (storedToken) {
        setLoading(true)
        getUserDataFromBrowser() &&
          setUser(JSON?.parse(getUserDataFromBrowser() || ''))
        setLoading(false)
      } else {
        removeUserDataFromBrowser()
        setLoading(false)
      }
    }

    initAuth()
  }, [])

  async function updateUserInfo(response: loginResType) {
    getUserInfo(response.email)
      .then(value => {
        const profile = value
        const userInfo = {
          ...profile,
          id: response.userId,
          email: response.email,
          username: `${profile.firstName} ${
            profile?.middleName ? '(' + profile?.middleName + ')' : ''
          } ${profile.lastName}`,
          firstName: profile.firstName,
          timezone: profile.timezone,
        }
        saveUserDataToBrowser(userInfo)
        setUser(userInfo)
      })
      .catch(e => {
        router.push('/login')
      })
  }

  const handleLogin = (
    params: LoginParams,
    errorCallback?: ErrCallbackType,
    successCallback?: any,
  ) => {
    // axios
    login(params.email, params.password)
      .then(async response => {
        updateUserInfo(response).then(() => {
          if (successCallback) {
            successCallback()
          } else {
            router.replace('/')
          }
        })

        params.rememberMe ? saveRememberMe(params.email) : removeRememberMe()

        saveUserTokenToBrowser(response.accessToken)

        // const returnUrl = router.query.returnUrl
        // const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/'
      })

      .catch(err => {
        if (err.message === '406' || err.message === 406) {
          setOpenModal(true)
        } else if (errorCallback) errorCallback(err)
        else return err
      })
  }

  const handleLogout = () => {
    setUser(null)
    removeUserDataFromBrowser()
    removeUserTokenFromBrowser()
    logout()
    router.push('/login')
  }

  const handleRegister = (
    params: RegisterParams,
    errorCallback?: ErrCallbackType,
  ) => {
    axios
      .post(authConfig.registerEndpoint, params)
      .then((res: any) => {
        if (res.data.error) {
          if (errorCallback) errorCallback(res.data.error)
        } else {
          handleLogin({ email: params.email, password: params.password })
        }
      })
      .catch((err: { [key: string]: string }) =>
        errorCallback ? errorCallback(err) : null,
      )
  }

  const values = {
    user,
    loading,
    setUser,
    setLoading,
    login: handleLogin,
    logout: handleLogout,
    register: handleRegister,
    updateUserInfo: updateUserInfo,
  }

  return (
    <AuthContext.Provider value={values}>
      <AlertModal open={openModal} onClose={() => setOpenModal(false)} />
      {children}
    </AuthContext.Provider>
  )
}

export { AuthContext, AuthProvider }

function AlertModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Dialog open={open}>
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
            src='/images/icons/project-icons/status-progress.png'
            width={60}
            height={60}
            alt='role select error'
          />
          <Typography variant='h6'>
            Sign up approval for <span style={{ color: '#666CFF' }}>GloZ</span>{' '}
            is
            <br />
            in progress.
          </Typography>
          <Typography variant='body2'>
            You can sign in once approved.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center' }} mt={4}>
          <Button
            variant='contained'
            onClick={onClose}
            sx={{ background: '#666CFF', textTransform: 'none' }}
          >
            Okay
          </Button>
        </Box>
      </Box>
    </Dialog>
  )
}
