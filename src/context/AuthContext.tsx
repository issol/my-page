// ** React Imports
import { createContext, useEffect, useState, ReactNode } from 'react'

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
  setUser: null,
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
        console.log(response)
        /* TODO
        1. getProfile을 해서 role이 없다면
        2. selectRole 페이지로 이동
        3. role이 있는 경우 legal name이 있는지 체크
        4. legal name이 없으면 personal info 작성 페이지로 이동
        5. 있을 경우 role / permission이 manager인 경우
        6. role management 페이지로 이동
        7. 아닐 경우 빈 랜딩페이지로 이동 */
        Promise.all([
          getUserInfo(response.email),
          getUserRoleNPermission(response.userId),
        ])
          .then(values => {
            console.log(values)
          })
          .catch(e => {
            console.log(e)
          })

        params.rememberMe
          ? window.localStorage.setItem(authConfig.rememberId, params.email)
          : window.localStorage.removeItem(authConfig.rememberId)
        window.localStorage.setItem(
          authConfig.storageTokenKeyName,
          response.accessToken,
        )

        /* TODO: 아래 로직도 promise all성공 이후로 옮기기 */
        window.localStorage.setItem(
          'userData',
          JSON.stringify({
            id: response.userId,
            role: ['TAD', 'LPM'],
            email: response.email,
            fullName: 'John Doe',
            username: 'John',
            permission: TadPermission,
          }),
        )
        setUser({
          id: response.userId,
          role: ['TAD', 'LPM'],
          email: response.email,
          fullName: 'John Doe',
          username: 'John',
          permission: TadPermission,
        })
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
