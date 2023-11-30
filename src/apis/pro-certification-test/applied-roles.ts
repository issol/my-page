import axios from '@src/configs/axios'
import { makeQuery } from '@src/shared/transformer/query.transformer'
import {
  ProAppliedRolesFilterType,
  ProAppliedRolesStatusType,
  ProAppliedRolesType,
} from '@src/types/pro-certification-test/applied-roles'
import {
  ContractDetailType,
  ContractParam,
  currentVersionType,
} from '../contract.api'
import dayjs from 'dayjs'

export const getProAppliedRoles = async (
  filters: ProAppliedRolesFilterType,
): Promise<{
  data: ProAppliedRolesType[]
  totalCount: number
}> => {
  // const data = await axios.get(
  //   `/api/enough/cert/test/paper?${makeQuery(filters)}`,
  // )
  // return data.data

  // const testData: ProAppliedRolesType[] = [
  //   {
  //     id: 1,
  //     jobType: 'OTT/Subtitle',
  //     role: 'Transcriber',
  //     sourceLanguage: 'en',
  //     targetLanguage: 'np',
  //     basicTest: {
  //       score: 80,
  //       isPassed: true,
  //     },
  //     skillTest: {
  //       score: 85,
  //       isPassed: true,
  //     },
  //     status: 'Test assigned',
  //     testStartedAt: '2022-01-01T00:00:00Z',
  //     reason: {
  //       type: 'Paused',
  //       from: 'From 1',
  //       message: 'Message 1',
  //       reason: 'Reason 1',
  //       rejectedAt: '2022-01-02T00:00:00Z',
  //     },
  //     testGuideline: {
  //       id: 1,
  //       userId: 1,
  //       version: 1,
  //       writer: 'Writer 1',
  //       email: 'email1@example.com',
  //       testType: 'Test Type 1',
  //       jobType: 'Job Type 1',
  //       role: 'Role 1',
  //       source: 'Source 1',
  //       target: 'Target 1',
  //       googleFormLink: 'https://forms.gle/XXXXX',
  //       updatedAt: '2022-01-03T00:00:00Z',
  //       content: {
  //         blocks: [
  //           {
  //             key: 'Key 1',
  //             text: 'Text 1',
  //             type: 'Type 1',
  //             depth: 0,
  //             inlineStyleRanges: [
  //               {
  //                 offset: 0,
  //                 length: 5,
  //                 style: 'Style 1',
  //               },
  //             ],
  //             entityRanges: [],
  //             data: {},
  //           },
  //         ],
  //         entityMap: {},
  //       },
  //       files: [
  //         {
  //           id: 1,
  //           name: 'File 1',
  //           size: 1000,
  //           fileKey: 'FileKey1',
  //         },
  //       ],
  //     },
  //     statusHistory: [
  //       {
  //         id: 1,
  //         status: 'Awaiting approval',
  //         updatedAt: '2022-01-04T00:00:00Z',
  //       },
  //     ],
  //   },
  //   {
  //     id: 2,
  //     jobType: 'Documents/Text',
  //     role: 'Transcriber',
  //     sourceLanguage: 'fr',
  //     targetLanguage: 'gr',
  //     basicTest: {
  //       score: 90,
  //       isPassed: true,
  //     },
  //     skillTest: {
  //       score: 95,
  //       isPassed: true,
  //     },
  //     status: 'Awaiting approval',
  //     testStartedAt: '2022-02-01T00:00:00Z',
  //     reason: {
  //       type: 'Rejected',
  //       from: 'From 2',
  //       message: 'Message 2',
  //       reason: 'Reason 2',
  //       rejectedAt: '2022-02-02T00:00:00Z',
  //     },
  //     testGuideline: {
  //       id: 2,
  //       userId: 2,
  //       version: 2,
  //       writer: 'Writer 2',
  //       email: 'email2@example.com',
  //       testType: 'Test Type 2',
  //       jobType: 'Job Type 2',
  //       role: 'Role 2',
  //       source: 'Source 2',
  //       target: 'Target 2',
  //       googleFormLink: 'https://forms.gle/YYYYY',
  //       updatedAt: '2022-02-03T00:00:00Z',
  //       content: {
  //         blocks: [
  //           {
  //             key: 'Key 2',
  //             text: 'Text 2',
  //             type: 'Type 2',
  //             depth: 0,
  //             inlineStyleRanges: [
  //               {
  //                 offset: 0,
  //                 length: 5,
  //                 style: 'Style 2',
  //               },
  //             ],
  //             entityRanges: [],
  //             data: {},
  //           },
  //         ],
  //         entityMap: {},
  //       },
  //       files: [
  //         {
  //           id: 2,
  //           name: 'File 2',
  //           size: 2000,
  //           fileKey: 'FileKey2',
  //         },
  //       ],
  //     },
  //     statusHistory: [
  //       {
  //         id: 2,
  //         status: 'Awaiting approval',
  //         updatedAt: '2022-02-04T00:00:00Z',
  //       },
  //     ],
  //   },
  //   // 다른 테스트 데이터...
  // ]
  const statusTypes: ProAppliedRolesStatusType[] = [
    'Awaiting approval',
    'Test assigned',
    'Role assigned',
    'Rejected by TAD',
    'Test declined',
    'Role declined',
    'Basic test Ready',
    'Skill test Ready',
    'Paused',
    'Basic in progress',
    'Basic submitted',
    'Basic failed',
    'Basic passed',
    'Skill in progress',
    'Skill submitted',
    'Skill failed',
    'Contract required',
    'Certified',
    'Test in preparation',
  ]
  const testData: ProAppliedRolesType[] = statusTypes.map((status, index) => ({
    id: index + 1,
    jobType: `Job Type ${index + 1}`,
    role: `Role ${index + 1}`,
    sourceLanguage: index % 2 === 0 ? 'jp' : 'ko',
    targetLanguage: 'en',
    basicTest: {
      score: 80,
      isPassed: true,
    },
    skillTest: {
      score: 85,
      isPassed: true,
    },
    status: status,
    testStartedAt: '2022-01-01',
    reason: {
      type: 'Paused',
      from: 'User',
      message: 'Test message',
      reason: 'Test reason',
      retestDate: '2022-01-01',
    },
    testGuideline: {
      id: index + 1,
      userId: index + 1,
      version: 1,
      writer: 'Test writer',
      email: 'test@example.com',
      testType: 'Test type',
      jobType: `Job Type ${index + 1}`,
      role: `Role ${index + 1}`,
      source: 'Test source',
      target: 'Test target',
      googleFormLink: 'https://example.com',
      updatedAt: '2022-01-01',
      content: {
        blocks: [],
        entityMap: {},
      },
      files: [],
    },
    statusHistory: [],
  }))

  return { data: testData, totalCount: testData.length }
}

export const getProContractDetail = async (
  props: ContractParam,
): Promise<currentVersionType> => {
  // const { data } = await axios.get(
  //   `/api/enough/onboard/contract?type=${props.type}&language=${props.language}`,
  // )
  // return data

  const data =
    props.language === 'ENG'
      ? {
          documentId: 16,
          userId: 28,
          title: '[EN] NDA',
          writer: 'ALL (ROLE) MASTER',
          email: 'enuff-all-master@glozinc.com',
          updatedAt: '2023-11-29T02:44:02.968Z',
          content: {
            blocks: [
              {
                key: '3hdk6',
                data: {},
                text: 'Legal name: {Legal name}\nPermanent address: {Address}\nDate of birth: {Date of birth}\n\n1. Agreement {Legal name}(also known as “contractor”) will provide Glocalize Inc. US and Glocalize Inc. Korea (“Glocalize” or “Glocalize Inc.”) with as to the specifications detailed in the terms and conditions below.\n\nDUTIES AND RESPONSIBILITIES OF CONTRACTOR: Contractor shall provide to Glocalize Inc. localization services on an as needed basis at times mutually agreed upon by the parties.\n\nI understand & agree to meet Glocalize Inc. service delivery expectation as needed.\n\n2. Default Payment Terms Except where different payment terms have been agreed in writing with a Contractor, Glocalize will start the transaction for start the transactions for authorized invoices which comply with these requirements on a “45-47 net days”. This means that all of your work submitted and invoiced (through order forms)',
                type: 'unstyled',
                depth: 0,
                entityRanges: [],
                inlineStyleRanges: [
                  {
                    style: 'color-rgba(76,78,100,0.87)',
                    length: 12,
                    offset: 97,
                  },
                  {
                    style: 'bgcolor-rgb(255,255,255)',
                    length: 12,
                    offset: 97,
                  },
                  {
                    style: 'fontsize-16',
                    length: 12,
                    offset: 97,
                  },
                  {
                    style:
                      'fontfamily-Inter, sans-serif, -apple-system, "system-ui", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol',
                    length: 12,
                    offset: 97,
                  },
                ],
              },
            ],
            entityMap: {},
          },
        }
      : {
          documentId: 35,
          userId: 2,
          title: '[KO] NDA',
          writer: 'Master (D) K',
          email: 'd_master_1@glozinc.com',
          updatedAt: '2023-06-07T01:59:37.218Z',
          content: {
            blocks: [
              {
                key: 'd9so6',
                data: {},
                text: '버전 업데이트 테스트',
                type: 'unstyled',
                depth: 0,
                entityRanges: [],
                inlineStyleRanges: [],
              },
            ],
            entityMap: {},
          },
        }

  let now = dayjs(new Date()).format('MM/DD/YYYY')
  let copyContent = { ...data.content }

  for (let i = 0; i < copyContent.blocks?.length; i++) {
    if (i === copyContent.blocks.length - 1) {
      copyContent.blocks[
        i
      ].text = `${copyContent?.blocks[i]?.text} \n\nSignature date: ${now}`
    }
  }

  const result = { ...data, content: copyContent }

  return result
}
