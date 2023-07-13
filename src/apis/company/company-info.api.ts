import axios from '@src/configs/axios'
import {
  CompanyAddressParamsType,
  CompanyInfoFormType,
  CompanyInfoParamsType,
  CompanyInfoType,
} from '@src/types/company/info'

export const getCompanyInfo = async (
  name: string,
): Promise<CompanyInfoType> => {
  try {
    const { data } = await axios.get(`/api/enough/u/comp?name=${name}`)

    return data
    // return {
    //   companyName: 'Glozinc.com',
    //   logo: '/images/logos/gloz-g.svg',
    //   billingPlan: {
    //     name: 'Premium',
    //   },
    //   timezone: { code: 'KR', label: 'Korea, Republic of', phone: '82' },
    //   ceo: [
    //     {
    //       firstName: 'Aria',
    //       lastName: 'Jeong',
    //     },
    //     {
    //       firstName: 'Ellie',
    //       lastName: 'Park',
    //     },
    //   ],
    //   headquarter: 'Korea, Republic of',
    //   email: 'info@glozinc.com',
    //   address: [
    //     {
    //       officeName: 'Korea office',
    //       baseAddress: '11, Yeongdong-daero 106-gil',
    //       detailAddress: 'Gangnam-gu',
    //       city: 'Seoul',
    //       state: 'Seoul',
    //       country: 'Korea, Republic of',
    //       zipCode: '06124',
    //     },
    //     {
    //       officeName: 'Japan office',
    //       baseAddress: 'New State Manor #722',
    //       detailAddress: 'Yoyogi 2-23-1',
    //       city: 'Shibuya-ku',
    //       state: 'Tokyo',
    //       country: 'Japan',
    //       zipCode: '151-0053',
    //     },
    //   ],
    // }
  } catch (e: any) {
    throw new Error(e)
  }
}

export const patchCompanyInfo = async (data: CompanyInfoParamsType) => {
  try {
    await axios.patch(`/api/enough/u/comp`, { ...data })
  } catch (e: any) {
    throw new Error(e)
  }
}

export const patchCompanyAddress = async (
  data: Array<CompanyAddressParamsType>,
  companyId: string,
) => {
  try {
    await axios.put(`/api/enough/u/company/address?companyId=${companyId}`, {
      data: data,
    })
  } catch (e: any) {
    throw new Error(e)
  }
}
