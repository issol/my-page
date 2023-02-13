import axios from 'src/configs/axios'
import { makeQuery } from 'src/shared/transformer/query.transformer'
import { FilterType } from 'src/pages/onboarding/client-guideline'

// **TODO api완성되면 endpoint, res 수정
export const getGuidelines = async (
  filters: FilterType,
): Promise<{
  data:
    | Array<{
        id: number
        title: string
        client: string
        category: string
        serviceType: Array<string>
        dueAt: string
      }>
    | []
  count: number
}> => {
  console.log(makeQuery(filters))
  try {
    // const { data } = await axios.get(
    //   `/api/enough/a/r-req/al?type=${props.type}&language=${props.language}`,
    // )

    return {
      data: [
        {
          id: 21778705315028,
          title: 'Naver webtoon guideline Ver.3',
          client: 'Naver',
          category: 'Webcomics',
          serviceType: ['Translation'],
          dueAt: 'Tue Jan 31 2023 00:40:09',
        },
        {
          id: 2,
          title: 'Tappytoon style guide',
          client: 'Tappytoon',
          category: 'Webnovel',
          serviceType: ['Translation', 'Proofreading', 'QC', 'DTP'],
          dueAt: 'Tue Jan 31 2023 00:40:09',
        },
        {
          id: 3,
          title: 'Naver webtoon guideline Ver.3',
          client: 'Naver',
          category: 'YouTube',
          serviceType: ['QC'],
          dueAt: 'Tue Jan 31 2023 00:40:09',
        },
        {
          id: 4,
          title: 'Naver webtoon guideline Ver.3',
          client: 'Naver',
          category: 'Webcomics',
          serviceType: ['Translation'],
          dueAt: 'Tue Jan 31 2023 00:40:09',
        },
      ],
      count: 4,
    }
  } catch (e: any) {
    return {
      data: [],
      count: 0,
    }
  }
}

export const getGuidelineDetail = async (id: number) => {
  try {
    // const { data } = await axios.get(
    //   `/api/enough/a/r-req/al?type=${props.type}&language=${props.language}`,
    // )

    return {
      id: 1111,
      userId: 21778705315028,
      title: 'Client guideline',
      email: 'bon@glozinc.com',
      client: 'GloZ',
      category: 'Dubbing',
      serviceType: 'DTP',
      content: {
        blocks: [
          {
            key: 'd9so6',
            text: 'translation guidelines document for web novels:',
            type: 'unstyled',
            depth: 0,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {},
          },
          {
            key: 'b75mm',
            text: 'Purpose of Translation: Clearly define the purpose of the document being translated, whether it is an official document or a consumer product manual, etc.',
            type: 'unstyled',
            depth: 0,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {},
          },
          {
            key: 'b751mm',
            text: 'Translation Style: Define the style of language, whether it is a formal language style or a friendly and easy language style.',
            type: 'unstyled',
            depth: 0,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {},
          },
          {
            key: 'b76mm',
            text: 'Language Compliance: Comply with standard language and international language regulations.',
            type: 'unstyled',
            depth: 0,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {},
          },
          {
            key: 'b76mm1',
            text: 'Consistency: Maintain consistency in terminology and phrasing throughout the document.',
            type: 'unstyled',
            depth: 0,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {},
          },
          {
            key: 'b76mm21',
            text: 'Accurate Translation: Ensure that the translation accurately conveys the meaning of the original text, avoiding omissions or misunderstandings.',
            type: 'unstyled',
            depth: 0,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {},
          },
          {
            key: 'b76mm22',
            text: 'Cultural Sensitivity: Be mindful of cultural differences and avoid translating phrases or expressions that may be insensitive or inappropriate.',
            type: 'unstyled',
            depth: 0,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {},
          },
          {
            key: 'b76mm23',
            text: 'Review Process: Have the translation reviewed by a native speaker or professional editor to ensure its quality and accuracy.',
            type: 'unstyled',
            depth: 0,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {},
          },
          {
            key: 'b76mm24',
            text: 'Feedback: Encourage feedback from readers and continuously improve the quality of the translation.',
            type: 'unstyled',
            depth: 0,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {},
          },
        ],
        entityMap: {},
      },
      writer: 'Bon (middle) Kim',
      updatedAt: 'Fri Feb 03 2023 10:50:40',
      files: [
        { name: 'add.jpeg', size: 200000 },
        { name: 'adddd.pdf', size: 3333999 },
      ],

      versionHistory: [
        {
          id: 1112,
          userId: 21778705315028,
          title: 'Client guideline',
          email: 'bon@glozinc.com',
          client: 'GloZ',
          category: 'Dubbing',
          serviceType: 'DTP',
          files: [
            { name: 'add.jpeg', size: 200000 },
            { name: 'adddd.pdf', size: 3333999 },
          ],
          content: {
            blocks: [
              {
                key: 'f5ile',
                text: 'translation guidelines document for movie subtitles: ',
                type: 'unstyled',
                depth: 0,
                inlineStyleRanges: [],
                entityRanges: [],
                data: {},
              },
              {
                key: 'iikv1',
                text: 'Purpose of Translation: Clearly define the purpose of the subtitles, whether they are intended for a specific target audience or a general audience.',
                type: 'unstyled',
                depth: 0,
                inlineStyleRanges: [],
                entityRanges: [],
                data: {},
              },
              {
                key: 'iikv2',
                text: 'Translation Style: Define the style of language, whether it is a formal language style or a more casual and conversational language style.',
                type: 'unstyled',
                depth: 0,
                inlineStyleRanges: [],
                entityRanges: [],
                data: {},
              },
              {
                key: 'iikv3',
                text: 'Language Compliance: Comply with standard language and international language regulations.',
                type: 'unstyled',
                depth: 0,
                inlineStyleRanges: [],
                entityRanges: [],
                data: {},
              },
              {
                key: 'iikv4',
                text: 'Timing: Ensure that the subtitles are timed accurately to match the spoken dialogue in the movie.',
                type: 'unstyled',
                depth: 0,
                inlineStyleRanges: [],
                entityRanges: [],
                data: {},
              },
              {
                key: 'iikv5',
                text: 'Length: Limit the length of the subtitles to ensure they can be read comfortably within the allotted time.',
                type: 'unstyled',
                depth: 0,
                inlineStyleRanges: [],
                entityRanges: [],
                data: {},
              },
              {
                key: 'iikv6',
                text: 'Cultural Sensitivity: Be mindful of cultural differences and avoid translating phrases or expressions that may be insensitive or inappropriate.',
                type: 'unstyled',
                depth: 0,
                inlineStyleRanges: [],
                entityRanges: [],
                data: {},
              },
              {
                key: 'iikv7',
                text: 'Review Process: Have the subtitles reviewed by a native speaker or professional editor to ensure their quality and accuracy.',
                type: 'unstyled',
                depth: 0,
                inlineStyleRanges: [],
                entityRanges: [],
                data: {},
              },
              {
                key: 'iikv8',
                text: 'Feedback: Encourage feedback from viewers and continuously improve the quality of the subtitles.',
                type: 'unstyled',
                depth: 0,
                inlineStyleRanges: [],
                entityRanges: [],
                data: {},
              },
              {
                key: 'iikv9',
                text: 'Consistency: Maintain consistency in terminology and phrasing throughout the movie.',
                type: 'unstyled',
                depth: 0,
                inlineStyleRanges: [],
                entityRanges: [],
                data: {},
              },
            ],
            entityMap: {},
          },
        },
        {
          id: 1212,
          userId: 11333,
          title: 'Client guideline',
          email: 'bon@glozinc.com',
          client: 'GloZ',
          category: 'Dubbing',
          serviceType: 'DTP',
          files: [
            { name: 'add.jpeg', size: 200000 },
            { name: 'adddd.pdf', size: 3333999 },
          ],
          content: {
            blocks: [
              {
                key: 'f5ile',
                text: 'translation guidelines document for movie subtitles: ',
                type: 'unstyled',
                depth: 0,
                inlineStyleRanges: [],
                entityRanges: [],
                data: {},
              },
              {
                key: 'iikv1',
                text: 'Purpose of Translation: Clearly define the purpose of the subtitles, whether they are intended for a specific target audience or a general audience.',
                type: 'unstyled',
                depth: 0,
                inlineStyleRanges: [],
                entityRanges: [],
                data: {},
              },
              {
                key: 'iikv2',
                text: 'Translation Style: Define the style of language, whether it is a formal language style or a more casual and conversational language style.',
                type: 'unstyled',
                depth: 0,
                inlineStyleRanges: [],
                entityRanges: [],
                data: {},
              },
              {
                key: 'iikv3',
                text: 'Language Compliance: Comply with standard language and international language regulations.',
                type: 'unstyled',
                depth: 0,
                inlineStyleRanges: [],
                entityRanges: [],
                data: {},
              },
              {
                key: 'iikv4',
                text: 'Timing: Ensure that the subtitles are timed accurately to match the spoken dialogue in the movie.',
                type: 'unstyled',
                depth: 0,
                inlineStyleRanges: [],
                entityRanges: [],
                data: {},
              },
              {
                key: 'iikv5',
                text: 'Length: Limit the length of the subtitles to ensure they can be read comfortably within the allotted time.',
                type: 'unstyled',
                depth: 0,
                inlineStyleRanges: [],
                entityRanges: [],
                data: {},
              },
              {
                key: 'iikv6',
                text: 'Cultural Sensitivity: Be mindful of cultural differences and avoid translating phrases or expressions that may be insensitive or inappropriate.',
                type: 'unstyled',
                depth: 0,
                inlineStyleRanges: [],
                entityRanges: [],
                data: {},
              },
              {
                key: 'iikv7',
                text: 'Review Process: Have the subtitles reviewed by a native speaker or professional editor to ensure their quality and accuracy.',
                type: 'unstyled',
                depth: 0,
                inlineStyleRanges: [],
                entityRanges: [],
                data: {},
              },
              {
                key: 'iikv8',
                text: 'Feedback: Encourage feedback from viewers and continuously improve the quality of the subtitles.',
                type: 'unstyled',
                depth: 0,
                inlineStyleRanges: [],
                entityRanges: [],
                data: {},
              },
              {
                key: 'iikv9',
                text: 'Consistency: Maintain consistency in terminology and phrasing throughout the movie.',
                type: 'unstyled',
                depth: 0,
                inlineStyleRanges: [],
                entityRanges: [],
                data: {},
              },
            ],
            entityMap: {},
          },
        },
      ],
    }
  } catch (e: any) {
    throw new Error(e)
  }
}

export const getGuidelineFileURl = async (userId: number, fileName: string) => {
  try {
    const { data } = await axios.get(
      `/api/enough/u/pu/ps-url?userId=${userId}&fileName=${fileName}`,
    )
    return data
  } catch (e: any) {
    throw new Error(e)
  }
}

export type FormType = {
  title: string
  client: string
  category: string
  serviceType: string
  content: any
}

export const postGuideline = async (form: FormType) => {
  try {
    return await axios.post(`/api/enough/a/r-req/al?type=`, form)
  } catch (e: any) {
    throw new Error(e)
  }
}

export const uploadGuidelineFiles = async (id: number, fileName: string) => {
  try {
    return await axios.post(
      `/api/enough/a/r-req/al?type=${id}&fileName=${fileName}`,
    )
  } catch (e: any) {
    throw new Error(e)
  }
}

export const deleteGuidelineFile = async (userId: number, fileName: string) => {
  try {
    return await axios.delete(
      `/api/enough/a/r-req/al?type=${userId}&fileName=${fileName}`,
    )
  } catch (e: any) {
    throw new Error(e)
  }
}

export const deleteGuideline = async (userId: number) => {
  try {
    return await axios.delete(`/api/enough/a/r-req/al?type=${userId}`)
  } catch (e: any) {
    throw new Error(e)
  }
}

export const restoreGuideline = async (id: number) => {
  try {
    return await axios.patch(`/api/enough/a/r-req/al?type=${id}`)
  } catch (e: any) {
    throw new Error(e)
  }
}
