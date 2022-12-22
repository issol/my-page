import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'

const { NODE_ENV } = process.env

const baseUrl =
  NODE_ENV === 'development' ? process.env.NEXT_PUBLIC_BASEURL : ''
export const BASEURL =
  process.env.NEXT_PUBLIC_API_DOMAIN || 'https://api-dev.gloground.com'

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
    // ApiErrorHandler(error, localStorage.getItem('email') ?? 'not logged-in')
    return Promise.reject(error)
  },
)

// instance.interceptors.response.use(
//   (response: AxiosResponse) => {
//     return response
//   },
//   async (error) => {
//     const originalRequest = error.config
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       // 인증 실패시 토큰 재요청 여기서 할건지 정하기
//     }
//     return Promise.reject(error)
//   },
// )

instance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  async (error: AxiosError) => {
    error.config = error.config ?? {}
    const originalRequest = error.config
    const originalRequestHeader = error.config.headers ?? {}

    // if (window.location.host.includes('localhost')) {
    // } else{

    // }

    if (error.response?.status === 401) {
      if (!isTokenRefreshing) {
        isTokenRefreshing = true
        window.localStorage.removeItem('userData')
        // const { data } = useGetRefreshToken(isTokenRefreshing)
        const { data } = await axios.get(
          `${BASEURL}/api/pichu/auth/refresh-access-token?selects=email&selects=originatorCredentials`,
        )

        const { accessToken: newAccessToken } = data

        // console.log(newAccessToken)

        if (newAccessToken === null) {
          isTokenRefreshing = false
          window.location.href = '/login'

          localStorage.removeItem('accessToken')
          localStorage.removeItem('email')
          localStorage.removeItem('role')

          return Promise.reject(error)
        } else {
          setHeaderToken(newAccessToken)
          // invalidateQuery()

          isTokenRefreshing = false
          axios.defaults.headers.common['Authorization'] =
            'Bearer ' + newAccessToken
          onTokenRefreshed(newAccessToken)
          window.location.reload()
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
