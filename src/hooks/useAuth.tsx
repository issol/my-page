import { login, logout } from '@src/apis/sign.api'
import {
  getUserInfo,
  getClientUserInfo,
  UserInfoResType,
} from '@src/apis/user.api'
import axios from '@src/configs/axios'
import {
  ClientUserType,
  ErrCallbackType,
  LoginParams,
  RegisterParams,
  UserDataType,
} from '@src/context/types'
import useModal from '@src/hooks/useModal'

import {
  getCurrentRole,
  removeAllSessionStorage,
  removeCompanyDataFromBrowser,
  removeRememberMe,
  removeUserDataFromBrowser,
  removeUserTokenFromBrowser,
  saveCompanyDataToBrowser,
  saveRememberMe,
  saveUserDataToBrowser,
  saveUserTokenToBrowser,
} from '@src/shared/auth/storage'
import { authState } from '@src/states/auth'
import { loginResType } from '@src/types/sign/signInTypes'
import { useRouter } from 'next/router'
import {
  useRecoilRefresher_UNSTABLE,
  useRecoilState,
  useSetRecoilState,
} from 'recoil'
import authConfig from '@src/configs/auth'
import useRecoilCacheRefresh from './useRecoilCacheRefresh'
import {
  currentRoleSelector,
  permissionSelector,
  permissionState,
} from '@src/states/permission'
import { deleteCookie, getCookie, setCookie } from 'cookies-next'
import SignupNotApprovalModal from 'src/pages/[companyName]/components/modals/confirm-modals/signup-not-approval-modal'

const useAuth = () => {
  const setAuth = useSetRecoilState(authState)
  const setCurrentRole = useSetRecoilState(currentRoleSelector)
  const currentRole = getCurrentRole()
  const router = useRouter()
  const { openModal, closeModal } = useModal()

  const updateUserInfo = async (
    response: loginResType,
  ): Promise<UserInfoResType | null> => {
    let result: UserInfoResType | null = null

    if (response?.accessToken) {
      saveUserTokenToBrowser(response.accessToken)
    }
    try {
      const value = await getUserInfo(response.userId)
      const profile = value
      const userInfo = {
        ...profile,
        id: response.userId,
        email: response.email,
        username: `${profile.firstName} ${
          profile?.middleName ? '(' + profile?.middleName + ')' : ''
        } ${profile.lastName}`,
        firstName: profile.firstName,
        timezone: profile.timezone,
      }

      result = userInfo

      saveUserDataToBrowser(userInfo)

      // 컴퍼니 데이터 패칭이 늦어 auth-provider에서 company 데이터가 도착하기 전에 로직체크가 됨
      // user, company 데이터를 동시에 set 하도록 변경
      if (
        value.roles &&
        value.roles?.filter(role => role.name === 'CLIENT').length > 0
      ) {
        const companyData = await getClientUserInfo()
        saveCompanyDataToBrowser(companyData)
        setAuth(prev => ({ ...prev, user: userInfo, company: companyData }))
      } else {
        setAuth(prev => ({ ...prev, user: userInfo }))
      }
      setCurrentRole(
        value?.roles && value?.roles.length > 0 ? value?.roles[0] : null,
      )
    } catch (e) {
      router.push('/login')
    }
    console.log(result)
    return result
  }

  const handleLogin = (
    params: LoginParams,
    errorCallback?: ErrCallbackType,
    successCallback?: any,
  ) => {
    login(params.email, params.password)
      .then(async response => {
        if (!response.accessToken) {
          openModal({
            type: 'signup-not-approval-modal',
            children: (
              <SignupNotApprovalModal
                companyName={response.companyName ?? ''}
                onClose={() => closeModal('signup-not-approval-modal')}
              />
            ),
          })
        } else {
          updateUserInfo(response).then(res => {
            if (successCallback) {
              successCallback()
            } else {
              if (res) {
                const role =
                  res?.roles && res?.roles.length > 0 ? res?.roles[0] : null

                const companyName = res.company ?? null
                setCookie('companyName', companyName, { secure: true })
                if (companyName) {
                  router.replace(`/${companyName}/`)
                } else {
                  router.replace('/')
                }
                // router.replace()
                // if (role) {
                //   switch (role.name) {
                //     case 'PRO':
                //       router.replace(`/dashboards/pro`)
                //       break
                //     case 'LPM':
                //       router.replace(`/dashboards/lpm`)
                //       break
                //     case 'TAD':
                //       router.replace(`/dashboards/tad`)
                //       break
                //     case 'ACCOUNT_MANAGER':
                //       router.replace(`/dashboards/account`)
                //       break
                //     case 'CLIENT':
                //       router.replace(`/dashboards/client`)
                //       break

                //     default:
                //       router.replace('/')
                //   }
                // }
              }
            }
          })

          params.rememberMe ? saveRememberMe(params.email) : removeRememberMe()
          saveUserTokenToBrowser(response.accessToken)
        }
      })

      .catch(err => {
        if (err.message === '406' || err.message === 406) {
          openModal({
            type: 'signup-not-approval-modal',
            children: (
              <SignupNotApprovalModal
                onClose={() => closeModal('signup-not-approval-modal')}
              />
            ),
          })
        } else if (errorCallback) errorCallback(err)
        else return err
      })
  }

  const handleLogout = async () => {
    const companyName = getCookie('companyName')

    removeUserDataFromBrowser()
    removeUserTokenFromBrowser()
    removeCompanyDataFromBrowser()
    removeAllSessionStorage()
    deleteCookie('companyName')

    setAuth({ user: null, company: undefined, loading: false })
    setCurrentRole(null)

    await logout()

    if (companyName) {
      router.push(`/${companyName}/login`)
    } else {
      router.push('/login')
    }
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

  return {
    login: handleLogin,
    logout: handleLogout,
    register: handleRegister,
    updateUserInfo: updateUserInfo,
  }
}

export default useAuth
