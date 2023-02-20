import axios, { BASEURL } from 'src/configs/axios'
import originalAxios from 'axios'
import { getUserTokenFromBrowser } from 'src/shared/auth/storage'

export enum FilePathEnum {
  resume = 'resume',
  contract = 'contracts',
}
type Paths = FilePathEnum.resume | FilePathEnum.contract

//resume, contract form 용 (유저 개개인용)
export const getPresignedUrl = async (
  userId: number,
  fileName: string,
  path: Paths,
) => {
  try {
    const { data } = await axios.get(
      `${BASEURL}/api/enough/u/pu/ps-url?userId=${userId}&fileName=${fileName}&path=${path}`,
    )
    return data
  } catch (e: any) {
    throw new Error(e)
  }
}

export const postFiles = async (url: string, formData: FormData) => {
  return originalAxios.put(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization:
        'Bearer ' + typeof window === 'object'
          ? getUserTokenFromBrowser()
          : null,
    },
  })
}
