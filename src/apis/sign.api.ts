import axios from 'src/configs/axios'

export const login = async (email: string, password: string) => {
  const { data } = await axios.post(`/api/pichu/auth/login`, {
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

export const getProfile = async () => {
  try {
    const { data } = await axios.get(`/api/pika/user/profile`)
    return data
  } catch (e: any) {
    throw new Error(e)
  }
}
