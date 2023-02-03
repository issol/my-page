import { AnyAbility } from '@casl/ability'
import { useRouter } from 'next/router'
import { toast } from 'react-hot-toast'
import { useQuery } from 'react-query'
import { ContractParam, getContractDetail } from 'src/apis/contract.api'

export const useGetContract = ({ type, language }: ContractParam) => {
  const router = useRouter()
  return useQuery(
    'get-contract',
    () => {
      return getContractDetail({ type, language })
    },
    {
      //   staleTime: 60 * 1000, // 1
      //   keepPreviousData: true,
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
