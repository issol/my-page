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
