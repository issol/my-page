import { getProjectCalendarData } from '@src/apis/pro-projects.api'
import { toast } from 'react-hot-toast'
import { useQuery } from 'react-query'

export const useGetProjectCalendarData = (
  id: number,
  year: number,
  month: number,
) => {
  return useQuery(
    'get-project-calendar',
    () => {
      return getProjectCalendarData(id, year, month)
    },
    {
      suspense: true,
      onError: () => {
        toast.error('Something went wrong. Please try again.', {
          position: 'bottom-left',
        })
      },
    },
  )
}

// export const useGetGuideLineDetail = (id: number) => {
//   return useQuery(
//     'get-guideline/detail',
//     () => {
//       return getGuidelineDetail(id)
//     },
//     {
//       enabled: false,
//       suspense: true,
//       useErrorBoundary: false,
//       onError: (e: any) => {
//         toast.error('Something went wrong. Please try again.', {
//           position: 'bottom-left',
//         })
//         return e
//       },
//     },
//   )
// }
