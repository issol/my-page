import axios, { BASEURL } from 'src/configs/axios'
import originalAxios from 'axios'
import { getUserTokenFromBrowser } from 'src/shared/auth/storage'
import { ClientClassificationType } from '@src/context/types'
import { CountryType } from '@src/types/sign/personalInfoTypes'

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

export type CompanyListByBusinessType = {
  id: string
  name: string
  emailDomain: string[]
  type: string
  businessClassification: ClientClassificationType
  headquarter: string
  logo: string | null
  registrationNumber: string
  commencementDate: string
  email: string
  phone: string
  fax: string
  ceo: {
    lastName: string
    firstName: string
    middleName: string
  }[]
  representativeName: string | null
  timezone: CountryType
}

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

export const getCompanyInfoByBusinessNumber = async (
  type: string, //일단은 type으로 들어가는 값은 'Client'만 있음. 추가될 경우 type정의하기
  registrationNumber: string,
): Promise<Array<CompanyListByBusinessType>> => {
  try {
    const { data } = await axios.get(
      `/api/enough/u/comp/list?type=${type}&registrationNumber=${registrationNumber}`,
    )
    return data
  } catch (e: any) {
    return []
  }
}
