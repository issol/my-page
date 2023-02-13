import axios from 'src/configs/axios'
import { loginResType } from 'src/types/sign/signInTypes'
import { RoleType } from 'src/context/types'

export const login = async (
  email: string,
  password: string,
): Promise<loginResType> => {
  try {
    const { data } = await axios.post(`/api/enough/a/login`, {
      email,
      password,
    })
    return data
  } catch (e: any) {
    throw new Error(e.response.status)
  }
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
  } catch (e: any) {
    if (e.response.data.statusCode === 403) {
      throw 'NOT_A_MEMBER'
    } else {
      throw new Error(e)
    }
  }
}

/* TODO : url 수정 */
export const redirectLinkedInAuth = (e: any) => {
  e.preventDefault()
  if (typeof window === 'object') {
    window.location.href = `/api/pichu/auth/linkedin`
  }
}

export const checkEmailDuplication = async (email: string) => {
  try {
    const { data } = await axios.get(`/api/enough/u/pu/r-check?email=${email}`)
    return data
  } catch (e: any) {
    throw new Error(e)
  }
}

export const sendEmailVerificationCode = async (email: string) => {
  try {
    await axios.post(`/api/enough/a/email/code`, { email })
  } catch (e: any) {
    throw new Error(e)
  }
}

export const verifyPinCode = async (
  email: string,
  verificationCode: string,
) => {
  try {
    await axios.post(`/api/enough/a/email/verify`, { email, verificationCode })
  } catch (e: any) {
    throw new Error(e)
  }
}

export const signUp = async (
  email: string,
  roles: Array<RoleType>,
  password?: string,
): Promise<{ userId: number; email: string }> => {
  const body = !password ? { email, roles } : { email, password, roles }
  try {
    const { data } = await axios.post(`/api/enough/a/signup`, body)
    return data
  } catch (e: any) {
    throw new Error(e)
  }
}

export const validateRole = async (
  companyName: string,
  email: string,
): Promise<boolean> => {
  try {
    const { data } = await axios.get(
      `/api/enough/u/comp/e-chk?companyName=${companyName}&email=${email}`,
    )
    return data
  } catch (e: any) {
    throw new Error(e)
  }
}

export const logout = async () => {
  try {
    await axios.post(`/api/enough/a/logout`)
  } catch (e: any) {
    console.log(e)
  }
}
