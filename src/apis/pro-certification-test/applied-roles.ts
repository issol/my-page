import axios from '@src/configs/axios'
import { makeQuery } from '@src/shared/transformer/query.transformer'
import {
  ProAppliedRolesFilterType,
  ProAppliedRolesType,
} from '@src/types/pro-certification-test/applied-roles'

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

  const testData: ProAppliedRolesType[] = [
    {
      id: 1,
      jobType: 'OTT/Subtitle',
      role: 'Transcriber',
      sourceLanguage: 'en',
      targetLanguage: 'np',
      basicTest: {
        score: 80,
        isPassed: true,
      },
      skillTest: {
        score: 85,
        isPassed: true,
      },
      status: 'Test assigned',
      testStartedAt: '2022-01-01T00:00:00Z',
      reason: {
        type: 'Paused',
        from: 'From 1',
        message: 'Message 1',
        reason: 'Reason 1',
        rejectedAt: '2022-01-02T00:00:00Z',
      },
      testGuideline: {
        id: 1,
        userId: 1,
        version: 1,
        writer: 'Writer 1',
        email: 'email1@example.com',
        testType: 'Test Type 1',
        jobType: 'Job Type 1',
        role: 'Role 1',
        source: 'Source 1',
        target: 'Target 1',
        googleFormLink: 'https://forms.gle/XXXXX',
        updatedAt: '2022-01-03T00:00:00Z',
        content: {
          blocks: [
            {
              key: 'Key 1',
              text: 'Text 1',
              type: 'Type 1',
              depth: 0,
              inlineStyleRanges: [
                {
                  offset: 0,
                  length: 5,
                  style: 'Style 1',
                },
              ],
              entityRanges: [],
              data: {},
            },
          ],
          entityMap: {},
        },
        files: [
          {
            id: 1,
            name: 'File 1',
            size: 1000,
            fileKey: 'FileKey1',
          },
        ],
      },
      statusHistory: [
        {
          id: 1,
          status: 'Awaiting approval',
          updatedAt: '2022-01-04T00:00:00Z',
        },
      ],
    },
    {
      id: 2,
      jobType: 'Documents/Text',
      role: 'Transcriber',
      sourceLanguage: 'fr',
      targetLanguage: 'gr',
      basicTest: {
        score: 90,
        isPassed: true,
      },
      skillTest: {
        score: 95,
        isPassed: true,
      },
      status: 'Awaiting approval',
      testStartedAt: '2022-02-01T00:00:00Z',
      reason: {
        type: 'Rejected',
        from: 'From 2',
        message: 'Message 2',
        reason: 'Reason 2',
        rejectedAt: '2022-02-02T00:00:00Z',
      },
      testGuideline: {
        id: 2,
        userId: 2,
        version: 2,
        writer: 'Writer 2',
        email: 'email2@example.com',
        testType: 'Test Type 2',
        jobType: 'Job Type 2',
        role: 'Role 2',
        source: 'Source 2',
        target: 'Target 2',
        googleFormLink: 'https://forms.gle/YYYYY',
        updatedAt: '2022-02-03T00:00:00Z',
        content: {
          blocks: [
            {
              key: 'Key 2',
              text: 'Text 2',
              type: 'Type 2',
              depth: 0,
              inlineStyleRanges: [
                {
                  offset: 0,
                  length: 5,
                  style: 'Style 2',
                },
              ],
              entityRanges: [],
              data: {},
            },
          ],
          entityMap: {},
        },
        files: [
          {
            id: 2,
            name: 'File 2',
            size: 2000,
            fileKey: 'FileKey2',
          },
        ],
      },
      statusHistory: [
        {
          id: 2,
          status: 'Awaiting approval',
          updatedAt: '2022-02-04T00:00:00Z',
        },
      ],
    },
    // 다른 테스트 데이터...
  ]

  return { data: testData, totalCount: testData.length }
}
