import axios from 'src/configs/axios'
import { RoleType } from 'src/types/apps/userTypes'
import {
  ConsumerUserInfoType,
  CountryType,
  JobInfoType,
  ManagerUserInfoType,
  PronounceType,
} from 'src/types/sign/personalInfoTypes'

export const getUserInfo = async (email: string) => {
  try {
    const { data } = await axios.get(`/api/enough/u/pu?email=${email}`)
    return {
      email: data.userEmail,
      firstName: data.firstName,
      lastName: data.lastName,
      country: data?.country,
      extraData: data?.extraData,
    }
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
  userInfo: ConsumerUserInfoType,
) => {
  try {
    await axios.put(`/api/enough/u/pu/edit`, userInfo)
  } catch (e: any) {
    throw new Error(e)
  }
}

/* TAD, LPM 전용 프로필 업데이트 */
export const updateManagerUserInfo = async (userInfo: ManagerUserInfoType) => {
  try {
    await axios.put(`/api/enough/u/pu/edit`, userInfo)
  } catch (e: any) {
    throw new Error(e)
  }
}
