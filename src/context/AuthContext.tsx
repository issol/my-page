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
import { getProfile, getRefreshToken, login } from 'src/apis/sign.api'

// ** Defaults
const defaultProvider: AuthValuesType = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  register: () => Promise.resolve(),
}

const AuthContext = createContext(defaultProvider)

type Props = {
  children: ReactNode
}

type RoleType = {
  role: string
}

const AuthProvider = ({ children }: Props) => {
  // ** States
  const [user, setUser] = useState<UserDataType | null>(defaultProvider.user)
  const [loading, setLoading] = useState<boolean>(defaultProvider.loading)

  // ** Hooks
  const router = useRouter()

  // useEffect(() => {
  //   const initAuth = async (): Promise<void> => {
  //     const storedToken = window.localStorage.getItem(
  //       authConfig.storageTokenKeyName,
  //     )!

  //     if (storedToken) {
  //       setLoading(true)
  //       await axios
  //         .get(`/api/pika/user/profile`, {
  //           headers: { Authorization: `Bearer ${storedToken}` },
  //         })
  //         .then(async (response: any) => {
  //           setLoading(false)
  //           const data = await axiosDefault.get('/api/policy/data', {
  //             params: { role: response.data.role },
  //           })
  //           setUser({
  //             id: response.data.id,
  //             role: response.data.role,
  //             // role: 'LPM',
  //             email: response.data.email,
  //             fullName: `${response.data.firstName} ${response.data.lastName}`,
  //             username: response.data.nickname,
  //             avatar: response.data.profileImageUrl,
  //             policy: data.data,
  //           })
  //         })

  //         .catch(() => {
  //           localStorage.removeItem('userData')
  //           localStorage.removeItem('refreshToken')
  //           localStorage.removeItem('accessToken')
  //           setUser(null)
  //           setLoading(false)
  //           if (
  //             authConfig.onTokenExpiration === 'logout' &&
  //             !router.pathname.includes('login')
  //           ) {
  //             router.replace('/login')
  //           }
  //         })
  //     } else {
  //       setLoading(false)
  //     }
  //   }

  //   initAuth()
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [])

  // const loginMutation = useMutation((info: LoginParams) =>
  //   login(info.email, info.password),
  // )

  // const handleLogin = (
  //   params: LoginParams,
  //   errorCallback?: ErrCallbackType,
  // ) => {
  //   loginMutation.mutate(params, {
  //     onSuccess: async (data: LoginSuccessResponse) => {
  //       params.rememberMe
  //         ? window.localStorage.setItem(
  //             authConfig.storageTokenKeyName,
  //             data.accessToken,
  //           )
  //         : null

  //       // const returnUrl = router.query.returnUrl
  //       await axios
  //         .get(`/api/pika/user/profile`, {
  //           headers: { Authorization: `Bearer ${data.accessToken}` },
  //         })
  //         .then(async (response: any) => {
  //           setLoading(false)
  //           const data = await axiosDefault.get('/api/policy/data', {
  //             params: { role: response.data.role },
  //           })

  //           setUser({
  //             id: response.data.id,
  //             role: response.data.role,
  //             // role: 'LPM',
  //             email: response.data.email,
  //             fullName: `${response.data.firstName} ${response.data.lastName}`,
  //             username: response.data.nickname,
  //             avatar: response.data.profileImageUrl,
  //             policy: data.data,
  //           })
  //         })
  //         .catch(() => {
  //           localStorage.removeItem('userData')
  //           localStorage.removeItem('refreshToken')
  //           localStorage.removeItem('accessToken')
  //           setUser(null)
  //           setLoading(false)
  //           if (
  //             authConfig.onTokenExpiration === 'logout' &&
  //             !router.pathname.includes('login')
  //           ) {
  //             router.replace('/login')
  //           }
  //         })
  //       params.rememberMe
  //         ? window.localStorage.setItem('userData', JSON.stringify(data))
  //         : null

  //       // const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/'
  //       router.replace('/')
  //     },
  //     onError: err => {
  //       if (errorCallback) errorCallback(err)
  //     },
  //   })
  // }
  useEffect(() => {
    const initAuth = async (): Promise<void> => {
      const storedToken = window.localStorage.getItem(
        authConfig.storageTokenKeyName,
      )!
      if (storedToken) {
        setLoading(true)
        await axios
          .get(authConfig.meEndpoint, {
            headers: {
              Authorization: storedToken,
            },
          })
          .then(async response => {
            const data = await axios.get('/api/policy/data', {
              params: { role: response.data.userData.role },
            })
            setLoading(false)
            setUser({ ...response.data.userData, policy: data.data })
          })
          .catch(() => {
            localStorage.removeItem('userData')
            localStorage.removeItem('refreshToken')
            localStorage.removeItem('accessToken')
            setUser(null)
            setLoading(false)
            if (
              authConfig.onTokenExpiration === 'logout' &&
              !router.pathname.includes('login')
            ) {
              router.replace('/login')
            }
          })
      } else {
        setLoading(false)
      }
    }

    initAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleLogin = (
    params: LoginParams,
    errorCallback?: ErrCallbackType,
  ) => {
    axios
      .post(authConfig.loginEndpoint, params)
      .then(async response => {
        console.log(response)

        params.rememberMe
          ? window.localStorage.setItem(
              authConfig.storageTokenKeyName,
              response.data.accessToken,
            )
          : null
        const returnUrl = router.query.returnUrl

        const data = await axios.get('/api/policy/data', {
          params: { role: response.data.userData.role },
        })

        setUser({ ...response.data.userData, policy: data.data })
        params.rememberMe
          ? window.localStorage.setItem(
              'userData',
              JSON.stringify(response.data.userData),
            )
          : null

        const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/'

        router.replace(redirectURL as string)
      })

      .catch(err => {
        if (errorCallback) errorCallback(err)
      })
  }

  const handleLogout = () => {
    setUser(null)
    window.localStorage.removeItem('userData')
    window.localStorage.removeItem(authConfig.storageTokenKeyName)
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
