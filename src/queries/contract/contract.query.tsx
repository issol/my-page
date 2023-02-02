import { AnyAbility } from '@casl/ability'
import { useRouter } from 'next/router'
import { toast } from 'react-hot-toast'
import { useQuery } from 'react-query'
import { ContractParam, getContractDetail } from 'src/apis/contract.api'

export const useGetContract = ({
  type,
  language,
  initialize,
}: ContractParam & { initialize: Function }) => {
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
      //   select: (data: ResponseRequestsType[]) => {
      //     return data.map((value: ResponseRequestsType) => ({
      //       id: value.userId,
      //       email: value.userEmail,
      //       roles: value.roles,
      //       permission: 'General',
      //       rId: value.id,
      //     }))
      //   },
      onSuccess: data => {
        initialize()
        if (data) {
          router.push({
            pathname: '/onboarding/contracts/detail',
            query: { type, language },
          })
        } else {
          router.push({
            pathname: '/onboarding/contracts/form',
            query: { type, language },
          })
        }
      },
      onError: () => {
        toast.error('Something went wrong. Please try again.', {
          position: 'bottom-left',
        })
      },
    },
  )
}
