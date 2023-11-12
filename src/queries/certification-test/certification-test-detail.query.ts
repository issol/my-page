import toast from 'react-hot-toast'
import { useQuery } from 'react-query'
import { getTestDetail } from 'src/apis/certification-test.api'

export const useGetTestDetail = (id: number, edit: boolean) => {
  return useQuery(
    ['test-detail'],
    () => {
      return getTestDetail(id)
    },
    {
      suspense: true,
      // select: data => ({
      //   versionHistory: [
      //     {
      //       id: 1,
      //       userId: 2,
      //       version: 1,
      //       writer: 'Leriel',
      //       email: 'leriel@glozinc.com',
      //       testType: 'basic',
      //       jobType: '',
      //       role: '',
      //       source: 'ko',
      //       target: 'en',
      //       googleFormLink:
      //         'https://docs.google.com/forms/d/1tDrCHba9B4fted__MbMvkPH-t1DlvuURoq5wgaoh0k8/viewform?edit_requested=true',
      //       files: [],
      //       content: {
      //         blocks: [
      //           {
      //             data: {},
      //             depth: 0,
      //             entityRanges: [],
      //             inlineStyleRanges: [],
      //             key: 'd9so6',
      //             text: 'translation guidelines document for web novels:',
      //             type: 'unstyled',
      //           },
      //           {
      //             data: {},
      //             depth: 0,
      //             entityRanges: [],
      //             inlineStyleRanges: [],
      //             key: 'b75mm',
      //             text: 'Purpose of Translation: Clearly define the purpose of the document being translated, whether it is an official document or a consumer product manual, etc.',
      //             type: 'unstyled',
      //           },
      //         ],
      //         entityMap: {},
      //       },
      //       updatedAt: '2022-09-22T07:08:33.011Z',
      //     },
      //   ],
      //   currentVersion: {
      //     ...data.currentVersion,
      //     content: {
      //       blocks: [
      //         {
      //           data: {},
      //           depth: 0,
      //           entityRanges: [],
      //           inlineStyleRanges: [],
      //           key: 'd9so6',
      //           text: 'translation guidelines document for web novels:',
      //           type: 'unstyled',
      //         },
      //         {
      //           data: {},
      //           depth: 0,
      //           entityRanges: [],
      //           inlineStyleRanges: [],
      //           key: 'b75mm',
      //           text: 'Purpose of Translation: Clearly define the purpose of the document being translated, whether it is an official document or a consumer product manual, etc.',
      //           type: 'unstyled',
      //         },
      //       ],
      //       entityMap: {},
      //     },
      //   },
      // }),
      // onSuccess: () => setSearch(false),
      onError: () => {
        toast.error('Something went wrong. Please try again.', {
          position: 'bottom-left',
        })
      },
      enabled: !!id && edit,
    },
  )
}
