import * as Sentry from '@sentry/react'
import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import dayjs from 'dayjs'

export const StatusCode = {
  100: 'Error',
  400: 'Bad Request',
  401: 'Unauthorized',
  402: 'Payment Required',
  403: 'Forbidden',
  404: 'Not Found',
  405: 'Method Not Allowed',
  406: 'Not Acceptable',
  407: 'Proxy Authentication Required',
  408: 'Request Timeout',
  409: 'Conflict',
  410: 'Gone',
  411: 'Length Required',
  412: 'Precondition Failed',
  413: 'Payload Too Large',
  414: 'URI Too Long',
  415: 'Unsupported Media Type',
  416: 'Requested Range Not Satisfiable',
  417: 'Expectation Failed',
  418: "I'm a teapot",
  421: 'Misdirected Request',
  422: 'Unprocessable Entity (WebDAV)',
  423: 'Locked (WebDAV)',
  424: 'Failed Dependency (WebDAV)',
  426: 'Upgrade Required',
  428: 'Precondition Required',
  429: 'Too Many Requests',
  431: 'Request Header Fields Too Large',
  451: 'Unavailable For Legal Reasons',

  500: 'Internal Server Error',
  501: 'Not Implemented',
  502: 'Bad Gateway',
  503: 'Service Unavailable',
  504: 'Gateway Timeout',
  505: 'HTTP Version Not Supported',
  506: 'Variant Also Negotiates',
  507: 'Insufficient Storage',
  508: 'Loop Detected (WebDAV)',
  510: 'Not Extended',
  511: 'Network Authentication Required',
}

export const ApiErrorHandler = (error: AxiosError, email = '') => {
  const errorData = error.config?.data
  console.log('sentry', error.config)
  const { method, url, params, headers } = error?.config || {} // axios의 error객체
  const { data, status } = error.response || { data: null, status: null }
  if (status !== 401) {
    Sentry.withScope((scope: Sentry.Scope) => {
      scope.setTransactionName(`${status} Error`)

      Sentry.setContext('API Request Detail', {
        method,
        url,
        params,
        errorData,
        headers,
      })
      Sentry.setContext('API Response Detail', {
        status,
        data,
      })

      scope.setFingerprint([method!, status ? status.toString() : '', url!])
      scope.setTag('Api Error', `${status}`)
      scope.setTag('email', email)
      scope.setUser({ email: email })
      scope.setLevel('error')

      const err: any = new Error(`${error.message}`)

      if (Object.keys(StatusCode).includes(status ? status.toString() : '')) {
        for (const [key, value] of Object.entries(StatusCode)) {
          if (status && key === status.toString()) err.name = value
        }
      }

      Sentry.captureException(err)
    })
  }
}

export const ClientErrorHandler = (
  event: Sentry.Event,
  hint: Sentry.EventHint,
) => {
  const error = hint.originalException!.toString()
  const occurred = event.request!.url
  const time = dayjs(event.timestamp).format('YYYY-MM-DD HH:mm:ss')
  // const time = moment(event.timestamp, 'X')
  //   .tz('timezone')
  //   .format('YYYY-MM-DD HH:mm:ss')
  event.tags = event.tags || {}
  event.contexts = event.contexts || {}
  event.user = event.user || {}
  event.tags.email = sessionStorage.getItem('email') ?? 'not logged-in'
  event.user.email = sessionStorage.getItem('email') ?? 'not logged-in'

  event.transaction = 'Client Error'

  event.contexts = { 'Error Detail': { error, occurred, time } }

  return event
}
