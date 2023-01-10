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
import { getProfile, login } from 'src/apis/sign.api'

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
        // const userData = { token: response.accessToken, email: params.email }
        // params.rememberMe
        //   ? window.localStorage.setItem(
        //       authConfig.storageTokenKeyName,
        //       JSON.stringify(userData),
        //     )
        //   : null
        window.localStorage.setItem(
          'userData',
          JSON.stringify({
            id: response.userId,
            role: ['TAD', 'LPM'],
            email: response.email,
            fullName: 'John Doe',
            username: 'John',
            permission: [
              'dashboard-create',
              'dashboard-read',
              'dashboard-update',
              'dashboard-delete',
              'account-create',
              'account-read',
              'account-update',
              'account-delete',
              'email-create',
              'email-read',
              'email-update',
              'email-delete',
              'recruitingCreate-update',
              'proList-update',
              'quotes-create',
              'quotes-read',
              'quotes-update',
              'quotes-delete',
              'quoteList-create',
              'quoteList-read',
              'quoteList-update',
              'quoteList-delete',
              'quoteCreate-create',
              'quoteCreate-read',
              'quoteCreate-update',
              'quoteCreate-delete',
              'orders-create',
              'orders-read',
              'orders-update',
              'orders-delete',
              'orderList-create',
              'orderList-read',
              'orderList-update',
              'orderList-delete',
              'invoices-create',
              'invoices-read',
              'invoices-update',
              'invoices-delete',
              'clientInvoiceList-create',
              'clientInvoiceList-read',
              'clientInvoiceList-update',
              'clientInvoiceList-delete',
              'roles-create',
              'roles-read',
              'roles-update',
              'roles-delete',
              'company-create',
              'company-read',
              'company-update',
              'company-delete',
            ],
          }),
        )
        setUser({
          id: response.userId,
          role: ['TAD', 'LPM'],
          email: response.email,
          fullName: 'John Doe',
          username: 'John',
          permission: [
            'dashboard-create',
            'dashboard-read',
            'dashboard-update',
            'dashboard-delete',
            'account-create',
            'account-read',
            'account-update',
            'account-delete',
            'email-create',
            'email-read',
            'email-update',
            'email-delete',
            'recruitingCreate-update',
            'proList-update',
            'quotes-create',
            'quotes-read',
            'quotes-update',
            'quotes-delete',
            'quoteList-create',
            'quoteList-read',
            'quoteList-update',
            'quoteList-delete',
            'quoteCreate-create',
            'quoteCreate-read',
            'quoteCreate-update',
            'quoteCreate-delete',
            'orders-create',
            'orders-read',
            'orders-update',
            'orders-delete',
            'orderList-create',
            'orderList-read',
            'orderList-update',
            'orderList-delete',
            'invoices-create',
            'invoices-read',
            'invoices-update',
            'invoices-delete',
            'clientInvoiceList-create',
            'clientInvoiceList-read',
            'clientInvoiceList-update',
            'clientInvoiceList-delete',
            'roles-create',
            'roles-read',
            'roles-update',
            'roles-delete',
            'company-create',
            'company-read',
            'company-update',
            'company-delete',
          ],
        })
        const returnUrl = router.query.returnUrl

        /* TODO
        1. getProfile을 해서 role이 없다면
        2. selectRole 페이지로 이동
        3. role이 있는 경우 legal name이 있는지 체크
        4. legal name이 없으면 personal info 작성 페이지로 이동
        5. 있을 경우 role / permission이 manager인 경우
        6. role management 페이지로 이동
        7. 아닐 경우 빈 랜딩페이지로 이동 */

        /* TODO: getProfile api 나오면 수정 */
        // setUser({
        //   policy: response.data.userData.policy,
        // })

        const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/'

        router.replace(redirectURL as string)
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
