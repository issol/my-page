import axios from 'src/configs/axios'
import { makeQuery } from 'src/shared/transformer/query.transformer'

export type ContractParam = {
  type: 'nda' | 'privacy' | 'freelancer' | ''
  language: 'ko' | 'en' | ''
}
// **TODO api완성되면 endpoint, res 수정
export const getContractDetail = async (props: ContractParam) => {
  try {
    const { data } = await axios.get(
      `/api/enough/a/r-req/al?type=${props.type}&language=${props.language}`,
    )

    return null
  } catch (e: any) {
    return null
  }
}
