import axios from 'axios'

export const getSignUpRequests = async () => {
  const { data } = await axios.get('/api/company/signup-requests')

  return data
}
