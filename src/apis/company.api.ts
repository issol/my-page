import axios from 'axios'
import { MembersType, SignUpRequestsType } from 'src/types/company/members'

export const getSignUpRequests = async () => {
  const { data } = await axios.get('/api/company/signup-requests')

  return data
}

export const deleteSignUpRequests = async (id: number) => {
  const data = await axios.delete('/api/company/delete', {
    data: id,
  })

  return data
}

export const undoSignUpRequest = async (user: SignUpRequestsType) => {
  const data = await axios.post('/api/company/undo', {
    user,
  })

  return data
}

export const getMembers = async () => {
  const { data } = await axios.get('/api/company/members')

  return data
}

export const approveMembers = async (user: MembersType) => {
  console.log(user)

  const { data } = await axios.post('/api/company/approve-members', {
    user,
  })

  return data
}

export const undoMembers = async (user: MembersType) => {
  const { data } = await axios.delete('/api/company/undo-member', {
    data: user.id,
  })

  return data
}
