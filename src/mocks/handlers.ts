import { rest } from 'msw'

import { Book, Review } from './types'

// 이 부분 글로벌 const로 빠져야 합니다.
export const BASEURL =
  process.env.NEXT_PUBLIC_API_DOMAIN || 'https://api-enough-dev.gloground.com'

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
]
