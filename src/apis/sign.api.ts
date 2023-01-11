import axios from 'src/configs/axios'
import { loginResType } from 'src/types/sign/signInTypes'
import { RoleType } from 'src/types/apps/userTypes'

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
    throw new Error(e)
  }
}

export const getRefreshToken = async () => {
  const { data } = await axios.get(
    '/api/pichu/auth/refresh-access-token?selects=email&selects=originatorCredentials',
  )

  return data
}

export const getProfile = async () => {
  try {
    const { data } = await axios.get(`/api/pika/user/profile`)
    return data
  } catch (e: any) {
    throw new Error(e)
  }
}

/* TODO : url 수정 */
export const redirectGoogleAuth = (e: any) => {
  e.preventDefault()
  if (typeof window === 'object') {
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth/oauthchooseaccount?access_type=offline&prompt=consent&response_type=code&redirect_uri=${window.location.protocol}%2F%2F${window.location.host}%2Fsign%2Frequest-g-grant&scope=email%20profile%20openid&client_id=19780090882-pcmto03bt0r8ok64bcjig5tovpt67vvk.apps.googleusercontent.com&flowName=GeneralOAuthFlow`
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
  password: string,
): Promise<{ userId: number; email: string }> => {
  try {
    const { data } = await axios.post(`/api/enough/a/signup`, {
      email,
      password,
    })
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

export const postRole = async (userId: number, roles: Array<RoleType>) => {
  try {
    await axios.put(`/api/enough/a/role/grant`, { userId, roles })
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
