import axios from 'src/configs/axios'
import { loginResType } from 'src/types/sign/signInTypes'
import { UserRoleType } from 'src/context/types'
import logger from '@src/@core/utils/logger'

export const login = async (
  email: string,
  password: string,
): Promise<loginResType> => {
  const { data } = await axios.post(`/api/enough/a/login`, {
    email,
    password,
  })
  return data
}

export const getRefreshToken = async () => {
  const { data } = await axios.get(
    '/api/pichu/auth/refresh-access-token?selects=email&selects=originatorCredentials',
  )

  return data
}

export const googleAuth = async (credential: string): Promise<loginResType> => {
  try {
    const { data } = await axios.post(
      `/api/enough/a/google/x-gu-grant?credential=${credential}`,
    )
    return data
  // } catch (e: any) {
  //   console.log("")
  //   if (e.response.data.statusCode === 403) {
  //     throw 'NOT_A_MEMBER'
  //   } else if (e.response.data.statusCode >= 500) {
  //     throw 'SERVER_ERROR'
  //   } else {
  //     throw new Error(e)
  //   }
  // }
  } catch (e: any) {
    // e.response의 존재 여부 확인
    console.log("googleAuth-e",e)
    if (e.response && e.response.data) {
      if (e.response.data.statusCode === 403) {
        throw 'NOT_A_MEMBER';
      } else if (e.response.data.statusCode >= 500) {
        throw 'SERVER_ERROR';
      }
    }
    // 그 외의 경우, 일반적인 오류 처리
    throw new Error(e.message || 'Unknown error');
  }
}

/* TODO: linked in signup, login은 일단 holding중 */
export const redirectLinkedInAuth = (e: any) => {
  e.preventDefault()
  if (typeof window === 'object') {
    window.location.href = `/api/pichu/auth/linkedin`
  }
}

export const checkEmailDuplication = async (email: string) => {
  const { data } = await axios.get(`/api/enough/u/pu/r-check?email=${email}`)
  return data
}

export const sendEmailVerificationCode = async (email: string) => {
  await axios.post(`/api/enough/a/email/code`, { email })
}

export const verifyPinCode = async (
  email: string,
  verificationCode: string,
) => {
  await axios.post(`/api/enough/a/email/verify`, { email, verificationCode })
}

export const signUp = async (
  email: string,
  roles: Array<UserRoleType>,
  password?: string,
): Promise<loginResType> => {
  const body = !password ? { email, roles } : { email, password, roles }

  const { data } = await axios.post(`/api/enough/a/signup`, body)
  return data
}
export const snsSignUp = async (
  email: string,
  roles: Array<UserRoleType>,
): Promise<loginResType> => {
  const { data } = await axios.post(`/api/enough/a/google/signup`, {
    email,
    roles,
  })
  return data
}

export const validateRole = async (
  companyName: string,
  email: string,
): Promise<boolean> => {
  const { data } = await axios.get(
    `/api/enough/u/comp/e-chk?companyName=${companyName}&email=${email}`,
  )
  return data
}

export const logout = async () => {
  try {
    await axios.post(`/api/enough/a/logout`)
  } catch (e: any) {
    logger.debug(e)
  }
}
