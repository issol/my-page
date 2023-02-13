import axios from 'src/configs/axios'
import { makeQuery } from 'src/shared/transformer/query.transformer'

export type ContractParam = {
  type: 'nda' | 'privacy' | 'freelancer' | ''
  language: 'ko' | 'en' | ''
}
// **TODO api완성되면 endpoint, res 수정

export const getContractDetail = async (props: ContractParam) => {
  try {
    // const { data } = await axios.get(
    //   `/api/enough/a/r-req/al?type=${props.type}&language=${props.language}`,
    // )

    return {
      id: 1111,
      userId: 21778705315028,
      title: '[KOR] NDA',
      email: 'bon@glozinc.com',
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

      versionHistory: [
        {
          id: 1112,
          userId: 123232,
          version: 'version1',
          writer: 'Bon (middle) Kim',
          email: 'bon@glozinc.com',
          updatedAt: 'Fri Feb 03 2023 10:50:40',
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

export const deleteContract = async (id: number) => {
  try {
    return await axios.delete(`/api/enough/a/r-req/al?type=${id}`)
  } catch (e: any) {
    throw new Error(e)
  }
}

export const restoreContract = async (id: number) => {
  try {
    return await axios.patch(`/api/enough/a/r-req/al?type=${id}`)
  } catch (e: any) {
    throw new Error(e)
  }
}
