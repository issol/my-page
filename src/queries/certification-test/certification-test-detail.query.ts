import toast from 'react-hot-toast'
import { useQuery } from 'react-query'
import { getTestDetail } from 'src/apis/certification-test.api'

export const useGetTestDetail = (id: number, edit: boolean) => {
  return useQuery(
    ['test-detail', id],
    () => getTestDetail(id),

    {
      suspense: true,

      onError: () => {
        toast.error('Something went wrong. Please try again.', {
          position: 'bottom-left',
        })
      },
      enabled: !!id && !isNaN(id) && edit,
    },
  )
}
