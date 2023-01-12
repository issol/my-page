import axios from 'src/configs/axios'
import { RoleType } from 'src/types/apps/userTypes'

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

/* TODO: userInfo타입 정의하기 */
export const updateUserInfo = async (userInfo: any) => {
  try {
    await axios.put(`/api/enough/u/pu/edit`, userInfo)
  } catch (e: any) {
    throw new Error(e)
  }
}
