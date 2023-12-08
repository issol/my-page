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
  userId: number,
  filters: ProAppliedRolesFilterType,
): Promise<{
  data: ProAppliedRolesType[]
  totalCount: number
}> => {
  const { data } = await axios.get(
    `/api/enough/cert/test/pro/${userId}/applied-role?${makeQuery(filters)}`,
  )
  return data
  // const statusTypes: ProAppliedRolesStatusType[] = [
  //   'Awaiting approval',
  //   'Test assigned',
  //   'Role assigned',
  //   'Rejected by TAD',
  //   'Test declined',
  //   'Role declined',
  //   'Basic test Ready',
  //   'Skill test Ready',
  //   'Paused',
  //   'Basic in progress',
  //   'Basic submitted',
  //   'Basic failed',
  //   'Basic passed',
  //   'Skill in progress',
  //   'Skill submitted',
  //   'Skill failed',
  //   'Contract required',
  //   'Certified',
  //   'Test in preparation',
  // ]
  // const testData: ProAppliedRolesType[] = statusTypes.map((status, index) => ({
  //   id: index + 1,
  //   jobType: `Job Type ${index + 1}`,
  //   role: `Role ${index + 1}`,
  //   sourceLanguage: index % 2 === 0 ? 'jp' : 'ko',
  //   targetLanguage: 'en',
  //   basicTest: {
  //     score: 80,
  //     isPassed: null,
  //     isExist: true,
  //     isSkipped: true,
  //     testPaperFormLink: 'https://www.naver.com',
  //     testStartedAt: '2022-01-01',
  //   },
  //   skillTest: {
  //     score: 85,
  //     isPassed: false,
  //     isExist: false,
  //     testPaperFormLink: 'https://www.naver.com',
  //     testStartedAt: '2022-01-02',
  //   },
  //   status: status,
  //   reason: {
  //     type: 'Paused',
  //     from: 'User',
  //     message: 'Test message',
  //     reason: 'Test reason',
  //     retestDate: '2022-01-01',
  //   },
  //   testGuideline: {
  //     id: index + 1,
  //     userId: index + 1,
  //     version: 1,
  //     writer: 'Test writer',
  //     email: 'test@example.com',
  //     testType: 'basic',
  //     jobType: `Job Type ${index + 1}`,
  //     role: `Role ${index + 1}`,
  //     source: 'ja',
  //     target: 'ko',
  //     googleFormLink: 'https://example.com',
  //     updatedAt: '2022-01-01',
  //     content: {
  //       blocks: [
  //         {
  //           key: 'a0oh6',
  //           data: {},
  //           text: '1. Avoid Over-Interpretation',
  //           type: 'unstyled',
  //           depth: 0,
  //           entityRanges: [],
  //           inlineStyleRanges: [
  //             {
  //               style: 'BOLD',
  //               length: 25,
  //               offset: 3,
  //             },
  //           ],
  //         },
  //         {
  //           key: '1e0tk',
  //           data: {},
  //           text: " Excessive interpretation in your translation may result in point deductions. It's advisable to stay faithful to the original meaning while avoiding substantial changes.",
  //           type: 'unstyled',
  //           depth: 0,
  //           entityRanges: [],
  //           inlineStyleRanges: [],
  //         },
  //         {
  //           key: '3534j',
  //           data: {},
  //           text: '',
  //           type: 'unstyled',
  //           depth: 0,
  //           entityRanges: [],
  //           inlineStyleRanges: [],
  //         },
  //         {
  //           key: '7jr49',
  //           data: {},
  //           text: '2. Contextual Comprehension',
  //           type: 'unstyled',
  //           depth: 0,
  //           entityRanges: [],
  //           inlineStyleRanges: [
  //             {
  //               style: 'BOLD',
  //               length: 24,
  //               offset: 3,
  //             },
  //           ],
  //         },
  //         {
  //           key: '8v0mo',
  //           data: {},
  //           text: " Fully understand the source text and perform your translation within its context. Don't isolate words or phrases; focus on capturing the entire sentence's meaning.",
  //           type: 'unstyled',
  //           depth: 0,
  //           entityRanges: [],
  //           inlineStyleRanges: [],
  //         },
  //         {
  //           key: 'd2m69',
  //           data: {},
  //           text: '',
  //           type: 'unstyled',
  //           depth: 0,
  //           entityRanges: [],
  //           inlineStyleRanges: [],
  //         },
  //         {
  //           key: '31vmn',
  //           data: {},
  //           text: '3. Lexical Diversity',
  //           type: 'unstyled',
  //           depth: 0,
  //           entityRanges: [],
  //           inlineStyleRanges: [
  //             {
  //               style: 'BOLD',
  //               length: 17,
  //               offset: 3,
  //             },
  //           ],
  //         },
  //         {
  //           key: '32dta',
  //           data: {},
  //           text: 'Utilize a wide range of vocabulary to express diversity in your translation. Avoid repetitive words or expressions, and opt for suitable synonyms and phrases.',
  //           type: 'unstyled',
  //           depth: 0,
  //           entityRanges: [],
  //           inlineStyleRanges: [],
  //         },
  //         {
  //           key: 'ac05r',
  //           data: {},
  //           text: '',
  //           type: 'unstyled',
  //           depth: 0,
  //           entityRanges: [],
  //           inlineStyleRanges: [],
  //         },
  //         {
  //           key: '3mb1a',
  //           data: {},
  //           text: '4. Grammar and Structure',
  //           type: 'unstyled',
  //           depth: 0,
  //           entityRanges: [],
  //           inlineStyleRanges: [
  //             {
  //               style: 'BOLD',
  //               length: 21,
  //               offset: 3,
  //             },
  //           ],
  //         },
  //         {
  //           key: '659fk',
  //           data: {},
  //           text: ' Adhere to grammar rules and use proper sentence structures. Grammar errors can impact your evaluation.',
  //           type: 'unstyled',
  //           depth: 0,
  //           entityRanges: [],
  //           inlineStyleRanges: [],
  //         },
  //         {
  //           key: 'cfsrc',
  //           data: {},
  //           text: '',
  //           type: 'unstyled',
  //           depth: 0,
  //           entityRanges: [],
  //           inlineStyleRanges: [],
  //         },
  //         {
  //           key: '6fsqq',
  //           data: {},
  //           text: '5. Style',
  //           type: 'unstyled',
  //           depth: 0,
  //           entityRanges: [],
  //           inlineStyleRanges: [
  //             {
  //               style: 'BOLD',
  //               length: 5,
  //               offset: 3,
  //             },
  //           ],
  //         },
  //         {
  //           key: '34da8',
  //           data: {},
  //           text: " Adapt your translation style to match the source text's style and purpose. For formal documents, use formal language, and for informal ones, use conversational language.",
  //           type: 'unstyled',
  //           depth: 0,
  //           entityRanges: [],
  //           inlineStyleRanges: [],
  //         },
  //       ],
  //       entityMap: {},
  //     },
  //     files: [
  //       {
  //         id: 2,
  //         name: 'QA에 도움을 주는 귀여운 사진.jpg',
  //         size: 42835,
  //         fileKey:
  //           'testPaper/basic/ko/V4/QA에 도움을 주는 귀여운 사진.jpg',
  //       },
  //       {
  //         id: 3,
  //         name: 'QA에 도움을 주는 귀여운 사진 두 번째.png',
  //         size: 384742,
  //         fileKey:
  //           'testPaper/basic/ko/V4/QA에 도움을 주는 귀여운 사진 두 번째.png',
  //       },
  //     ],
  //   },
  //   statusHistory: [],
  // }))
  // return { data: testData, totalCount: testData.length }
}

export const getProContractDetail = async (
  props: ContractParam,
): Promise<currentVersionType> => {
  const { data } = await axios.get(
    `/api/enough/onboard/contract?type=${props.type}&language=${props.language}`,
  )

  let now = dayjs(new Date()).format('MM/DD/YYYY')
  let copyContent = { ...data.currentVersion.content }

  console.log(copyContent)

  for (let i = 0; i < copyContent.blocks?.length; i++) {
    if (i === copyContent.blocks.length - 1) {
      copyContent.blocks[i].text = `${copyContent?.blocks[i]?.text} \n\n${
        props.language === 'ENG' ? 'Signature date:' : '서명 일자:'
      } ${now}`
    }
  }

  return { ...data, content: copyContent }

  // const data = {
  //   documentId: 16,
  //   userId: 28,
  //   title:
  //     props.type === 'PRIVACY'
  //       ? props.language === 'ENG'
  //         ? '[EN] Privacy Contract'
  //         : '[KO] Privacy Contract'
  //       : props.type === 'FREELANCER'
  //       ? props.language === 'ENG'
  //         ? '[EN] Freelancer contract'
  //         : '[KO] Freelancer contract'
  //       : props.type === 'NDA'
  //       ? props.language === 'ENG'
  //         ? '[EN] NDA'
  //         : '[KO] NDA'
  //       : '',
  //   writer: 'ALL (ROLE) MASTER',
  //   email: 'enuff-all-master@glozinc.com',
  //   updatedAt: '2023-11-29T02:44:02.968Z',
  //   content: {
  //     blocks: [
  //       {
  //         key: '3hdk6',
  //         data: {},
  //         text:
  //           props.language === 'ENG'
  //             ? 'Legal name: {Legal name}\nPermanent address: {Address}\nDate of birth: {Date of birth}\n\n1. Agreement {Legal name}(also known as “contractor”) will provide Glocalize Inc. US and Glocalize Inc. Korea (“Glocalize” or “Glocalize Inc.”) with as to the specifications detailed in the terms and conditions below.\n\nDUTIES AND RESPONSIBILITIES OF CONTRACTOR: Contractor shall provide to Glocalize Inc. localization services on an as needed basis at times mutually agreed upon by the parties.\n\nI understand & agree to meet Glocalize Inc. service delivery expectation as needed.\n\n2. Default Payment Terms Except where different payment terms have been agreed in writing with a Contractor, Glocalize will start the transaction for start the transactions for authorized invoices which comply with these requirements on a “45-47 net days”. This means that all of your work submitted and invoiced (through order forms)'
  //             : '법적 이름: {Legal name}\n영구 주소: {Address}\n생년월일: {Date of birth}\n\n1. 계약 {Legal name}(이하 "계약자")은 아래의 약관에 명시된 사항에 따라 Glocalize Inc. US 및 Glocalize Inc. Korea(이하 "Glocalize" 또는 "Glocalize Inc.")에 서비스를 제공할 것입니다.\n\n계약자의 의무와 책임: 계약자는 당사자간에 상호 합의한 시간에 필요에 따라 Glocalize Inc.에 지역화 서비스를 제공해야 합니다.\n\n나는 Glocalize Inc.의 서비스 제공 기대치를 이해하고 필요에 따라 충족시키겠다는 것에 동의합니다.\n\n2. 기본 결제 조건 계약자와 서면으로 다른 결제 조건이 합의된 경우를 제외하고, Glocalize는 이러한 요구 사항을 준수하는 승인된 인보이스에 대해 "45-47 순일"에 거래를 시작합니다. 이는 제출하고 청구한 모든 작업(주문 양식을 통해)이라는 의미입니다.',
  //         type: 'unstyled',
  //         depth: 0,
  //         entityRanges: [],
  //         inlineStyleRanges: [
  //           {
  //             style: 'color-rgba(76,78,100,0.87)',
  //             length: 12,
  //             offset: 97,
  //           },
  //           {
  //             style: 'bgcolor-rgb(255,255,255)',
  //             length: 12,
  //             offset: 97,
  //           },
  //           {
  //             style: 'fontsize-16',
  //             length: 12,
  //             offset: 97,
  //           },
  //           {
  //             style:
  //               'fontfamily-Inter, sans-serif, -apple-system, "system-ui", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol',
  //             length: 12,
  //             offset: 97,
  //           },
  //         ],
  //       },
  //     ],
  //     entityMap: {},
  //   },
  // }

  // let now = dayjs(new Date()).format('MM/DD/YYYY')
  // let copyContent = { ...data.content }

  // for (let i = 0; i < copyContent.blocks?.length; i++) {
  //   if (i === copyContent.blocks.length - 1) {
  //     copyContent.blocks[i].text = `${copyContent?.blocks[i]?.text} \n\n${
  //       props.language === 'ENG' ? 'Signature date:' : '서명 일자:'
  //     } ${now}`
  //   }
  // }

  // const result = { ...data, content: copyContent }

  // return result
}
