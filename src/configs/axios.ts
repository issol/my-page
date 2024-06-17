import { ApiErrorHandler } from '@src/shared/sentry-provider'
import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import axios from 'axios'

import {
  getUserDataFromBrowser,
  getUserTokenFromBrowser,
  removeCompanyDataFromBrowser,
  removeUserDataFromBrowser,
  saveUserTokenToBrowser,
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

export const axiosConfigs = {
  baseURL: BASEURL,
  headers: {
    Accept: 'application/json',
    Authorization:
      'Bearer ' + typeof window === 'object' ? getUserTokenFromBrowser() : null,
  },
  timeout: 10000,
  withCredentials: true,
}

const instance = axios.create(axiosConfigs)

export const setHeaderToken = (token: string) => {
  saveUserTokenToBrowser(token)
}

export const getHeaderToken = () => {
  return getUserTokenFromBrowser()
}

instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
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
  async error => {
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
            removeCompanyDataFromBrowser()

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
          removeCompanyDataFromBrowser()
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
      ApiErrorHandler(
        error,
        JSON.parse(getUserDataFromBrowser()!)?.email,
        window.location.href,
      )
      // ApiErrorHandler(error, localStorage.getItem('email') ?? 'not logged-in')
    }
    return Promise.reject(error)
  },
)

export default instance
