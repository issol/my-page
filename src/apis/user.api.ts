import axios from 'src/configs/axios'
import { RoleType } from 'src/types/apps/userTypes'
import {
  ConsumerUserInfoType,
  ManagerUserInfoType,
} from 'src/types/sign/personalInfoTypes'
import { UserDataType } from 'src/context/types'

type UserInfoResType = Omit<
  UserDataType,
  'id' | 'role' | 'permission' | 'company' | 'username'
>
export const getUserInfo = async (email: string): Promise<UserInfoResType> => {
  try {
    const { data } = await axios.get(`/api/enough/u/pu?email=${email}`)
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

export const getPresignedUrl = async (userId: number, fileName: string) => {
  try {
    const { data } = await axios.get(
      `/api/enough/u/pu/ps-url?userId=${userId}&fileName=${fileName}`,
    )
    return data
  } catch (e: any) {
    throw new Error(e)
  }
}

export const updateResumeFile = async (url: string, file: FormData) => {
  try {
    await axios.post(url, file, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  } catch (e: any) {
    throw new Error(e)
  }
}

/* TAD, LPM 전용 프로필 업데이트 */
export const updateManagerUserInfo = async (
  userInfo: ManagerUserInfoType & { userId: number },
) => {
  try {
    await axios.put(`/api/enough/u/pu/edit`, userInfo)
  } catch (e: any) {
    throw new Error(e)
  }
}
