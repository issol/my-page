import axios from 'src/configs/axios'
import axiosDefault from 'axios'
import { RoleType } from 'src/context/types'
import {
  ConsumerUserInfoType,
  ManagerUserInfoType,
} from 'src/types/sign/personalInfoTypes'
import { UserDataType } from 'src/context/types'

export type UserInfoResType = Omit<
  UserDataType,
  'id' | 'role' | 'permission' | 'company' | 'username'
>

export const getProDetails = async (userId: number) => {
  try {
    const { data } = await axiosDefault.get('/api/pro/details', {
      params: { id: userId },
    })

    return data
  } catch (e: any) {
    throw new Error(e)
  }
}

export const getUserInfo = async (userId: number): Promise<UserInfoResType> => {
  try {
    const { data } = await axios.get(`/api/enough/u/pu/profile/${userId}`)
    return data
  } catch (e: any) {
    throw new Error(e)
  }
}

export const getUserRoleNPermission = async (
  userId: number,
): Promise<{ roles: Array<RoleType>; permissions: [] }> => {
  try {
    const { data } = await axios.get(`/api/enough/a/role/rels?userId=${userId}`)
    return data
  } catch (e: any) {
    throw new Error(e)
  }
}

/* client, pro 프로필 업데이트용 */
export const updateConsumerUserInfo = async (
  userInfo: ConsumerUserInfoType & { userId: number },
) => {
  try {
    await axios.put(`/api/enough/u/pu/edit`, userInfo)
  } catch (e: any) {
    throw new Error(e)
  }
}

/* TAD, LPM 전용 프로필 업데이트 */
export const updateManagerUserInfo = async (
  userInfo: ManagerUserInfoType & { userId: number },
) => {
  try {
    await axios.put(`/api/enough/u/pu/member/edit`, userInfo)
  } catch (e: any) {
    throw new Error(e)
  }
}

export const sendResetEmail = async (email: string) => {
  const { data } = await axios.post(`/api/enough/u/pw/reset`, { email })

  return data
}

export const resetPassword = async (params: {
  newPW: string
  token: string
}) => {
  const { data } = await axios.put('/api/enough/u/pw/reset/save', params)

  return data
}

/* TODO: endpoint, method 수정하기 */
export const changePassword = async (userId: number, password: string) => {
  try {
    const { data } = await axios.put('/api/enough/u/pw/reset/save')
  } catch (e: any) {
    throw new Error(e)
  }
}

/* TODO: endpoint, method 수정하기 */
export const deleteAccount = async (userId: number) => {
  // try {
  //   const { data } = await axios.put('/api/enough/u/pw/reset/save')
  // } catch (e: any) {
  //   throw new Error(e)
  // }
  const errorData = {
    jobIds: ['jobId1', 'jobId2', 'jobId2', 'jobId2'],
    totalPrice: 100,
    currency: 'USD',
  }
  throw new Error(JSON.stringify(errorData))
}
