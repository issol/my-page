import { toast } from 'react-hot-toast'
import { useQuery } from 'react-query'
import { getGuidelines } from 'src/apis/client-guideline.api'
import { FilterType } from 'src/pages/onboarding/client-guideline'

export const useGetGuideLines = (
  filter: FilterType,
  search: boolean,
  setSearch: (v: boolean) => void,
) => {
  return useQuery(
    'get-contract',
    () => {
      return getGuidelines(filter)
    },
    {
      suspense: true,
      enabled: search,
      onSuccess: () => setSearch(false),
      onError: () => {
        toast.error('Something went wrong. Please try again.', {
          position: 'bottom-left',
        })
      },
    },
  )
}
