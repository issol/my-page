import { toast } from 'react-hot-toast'
import { useQuery, useQueryClient } from 'react-query'
import { ContractParam, getContractDetail } from 'src/apis/contract.api'

export const useInvalidateContractQuery = () => {
  const queryClient = useQueryClient()
  function invalidate() {
    queryClient.invalidateQueries({
      queryKey: 'get-contract/detail',
    })
  }
  return invalidate
}

export const useGetContract = ({ type, language }: ContractParam) => {
  return useQuery(
    'get-contract/detail',
    () => {
      return getContractDetail({ type, language })
    },
    {
      enabled: false,
      // enabled: !!type && !!language,
      staleTime: 60 * 1000, // 1min
      keepPreviousData: true,
      suspense: true,
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
