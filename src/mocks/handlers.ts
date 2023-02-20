import { rest } from 'msw'
import { onboardingUser } from 'src/@fake-db/user'
import { Book, Review } from './types'

// 이 부분 글로벌 const로 빠져야 합니다.
export const BASEURL =
  process.env.NEXT_PUBLIC_API_DOMAIN || 'https://api-enough-dev.gloground.com'

const image = '/sample/seo.pdf'

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

  rest.get(BASEURL + '/api/enough/resume', async (req, res, ctx) => {
    // const imageBuffer = await fetch(image).then(res => res.arrayBuffer())
    // console.log(imageBuffer)

    // return res(
    //   ctx.set('Content-Length', imageBuffer.byteLength.toString()),
    //   ctx.set('ContentType', 'application/pdf'),
    //   // Respond with the "ArrayBuffer".
    //   ctx.body(imageBuffer),
    // )
    return res(ctx.status(200), ctx.json({ url: '/sample/sample.docx' }))
  }),

  // rest.get(BASEURL + '/api/enough/onboard/user/al', (req, res, ctx) => {
  //   return res(ctx.status(200), ctx.json(onboardingUser))
  // }),
]
