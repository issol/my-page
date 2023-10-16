import axios from 'src/configs/axios'
import {
  SignUpRequestsType,
  RequestActionType,
} from 'src/types/company/members'
import { makeQuery } from 'src/shared/transformer/query.transformer'

export const getSignUpRequests = async () => {
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
  await axios.patch('/api/enough/a/role/us/edit', { ...data })
}

export const deleteMember = async (userId: number) => {
  await axios.delete(`/api/enough/u/pu/${userId}`)
}
