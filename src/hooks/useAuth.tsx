import { login, logout } from '@src/apis/sign.api'
import { getUserInfo, getClientUserInfo } from '@src/apis/user.api'
import axios from '@src/configs/axios'
import {
  ClientUserType,
  ErrCallbackType,
  LoginParams,
  RegisterParams,
  UserDataType,
} from '@src/context/types'
import useModal from '@src/hooks/useModal'
import SignupNotApprovalModal from '@src/pages/components/modals/confirm-modals/signup-not-approval-modal'
import {
  removeRememberMe,
  removeUserDataFromBrowser,
  removeUserTokenFromBrowser,
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
import authConfig from 'src/configs/auth'
import useRecoilCacheRefresh from './useRecoilCacheRefresh'
import {
  currentRoleSelector,
  permissionSelector,
  permissionState,
} from '@src/states/permission'

const useAuth = () => {
  const setAuth = useSetRecoilState(authState)
  const setCurrentRole = useSetRecoilState(currentRoleSelector)
  const router = useRouter()
  const { openModal, closeModal } = useModal()

  async function updateUserInfo(response: loginResType) {
    if (response?.accessToken) {
      saveUserTokenToBrowser(response.accessToken)
    }
    getUserInfo(response.userId)
      .then(value => {
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
        saveUserDataToBrowser(userInfo)

        // 컴퍼니 데이터 패칭이 늦어 auth-provider에서 company 데이터가 도착하기 전에 로직체크가 됨
        // user, company 데이터를 동시에 set 하도록 변경
        getClientUserInfo()
        .then(companyData => {
          setAuth(prev => ({ ...prev, user: userInfo, company: companyData}))
        })
      })
      .catch(e => {
        router.push('/login')
      })
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
          updateUserInfo(response).then(() => {
            if (successCallback) {
              successCallback()
            } else {
              router.replace('/')
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

  const handleLogout = () => {
    setAuth(prev => ({ ...prev, user: null }))
    setCurrentRole(null)

    removeUserDataFromBrowser()
    removeUserTokenFromBrowser()

    logout()
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

  return {
    login: handleLogin,
    logout: handleLogout,
    register: handleRegister,
    updateUserInfo: updateUserInfo,
  }
}

export default useAuth
