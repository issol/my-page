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

export const getPresignedUrl = async (
  userId: number,
  fileName: string,
  path: Paths,
) => {
  try {
    const { data } = await axios.get(
      `/api/enough/u/pu/ps-url?userId=${userId}&fileName=${fileName}&path:=${path}`,
    )
    return data
  } catch (e: any) {
    throw new Error(e)
  }
}
