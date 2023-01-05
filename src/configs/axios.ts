import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import authConfig from 'src/configs/auth'

export const BASEURL =
  process.env.NEXT_PUBLIC_API_DOMAIN || 'https://api-enough-dev.gloground.com'
console.log('BaseUrl : ', BASEURL)
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
      'Bearer ' + typeof window === 'object'
        ? localStorage.getItem('accessToken')
        : null,
  },
  timeout: 10000,
  withCredentials: true,
})

export const setHeaderToken = (token: string) => {
  if (typeof window === 'object') {
    localStorage.setItem('accessToken', token)
  }
}

export const getHeaderToken = () => {
  if (typeof window === 'object') {
    return localStorage.getItem('accessToken')
  }
}

export const getEmail = () => {
  if (typeof window === 'object') {
    return localStorage.getItem('email') ?? ''
  }
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
        const { data } = await axios.get(
          `${BASEURL}/api/pichu/auth/refresh-access-token?selects=email&selects=originatorCredentials`,
        )

        const { accessToken: newAccessToken } = data

        if (newAccessToken === null) {
          isTokenRefreshing = false
          window.location.href = '/login'

          localStorage.removeItem(authConfig.storageTokenKeyName)
          localStorage.removeItem('email')
          localStorage.removeItem('role')

          return Promise.reject(error)
        } else {
          setHeaderToken(newAccessToken)

          isTokenRefreshing = false
          axios.defaults.headers.common['Authorization'] =
            'Bearer ' + newAccessToken
          onTokenRefreshed(newAccessToken)
          // window.location.reload()
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
      // ApiErrorHandler(error, localStorage.getItem('email') ?? 'not logged-in')
    }
    return Promise.reject(error)
  },
)

export default instance
