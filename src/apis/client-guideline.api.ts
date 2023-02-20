import axios from 'src/configs/axios'
import { makeQuery } from 'src/shared/transformer/query.transformer'
import { FilterType } from 'src/pages/onboarding/client-guideline'

export type FileType = { id: number; name: string; size: number }
export type FilePostType = { name: string; size: number; fileUrl: string }
export const getGuidelines = async (
  filters: FilterType,
): Promise<{
  data:
    | Array<{
        id: number
        version: number
        title: string
        client: string
        category: string
        serviceType: string
        createdAt: string
      }>
    | []
  count: number
}> => {
  console.log(makeQuery(filters))
  try {
    const { data } = await axios.get(
      `/api/enough/onboard/guideline?${makeQuery(filters)}`,
    )
    return data
    // return {
    //   data: [
    // {
    //   id: 21778705315028,
    //   title: 'Naver webtoon guideline Ver.3',
    //   client: 'Naver',
    //   category: 'Webcomics',
    //   serviceType: 'Translation',
    //   createdAt: 'Tue Jan 31 2023 00:40:09',
    // },
    //     {
    //       id: 2,
    //       title: 'Tappytoon style guide',
    //       client: 'Tappytoon',
    //       category: 'Webnovel',
    //       serviceType: 'Proofreading',
    //       createdAt: 'Tue Jan 31 2023 00:40:09',
    //     },
    //     {
    //       id: 3,
    //       title: 'Naver webtoon guideline Ver.3',
    //       client: 'Naver',
    //       category: 'YouTube',
    //       serviceType: 'QC',
    //       createdAt: 'Tue Jan 31 2023 00:40:09',
    //     },
    //     {
    //       id: 4,
    //       title: 'Naver webtoon guideline Ver.3',
    //       client: 'Naver',
    //       category: 'Webcomics',
    //       serviceType: 'Translation',
    //       createdAt: 'Tue Jan 31 2023 00:40:09',
    //     },
    //   ],
    //   count: 4,
    // }
  } catch (e: any) {
    return {
      data: [],
      count: 0,
    }
  }
}

export type CurrentGuidelineType = {
  id: number
  version?: number
  userId: 12345
  title: string
  writer: string
  email: string
  client: string
  category: string
  serviceType: string
  updatedAt: string
  content: any
  files: Array<FileType>
}

export type GuideDetailType = {
  currentVersion: CurrentGuidelineType
  versionHistory: Array<CurrentGuidelineType>
}
export const getGuidelineDetail = async (
  id: number,
): Promise<GuideDetailType> => {
  try {
    const { data } = await axios.get(`/api/enough/onboard/guideline/${id}`)
    return data
  } catch (e: any) {
    throw new Error(e)
  }
}

export const checkGuidelineExistence = async (
  client: string,
  category: string,
  serviceType: string,
): Promise<boolean> => {
  try {
    return await axios.get(
      `/api/enough/onboard/guideline/created-check?client=${client}&category=${category}&serviceType=${serviceType}`,
    )
  } catch (e: any) {
    throw new Error(e)
  }
}

export type FormType = {
  writer: string
  email: string
  title: string
  client: string
  category: string
  serviceType: string
  content: any
  text: string
  files?: Array<FilePostType>
}

export const postGuideline = async (
  form: FormType,
): Promise<{ id: number }> => {
  try {
    const { data } = await axios.post(`/api/enough/onboard/guideline`, form)
    return data
  } catch (e: any) {
    throw new Error(e)
  }
}

export const updateGuideline = async (id: number, form: FormType) => {
  try {
    return await axios.patch(`/api/enough/onboard/guideline/${id}`, form)
  } catch (e: any) {
    throw new Error(e)
  }
}

export const uploadGuidelineFiles = async (id: number, fileName: string) => {
  try {
    return await axios.post(
      `/api/enough/a/r-req/al?type=${id}&fileName=${fileName}`,
    )
  } catch (e: any) {
    throw new Error(e)
  }
}

export const deleteGuidelineFile = async (fileId: number) => {
  try {
    return await axios.delete(`/api/enough/onboard/guideline/file/${fileId}`)
  } catch (e: any) {
    throw new Error(e)
  }
}

export const deleteGuideline = async (guidelineId: number) => {
  try {
    return await axios.delete(`/api/enough/onboard/guideline/${guidelineId}`)
  } catch (e: any) {
    throw new Error(e)
  }
}

// ** TODO : api수정
export const restoreGuideline = async (id: number) => {
  try {
    return await axios.patch(`/api/enough/a/r-req/al?type=${id}`)
  } catch (e: any) {
    throw new Error(e)
  }
}

// ** TODO : method, response 문의
// 1. path를 배열로 여러개 보내면 해당 path의 pre signed url이 한꺼번에 배열로 오는지?
// => 여러개를 한꺼번에 받거나 업로드 할 때를 위해 배열로, 리턴도 배열인데 자세한 스키마는 나중에 전달해주시기로 함
// method post맞는지 => 배열을 보내기 위해서
// 이건 공통 용
// path : /<clinet>/<category>/<serviceType>/V<version>/<fileName> 형태
export const getGuidelinePreSignedUrl = async (
  path: string[],
): Promise<Array<string>> => {
  try {
    const { data } = await axios.post(
      `/api/enough/onboard/guideline/upload-file`,
      {
        path,
      },
    )
    return data
  } catch (e: any) {
    throw new Error(e)
  }
}
