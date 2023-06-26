import axios from '@src/configs/axios'
import { UnitOptionType } from '@src/types/options.type'

// option값으로 사용할 데이터 받아오는 api모듬

export const getUnitOptions = async (): Promise<UnitOptionType[]> => {
  try {
    const { data } = await axios.get(`/api/enough/u/request/unit/list`)
    return data
  } catch (error) {
    return []
  }
}
