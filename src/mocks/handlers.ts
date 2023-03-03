import { rest } from 'msw'
import { BASEURL } from 'src/configs/axios'

import { Book, Review } from './types'

const image = '/sample/seo.pdf'

type ReqType = {
  body: {
    category?: any
    client?: any
    content?: any
    serviceType?: any
    title?: any
  }
}

type ReqType2 = {
  params: {
    guidelineId?: any
    fileId?: any
  }
}

export const handlers = [
  // Handles a GET /user request
  rest.get(BASEURL + '/api/enough/u/pu/r-check', (req, res, ctx) => {
    const userEmail = req.url.searchParams.get('email')
    if (userEmail != 'jay@glozinc.com') {
      return res(ctx.status(200), ctx.body('good to go!'))
    } else {
      return res(
        ctx.status(409),
        ctx.json({
          statusCode: 409,
          message: 'Email: jay@glozinc.com 이미 가입된 계정입니다.',
          error: 'Conflict',
        }),
      )
    }
  }),

  // 클라이언트 가이드라인
  // get list
  rest.get(BASEURL + '/api/enough/onboard/guideline', (req, res, ctx) => {
    interface Data {
      title: string
      client: string
      category: string
      serviceType: string
    }
    const f_Skip = Number(req.url.searchParams.get('skip')) || 1
    const f_PageSize = Number(req.url.searchParams.get('pageSize')) || 10
    const f_Title = req.url.searchParams.get('title') || ''
    const f_Client = req.url.searchParams.get('client')
      ? [req.url.searchParams.get('client')]
      : []
    const f_Category = req.url.searchParams.get('category')
      ? [req.url.searchParams.get('category')]
      : []
    const f_ServiceType = req.url.searchParams.get('serviceType')
      ? [req.url.searchParams.get('serviceType')]
      : []

    const titles = [
      'sample title 1',
      'sample title 2',
      'sample title 3',
      'my title 1',
      'my title 2',
      'my title 3',
      'company title 1',
      'company title 2',
      'company title 3',
    ]
    const clients = [
      'Disney',
      'Naver',
      'Netflix',
      'RIDI',
      'Sandbox',
      'Tapytoon',
    ]
    const categories = [
      'Documents/Text',
      'Dubbing',
      'Interpretation',
      'Misc.',
      'OTT/Subtitle',
      'Webcomics',
      'Webnovel',
    ]
    const serviceTypes = [
      'Admin task(Internal task)',
      'Copywriting',
      'DTP',
      'DTP file prep',
      'DTP QC',
      'Editing',
      'File preparation',
      'Final check',
      'interpretation',
      'Proofreading',
      'QC',
      'Review',
      'Revision(Rework)',
      'Subtitle',
      'TAE(Translator accept edits)',
      'Translation',
      'Transcription',
    ]

    function getRandomDate() {
      const start = new Date('2022-01-01')
      const end = new Date('2023-12-31')
      return new Date(
        start.getTime() + Math.random() * (end.getTime() - start.getTime()),
      ).toISOString()
    }

    function generateRandomData() {
      const data = []
      for (let i = 0; i < 20; i++) {
        // 20개의 랜덤 데이터 생성
        const title = titles[Math.floor(Math.random() * titles.length)]
        const client = clients[Math.floor(Math.random() * clients.length)]
        const category =
          categories[Math.floor(Math.random() * categories.length)]
        const serviceType =
          serviceTypes[Math.floor(Math.random() * serviceTypes.length)]
        const createdAt = getRandomDate()
        const id = i + 1
        data.push({ id, title, client, category, serviceType, createdAt })
      }
      return data
    }

    function filterData(
      titles?: string,
      clients?: Array<string | null>,
      categories?: Array<string | null>,
      serviceTypes?: Array<string | null>,
    ): Data[] {
      return sampleList.filter(
        item =>
          (!titles || titles === item.title) &&
          (clients?.length === 0 || clients?.includes(item.client)) &&
          (categories?.length === 0 || categories?.includes(item.category)) &&
          (serviceTypes?.length === 0 ||
            serviceTypes?.includes(item.serviceType)),
      )
    }

    const sampleList: Data[] = generateRandomData()
    const finalList = filterData(f_Title, f_Client, f_Category, f_ServiceType)
    return res(
      ctx.status(200),
      ctx.json({
        data: finalList,
        count: finalList.length,
      }),
    )
  }),

  // guideline upload

  rest.post(
    BASEURL + '/api/enough/onboard/guideline',
    (req: ReqType, res, ctx) => {
      if (
        req.body?.category &&
        req.body?.client &&
        req.body?.content &&
        req.body?.serviceType &&
        req.body?.title
      ) {
        return res(ctx.status(200), ctx.json(req.body))
      } else {
        return res(ctx.status(404), ctx.json(req.body))
      }
    },
  ),

  rest.get(BASEURL + '/api/enough/onboard/guideline/:id', (req, res, ctx) => {
    const id = req.params.id
    const detail = {
      currentVersion: {
        id: id,
        userId: 12345,
        title: 'title sample',
        writer: 'Jay Lee',
        email: 'jay@glozinc.com',
        client: 'GloZ',
        category: 'Dubbing',
        serviceType: 'Editing',
        updatedAt: '2023-02-10T07:33:53.740Z1',
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
          ],
          entityMap: {},
        },
        files: [
          { name: 'file1.docx', size: 34876123 },
          { name: 'file2.xlsx', size: 25161 },
        ],
      },
      versionHistory: [
        {
          id: 2,
          userId: 12345,
          title: 'title sample',
          name: 'Jay Lee',
          email: 'jay@glozinc.com',
          client: 'GloZ',
          category: 'Dubbing',
          serviceType: 'Editing',
          content: 'awefawef',
          updatedAt: '2023-02-10T07:33:53.740Z1',
          files: [
            { name: 'file1.docx', size: 34876123 },
            { name: 'file2.xlsx', size: 25161 },
          ],
        },
        {
          id: 1,
          userId: 12345,
          title: 'title sample',
          name: 'Jay Lee',
          email: 'jay@glozinc.com',
          client: 'GloZ',
          category: 'Dubbing',
          serviceType: 'Editing',
          content: 'awefawef',
          updatedAt: '2023-02-10T07:33:53.740Z1',
          files: [
            { name: 'file1.docx', size: 34876123 },
            { name: 'file2.xlsx', size: 25161 },
          ],
        },
      ],
    }
    return res(ctx.status(200), ctx.json(detail))
  }),

  rest.patch(
    BASEURL + '/api/enough/onboard/guideline/:guidelineId',
    (req: ReqType2, res, ctx) => {
      return res(ctx.status(200), ctx.body(req.params.guidelineId))
    },
  ),

  rest.delete(
    BASEURL + '/api/enough/onboard/guideline/:guidelineId',
    (req: ReqType2, res, ctx) => {
      return res(ctx.status(200), ctx.body(req.params.guidelineId))
    },
  ),

  rest.delete(
    BASEURL + '/api/enough/onboard/guideline/file/:fileId',
    (req: ReqType2, res, ctx) => {
      return res(ctx.status(200), ctx.body(req.params.fileId))
    },
  ),
  // rest.get(BASEURL + '/api/enough/onboard/user/al', (req, res, ctx) => {
  //   return res(ctx.status(200), ctx.json(onboardingUser))
  // }),

  // Recruiting
  // 리크루팅 리스트 가져오기
  rest.get(
    BASEURL + '/api/enough/recruiting',
    (req, res, ctx) => {
      const recruitingList = {
        'data': [
          {
            'id': 1,
            'status': 'Ongoing',
            'client': 'Netflix',
            'jobType' : 'Webcomics',
            'role' : 'Proofreader',
            'sourceLanguage': 'EN',
            'targetLanguage': 'KO',
            'writer' : 'Tammy Na',
            'dueDate' : '02/02/2023, 06:20 PM',
            'numberOfLinguist' : 2,
            'jobStatus':'Ongoing',
            'isHide':false
          },
          {
            'id': 2,
            'status': 'Fulfilled',
            'client': 'Naver',
            'jobType' : 'YouTube',
            'role' : 'Translator',
            'sourceLanguage': 'JA',
            'targetLanguage': 'FR',
            'writer' : 'Jay Cha',
            'dueDate' : '02/02/2023, 06:20 PM',
            'numberOfLinguist' : 2,
            'jobStatus':'Ongoing',
            'isHide':false
          }
        ],
        'count': 2
      }
      if (
        req.url.searchParams.get('client') &&
        req.url.searchParams.get('jobType') &&
        req.url.searchParams.get('role') &&
        req.url.searchParams.get('source') &&
        req.url.searchParams.get('target')
      ) return res(ctx.status(200), ctx.json(recruitingList))
      else return res(ctx.status(409), ctx.body(''))
    },
  ),

  //리크루팅 디테일 가져오기
  rest.get(
    BASEURL + '/api/enough/recruiting/:id', (req, res, ctx) => {
      const id = req.params.id
      const detail = {
        'currentVersion' : {
          'id': 1,
          'version': 3,
          'writer': 'Jay Cha',
          'email': 'jaycha@glozinc.com',
          'createdAt': '02/02/2023, 06:20 PM',
          'status': "Ongoing", 
          'client': 'Naver',
          'jobType': 'OTT/Subtitle',
          'role': 'Translator',
          'sourceLanguage': 'KO',
          'targetLanguage': 'ZH_HANT',
          'numberOfLinguist': 3,
          'dueDate': '02/02/2023, 06:20 PM',
          'dueDateTimezone': null,
          'jobPostLink': 'https://gloz.io/short1', // short url
          'content': '???',
          'isHide': false
        },
        'versionHistory' : [
          {
            'id': 2,
            'version': 2,
            'writer': 'Jay Cha',
            'email': 'jaycha@glozinc.com',
            'createdAt': '02/02/2023, 06:20 PM',
            'status': "Ongoing", 
            'client': 'Naver',
            'jobType': 'OTT/Subtitle',
            'role': 'Translator',
            'sourceLanguage': 'KO',
            'targetLanguage': 'ZH_HANT',
            'numberOfLinguist': 3,
            'dueDate': '02/02/2023, 06:20 PM',
            'dueDateTimezone': null,
            'jobPostLink': 'https://gloz.io/short1', // short url
            'content': '???',
            'isHide': false
          },
          {
            'id': 3,
            'version': 1,
            'writer': 'Jay Cha',
            'email': 'jaycha@glozinc.com',
            'createdAt': '02/02/2023, 06:20 PM',
            'status': "Ongoing", 
            'client': 'Naver',
            'jobType': 'OTT/Subtitle',
            'role': 'Translator',
            'sourceLanguage': 'KO',
            'targetLanguage': 'ZH_HANT',
            'numberOfLinguist': 3,
            'dueDate': '02/02/2023, 06:20 PM',
            'dueDateTimezone': null,
            'jobPostLink': 'https://gloz.io/short1', // short url
            'content': '???',
            'isHide': false
          }
        ]
      }
      if (id) return res(ctx.status(200), ctx.json(detail))
      else return res(ctx.status(409), ctx.body(''))
    },
  ),

  //리크루팅 디테일 가져오기
  rest.get(
    BASEURL + '/api/enough/recruiting/dashboard', (req, res, ctx) => {
      return res(ctx.status(200), ctx.json({
        'onGoing':55,
        'done':125,
        'hold':76,
        'total':256243
      }))
    },
  ),

  //리크루팅 요청서
  rest.post(
    BASEURL + '/api/enough/recruiting', (req, res, ctx) => {
      if (
        req.body?.status &&
        req.body?.client &&
        req.body?.jobType &&
        req.body?.role &&
        req.body?.sourceLanguage &&
        req.body?.targetLanguage &&
        req.body?.openings &&
        req.body?.dueAt &&
        req.body?.timezone &&
        req.body?.jobPostLink &&
        req.body?.content
      )
      return res(ctx.status(200), ctx.json({
        'id':123
      }))
      else return res(ctx.status(409), ctx.body(''))
    },
  ),

  //리크루팅 업데이트
  rest.patch(
    BASEURL + '/api/enough/recruiting/:id', (req, res, ctx) => {
      if (
        req.params.id &&
        req.body?.status &&
        req.body?.client &&
        req.body?.jobType &&
        req.body?.role &&
        req.body?.sourceLanguage &&
        req.body?.targetLanguage &&
        req.body?.numberOfLinguist &&
        req.body?.dueDate &&
        req.body?.dueDateTimezone &&
        req.body?.jobPostLink &&
        req.body?.content
      )
      return res(ctx.status(200), ctx.json({
        'id':req.params.id
      }))
      else return res(ctx.status(409), ctx.body(''))
    },
  ),

  //리크루팅 숨김처리
  // 리크루팅 업데이트랑 엔드포인트가 겹침
  // rest.patch(
  //   BASEURL + '/api/enough/recruiting/:id', (req, res, ctx) => {
  //     if (
  //       req.params.id &&
  //       req.body?.hide
  //     )
  //     return res(ctx.status(200), ctx.json({
  //       'id':req.params.id
  //     }))
  //     else return res(ctx.status(409), ctx.body(''))
  //   },
  // )

  // 리크루팅 삭제
  rest.delete(
    BASEURL + '/api/enough/recruiting/:id', (req, res, ctx) => {
      if (req.params.id) return res(ctx.status(200), ctx.body(''))
      else return res(ctx.status(409), ctx.body(''))
    },
  ),

  // 잡포스팅 리스트 가져오기
  rest.get(
    BASEURL + '/api/enough/recruiting/jobposting', (req, res, ctx) => {
      const jobpostingList = {
        'data': [
          {
            'id': 1,
            'status': 'Ongoing',
            'client': 'Netflix',
            'jobType' : 'Webcomics',
            'role' : 'Proofreader',
            'sourceLanguage': 'EN',
            'targetLanguage': 'KO',
            'yearsOfExperience' : '3~5 years',
            'tadName': 'Bon',
            'dueAt' : '02/02/2023, 06:20 PM',
            'openings' : 2,
            'view': 23
          },
          {
            'id': 2,
            'status': 'Ongoing',
            'client': 'Netflix',
            'jobType' : 'Webcomics',
            'role' : 'Proofreader',
            'sourceLanguage': 'EN',
            'targetLanguage': 'KO',
            'yearsOfExperience' : '10+ years',
            'tadName': 'Ethan',
            'dueAt' : '02/02/2023, 06:20 PM',
            'openings' : 5,
            'view': 28239
          }
        ],
        'count': 2
      }  
      if (
        req.url.searchParams.get('jobType') &&
        req.url.searchParams.get('role') &&
        req.url.searchParams.get('source') &&
        req.url.searchParams.get('target') &&
        req.url.searchParams.get('yearsOfExperience') &&
        req.url.searchParams.get('dueAt') &&
        req.url.searchParams.get('take') &&
        req.url.searchParams.get('skip')
      ) return res(ctx.status(200), ctx.json(jobpostingList))
      else return res(ctx.status(409), ctx.body(''))
    },
  ),

  // 잡포스팅 디테일 가져오기
  rest.get(
    BASEURL + '/api/enough/recruiting/jobposting/:id', (req, res, ctx) => {
      const jobpostingDetailList = {
        'data': {
          'id': req.params.id,
          'writer': 'Jay Cha',
          'email': 'jaycha@glozinc.com',
          'jobType' : 'Webcomics',
          'role' : 'Proofreader',
          'sourceLanguage': 'EN',
          'targetLanguage': 'KO',
          'dueDate': '02/02/2023, 06:20 PM',
          'numberOfLinguist': 5,
          'dueDateTimezone': '?',
          'yearsOfExperience' : '3~5 years',
          'postLink' : [
            {
              'id': 1,
              'category': 'JobKorea',
              'link': 'https://jobkorea.com/123123'
            },
            {
              'id': 2,
              'category': 'Albamon',
              'link': 'https://albamon.com/123123'
            },
          ],
          'jobPostLink': 'htps://gloz.io/short2',
          'createdAt' : '02/02/2023, 06:20 PM',
          'content' : 'a',
          'view': 23 
        }
      }
      if (req.params.id) return res(ctx.status(200), ctx.json(jobpostingDetailList))
      else return res(ctx.status(409), ctx.body(''))
    },
  ),

  // 잡포스팅 요청서
  rest.post(
    BASEURL + '/api/enough/recruiting/jobposting', (req, res, ctx) => {
      if (
        req.body?.status &&
        req.body?.jobType &&
        req.body?.role &&
        req.body?.sourceLanguage &&
        req.body?.targetLanguage &&
        req.body?.yearsOfExperience &&
        req.body?.numberOfLinguist &&
        req.body?.dueDate &&
        req.body?.dueDateTimezone &&
        req.body?.postLink &&
        req.body?.content
      )
      return res(ctx.status(200), ctx.json({
        'id':5
      }))
      else return res(ctx.status(409), ctx.body(''))
    }
  ),

  // 잡포스팅 업데이트
  rest.patch(
    BASEURL + '/api/enough/recruiting/jobposting/:id', (req, res, ctx) => {
      if (
        req.body?.status &&
        req.body?.jobType &&
        req.body?.role &&
        req.body?.sourceLanguage &&
        req.body?.targetLanguage &&
        req.body?.yearsOfExperience &&
        req.body?.numberOfLinguist &&
        req.body?.dueDate &&
        req.body?.dueDateTimezone &&
        req.body?.postLink &&
        req.body?.content
      )
      return res(ctx.status(200), ctx.json({
        'id':req.params.id
      }))
      else return res(ctx.status(409), ctx.body(''))
    }
  ),

  // 리크루팅 삭제
  rest.delete(
    BASEURL + '/api/enough/recruiting/jobposting/:id', (req, res, ctx) => {
      if (req.params.id) return res(ctx.status(200), ctx.body(''))
      else return res(ctx.status(409), ctx.body(''))
    },
  ),
]
