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

/* TODO : url 수정 */
export const redirectGoogleAuth = (e: any) => {
  e.preventDefault()
  if (typeof window === 'object') {
    // window.location.href = `https://accounts.google.com/o/oauth2/v2/auth/oauthchooseaccount?access_type=offline&prompt=consent&response_type=code&redirect_uri=${window.location.protocol}%2F%2F${window.location.host}%2Fsign%2Frequest-g-grant&scope=email%20profile%20openid&client_id=644269375379-aidfbdlh5jip1oel3242h5al3o1qsr40.apps.googleusercontent.com&flowName=GeneralOAuthFlow`
    // window.location.href = `https://accounts.google.com/gsi/select?client_id=644269375379-aidfbdlh5jip1oel3242h5al3o1qsr40.apps.googleusercontent.com&ux_mode=popup&ui_mode=card&as=ifN6k6z5Hyusc2hYPiK5ew&channel_id=ba0bdc7d71db77178b43ea0ec9b261674285c31913b5b8e9a3dd6e9ab1fc763f&origin=http%3A%2F%2Flocalhost%3A3000`
  }
}

export const googleAuth = async (credential: string, g_csrf_token: string) => {
  try {
    const { data } = await axios.get(
      `/api/enough/a/google/x-gu-grant?credential=${credential}&g_csrf_token=${g_csrf_token}`,
    )
    return data
  } catch (e: any) {
    throw new Error(e)
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
  roles: Array<RoleType>,
): Promise<{ userId: number; email: string }> => {
  try {
    const { data } = await axios.post(`/api/enough/a/signup`, {
      email,
      password,
      roles,
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

export const logout = async () => {
  try {
    await axios.post(`/api/enough/a/logout`)
  } catch (e: any) {
    console.log(e)
  }
}
