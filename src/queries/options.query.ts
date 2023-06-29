import {
  getCompanyList,
  getContactPersonList,
  getUnitOptions,
} from '@src/apis/options.api'
import { CompanyType } from '@src/types/options.type'
import toast from 'react-hot-toast'
import { useQuery } from 'react-query'

export const useGetUnitOptions = () => {
  return useQuery(['options/unit'], () => getUnitOptions(), {
    staleTime: 60 * 1000, // 1
    suspense: false,
    keepPreviousData: true,
    select(data) {
      return data.map(({ id, name, isAvailable }) => ({
        id,
        name,
        isAvailable,
      }))
    },
  })
}
export const useGetCompanyOptions = (type: CompanyType) => {
  return useQuery(['options/company'], () => getCompanyList(type), {
    staleTime: 60 * 1000, // 1
    suspense: false,
    keepPreviousData: true,
  })
}
export const useGetContactPersonOptions = () => {
  return useQuery(['options/contactPerson'], () => getContactPersonList(), {
    staleTime: 60 * 1000, // 1
    suspense: false,
    keepPreviousData: true,
  })
}
