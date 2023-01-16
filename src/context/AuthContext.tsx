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
  LoginSuccessResponse,
} from './types'
import { useMutation, useQuery } from 'react-query'
import { login, logout } from 'src/apis/sign.api'
import { TadPermission } from 'src/layouts/UserLayout'
import { getUserInfo } from 'src/apis/user.api'
import { getUserRoleNPermission } from 'src/apis/user.api'
import { loginResType } from 'src/types/sign/signInTypes'

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
  // ** States
  const [user, setUser] = useState<UserDataType | null>(defaultProvider.user)
  const [loading, setLoading] = useState<boolean>(defaultProvider.loading)

  // ** Hooks
  const router = useRouter()

  useEffect(() => {
    const initAuth = async (): Promise<void> => {
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
        router.replace('/login')
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
      } else if (user.role.includes('TAD') || user.role.includes('LPM')) {
        router.replace('/welcome/manager')
      }
    }
  }, [user])

  function updateUserInfo(response: loginResType) {
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
          username: `${profile.firstName} ${profile?.middleName ?? null} ${
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
        console.log(e)
        router.push('/login')
      })
  }
  const handleLogin = (
    params: LoginParams,
    errorCallback?: ErrCallbackType,
  ) => {
    // axios
    login(params.email, params.password)
      .then(async response => {
        updateUserInfo(response)

        params.rememberMe
          ? window.localStorage.setItem(authConfig.rememberId, params.email)
          : window.localStorage.removeItem(authConfig.rememberId)
        window.localStorage.setItem(
          authConfig.storageTokenKeyName,
          response.accessToken,
        )

        // const returnUrl = router.query.returnUrl
        // const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/'

        router.replace('/')
      })

      .catch(err => {
        if (errorCallback) errorCallback(err)
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

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
