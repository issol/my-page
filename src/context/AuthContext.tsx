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
import { getUserRoleNPermission } from 'src/apis/user.api'
import { loginResType } from 'src/types/sign/signInTypes'
import { ModalContext } from './ModalContext'
import { Box } from '@mui/system'
import { Button, Dialog, Typography } from '@mui/material'

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

  // ** Hooks
  const router = useRouter()

  useEffect(() => {
    const initAuth = async (): Promise<void> => {
      router.pathname === '/' && router.replace('/login')

      const storedToken = window.localStorage.getItem(
        authConfig.storageTokenKeyName,
      )!

      if (storedToken) {
        setLoading(true)
        window.localStorage.getItem('userData') &&
          setUser(JSON?.parse(window.localStorage.getItem('userData') || ''))
        setLoading(false)
      } else {
        window.localStorage.removeItem('userData')
        setLoading(false)
      }
    }

    initAuth()
  }, [])

  useEffect(() => {
    if (user === null) return
    if (!user.firstName) {
      if (user.role.includes('PRO')) {
        router.replace('/welcome/consumer')
        /** TODO:
         acl에서 role을 체크하는 부분 때문에 부득이하게 같은 페이지를 두개 만들어 routing.
         추후 acl에서 role은 체크하지 않도록 수정이 필요함
         1. 수정되면 조건문 수정
            else if(user.role.includes('TAD') || user.role.includes('LPM')) router.replace('/welcome/manager')
         2. 불필요해진 페이지 삭제
       */
      } else if (user.role.includes('TAD')) {
        router.replace('/welcome/manager/tad')
      } else if (user.role.includes('LPM')) {
        router.replace('/welcome/manager/lpm')
      }
    }
  }, [user])

  async function updateUserInfo(response: loginResType) {
    Promise.all([
      getUserInfo(response.email),
      getUserRoleNPermission(response.userId),
    ])
      .then(values => {
        const profile = values[0]
        const permission = values[1]
        const userInfo = {
          id: response.userId,
          role: permission.roles,
          email: response.email,
          username: `${profile.firstName} ${profile?.middleName ?? ''} ${
            profile.lastName
          }`,
          firstName: profile.firstName,
          timezone: profile.timezone,
          permission: [...permission.permissions, 'IK9400'],
        }

        window.localStorage.setItem('userData', JSON.stringify(userInfo))
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

        params.rememberMe
          ? window.localStorage.setItem(authConfig.rememberId, params.email)
          : window.localStorage.removeItem(authConfig.rememberId)
        window.localStorage.setItem(
          authConfig.storageTokenKeyName,
          response.accessToken,
        )

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
    window.localStorage.removeItem('userData')
    window.localStorage.removeItem(authConfig.storageTokenKeyName)
    window.localStorage.removeItem('policy')
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
