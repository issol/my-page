import axios from 'axios'
import axiosDefault from 'src/configs/axios'
import {
  MembersType,
  SignUpRequestsType,
  RequestActionType,
} from 'src/types/company/members'

export const getSignUpRequests = async () => {
  // const { data } = await axios.get('/api/company/signup-requests')
  const { data } = await axiosDefault.get('/api/enough/a/r-req/al')

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
  // const { data } = await axiosDefault.get('/api/company/members')

  const { data } = await axiosDefault.get('/api/enough/a/role/us')

  return data
}

export const approveMembers = async (user: MembersType) => {
  console.log(user)

  const { data } = await axios.post('/api/company/approve-members', {
    user,
  })

  // /api/enough/a/r-req/reply
  // requestId: number,  reply : 'accept' || 'reject'

  return data
}

export const undoMembers = async (user: MembersType) => {
  const { data } = await axios.delete('/api/company/undo-member', {
    data: user.id,
  })

  return data
}

export const requestAction = async (params: RequestActionType) => {
  const { data } = await axios.patch('api/enough/a/r-req/reply', {
    ...params,
  })

  return data
}
