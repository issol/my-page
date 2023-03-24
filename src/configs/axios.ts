import { ApiErrorHandler } from '@src/shared/sentry-provider'
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import authConfig from 'src/configs/auth'
import {
  getUserTokenFromBrowser,
  removeUserTokenFromBrowser,
  saveUserTokenToBrowser,
  removeUserDataFromBrowser,
} from 'src/shared/auth/storage'

export const BASEURL =
  process.env.NEXT_PUBLIC_API_DOMAIN || 'https://api-enough-dev.gloground.com'
let isTokenRefreshing = false
let refreshSubscribers: any = []

const onTokenRefreshed = (accessToken: string) => {
  refreshSubscribers.map((callback: any) => callback(accessToken))
  refreshSubscribers = []
}

const addRefreshSubscriber = (callback: any) => {
  refreshSubscribers.push(callback)
}

const instance = axios.create({
  baseURL: BASEURL,
  headers: {
    Accept: 'application/json',
    Authorization:
      'Bearer ' + typeof window === 'object' ? getUserTokenFromBrowser() : null,
  },
  timeout: 10000,
  withCredentials: true,
})

export const setHeaderToken = (token: string) => {
  saveUserTokenToBrowser(token)
}

export const getHeaderToken = () => {
  return getUserTokenFromBrowser()
}

instance.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const token = getHeaderToken()
    if (token) {
      config.headers = config.headers ?? {}
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  },
)

instance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  async (error: AxiosError) => {
    error.config = error.config ?? {}
    const originalRequest = error.config
    const originalRequestHeader = error.config.headers ?? {}
    if (error.response?.status === 401) {
      if (!isTokenRefreshing) {
        isTokenRefreshing = true
        try {
          const refreshTokenInstance = axios.create({
            baseURL: BASEURL,
            headers: {
              Accept: 'application/json',
              Authorization: originalRequest?.headers?.Authorization,
            },
            withCredentials: true,
            timeout: 10000,
          })
          const { data } = await refreshTokenInstance.get(
            '/api/enough/a/refresh',
          )

          const { accessToken: newAccessToken } = data

          if (newAccessToken === null) {
            isTokenRefreshing = false
            window.location.href = '/login'

            removeUserDataFromBrowser()

            return Promise.reject(error)
          } else {
            setHeaderToken(newAccessToken)

            isTokenRefreshing = false
            axios.defaults.headers.common['Authorization'] =
              'Bearer ' + newAccessToken
            onTokenRefreshed(newAccessToken)
            // window.location.reload()
          }
        } catch (e: any) {
          window.location.href = '/login'
          removeUserDataFromBrowser()
        }
      }
      const retryOriginalRequest = new Promise(resolve => {
        addRefreshSubscriber((accessToken: any) => {
          originalRequestHeader.Authorization = 'Bearer ' + accessToken
          resolve(axios(originalRequest))
        })
      })

      return retryOriginalRequest
    } else {
      ApiErrorHandler(error)
      // ApiErrorHandler(error, localStorage.getItem('email') ?? 'not logged-in')
    }
    return Promise.reject(error)
  },
)

export default instance
