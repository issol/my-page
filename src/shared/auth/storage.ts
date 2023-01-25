// ** Config
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
export function gerRememberMe() {
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

/* Enough 전체 permission 정보 */
export function getAllPermission() {
  if (typeof window === 'object') {
    return window.localStorage.getItem(authConfig.permission)
  }
}

export function saveAllPermission(permission: any) {
  if (typeof window === 'object') {
    window.localStorage.setItem(authConfig.permission, permission)
  }
}

export function removeAllPermission() {
  if (typeof window === 'object') {
    window.localStorage.removeItem(authConfig.permission)
  }
}
