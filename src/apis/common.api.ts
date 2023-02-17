import axios from 'src/configs/axios'

export enum FilePathEnum {
  resume = 'resume',
  contract = 'contracts',
  guideline = 'guideline',
}
type Paths =
  | FilePathEnum.resume
  | FilePathEnum.contract
  | FilePathEnum.guideline

//ex : path = /guideline/<clinet>/<category>/<serviceType>/V<version>/<fileName>
// / :  - (하이픈) 으로 변경
// 공백 : _ (언더바) 으로 변경
// (ex) <버킷>/guideline/NAVER/Documents-Text/TAE(Translator_accept_edits)/V1/<fileName>

export const getPresignedUrl = async (
  userId: number,
  fileName: string,
  path: Paths,
) => {
  try {
    const { data } = await axios.get(
      `/api/enough/u/pu/ps-url?userId=${userId}&fileName=${fileName}&path=${path}`,
    )
    return data
  } catch (e: any) {
    throw new Error(e)
  }
}
