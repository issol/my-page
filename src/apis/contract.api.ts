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
            text: '1. Agreement ____________________________ (also known as “contractor”) will provide Glocalize Inc. US and Glocalize Inc. Korea (“Glocalize” or “Glocalize Inc.”) with as to the specifications detailed in the terms and conditions below.',
            type: 'unstyled',
            depth: 0,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {},
          },
          {
            key: 'b75mm',
            text: 'DUTIES AND RESPONSIBILITIES OF CONTRACTOR: Contractor shall provide to Glocalize Inc. localization services on an as needed basis at times mutually agreed upon by the parties.',
            type: 'unstyled',
            depth: 0,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {},
          },
          {
            key: 'b751mm',
            text: 'DUTIES AND RESPONSIBILITIES OF CONTRACTOR: Contractor shall provide to Glocalize Inc. localization services on an as needed basis at times mutually agreed upon by the parties.',
            type: 'unstyled',
            depth: 0,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {},
          },
          {
            key: 'b76mm',
            text: 'DUTIES AND RESPONSIBILITIES OF CONTRACTOR: Contractor shall provide to Glocalize Inc. localization services on an as needed basis at times mutually agreed upon by the parties.',
            type: 'unstyled',
            depth: 0,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {},
          },
          {
            key: 'b76mm1',
            text: 'DUTIES AND RESPONSIBILITIES OF CONTRACTOR: Contractor shall provide to Glocalize Inc. localization services on an as needed basis at times mutually agreed upon by the parties.',
            type: 'unstyled',
            depth: 0,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {},
          },
          {
            key: 'b76mm2',
            text: 'DUTIES AND RESPONSIBILITIES OF CONTRACTOR: Contractor shall provide to Glocalize Inc. localization services on an as needed basis at times mutually agreed upon by the parties.',
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
                text: 'dd ',
                type: 'unordered-list-item',
                depth: 0,
                inlineStyleRanges: [],
                entityRanges: [],
                data: {},
              },
              {
                key: 'iikv',
                text: 'sdfslkj',
                type: 'unordered-list-item',
                depth: 0,
                inlineStyleRanges: [
                  {
                    offset: 0,
                    length: 7,
                    style: 'SUBSCRIPT',
                  },
                  {
                    offset: 0,
                    length: 7,
                    style: 'SUPERSCRIPT',
                  },
                  {
                    offset: 0,
                    length: 7,
                    style: 'CODE',
                  },
                ],
                entityRanges: [],
                data: {},
              },
              {
                key: '4vn0d',
                text: 'dfdf',
                type: 'unordered-list-item',
                depth: 0,
                inlineStyleRanges: [
                  {
                    offset: 0,
                    length: 4,
                    style: 'SUBSCRIPT',
                  },
                  {
                    offset: 0,
                    length: 4,
                    style: 'SUPERSCRIPT',
                  },
                  {
                    offset: 0,
                    length: 4,
                    style: 'CODE',
                  },
                ],
                entityRanges: [],
                data: {},
              },
              {
                key: '23n2g',
                text: 'color!',
                type: 'unordered-list-item',
                depth: 0,
                inlineStyleRanges: [
                  {
                    offset: 0,
                    length: 6,
                    style: 'color-rgb(97,189,109)',
                  },
                ],
                entityRanges: [],
                data: {},
              },
              {
                key: 'bd1bf',
                text: '🤗',
                type: 'unstyled',
                depth: 0,
                inlineStyleRanges: [
                  {
                    offset: 0,
                    length: 1,
                    style: 'color-rgb(97,189,109)',
                  },
                ],
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
