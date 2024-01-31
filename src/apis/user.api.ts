import { ClientUserType } from './../context/types'
import axios from 'src/configs/axios'
import axiosDefault from 'axios'
import {
  CorporateClientInfoType,
  RoleType,
  UserDataType,
} from 'src/context/types'
import {
  ManagerUserInfoType,
  ProUserExperienceInfoType,
  ProUserInfoType,
  ProUserNoteInfoType,
  ProUserSpecialtiesInfoType,
  ProUserResumeInfoType,
} from 'src/types/sign/personalInfoTypes'
import { ContactPersonType } from '@src/types/schema/client-contact-person.schema'

export type UserInfoResType = Omit<
  UserDataType,
  'id' | 'role' | 'permission' | 'company' | 'username'
>

export const getProDetails = async (userId: number) => {
  const { data } = await axiosDefault.get('/api/pro/details', {
    params: { id: userId },
  })

  return data
}

export const getUserInfo = async (userId: number): Promise<UserInfoResType> => {
  const { data } = await axios.get(`/api/enough/u/pu/profile/${userId}`)
  return data
}

export const getUserRoleNPermission = async (
  userId: number,
): Promise<{ roles: Array<RoleType>; permissions: [] }> => {
  const { data } = await axios.get(`/api/enough/a/role/rels?userId=${userId}`)
  return data
}

/* CLIENT 전용 프로필 업데이트 */
export const updateClientUserInfo = async (
  userInfo: ContactPersonType & { userId: number } & {
    clientId: number
    companyId: string
    headquarter?: string
  },
) => {
  await axios.put(`/api/enough/u/pu/client/edit`, userInfo)
}

/* pro 프로필 업데이트용 */
export const updateConsumerUserInfo = async (
  userInfo: (
    | ProUserInfoType
    | ManagerUserInfoType
    | ProUserResumeInfoType
    | ProUserNoteInfoType
    | ProUserExperienceInfoType
    | ProUserSpecialtiesInfoType
  ) & {
    userId: number
  },
) => {
  await axios.put(`/api/enough/u/pu/edit`, userInfo)
}

/* TAD, LPM 전용 프로필 업데이트 */
export const updateManagerUserInfo = async (
  userInfo: ManagerUserInfoType & { userId: number },
) => {
  await axios.put(`/api/enough/u/pu/member/edit`, userInfo)
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

export const validatePassword = async (pw: string): Promise<boolean> => {
  const { data } = await axios.post('/api/enough/u/pu/v-check', { pw })
  return data
}

export const changePassword = async (
  pw: string,
  newPW: string,
): Promise<boolean> => {
  const { data } = await axios.put('/api/enough/u/pw/password', {
    pw,
    newPW,
  })
  return data
}

export const getIsDeletableAccount = async (): Promise<boolean> => {
  const { data } = await axios.get('/api/enough/u/pu/delete-account')
  if (!data?.corporationIds) {
    return true
  } else {
    throw new Error(JSON.stringify(data))
  }
}

export const deleteAccount = async (reasonCode: number, text: string) => {
  return await axios.delete('/api/enough/u/pw/reset/save', {
    data: { reasonCode, text },
  })
}

export const getDeleteAccountReasonList = async (): Promise<
  Array<{
    id: number
    reason: string
    statusCode: number
  }>
> => {
  const { data } = await axios.get('api/enough/u/delete-reason')
  return data
}

export const verifyCompanyInfo = async (
  info: CorporateClientInfoType,
): Promise<boolean> => {
  const { data } = await axios.post('/api/enough/u/comp/validation', info)
  return data
}

export const getClientUserInfo = async (): Promise<ClientUserType> => {
  const { data } = await axios.get('/api/enough/u/client/my-company')
  return data
}

export type RequestCompanyJoinType = {
  userId: number
  email: string
  companyId: string
}

export const requestJoinToCompany = async (
  info: RequestCompanyJoinType,
): Promise<void> => {
  await axios.put('api/enough/a/r-req', {
    ...info,
    type: 'General',
    roles: ['CLIENT'],
  })
}
