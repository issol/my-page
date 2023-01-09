import axios from 'src/configs/axios'
import { loginResType } from 'src/types/sign/signInTypes'

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

/* TODO : endpoint 변경하기 */
export const sendEmailVerificationCode = async (email: string) => {
  try {
    const { data } = await axios.get(`/api/enough/u/pu/r-check?email=${email}`)
    return data
  } catch (e: any) {
    throw new Error(e)
  }
}
