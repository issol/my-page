import axios, { BASEURL } from 'src/configs/axios'
import originalAxios from 'axios'
import { getUserTokenFromBrowser } from 'src/shared/auth/storage'

export enum FilePathEnum {
  resume = 'resume',
  contract = 'contracts',
}
type Paths = FilePathEnum.resume | FilePathEnum.contract

export type StatusType =
  | 'RequestClient'
  | 'Quote'
  | 'Order'
  | 'InvoiceReceivable'
  | 'InvoicePayable'
  | 'Job'

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

/**
 * getUploadUrlforCommon, getDownloadUrlforCommon FilePath 관련 특이사항
 * FilePath는 S3에 저장되어야 할 정확한 위치의 경로를 미리 조합한 후 위 함수를 통해 업로드/다운로드 경로를 받아야 함
 * 예) Pro의 Resume 파일 업로드 시 : /1234(userId)/resume/resume-file.pdf 와 같이 전체 경로를 조합한 후 getUploadUrlforCommon를 통해 업로드 경로를 받아야 함
 */
//pro, onboarding 등 S3 업로드 주소 조회용(Presigned-URL)
export const getUploadUrlforCommon = async (
  fileType: string,
  filePath: string,
) => {
  try {
    const { data } = await axios.get(
      `${BASEURL}/api/enough/u/s3/presigned-url?type=${fileType}&filePath=${encodeURIComponent(
        filePath,
      )}`,
    )
    return data
  } catch (e: any) {
    throw new Error(e)
  }
}

//pro, onboarding 등 CloudFront를 통한 다운로드 주소 조회용(Signed-URL)
export const getDownloadUrlforCommon = async (
  fileType: string,
  filePath: string,
) => {
  try {
    const { data } = await axios.get(
      `${BASEURL}/api/enough/u/s3/signed-url?type=${fileType}&filePath=${filePath}`,
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

export const uploadFileToS3 = async (url: string, file: any) => {
  return originalAxios.put(url, file, {
    headers: {
      'Content-Type': file.type,
    },
  })
}

export const getStatusList = async (
  type: StatusType,
): Promise<Array<{ value: number; label: string }>> => {
  try {
    const { data } = await axios.get(`/api/enough/u/status/list?type=${type}`)
    // console.log(data)

    const res = data.map((item: any) => ({
      label: item.status,
      value: item.statusCode,
    }))

    return res
  } catch (e: any) {
    return []
  }
}
