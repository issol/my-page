import axios from 'src/configs/axios'
import {
  MembersType,
  SignUpRequestsType,
  RequestActionType,
} from 'src/types/company/members'
import { makeQuery } from 'src/shared/transformer/query.transformer'

export const getSignUpRequests = async () => {
  // const { data } = await axios.get('/api/company/signup-requests')
  try {
    const { data } = await axios.get('/api/enough/a/r-req/al')

    return data
  } catch (e: any) {
    return []
  }
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
  try {
    const { data } = await axios.get('/api/enough/a/role/us')

    return data
  } catch (e: any) {
    return []
  }
}

export const requestAction = async (params: RequestActionType) => {
  const { data } = await axios.get(
    `/api/enough/a/r-req/reply?${makeQuery(params)}`,
  )

  return data
}

export const undoRequest = async (params: { rId: number; reply: string }) => {
  const { data } = await axios.get(
    `/api/enough/a/r-req/rb?${makeQuery(params)}`,
  )

  return data
}

export const patchMember = async (data: {
  userId: number
  permissionGroups: string[]
}) => {
  try {
    await axios.patch('/api/enough/a/role/us/edit', { ...data })
  } catch (e: any) {
    throw new Error(e)
  }
}

export const deleteMember = async (userId: number) => {
  try {
    await axios.delete(`/api/enough/a/role/${userId}`)
  } catch (e: any) {
    throw new Error(e)
  }
}
