// ** Config
import { CreateClientBodyType } from '@src/apis/client.api'
import { CountryType } from '@src/types/sign/personalInfoTypes'
import authConfig from 'src/configs/auth'
import { UserDataType } from 'src/context/types'
/* session, local storage에 저장/삭제하는 로직을 여기서 관리 */

export function removeAllStorage() {
  if (typeof window === 'object') {
    window.localStorage.clear()
  }
}

/* UserData */
export function getUserDataFromBrowser() {
  if (typeof window === 'object') {
    return window.sessionStorage.getItem(authConfig.userInfo)
  }
}

export function saveUserDataToBrowser(userData: UserDataType) {
  if (typeof window === 'object') {
    window.sessionStorage.setItem(authConfig.userInfo, JSON.stringify(userData))
  }
}

export function removeUserDataFromBrowser() {
  if (typeof window === 'object') {
    window.sessionStorage.removeItem(authConfig.userInfo)
  }
}

/* Token */
export function getUserTokenFromBrowser() {
  if (typeof window === 'object') {
    return window.sessionStorage.getItem(authConfig.storageTokenKeyName)
  }
}

export function saveUserTokenToBrowser(token: string) {
  if (typeof window === 'object') {
    window.sessionStorage.setItem(authConfig.storageTokenKeyName, token)
  }
}

export function removeUserTokenFromBrowser() {
  if (typeof window === 'object') {
    window.sessionStorage.removeItem(authConfig.storageTokenKeyName)
  }
}

/* rememberMe */
export function getRememberMe() {
  if (typeof window === 'object') {
    return window.localStorage.getItem(authConfig.rememberId)
  }
}

export function saveRememberMe(email: string) {
  if (typeof window === 'object') {
    window.localStorage.setItem(authConfig.rememberId, email)
  }
}

export function removeRememberMe() {
  if (typeof window === 'object') {
    window.localStorage.removeItem(authConfig.rememberId)
  }
}

export function getRedirectPath() {
  if (typeof window === 'object') {
    return window.localStorage.getItem(authConfig.redirectPath)
  }
}

export function setRedirectPath(path: string) {
  if (typeof window === 'object') {
    window.localStorage.setItem(authConfig.redirectPath, path)
  }
}

export function removeRedirectPath() {
  if (typeof window === 'object') {
    window.localStorage.removeItem(authConfig.redirectPath)
  }
}
