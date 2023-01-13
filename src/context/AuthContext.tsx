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

// ** Defaults
const defaultProvider: AuthValuesType = {
  user: null,
  loading: true,
  setUser: (n: any) => {
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
        setUser(JSON.parse(window.localStorage.getItem('userData') || ''))
        setLoading(false)
      } else {
        window.localStorage.removeItem('userData')
        // router.replace('/login')
        setLoading(false)
      }
    }

    initAuth()
  }, [])

  const handleLogin = (
    params: LoginParams,
    errorCallback?: ErrCallbackType,
  ) => {
    // axios
    login(params.email, params.password)
      .then(async response => {
        Promise.all([
          getUserInfo(response.email),
          getUserRoleNPermission(response.userId),
        ])
          .then(values => {
            console.log(values)
            const profile = values[0]
            const permission = values[1]

            window.localStorage.setItem(
              'userData',
              JSON.stringify({
                id: response.userId,
                role: permission.roles,
                email: response.email,
                username: `${profile.firstName} ${profile.extraData?.middleName} ${profile.lastName}`,
                extraData: profile.extraData,
                permission: [...permission.permissions, 'IK9400'],
              }),
            )
            setUser({
              id: response.userId,
              role: permission.roles,
              email: response.email,
              username: `${profile.firstName} ${profile.extraData?.middleName} ${profile.lastName}`,
              extraData: profile.extraData,
              permission: [...permission.permissions, 'IK9400'],
            })

            if (
              !profile.firstName ||
              (!profile.lastName && permission.roles.includes('PRO'))
            ) {
              if (permission.roles.includes('PRO')) {
                router.push('/welcome/consumer')
              } else if (
                permission.roles.includes('TAD') ||
                permission.roles.includes('LPM')
              ) {
                router.push('/welcome/manager')
              }
            }
          })
          .catch(e => {
            console.log(e)
            router.push('/login')
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
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
