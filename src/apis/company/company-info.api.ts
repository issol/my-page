import { CompanyInfoType } from '@src/types/company/info'

export const getCompanyInfo = async (): Promise<CompanyInfoType> => {
  try {
    return {
      adminCompanyName: 'Glozinc.com',
      logo: '/images/logos/gloz-g.svg',
      billingPlan: {
        name: 'Premium',
      },
      timezone: { code: 'KR', label: 'Korea, Republic of', phone: '82' },
      ceo: [
        {
          firstName: 'Aria',
          lastName: 'Jeong',
        },
        {
          firstName: 'Ellie',
          lastName: 'Park',
        },
      ],
      headquarter: 'Korea, Republic of',
      email: 'info@glozinc.com',
    }
  } catch (e: any) {
    throw new Error(e)
  }
}
