// ** React Imports
import { createContext, useEffect, useState, ReactNode, Dispatch } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Axios
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
  UserRoleType,
  ClientCompanyInfoType,
  CorporateClientInfoType,
} from './types'
import { login, logout } from 'src/apis/sign.api'
import { getClientUserInfo, getUserInfo } from 'src/apis/user.api'
import {
  loginResType,
  LoginResTypeWithOptionalAccessToken,
} from 'src/types/sign/signInTypes'
import { Box } from '@mui/system'
import { Button, Dialog, Typography } from '@mui/material'
import {
  getUserDataFromBrowser,
  getUserTokenFromBrowser,
  removeRememberMe,
  removeUserDataFromBrowser,
  removeUserTokenFromBrowser,
  saveRememberMe,
  saveUserDataToBrowser,
  saveUserTokenToBrowser,
  getRedirectPath,
  removeRedirectPath,
  getCurrentRole,
  setCurrentRole,
} from 'src/shared/auth/storage'

// ** hooks
import useModal from '@src/hooks/useModal'

// ** modals
import SignupNotApprovalModal from '@src/pages/components/modals/confirm-modals/signup-not-approval-modal'

/* redux */
import { getPermission, getRole } from 'src/store/permission'
import { useAppDispatch } from 'src/hooks/useRedux'
import { useAppSelector } from 'src/hooks/useRedux'

// ** Defaults
const defaultProvider: AuthValuesType = {
  user: null,
  company: null,
  loading: true,
  setUser: (n: any) => {
    return null
  },
  updateUserInfo: (res: LoginResTypeWithOptionalAccessToken) => {
    return null
  },
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

  // **TODO: CLIENT role로 가입한 유저에게만 리턴되는 데이터. 만약 CLIENT가 아닐 경우 null로 감
  const [company, setCompany] = useState<
    (ClientCompanyInfoType & CorporateClientInfoType) | null
  >(null)

  const [loading, setLoading] = useState<boolean>(defaultProvider.loading)

  const dispatch = useAppDispatch()

  // ** Hooks
  const router = useRouter()
  const { openModal, closeModal } = useModal()

  function hasTadAndLpm(role: UserRoleType[]): boolean {
    return (
      role.some(value => value.name === 'TAD') &&
      role.some(value => value.name === 'LPM')
    )
  }

  const userAccess = useAppSelector(state => state.userAccess)

  useEffect(() => {
    if (user) {
      dispatch(getRole(user.id)).then(res => {
        const isClient = res.payload.roles
          ?.map((i: { name: string }) => i.name)
          .includes('CLIENT')
        if (isClient) {
          getClientUserInfo(user.id).then(res => {
            setCompany(res.data)
          })
        }
      })
      dispatch(getPermission())
    }
  }, [user])

  useEffect(() => {
    if (user && userAccess.role.length) {
      const roles = userAccess.role.map(item => item.name)

      const redirectPath = getRedirectPath()
      const storageRole = getCurrentRole()
      // 세션 스토리지에 storageRole 값이 없는경우 사용자의 Role을 검사하여 설정(모든 유저 대상)
      if (!storageRole) {
        const TADRole =
          hasTadAndLpm(userAccess.role) &&
          userAccess.role.find(item => item.name === 'TAD')
        TADRole ? setCurrentRole(TADRole) : setCurrentRole(userAccess.role[0])
      } else {
        const findRole = userAccess.role.find(
          item => item.name === storageRole.name,
        )
        // 세션 스토리지에 storageRole 값이 있는 경우 name, type을 비교하여 현재 유저의 name, type과 다르면 업데이트
        if (findRole && storageRole.type !== findRole?.type)
          setCurrentRole(findRole)
        else setCurrentRole(userAccess.role[0])
      }

      const isClient = roles?.includes('CLIENT')
      const isProUpdatedProfile = roles?.includes('PRO') && user?.firstName
      const isManagerUpdatedProfile =
        (roles?.includes('TAD') || roles?.includes('LPM')) && user?.firstName

      if (!isClient) {
        if (!isProUpdatedProfile) {
          router.replace('/welcome/pro')
        } else if (!isManagerUpdatedProfile) {
          router.replace('/welcome/manager')
        }
        return
      } else if (isClient) {
        const isClientMaster =
          userAccess.role.find(i => i.name === 'CLIENT')?.type === 'Master'
        if (isClientMaster && !company?.name) {
          router.replace('/welcome/client')
        } else {
          if (user?.firstName) {
            //TODO: general client form으로 이동하도록 수정하기
            router.replace('/welcome/client')
          }
        }
      } else if (redirectPath) {
        router.replace(redirectPath)
        removeRedirectPath()
        return
      }
      if (router.pathname === '/') {
        router.push(`/home`)
      }
    }
  }, [userAccess.role, user, company])

  useEffect(() => {
    const initAuth = async (): Promise<void> => {
      router.pathname === '/' && router.replace('/login')

      const storedToken = getUserTokenFromBrowser()!

      if (storedToken) {
        setLoading(true)
        getUserDataFromBrowser() &&
          setUser(JSON?.parse(getUserDataFromBrowser() || ''))
        setLoading(false)
      } else {
        removeUserDataFromBrowser()
        setLoading(false)
      }
    }

    initAuth()
  }, [])

  async function updateUserInfo(response: LoginResTypeWithOptionalAccessToken) {
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
        setUser(userInfo)
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
    // axios
    login(params.email, params.password)
      .then(async response => {
        if (!response.accessToken) {
          openModal({
            type: 'signup-not-approval-modal',
            children: (
              <SignupNotApprovalModal
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

        // const returnUrl = router.query.returnUrl
        // const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/'
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
    setUser(null)
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

  const values = {
    user,
    company,
    loading,
    setUser,
    setLoading,
    login: handleLogin,
    logout: handleLogout,
    register: handleRegister,
    updateUserInfo: updateUserInfo,
  }
  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
