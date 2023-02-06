import { toast } from 'react-hot-toast'
import { useQuery } from 'react-query'
import { ContractParam, getContractDetail } from 'src/apis/contract.api'

export const useGetContract = ({ type, language }: ContractParam) => {
  return useQuery(
    'get-contract/detail',
    () => {
      return getContractDetail({ type, language })
    },
    {
      staleTime: 60 * 1000, // 1min
      keepPreviousData: true,
      suspense: true,
      enabled: !!type && !!language,
      onSuccess: data => {
        return data
      },
      onError: () => {
        toast.error('Something went wrong. Please try again.', {
          position: 'bottom-left',
        })
      },
    },
  )
}
