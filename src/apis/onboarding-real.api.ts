import axios from 'src/configs/axios'

export const getOnboardingProList = async () => {
  const data = await axios.get('/api/enough/onboard/user/al?take=20&skip=0')

  console.log(data)

  return data.data
}

export const getOnboardingProDetails = async (userId: string) => {
  const data = await axios.get(`/api/enough/onboard/user/al/${userId}`)

  return data.data
}
