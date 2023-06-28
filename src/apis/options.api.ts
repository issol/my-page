import axios from '@src/configs/axios'
import {
  CompanyOptionType,
  CompanyType,
  UnitOptionType,
} from '@src/types/options.type'
import { ContactPersonType } from '@src/types/schema/client-contact-person.schema'

// option값으로 사용할 데이터 받아오는 api모듬

export const getUnitOptions = async (): Promise<UnitOptionType[]> => {
  try {
    const { data } = await axios.get(`/api/enough/u/request/unit/list`)
    return data
  } catch (error) {
    return []
  }
}

export const getCompanyList = async (
  type: CompanyType,
): Promise<CompanyOptionType[]> => {
  try {
    const { data } = await axios.get(`/api/enough/u/comp/list?type=${type}`)
    return data
  } catch (error) {
    return []
  }
}

export const getContactPersonList = async (): Promise<
  Array<ContactPersonType & { userId: number }>
> => {
  try {
    const { data } = await axios.get(`/api/enough/u/contact-person/list`)
    return data
  } catch (error) {
    return []
  }
}
