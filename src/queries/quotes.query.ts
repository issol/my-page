import { MemberListType, getMemberList } from '@src/apis/quotes.api'
import { getLegalName } from '@src/shared/helpers/legalname.helper'
import { toast } from 'react-hot-toast'
import { useQuery } from 'react-query'
import { FilterType } from 'src/pages/client'

export const useGetMemberList = () => {
  return useQuery(
    ['get-member/list'],
    () => {
      return getMemberList()
    },
    {
      select: (data: Array<MemberListType>) =>
        data.map(item => {
          const name = getLegalName({
            firstName: item.firstName!,
            middleName: item.middleName,
            lastName: item.lastName!,
          })
          return {
            value: item.userId.toString(),
            label: name,
            jobTitle: item.jobTitle,
          }
        }),
      suspense: true,
      staleTime: 60 * 1000,
      keepPreviousData: true,
      onError: () => {
        toast.error('Something went wrong. Please try again.', {
          position: 'bottom-left',
        })
      },
    },
  )
}
