import axios from '@src/configs/axios'
import {
  CompanyAddressParamsType,
  CompanyInfoParamsType,
  CompanyInfoType,
} from '@src/types/company/info'

export const getCompanyInfo = async (
  name: string,
): Promise<CompanyInfoType> => {
  const { data } = await axios.get(`/api/enough/u/comp?name=${name}`)

  return data
}

export const patchCompanyInfo = async (data: CompanyInfoParamsType) => {
  await axios.patch(`/api/enough/u/comp`, { ...data })
}

export const patchCompanyAddress = async (
  data: Array<CompanyAddressParamsType>,
  companyId: string,
) => {
  await axios.put(`/api/enough/u/company/address?companyId=${companyId}`, {
    data: data,
  })
}
